# @pr0zpect/env-guard Demo Project

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://npm-2.vercel.app)
[![npm version](https://img.shields.io/npm/v/@pr0zpect/env-guard?style=for-the-badge&color=emerald)](https://www.npmjs.com/package/@pr0zpect/env-guard)

> **Live Demo & Interactive Playground**: [https://npm-2.vercel.app](https://npm-2.vercel.app)

A complete demonstration project showcasing [`@pr0zpect/env-guard`](https://www.npmjs.com/package/@pr0zpect/env-guard):
Lightweight, type-safe environment variable validation and secret protection for Node.js and TypeScript.

---

## 🌐 Live Production Deployment

| Service | Link |
| :--- | :--- |
| **🚀 Live App / Web Playground** | **[https://npm-2.vercel.app](https://npm-2.vercel.app)** |
| **🛡️ Sanitized Config Endpoint** | [https://npm-2.vercel.app/config](https://npm-2.vercel.app/config) |
| **💓 Health Check** | [https://npm-2.vercel.app/health](https://npm-2.vercel.app/health) |
| **📊 Vercel Dashboard** | [https://vercel.com/kisna-s-projects1/npm-2](https://vercel.com/kisna-s-projects1/npm-2) |

### Quick Live Test via cURL

```bash
# View sanitized config (demonstrates secret redaction)
curl https://npm-2.vercel.app/config

# Run live schema validation against Vercel serverless function
curl -X POST https://npm-2.vercel.app/api/validate \
  -H "Content-Type: application/json" \
  -d '{"schema":{"PORT":{"type":"port","required":true}},"source":{"PORT":"99999"}}'

# Test protected endpoint
curl -H "x-api-key: super-secret-production-token-999" https://npm-2.vercel.app/protected
```

---

## 🎯 What This Demo Shows

1. **Fail-Fast Bootstrapping**: Catches invalid ports, malformed URLs, bad enums, and missing required variables immediately at process boot before your app can misbehave.
2. **Automatic Secret Redaction**: Variables marked `secret: true` (e.g. `API_KEY`, passwords) are masked as `[REDACTED]` in error reports and sanitized diagnostic exports (`getSanitizedEnv()`).
3. **Type Coercion**: Parses environment strings into native TypeScript/JavaScript numbers, booleans, and enums.
4. **Conditional Validation (`requiredWhen`)**: Makes variables required only when related environment flags match (e.g., `AWS_S3_BUCKET` required only when `STORAGE_PROVIDER = 's3'`).
5. **Interactive Live Web Playground**: A built-in browser UI to test schemas and environment sources in real time.

---

## 🚀 Local Development

### 1. Run the Terminal Demo (Immediate Console Walkthrough)

```bash
npm run demo
```

### 2. Start the Express Server Locally

```bash
npm start
```
Then visit **`http://localhost:3000`**.

### 3. Run Validation Unit Tests

```bash
npm test
```

---

## 📁 Project Architecture

- **[config.js](file:///Users/pr0zpect/Documents/npm-2/config.js)**: Schema definition using `envGuard({ PORT, NODE_ENV, APP_NAME, API_KEY })`.
- **[server.js](file:///Users/pr0zpect/Documents/npm-2/server.js)**: Express app serving the web dashboard, static UI, health check, and `/api/validate`.
- **[api/index.js](file:///Users/pr0zpect/Documents/npm-2/api/index.js)**: Serverless handler entry point for Vercel.
- **[vercel.json](file:///Users/pr0zpect/Documents/npm-2/vercel.json)**: Vercel routing configuration.
- **[demo.js](file:///Users/pr0zpect/Documents/npm-2/demo.js)**: Runnable terminal script demonstrating type coercion, secret masking, `EnvGuardError`, and `requiredWhen`.
- **[public/index.html](file:///Users/pr0zpect/Documents/npm-2/public/index.html)**: Interactive browser playground with Tailwind dark mode UI.
- **[test.js](file:///Users/pr0zpect/Documents/npm-2/test.js)**: Unit test suite asserting schema rules and error handling.
- **[.env](file:///Users/pr0zpect/Documents/npm-2/.env)**: Local environment variables file.
