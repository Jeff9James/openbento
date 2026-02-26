# Known Issues and Potential Bugs

This document lists known issues, potential bugs, and their fixes or workarounds for OpenBento.

## Table of Contents

1. [Critical Issues](#critical-issues)
2. [High Priority Issues](#high-priority-issues)
3. [Medium Priority Issues](#medium-priority-issues)
4. [Low Priority Issues](#low-priority-issues)
5. [Browser-Specific Issues](#browser-specific-issues)
6. [Platform-Specific Issues](#platform-specific-issues)
7. [Edge Cases](#edge-cases)
8. [Performance Issues](#performance-issues)
9. [Security Considerations](#security-considerations)
10. [Fixes Implemented](#fixes-implemented)

---

## Critical Issues

### 1. **localStorage Quota Exceeded**

**Description:** Users with many bentos or large images may hit localStorage's ~5MB limit.

**Symptoms:**
- Error: "QuotaExceededError"
- Data not saving
- App becomes unresponsive

**Fix:**
```typescript
// Compress data before saving
import { compress, decompress } from 'lz-string';

const saveToLocalStorage = (key: string, data: any) => {
  try {
    const compressed = compress(JSON.stringify(data));
    localStorage.setItem(key, compressed);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      // Fallback to IndexedDB
      saveToIndexedDB(key, data);
    } else {
      throw error;
    }
  }
};
```

**Workaround:**
- Export bentos as JSON for backup
- Reduce image sizes before uploading
- Delete unused bentos

**Status:** ⚠️ Needs implementation

---

### 2. **Image Upload Failures**

**Description:** Large images may fail to upload or cause performance issues.

**Symptoms:**
- Upload hangs
- Image doesn't display
- Slow performance

**Fix:**
```typescript
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

const resizeImage = (file: File, maxWidth: number = 1200): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas conversion failed'));
          }
        },
        'image/jpeg',
        0.85
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

// Usage
const handleImageUpload = async (file: File) => {
  if (file.size > MAX_IMAGE_SIZE) {
    const resized = await resizeImage(file);
    // Upload resized image
  }
};
```

**Status:** ✅ Partially implemented

---

### 3. **Supabase Connection Failures**

**Description:** Supabase connections may fail due to network issues or rate limits.

**Symptoms:**
- Analytics not tracking
- Connection errors in console
- Data not saving to Supabase

**Fix:**
```typescript
import { createClient } from '@supabase/supabase-js';

let supabase: ReturnType<typeof createClient> | null = null;
let retryCount = 0;
const MAX_RETRIES = 3;

const getSupabaseClient = () => {
  if (!supabase) {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !key) {
      console.warn('Supabase not configured');
      return null;
    }

    supabase = createClient(url, key, {
      auth: {
        persistSession: false,
      },
      global: {
        fetch: async (url, options) => {
          let attempts = 0;
          while (attempts <= MAX_RETRIES) {
            try {
              const response = await fetch(url, options);
              if (response.ok || attempts === MAX_RETRIES) {
                return response;
              }
              attempts++;
              await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
            } catch (error) {
              if (attempts === MAX_RETRIES) throw error;
              attempts++;
              await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
            }
          }
          throw new Error('Max retries exceeded');
        },
      },
    });
  }
  return supabase;
};
```

**Workaround:**
- Fall back to localStorage analytics
- Implement retry logic with exponential backoff
- Show user-friendly error messages

**Status:** ✅ Implemented

---

## High Priority Issues

### 4. **Three.js Performance on Mobile**

**Description:** 3D blocks may cause performance issues on low-end mobile devices.

**Symptoms:**
- Low frame rates
- Overheating
- Battery drain
- App crashes

**Fix:**
```typescript
import { isMobile } from 'react-device-detect';

const THREE_D_SETTINGS = {
  enabled: !isMobile || window.innerWidth > 768,
  quality: isMobile ? 'low' : 'high',
  pixelRatio: Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2),
  antialias: !isMobile,
  shadows: !isMobile,
};

// Adjust settings based on device
const adjustThreeSettings = () => {
  if (isMobile) {
    renderer.setPixelRatio(1); // Reduce pixel ratio on mobile
    renderer.shadowMap.enabled = false; // Disable shadows
  }
};
```

**Workaround:**
- Add quality settings for users
- Simplify 3D models
- Limit number of 3D blocks per page

**Status:** ✅ Implemented

---

### 5. **Drag and Drop on Mobile**

**Description:** Native HTML5 drag and drop API doesn't work on mobile devices.

**Symptoms:**
- Cannot drag blocks on mobile
- Touch events not handled
- Blocks jump around

**Fix:**
```typescript
// Use TouchEvent polyfill or react-dnd-touch-backend
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';

function App() {
  const isTouch = 'ontouchstart' in window;

  return (
    <DndProvider backend={isTouch ? TouchBackend : HTML5Backend}>
      {/* Your app */}
    </DndProvider>
  );
}
```

**Workaround:**
- Implement touch event handlers manually
- Use long-press to activate drag mode
- Add "Move" button for touch devices

**Status:** ✅ Implemented

---

### 6. **Race Conditions in Save**

**Description:** Multiple rapid saves may cause data corruption.

**Symptoms:**
- Data loss
- Overwritten changes
- Inconsistent state

**Fix:**
```typescript
import { debounce } from 'lodash';

const debouncedSave = debounce(async (data: BlockData[]) => {
  try {
    await saveToStorage(data);
    setIsSaving(false);
  } catch (error) {
    console.error('Save failed:', error);
    setIsSaving(true); // Show retry button
  }
}, 500);

const handleBlockChange = (newData: BlockData[]) => {
  setIsSaving(true);
  setBlocks(newData);
  debouncedSave(newData);
};
```

**Status:** ✅ Implemented

---

## Medium Priority Issues

### 7. **Accessibility - Focus Management**

**Description:** Focus may get trapped in modals or not return properly.

**Symptoms:**
- Keyboard navigation breaks
- Focus indicator lost
- Cannot exit modal with keyboard

**Fix:**
```typescript
import { useFocusTrap } from './hooks/useFocusTrap';

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(modalRef, isOpen);

  useEffect(() => {
    if (isOpen) {
      const previousFocus = document.activeElement as HTMLElement;
      modalRef.current?.focus();
      return () => previousFocus?.focus();
    }
  }, [isOpen]);

  return (
    <div ref={modalRef} tabIndex={-1}>
      {children}
    </div>
  );
}
```

**Status:** ⚠️ Partially implemented

---

### 8. **Export - Large Projects**

**Description:** Exporting large projects may fail or take too long.

**Symptoms:**
- Export hangs
- File incomplete
- Timeout errors

**Fix:**
```typescript
const exportProject = async (blocks: BlockData[]) => {
  // Show progress
  setExportProgress(0);

  // Export in chunks
  const CHUNK_SIZE = 100;
  const chunks = [];

  for (let i = 0; i < blocks.length; i += CHUNK_SIZE) {
    const chunk = blocks.slice(i, i + CHUNK_SIZE);
    chunks.push(await processChunk(chunk));
    setExportProgress((i / blocks.length) * 100);
  }

  // Combine chunks
  const fullExport = await combineChunks(chunks);
  setExportProgress(100);

  return fullExport;
};
```

**Status:** ✅ Implemented

---

### 9. **Memory Leaks**

**Description:** Long sessions may cause memory leaks, especially with image uploads.

**Symptoms:**
- App slows over time
- High memory usage
- Browser crashes

**Fix:**
```typescript
// Clean up blob URLs
useEffect(() => {
  return () => {
    // Revoke all blob URLs
    blobUrls.forEach(url => URL.revokeObjectURL(url));
  };
}, []);

// Clean up Three.js resources
useEffect(() => {
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer();

  return () => {
    renderer.dispose();
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach(m => m.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
  };
}, []);
```

**Status:** ⚠️ Partially implemented

---

### 10. **Undo/Redo - Memory Growth**

**Description:** History stack grows unbounded, consuming memory.

**Symptoms:**
- Slow undo/redo
- High memory usage
- Performance degradation

**Fix:**
```typescript
const MAX_HISTORY = 50;

const useHistory = (initialState: BlockData[]) => {
  const [history, setHistory] = useState<BlockData[][]>([initialState]);
  const [index, setIndex] = useState(0);

  const push = (newState: BlockData[]) => {
    const newHistory = history.slice(0, index + 1);
    newHistory.push(newState);

    // Limit history size
    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
    }

    setHistory(newHistory);
    setIndex(newHistory.length - 1);
  };

  return { history, index, push };
};
```

**Status:** ✅ Implemented

---

## Low Priority Issues

### 11. **Tooltip Positioning**

**Description:** Tooltips may appear off-screen or cover content.

**Symptoms:**
- Tooltip not visible
- Tooltip covers button
- Tooltip positioning jumps

**Fix:**
```typescript
const getTooltipPosition = (triggerRect: DOMRect, tooltipRect: DOMRect) => {
  const { innerWidth, innerHeight } = window;
  const margin = 10;

  // Try right position first
  let x = triggerRect.right + margin;
  let y = triggerRect.top;

  // If off-screen, try left
  if (x + tooltipRect.width > innerWidth) {
    x = triggerRect.left - tooltipRect.width - margin;
  }

  // If still off-screen, try top
  if (x < margin) {
    x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
    y = triggerRect.top - tooltipRect.height - margin;
  }

  // Adjust y if off-screen
  if (y + tooltipRect.height > innerHeight) {
    y = innerHeight - tooltipRect.height - margin;
  }

  return { x, y };
};
```

**Status:** ⚠️ Needs refinement

---

### 12. **Image Cropper - Zoom Issues**

**Description:** Image cropper zoom may be inconsistent or jump.

**Symptoms:**
- Zoom feels jerky
- Image jumps when zooming
- Cannot zoom to desired level

**Fix:**
```typescript
const handleZoom = (delta: number) => {
  setZoom((prevZoom) => {
    const newZoom = Math.max(1, Math.min(5, prevZoom + delta));
    return newZoom;
  });

  // Smooth zoom with CSS transition
  requestAnimationFrame(() => {
    const cropper = cropperRef.current;
    if (cropper) {
      cropper.style.transition = 'transform 0.15s ease-out';
    }
  });
};
```

**Status:** ⚠️ Needs refinement

---

## Browser-Specific Issues

### 13. **Safari - Back Button Cache**

**Description:** Safari caches page state when using back button.

**Symptoms:**
- Old data shows after back button
- Event listeners don't fire
- State is stale

**Fix:**
```typescript
// Listen for page show event
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // Reload to clear cache
    window.location.reload();
  }
});

// Or force reload on mount
useEffect(() => {
  if (window.performance.getEntriesByType('navigation')[0]?.type === 'back_forward') {
    window.location.reload();
  }
}, []);
```

**Status:** ✅ Implemented

---

### 14. **Firefox - Flexbox Gap**

**Description:** Firefox may have issues with flexbox gap in older versions.

**Symptoms:**
- Spacing not correct
- Layout breaks

**Fix:**
```css
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

/* Fallback for older Firefox */
@supports not (gap: 1rem) {
  .grid > * + * {
    margin-left: 1rem;
  }
}
```

**Status:** ✅ Implemented

---

### 15. **Edge - Three.js Performance**

**Description:** Edge may have lower Three.js performance than Chrome.

**Symptoms:**
- Lower frame rates
- Choppy animations

**Fix:**
```typescript
// Detect Edge and reduce quality
const isEdge = /Edg\//.test(navigator.userAgent);

if (isEdge) {
  renderer.setPixelRatio(1);
  renderer.powerPreference = 'low-power';
  renderer.setAntialias(false);
}
```

**Status:** ⚠️ Monitored

---

## Platform-Specific Issues

### 16. **iOS - Double-Tap Zoom**

**Description:** iOS zooms on double-tap of buttons.

**Symptoms:**
- Accidental zoom
- Buttons don't work on first tap

**Fix:**
```typescript
// Prevent double-tap zoom
const preventDoubleTapZoom = (event: TouchEvent) => {
  const now = Date.now();
  if (lastTapTime && now - lastTapTime < 300) {
    event.preventDefault();
  }
  lastTapTime = now;
};

document.addEventListener('touchend', preventDoubleTapZoom);
```

**Status:** ✅ Fixed

---

### 17. **Android - Chrome Address Bar**

**Description:** Chrome address bar hides/shows causing layout shifts.

**Symptoms:**
- Layout jumps
- Content gets cut off
- Scroll position changes

**Fix:**
```css
/* Fixed viewport height */
.container {
  height: 100dvh; /* dynamic viewport height */
  height: -webkit-fill-available;
}

/* Or use ResizeObserver */
const containerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      // Adjust layout on resize
    }
  });

  if (containerRef.current) {
    observer.observe(containerRef.current);
  }

  return () => observer.disconnect();
}, []);
```

**Status:** ✅ Fixed

---

## Edge Cases

### 18. **Special Characters in URLs**

**Description:** URLs with special characters may break.

**Symptoms:**
- Links don't work
- Encoding issues

**Fix:**
```typescript
import { encodeURI, decodeURI } from 'utils';

const sanitizeURL = (url: string): string => {
  try {
    const parsed = new URL(url);
    return parsed.toString();
  } catch {
    // Try encoding
    return encodeURI(url);
  }
};
```

**Status:** ✅ Implemented

---

### 19. **Empty State Handling**

**Description:** App may behave unexpectedly with empty data.

**Symptoms:**
- Crashes on empty arrays
- UI doesn't render
- Buttons disabled incorrectly

**Fix:**
```typescript
// Add null/empty checks
const renderBlocks = () => {
  if (!blocks || blocks.length === 0) {
    return <EmptyState />;
  }

  return blocks.map(block => <Block key={block.id} {...block} />);
};

// Add default values
const defaultProps = {
  blocks: [],
  settings: defaultSettings,
};
```

**Status:** ✅ Implemented

---

### 20. **Concurrent Updates**

**Description:** Multiple users editing same bento (if using backend).

**Symptoms:**
- Last write wins
- Data loss
- Conflicting changes

**Fix:**
```typescript
// Implement optimistic locking
const updateBlock = async (blockId: string, updates: any) => {
  const currentVersion = await getVersion();

  try {
    await updateBlockWithVersion(blockId, updates, currentVersion);
  } catch (error) {
    if (error.code === 'VERSION_MISMATCH') {
      // Show conflict resolution UI
      showConflictResolution();
    }
  }
};
```

**Status:** N/A (client-side only)

---

## Performance Issues

### 21. **Large Number of Blocks**

**Description:** Rendering many blocks causes performance issues.

**Symptoms:**
- Slow rendering
- Janky scrolling
- High CPU usage

**Fix:**
```typescript
// Virtual scrolling
import { useVirtualizer } from '@tanstack/react-virtual';

const BlockList = ({ blocks }: { blocks: BlockData[] }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: blocks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: '100vh', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <Block
            key={blocks[virtualItem.index].id}
            {...blocks[virtualItem.index]}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${virtualItem.start}px)` }}
          />
        ))}
      </div>
    </div>
  );
};
```

**Status:** ⚠️ Needs implementation

---

### 22. **Image Loading Performance**

**Description:** Many images loading slowly degrades performance.

**Symptoms:**
- Slow initial load
- Layout shifts
- High bandwidth usage

**Fix:**
```typescript
// Lazy load images
import { LazyLoadImage } from 'react-lazy-load-image-component';

// Add loading="lazy" to images
<img loading="lazy" src={src} alt={alt} />

// Use responsive images
<picture>
  <source srcSet={`${src}?w=400 400w, ${src}?w=800 800w`} sizes="(max-width: 400px) 400px, 800px" />
  <img src={`${src}?w=800`} alt={alt} loading="lazy" />
</picture>
```

**Status:** ✅ Implemented

---

## Security Considerations

### 23. **XSS Prevention**

**Description:** User input could contain malicious scripts.

**Symptoms:**
- Scripts execute
- Data theft
- Session hijacking

**Fix:**
```typescript
import DOMPurify from 'dompurify';

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'u', 'a', 'p'],
    ALLOWED_ATTR: ['href', 'target'],
  });
};

// Always sanitize user input
const handleTextInput = (text: string) => {
  const sanitized = sanitizeInput(text);
  setBlockData(prev => ({ ...prev, text: sanitized }));
};
```

**Status:** ✅ Implemented

---

### 24. **CSRF Protection**

**Description:** Cross-site request forgery attacks (if using backend).

**Symptoms:**
- Unauthorized actions
- Data modification

**Fix:**
```typescript
// Add CSRF token to requests
const fetchWithCSRF = async (url: string, options: RequestInit) => {
  const csrfToken = getCSRFToken();
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'X-CSRF-Token': csrfToken,
    },
  });
};
```

**Status:** N/A (client-side only)

---

## Fixes Implemented

✅ **Implemented**
⚠️ **Partially Implemented / Needs Refinement**
❌ **Not Implemented**

| Issue | Status | Priority |
|-------|--------|----------|
| localStorage Quota | ⚠️ | Critical |
| Image Upload Failures | ✅ | Critical |
| Supabase Connection | ✅ | Critical |
| Three.js Performance | ✅ | High |
| Drag and Drop Mobile | ✅ | High |
| Race Conditions | ✅ | High |
| Focus Management | ⚠️ | Medium |
| Export Large Projects | ✅ | Medium |
| Memory Leaks | ⚠️ | Medium |
| Undo/Redo Memory | ✅ | Medium |
| Tooltip Positioning | ⚠️ | Low |
| Image Cropper Zoom | ⚠️ | Low |
| Safari Back Cache | ✅ | Browser |
| Firefox Flex Gap | ✅ | Browser |
| Edge Three.js | ⚠️ | Browser |
| iOS Double-Tap Zoom | ✅ | Platform |
| Android Address Bar | ✅ | Platform |
| Special Chars URL | ✅ | Edge Case |
| Empty State | ✅ | Edge Case |
| Concurrent Updates | N/A | Edge Case |
| Virtual Scrolling | ⚠️ | Performance |
| Lazy Loading | ✅ | Performance |
| XSS Prevention | ✅ | Security |
| CSRF Protection | N/A | Security |

---

## Monitoring and Alerting

### Recommended Monitoring

1. **Error Tracking**
   - Sentry for error logging
   - Console error monitoring

2. **Performance Monitoring**
   - Web Vitals tracking
   - Lighthouse CI

3. **User Analytics**
   - Page views
   - Feature usage
   - Error rates

4. **Health Checks**
   - API endpoint monitoring
   - Uptime monitoring

---

## Conclusion

This document provides a comprehensive overview of known issues and potential bugs. Regular updates and monitoring are essential for maintaining a high-quality user experience.

For questions or to report new issues, please use the GitHub Issues page.
