import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// DEBUG: Global Error Handler for Mobile
window.onerror = function (message, source, lineno, colno, error) {
  alert(`Error: ${message}\nSource: ${source}:${lineno}`);
  return false;
};
window.onunhandledrejection = function (event) {
  alert(`Promise Error: ${event.reason}`);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
