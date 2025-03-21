import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'

// for error logging
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://a4cb06b652d7f818ec393f73e3a488bb@o4509011684294656.ingest.de.sentry.io/4509011688751184"
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
