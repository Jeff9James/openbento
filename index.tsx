import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './lib/AuthContext';
import { COMMON_BLOCK_CSS } from './services/commonStyles';

// Inject common CSS for blocks
const styleEl = document.createElement('style');
styleEl.setAttribute('data-openbento-common', 'true');
styleEl.textContent = COMMON_BLOCK_CSS;
document.head.appendChild(styleEl);

// Register Service Worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                console.log('New SW version available');
              }
            });
          }
        });
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
}

// Register app for custom protocol handler (deep links)
if (window.location.protocol !== 'file:') {
  try {
    // Register protocol handler for openbento:// links
    navigator.registerProtocolHandler(
      'openbento',
      '%s'
    );
  } catch (e) {
    // Ignore errors (protocol handler already registered or not supported)
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
  // Re-render handled by React Router in App.tsx
});

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
