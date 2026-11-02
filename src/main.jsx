import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/ibm-plex-sans-arabic/400.css';
import '@fontsource/ibm-plex-sans-arabic/500.css';
import '@fontsource/ibm-plex-sans-arabic/600.css';
import '@fontsource/amiri/400.css';
import '@fontsource/amiri/700.css';
import '@fontsource/cormorant-garamond/600.css';
import './styles.css';
import App from './App.jsx';
import { applyTheme } from './themes.js';
import { loadSettings } from './store.js';

// Apply the saved colours before the first paint to avoid a flash of the default theme.
const saved = loadSettings();
applyTheme(saved.theme, saved.mode);

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);

// Service worker: caches the whole app so it opens with no connection after the first visit.
if ('serviceWorker' in navigator) {
  import('virtual:pwa-register')
    .then(({ registerSW }) => registerSW({ immediate: true }))
    .catch(() => { /* not available in this context (e.g. an embedded preview) */ });
}
