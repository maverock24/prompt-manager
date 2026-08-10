---
title: OWASP #10 — Server-Side Request Forgery (SSRF)
description: Audit for user-controlled URLs being fetched by the server, weak URL validation, and access to internal network resources.
---

# OWASP #10 — SSRF Audit

Audit the application for Server-Side Request Forgery vulnerabilities. You MUST trace every user-controlled URL or IP address that the server fetches/connects to — do not assume validation is sufficient without reading the actual code.

## Audit Steps

### 1. Identify Server-Side Requests
Search for any server-side HTTP/client requests:
- `grep -rn "fetch\|axios\|got\|request\|superagent\|http\.request\|http\.get\|urllib\|httpx\|requests\." --include="*.ts" --include="*.js" --include="*.py"`

For each match, determine: is ANY part of the URL or request parameters from user input?

### 2. Common SSRF Entry Points
- **Webhook handlers**: user registers a webhook URL — is it validated?
- **URL preview / unfurling**: paste a link, server fetches it to show a preview
- **File import from URL**: "import from URL" feature
- **Image proxy**: server fetches and resizes user-submitted image URLs
- **PDF generation**: server fetches external resources to include in PDF
- **SSRF through file uploads**: SVG files, XML with external entities
- **API integrations**: user provides instance URL for self-hosted services

### 3. URL Validation Quality
For each validated URL, check:

**Blocklist (weak — can be bypassed):**
```javascript
// BYPASSABLE:
if (url.includes('localhost') || url.includes('127.0.0.1')) return error;
// Attacker uses: http://2130706433/ (decimal IP), http://0x7f000001/, DNS rebinding
```

**Allowlist (strong — preferred):**
```javascript
// SAFE:
const ALLOWED_HOSTS = ['api.example.com', 'cdn.example.com'];
const parsed = new URL(userUrl);
if (!ALLOWED_HOSTS.includes(parsed.hostname)) return error;
```

- Check for DNS rebinding protection
- Are internal IPs blocked? (10.x, 172.16-31.x, 192.168.x, 127.x, 169.254.x, [::1])
- Are cloud metadata endpoints blocked? (`169.254.169.254`, `metadata.google.internal`)
- Check redirect following: if URL A redirects to internal URL B, is B validated?

### 4. Internal Service Access
- Could an attacker reach: internal APIs, databases, admin panels, cloud metadata services?
- Is the application running in a cloud environment? (AWS/GCP/Azure metadata endpoints are high-value targets)
- Could SSRF be chained with other vulnerabilities?

### 5. Protocol & Scheme Validation
- Is the URL scheme restricted to `https://` only? (NOT `file://`, `gopher://`, `dict://`, `ftp://`)
- Can the attacker specify a port? Is port scanning possible?

### 6. Output Format
```
SEVERITY: [Critical|High|Medium|Low]
FILE: exact/path.ext:line
ENTRY_POINT: [where user input enters the request flow]
ISSUE: [SSRF vector description]
EVIDENCE: [code showing user-controlled URL and missing/inadequate validation]
FIX: [implement allowlist validation / restrict schemes / block internal IPs]
```
