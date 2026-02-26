# HelpModal Integration Guide

This guide explains how to integrate the new HelpModal component into OpenBento's Builder component.

## Quick Integration Steps

### Step 1: Import the HelpModal

Add this import to `components/Builder.tsx`:

```typescript
import HelpModal from './HelpModal';
```

Add it near the other modal imports, for example:

```typescript
import SettingsModal from './SettingsModal';
import ImageCropModal from './ImageCropModal';
import OnboardingWizard from './OnboardingWizard';
import HelpModal from './HelpModal'; // Add this line
```

---

### Step 2: Add State for Help Modal

In the Builder component's state declarations, add:

```typescript
const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
```

Place it near other modal states, for example:

```typescript
const [isSettingsOpen, setIsSettingsOpen] = useState(false);
const [isCropModalOpen, setIsCropModalOpen] = useState(false);
const [isHelpModalOpen, setIsHelpModalOpen] = useState(false); // Add this line
```

---

### Step 3: Add Help Button to UI

Add a help button in the header or toolbar. Find the header section in Builder.tsx (around line 400-500) and add the help button.

**Option A: Add to header bar with other buttons:**

```tsx
{/* Add this near other action buttons */}
<button
  onClick={() => setIsHelpModalOpen(true)}
  data-tooltip-id="help-button"
  data-tooltip-content="Help & FAQ"
  className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
  aria-label="Open help"
>
  <HelpCircle className="w-5 h-5 text-gray-600" />
</button>
<Tooltip id="help-button" place="bottom" />
```

**Option B: Add to the bottom of the page (floating button):**

```tsx
{/* Add this before the closing div of the main container */}
<button
  onClick={() => setIsHelpModalOpen(true)}
  data-tooltip-id="help-button"
  data-tooltip-content="Get help & answers"
  className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300"
  aria-label="Open help"
  aria-haspopup="dialog"
>
  <HelpCircle className="w-6 h-6" />
</button>
<Tooltip id="help-button" place="left" />
```

**Note:** The HelpModal component already includes its own floating button, so you might not need to add one. You can simply open it via a keyboard shortcut.

---

### Step 4: Add Keyboard Shortcut

Add a keyboard shortcut to open the help modal. Find the useEffect hook that handles keyboard shortcuts (or create one if it doesn't exist) and add:

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Open help with ? or F1 key
    if (e.key === '?' || e.key === 'F1') {
      e.preventDefault();
      setIsHelpModalOpen(true);
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

---

### Step 5: Add the HelpModal Component

Add the HelpModal component near the end of the Builder component's JSX, before the closing div:

```tsx
{/* Add this near other modals */}
<HelpModal
  isOpen={isHelpModalOpen}
  onClose={() => setIsHelpModalOpen(false)}
/>
```

---

### Step 6: Add Help Link to User Dropdown (Optional)

If you want to add a help link to the user dropdown menu, find the ProfileDropdown or UserDropdown component and add:

```tsx
{/* Add this item to the dropdown menu */}
<button
  onClick={() => setIsHelpModalOpen(true)}
  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
>
  <HelpCircle className="w-4 h-4" />
  <span>Help & FAQ</span>
</button>
```

---

## Complete Example Integration

Here's a complete example of how to integrate the HelpModal:

### In Builder.tsx:

```tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
// ... other imports
import HelpModal from './HelpModal';

// ... inside Builder component
const Builder: React.FC<BuilderProps> = ({ onBack }) => {
  // ... existing state
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // ... existing code

  // Add keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open help with ? or F1 key
      if (e.key === '?' || e.key === 'F1') {
        e.preventDefault();
        setIsHelpModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ... existing code

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ... header section */}

      {/* Add help button in header */}
      <div className="flex items-center gap-2">
        {/* ... other buttons */}
        <button
          onClick={() => setIsHelpModalOpen(true)}
          data-tooltip-id="help-button"
          data-tooltip-content="Help & FAQ"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Open help"
        >
          <HelpCircle className="w-5 h-5 text-gray-600" />
        </button>
        <Tooltip id="help-button" place="bottom" />
      </div>

      {/* ... rest of the component */}

      {/* Add HelpModal near other modals */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      {/* ... other modals */}
    </div>
  );
};
```

---

## Testing the Integration

After integrating the HelpModal, test the following:

1. **Button Click:**
   - Click the help button
   - Verify the modal opens
   - Verify the modal is centered
   - Verify animations play smoothly

2. **Keyboard Shortcut:**
   - Press `?` key
   - Verify the modal opens
   - Press `F1` key
   - Verify the modal opens

3. **Modal Functionality:**
   - Test the search bar
   - Test category filtering
   - Test expand/collapse FAQ items
   - Test close button
   - Test Escape key to close

4. **Accessibility:**
   - Test keyboard navigation within modal
   - Test with screen reader
   - Verify ARIA labels are present
   - Verify focus is trapped in modal

5. **Responsive Design:**
   - Test on mobile
   - Test on tablet
   - Test on desktop
   - Verify layout adapts correctly

---

## Customization Options

The HelpModal can be customized:

### Change FAQ Content
Edit the `faqData` array in `HelpModal.tsx` to add, modify, or remove FAQ items.

### Change Categories
Edit the `categories` array in `HelpModal.tsx` to add or remove categories.

### Change Colors
The modal uses Tailwind CSS colors. Change these in the component:
- Primary color: `bg-indigo-600`
- Text color: `text-gray-900`
- Border color: `border-gray-200`

### Add Custom Actions
Add custom buttons in the footer section of the HelpModal:

```tsx
{/* In the footer section */}
<a
  href="/contact"
  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
>
  Contact Support
</a>
```

---

## Troubleshooting

### Help Modal Not Opening
- Check if `isHelpModalOpen` state is set correctly
- Verify the button onClick handler
- Check browser console for errors

### Styles Not Applying
- Ensure Tailwind CSS is loaded
- Check for CSS conflicts
- Verify class names are correct

### Keyboard Shortcut Not Working
- Check if useEffect hook is mounted
- Verify event listener is added
- Check for conflicts with other keyboard shortcuts

### Search Not Filtering
- Check if search query state updates
- Verify filtering logic in useEffect
- Check for typos in FAQ keywords

---

## Notes

- The HelpModal includes its own floating button with tooltip
- You can use the built-in floating button OR add your own button in the header
- The HelpModal is fully accessible and supports keyboard navigation
- The HelpModal uses Framer Motion for smooth animations
- All FAQ items are categorized for easy navigation
- The search bar filters both questions and keywords

---

## Next Steps

After integrating the HelpModal:

1. Test all features mentioned above
2. Customize FAQ content for your specific use case
3. Add any additional categories or FAQ items
4. Test accessibility with screen readers
5. Deploy to staging and test in production
6. Gather user feedback and iterate

---

## Support

If you encounter any issues integrating the HelpModal:

1. Check this guide for troubleshooting tips
2. Review the component source code
3. Check the browser console for errors
4. Report issues on GitHub with details

---

The HelpModal is designed to be easily integrated and highly customizable. It provides a comprehensive help system that improves user experience and reduces support requests.
