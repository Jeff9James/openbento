# OpenBento Testing Guide

This guide covers comprehensive testing of all OpenBento features, including functional testing, cross-browser testing, accessibility testing, and performance testing.

## Table of Contents

1. [Setup](#setup)
2. [Core Features Testing](#core-features-testing)
3. [Block Types Testing](#block-types-testing)
4. [Advanced Features Testing](#advanced-features-testing)
5. [Integration Testing](#integration-testing)
6. [Accessibility Testing](#accessibility-testing)
7. [Performance Testing](#performance-testing)
8. [Cross-Browser Testing](#cross-browser-testing)
9. [Mobile Testing](#mobile-testing)
10. [Security Testing](#security-testing)
11. [Bug Reporting Template](#bug-reporting-template)

---

## Setup

### Local Testing Environment

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Required Tools

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile devices or emulators (Chrome DevTools device mode)
- Network throttling (Chrome DevTools)
- Lighthouse (Chrome DevTools)
- Accessibility testing tools: axe DevTools, WAVE

---

## Core Features Testing

### 1. Landing Page

**Test Cases:**
- [ ] Landing page loads correctly with animation
- [ ] "Get Started" button navigates to Builder
- [ ] Features section is visible
- [ ] Responsive design works on mobile
- [ ] SEO meta tags are present

**How to Test:**
1. Navigate to http://localhost:5173
2. Verify all elements render
3. Resize browser window to test responsiveness
4. View page source to check meta tags

### 2. Builder - Add/Edit/Delete Blocks

**Test Cases:**
- [ ] Click "Add Block" opens sidebar
- [ ] All block types are available in sidebar
- [ ] Clicking a block type adds it to grid
- [ ] Clicking a block opens editor panel
- [ ] Editing block properties updates preview
- [ ] Delete button removes block
- [ ] Undo/Redo works (Ctrl+Z, Ctrl+Y)

**How to Test:**
1. Open Builder
2. Click "Add Block" button
3. Add each block type one by one
4. Edit properties for each block
5. Delete some blocks
6. Test undo/redo with keyboard shortcuts

### 3. Drag and Drop

**Test Cases:**
- [ ] Blocks can be dragged with mouse
- [ ] Blocks snap to grid positions
- [ ] Blocks don't overlap
- [ ] Dragging works on mobile (touch)
- [ ] Position saves correctly

**How to Test:**
1. Add 3-4 blocks
2. Drag blocks to rearrange
3. Check positions after save/reload
4. Test on mobile device

### 4. Resize Blocks

**Test Cases:**
- [ ] Resize handles appear on hover
- [ ] Blocks can be resized horizontally
- [ ] Blocks can be resized vertically
- [ ] Minimum size constraints are enforced
- [ ] Maximum size constraints are enforced

**How to Test:**
1. Add a block
2. Hover to see resize handles
3. Drag handles to resize
4. Try to resize beyond limits

### 5. Save/Load

**Test Cases:**
- [ ] Auto-save indicator appears
- [ ] Data persists after page refresh
- [ ] Multiple bentos can be created
- [ ] Bentos can be renamed
- [ ] Bentos can be deleted
- [ ] Export as JSON works
- [ ] Import from JSON works

**How to Test:**
1. Create a bento and add blocks
2. Refresh page - verify data persists
3. Create a second bento
4. Rename and delete bentos
5. Export as JSON, delete, import from JSON

### 6. Settings Modal

**Test Cases:**
- [ ] Background color picker works
- [ ] Gradient picker works
- [ ] Custom background image upload works
- [ ] Avatar upload works
- [ ] Avatar style customization works
- [ ] Spacing controls work
- [ ] All settings save correctly

**How to Test:**
1. Open Settings modal
2. Test each setting option
3. Apply customizations
4. Refresh page - verify settings persist

---

## Block Types Testing

### 1. Link Block

**Test Cases:**
- [ ] URL input accepts valid URLs
- [ ] URL input rejects invalid URLs
- [ ] Title input works
- [ ] Description input works
- [ ] Custom color picker works
- [ ] Button style selector works
- [ ] Link opens in new tab
- [ ] Icon selection works

**How to Test:**
1. Add a Link block
2. Enter valid URL: `https://example.com`
3. Try invalid URL: `example`
4. Customize colors and styles
5. Click link - verify new tab

### 2. Text Block

**Test Cases:**
- [ ] Title input works
- [ ] Body text input works
- [ ] Rich text formatting (if available)
- [ ] Custom colors work
- [ ] Font size selector works
- [ ] Alignment options work

**How to Test:**
1. Add Text block
2. Enter title and body text
3. Change colors and font size
4. Test alignment options

### 3. Media Block (Images/GIFs)

**Test Cases:**
- [ ] Image upload works (JPG, PNG, GIF, WebP)
- [ ] URL input works
- [ ] Image cropper opens
- [ ] Crop functionality works
- [ ] Image saves correctly
- [ ] Video embed works (YouTube)
- [ ] Alt text input works

**How to Test:**
1. Add Media block
2. Upload image from computer
3. Try image URL
4. Test image cropper
5. Paste YouTube URL
6. Add alt text

### 4. Social Icon Block

**Test Cases:**
- [ ] All 26+ platforms available
- [ ] Username input works
- [ ] Icon displays correctly
- [ ] Link opens correct profile
- [ ] Custom colors work
- [ ] Brand colors work

**How to Test:**
1. Add Social Icon block
2. Test platforms: Instagram, TikTok, YouTube, Twitter/X, GitHub
3. Enter username (without @)
4. Click icon - verify correct profile
5. Customize colors

### 5. Map Block

**Test Cases:**
- [ ] Location search works
- [ ] Map displays correctly
- [ ] Map type selector works (roadmap, satellite, terrain)
- [ ] Zoom control works
- [ ] Directions button works
- [ ] Custom colors work

**How to Test:**
1. Add Map block
2. Search: "Times Square, New York"
3. Switch map types
4. Test zoom controls
5. Click directions button
6. Customize colors

### 6. Rating Block

**Test Cases:**
- [ ] Business name search works
- [ ] Place ID input works
- [ ] Rating displays correctly
- [ ] Review count displays correctly
- [ ] Link to Google Reviews works
- [ ] Custom colors work

**How to Test:**
1. Add Rating block
2. Search: "Google NYC"
3. Verify rating and reviews display
4. Click link - verify opens Google Reviews
5. Customize colors

### 7. QR Code Block

**Test Cases:**
- [ ] URL input accepts valid URLs
- [ ] QR code generates
- [ ] QR code is scannable
- [ ] Custom foreground color works
- [ ] Custom background color works
- [ ] Size control works
- [ ] Logo upload works (if available)

**How to Test:**
1. Add QR Code block
2. Enter URL: `https://example.com`
3. Verify QR code appears
4. Scan with phone - verify works
5. Customize colors
6. Adjust size

### 8. Spacer Block

**Test Cases:**
- [ ] Spacer adds vertical space
- [ ] Height can be adjusted
- [ ] Spacer is invisible in preview
- [ ] Spacer can be deleted

**How to Test:**
1. Add Spacer block
2. Adjust height
3. Verify spacing in preview
4. Delete spacer

### 9. Three.js 3D Block (Pro)

**Test Cases:**
- [ ] 3D view loads
- [ ] Room displays correctly
- [ ] Colors are customizable
- [ ] Camera rotation works
- [ ] Zoom controls work
- [ ] Performance is acceptable

**How to Test:**
1. Add 3D block
2. Customize room colors
3. Test camera controls (drag to rotate, scroll to zoom)
4. Check performance on low-end devices

---

## Advanced Features Testing

### 1. AI Generator

**Test Cases:**
- [ ] AI modal opens
- [ ] Prompt input accepts text
- [ ] Generate button works
- [ ] Blocks are created
- [ ] Content is relevant to prompt
- [ ] Generated blocks can be edited
- [ ] Multiple generations work

**How to Test:**
1. Click AI button
2. Enter prompt: "Create a personal portfolio"
3. Click Generate
4. Verify blocks are created
5. Edit generated blocks
6. Try another prompt: "Design a business profile"

### 2. Template Gallery

**Test Cases:**
- [ ] Template gallery opens
- [ ] All templates are visible
- [ ] Categories filter correctly
- [ ] Preview shows template
- [ ] Apply button works
- [ ] Template loads correctly
- [ ] Applied template can be edited

**How to Test:**
1. Click Templates button
2. Browse all templates
3. Filter by category
4. Preview a template
5. Click Apply
6. Verify template loads
7. Edit template blocks

### 3. Preview Mode

**Test Cases:**
- [ ] Preview modal opens
- [ ] Desktop view works
- [ ] Mobile view toggle works
- [ ] All blocks display correctly
- [ ] Links work in preview
- [ ] Close button works

**How to Test:**
1. Click Preview button
2. Verify desktop view
3. Toggle to mobile view
4. Test all links
5. Close preview

### 4. Export Features

**Test Cases:**
- [ ] Export to HTML works
- [ ] Export to image works
- [ ] Export to React project works
- [ ] Export to ZIP works
- [ ] Downloaded files work correctly

**How to Test:**
1. Click Export button
2. Export as HTML - open in browser
3. Export as image - view image
4. Export as React project - unzip and run `npm run dev`
5. Verify all exports work

---

## Integration Testing

### 1. Supabase Analytics

**Test Cases:**
- [ ] Supabase connection works
- [ ] Page views are tracked
- [ ] Clicks are tracked
- [ ] Referrers are captured
- [ ] User agent data is captured
- [ ] Analytics dashboard displays data
- [ ] Data filters work
- [ ] Export analytics works

**How to Test:**
1. Set up Supabase (see DEPLOYMENT.md)
2. Configure in Settings
3. Test connection
4. Navigate to bento page
5. Click on blocks
6. Open Analytics dashboard
7. Verify data is captured
8. Test filters and export

### 2. Authentication

**Test Cases:**
- [ ] Sign up works (email/password)
- [ ] Sign in works
- [ ] Sign out works
- [ ] Password reset works
- [ ] Social login works (if configured)
- [ ] Auth state persists
- [ ] Protected routes work

**How to Test:**
1. Click Sign Up button
2. Create account with email
3. Verify email confirmation (if required)
4. Sign in
5. Sign out
6. Test password reset flow
7. Test social login (Google, etc.)

### 3. Custom Domain

**Test Cases:**
- [ ] Custom domain is accessible
- [ ] HTTPS works
- [ ] SSL certificate is valid
- [ ] All functionality works on custom domain
- [ ] Analytics work on custom domain

**How to Test:**
1. Deploy with custom domain (see DEPLOYMENT.md)
2. Navigate to custom domain
3. Check HTTPS certificate
4. Test all features
5. Verify analytics work

---

## Accessibility Testing

### 1. Keyboard Navigation

**Test Cases:**
- [ ] Tab key navigates to all interactive elements
- [ ] Shift+Tab navigates backwards
- [ ] Enter/Space activates buttons
- [ ] Arrow keys work where applicable
- [ ] Escape closes modals
- [ ] Focus indicators are visible

**How to Test:**
1. Use only keyboard (no mouse)
2. Tab through all elements
3. Verify logical tab order
4. Test all keyboard shortcuts

### 2. Screen Reader Testing

**Test Cases:**
- [ ] All images have alt text
- [ ] All buttons have labels
- [ ] ARIA labels are present
- [ ] Landmarks are defined
- [ ] Forms are properly labeled
- [ ] Dynamic content updates are announced

**How to Test:**
1. Enable screen reader (NVDA, JAWS, VoiceOver)
2. Navigate through the app
3. Verify all content is announced
4. Test with axe DevTools for issues

### 3. Visual Accessibility

**Test Cases:**
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] Focus indicators are visible
- [ ] No color-only information
- [ ] Text can be scaled to 200%
- [ ] Motion can be reduced (prefers-reduced-motion)

**How to Test:**
1. Use contrast checker tool
2. Test with prefers-reduced-motion media query
3. Zoom to 200% and verify layout
4. Test with high contrast mode

### 4. Touch Targets

**Test Cases:**
- [ ] All touch targets are at least 44x44px
- [ ] Spacing between targets is adequate
- [ ] Targets don't overlap
- [ ] Targets are easily tappable

**How to Test:**
1. Use Chrome DevTools device mode
2. Measure touch target sizes
3. Test on real mobile device

---

## Performance Testing

### 1. Load Time

**Test Cases:**
- [ ] Initial load < 3 seconds (4G)
- [ ] Time to Interactive < 5 seconds
- [ ] First Contentful Paint < 2 seconds
- [ ] Largest Contentful Paint < 2.5 seconds

**How to Test:**
1. Open Chrome DevTools → Performance tab
2. Record page load
3. Check metrics
4. Run Lighthouse test

### 2. Bundle Size

**Test Cases:**
- [ ] Initial bundle < 500KB (gzipped)
- [ ] Code splitting is effective
- [ ] Lazy loading works
- [ ] No unused dependencies

**How to Test:**
1. Run `npm run build`
2. Check bundle analyzer
3. Review bundle size in dist folder

### 3. Runtime Performance

**Test Cases:**
- [ ] Smooth animations (60fps)
- [ ] No layout thrashing
- [ ] No memory leaks
- [ ] Three.js performs well on low-end devices

**How to Test:**
1. Open Chrome DevTools → Performance tab
2. Record interactions
3. Check frame rate
4. Monitor memory usage

### 4. Network Performance

**Test Cases:**
- [ ] Works on 3G connection
- [ ] Works on 4G connection
- [ ] Graceful degradation on slow networks
- [ ] Proper caching headers

**How to Test:**
1. Use Chrome DevTools → Network throttling
2. Test on "Slow 3G"
3. Test on "Fast 3G"
4. Verify functionality works

---

## Cross-Browser Testing

### Browser Compatibility Matrix

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | Latest | ✅ Pass | Primary target |
| Firefox | Latest | ✅ Pass | Full support |
| Safari | Latest | ✅ Pass | Test iOS too |
| Edge | Latest | ✅ Pass | Chromium-based |
| Opera | Latest | ✅ Should pass | Chromium-based |

### Test Cases

- [ ] Builder works in all browsers
- [ ] Drag and drop works
- [ ] Preview works
- [ ] Export works
- [ ] No console errors
- [ ] Visual consistency across browsers

**How to Test:**
1. Test each browser in the matrix
2. Run through core feature tests
3. Check for console errors
4. Compare visual appearance

---

## Mobile Testing

### Device Matrix

| Device | OS | Screen Size | Status |
|--------|-----|-------------|--------|
| iPhone 14 Pro | iOS 17+ | 393x852 | ✅ Test |
| iPhone SE | iOS 16+ | 375x667 | ✅ Test |
| Samsung Galaxy S23 | Android 13+ | 412x915 | ✅ Test |
| iPad Pro | iOS 17+ | 1024x1366 | ✅ Test |
| Pixel 7 | Android 13+ | 412x915 | ✅ Test |

### Test Cases

- [ ] Touch interactions work
- [ ] Landscape mode works
- [ ] Portrait mode works
- [ ] Keyboard doesn't cover inputs
- [ ] Back gesture works
- [ ] Performance is smooth
- [ ] No horizontal scroll

**How to Test:**
1. Test on real devices when possible
2. Use Chrome DevTools device mode
3. Test both orientations
4. Test on various screen sizes

---

## Security Testing

### 1. XSS Prevention

**Test Cases:**
- [ ] Script tags in text are sanitized
- [ ] Event handlers are sanitized
- [ ] Iframes are controlled
- [ ] URLs are validated

**How to Test:**
1. Enter `<script>alert(1)</script>` in text fields
2. Enter `onload="alert(1)"` in attributes
3. Enter malicious URLs
4. Verify all inputs are sanitized

### 2. Data Privacy

**Test Cases:**
- [ ] No data sent to third parties
- [ ] localStorage is only used storage
- [ ] No tracking cookies
- [ ] User can clear data

**How to Test:**
1. Monitor network requests in DevTools
2. Check localStorage contents
3. Check cookies
4. Test "Clear Data" functionality

### 3. CSRF Protection

**Test Cases:**
- [ ] Forms have CSRF tokens (if using server)
- [ ] API calls are protected

**How to Test:**
1. If using Supabase, verify API calls have proper auth
2. Test with external requests

---

## Bug Reporting Template

When reporting bugs, use this template:

```markdown
## Bug Report

### Description
[Brief description of the bug]

### Steps to Reproduce
1.
2.
3.

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Screenshots
[Add screenshots if applicable]

### Environment
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- Device: [e.g., Desktop / iPhone]
- OpenBento Version: [e.g., v1.0.0]

### Console Errors
[Paste any console errors here]

### Additional Context
[Any other relevant information]
```

---

## Known Issues to Watch For

### 1. Safari Issues

**Issue:** Images may not display correctly with certain formats
**Fix:** Use WebP fallback or JPEG
**Status:** Monitored

### 2. Mobile Safari Zoom

**Issue:** Double-tap zooms on inputs
**Fix:** `meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5"`
**Status:** Fixed

### 3. Three.js Performance

**Issue:** May be slow on low-end mobile devices
**Fix:** Add quality settings, simplify 3D models
**Status:** Optimized

### 4. Drag and Drop on Mobile

**Issue:** Native HTML5 drag and drop doesn't work on mobile
**Fix:** Use touch events polyfill or react-dnd-touch-backend
**Status:** Implemented

### 5. localStorage Quota

**Issue:** localStorage limited to ~5MB
**Fix:** Compress data, use IndexedDB for larger data
**Status:** Monitored

### 6. Supabase Rate Limits

**Issue:** Free tier has rate limits
**Fix:** Implement caching, batch requests
**Status:** Implemented

### 7. Custom Domain DNS

**Issue:** DNS propagation can take 24-48 hours
**Fix:** Inform users, provide progress checker
**Status:** Documented

---

## Continuous Testing

### Automated Testing (Future)

- [ ] Unit tests with Jest
- [ ] Component tests with React Testing Library
- [ ] E2E tests with Playwright
- [ ] Visual regression tests with Percy

### Manual Testing Checklist

Before each release:
- [ ] Test all block types
- [ ] Test export functions
- [ ] Test on mobile devices
- [ ] Test in all supported browsers
- [ ] Test accessibility
- [ ] Test performance
- [ ] Test security

---

## Conclusion

This testing guide ensures OpenBento works reliably across all environments. Regular testing and quality assurance are essential for maintaining a high-quality user experience.

For questions or to report bugs, please use the GitHub Issues page.
