import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'

// for error logging
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
});

//capture uncaught errors globally
window.addEventListener("error", (event) => {
  Sentry.captureException(event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  Sentry.captureException(event.reason);
});

//If an error happens inside a react component, the error boundary can catch it.
const SentryErrorBoundary = Sentry.withErrorBoundary(
  ({ children }) => children,
  {
    fallback: <h1>Something went wrong. Please try again later.</h1>,
  }
);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SentryErrorBoundary>
      <App />
    </SentryErrorBoundary>
  </StrictMode>,
)
