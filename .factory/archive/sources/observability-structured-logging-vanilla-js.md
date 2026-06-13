---
tags:
  - factory
  - source
  - observability
  - logging
source: factory-archivist
date: 2026-06-13
---

# Observability: Structured Logging for Vanilla JS

## Context

The app currently has zero log statements, no structured logging, and no error handling instrumentation. The factory eval's observability dimension scores 0.0. For a demo/test app with no backend, full observability tooling is overkill — but basic instrumentation satisfies the growth dimension.

## Recommended Approach (Zero-Dependency)

A lightweight `console.log` wrapper providing structured JSON logging:

```js
const logger = {
    info: (event, data) => console.log(JSON.stringify({ level: 'info', event, ...data, ts: Date.now() })),
    warn: (event, data) => console.warn(JSON.stringify({ level: 'warn', event, ...data, ts: Date.now() })),
    error: (event, data) => console.error(JSON.stringify({ level: 'error', event, ...data, ts: Date.now() })),
};
```

## What to Instrument

- **User interactions**: search queries, category filter changes, modal open/close, rating submissions, review submissions, PDF exports, theme toggles
- **Errors**: localStorage read/write failures, malformed data recovery
- **Global handler**: `window.onerror` for uncaught exceptions

## Eval Verification Points

The eval can check: (a) a logger/logging function exists, (b) log calls are present in key functions, (c) `window.onerror` is handled.

## Sources

- [Sentry: JavaScript Logging Library Definitive Guide 2026](https://blog.sentry.io/javascript-logging-library-definitive-guide/)
- [SitePoint: Logging Errors in Client-Side Applications](https://www.sitepoint.com/logging-errors-client-side-apps/)
- [Stackify: JavaScript Logging Basic Tips](https://stackify.com/javascript-logging-basic-tips/)
- [GitHub: loglevel — Minimal Lightweight Logging for JavaScript](https://github.com/pimterry/loglevel)
