---
title: OWASP #5 — Security Misconfiguration
description: Check for CORS misconfiguration, missing CSP headers, verbose error messages, default credentials, and unnecessary features.
---

# OWASP #5 — Security Misconfiguration Audit

Audit the application's configuration for security-relevant settings. Read the actual config files, deployment configs, and middleware setup — do NOT guess based on framework defaults.

## Audit Steps

### 1. CORS Configuration
- Find CORS settings: `grep -rn "cors\|CORS\|Access-Control" --include="*.ts" --include="*.js" --include="*.json"`
- Is `Access-Control-Allow-Origin` set to `*`? (Critical if credentials are allowed)
- Are allowed origins too broad? (e.g., regex that matches anything)
- Are sensitive headers exposed via `Access-Control-Expose-Headers`?

### 2. Security Headers
Check for presence and correctness of:
- `Content-Security-Policy` — is it present? Too permissive? Contains `unsafe-inline` or `unsafe-eval`?
- `Strict-Transport-Security` (HSTS) — configured with reasonable max-age?
- `X-Frame-Options` or `frame-ancestors` CSP — prevents clickjacking?
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- `Permissions-Policy`

### 3. Error Handling
- Do error responses leak stack traces?
- Do 404/500 pages reveal framework or version information?
- Are database errors (connection strings, table names) exposed to the client?
- Check: trigger an error and inspect the response

### 4. Default & Unnecessary Features
- Default credentials: search for `admin/admin`, `root/root`, `test/test` in seed data or config
- Directory listing: is it disabled on the web server?
- Server header: does it reveal `Apache/2.4.41`, `Express`, version numbers?
- Unused HTTP methods: are PUT, DELETE, TRACE, OPTIONS properly restricted?
- Debug endpoints: any `/debug`, `/graphiql`, `/swagger-ui` exposed in production?

### 5. Cookie Security
- Are cookies set with `Secure`, `HttpOnly`, and `SameSite` flags?
- Session cookie: is the name non-default? (default names leak framework info)

### 6. Output Format
```
SEVERITY: [Critical|High|Medium|Low]
FILE: exact/path.ext:line (config file) or describe the HTTP response
SETTING: [which misconfiguration]
EVIDENCE: [actual config value or response header observed]
FIX: [correct configuration value]
```
