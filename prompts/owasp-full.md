---
title: OWASP Top 10 — Full Security Audit
description: Complete OWASP Top 10 comprehensive security audit covering all ten categories. Use this for a thorough application security review.
---

# OWASP Top 10 — Full Security Audit

Perform a comprehensive OWASP Top 10 security review of the entire codebase. For each category below, you MUST read the actual source files before drawing conclusions. Do NOT make assumptions based on framework defaults or "best practices" — verify every claim with concrete file:line evidence.

For each finding, use this format:
- **Severity**: Critical / High / Medium / Low
- **File**: exact path and line number
- **Finding**: what's wrong and why it matters
- **Fix**: specific code change needed

---

## 1. Broken Access Control
- Verify every API endpoint / server action checks user ownership before returning or modifying data
- Check for missing authorization checks on "hidden" endpoints (admin, internal APIs)
- Look for IDOR vulnerabilities — can user A access user B's data by changing an ID parameter?
- Verify role-based access: are admin-only routes actually gated?
- Check that client-side hiding is not the only access control (must be enforced server-side)

## 2. Cryptographic Failures
- Search for hardcoded API keys, secrets, tokens in source code (grep for: `apiKey`, `secret`, `password`, `token`, `-----BEGIN`)
- Verify `.env.example` exists and `.env` is in `.gitignore`
- Check that sensitive data is encrypted at rest and in transit
- Verify TLS/HTTPS is enforced
- Check for weak hashing algorithms (MD5, SHA1 for passwords)

## 3. Injection
- SQL injection: check all database queries — are they parameterized? Any raw string concatenation?
- NoSQL injection: check MongoDB queries for unsanitized user input in `$where`, `$regex`
- Command injection: any `exec()`, `spawn()`, `eval()` with user input?
- Check ORM usage — are raw queries used anywhere? Are they parameterized?
- LDAP, XPath, OS command injection vectors

## 4. Insecure Design
- Rate limiting: is it implemented on auth endpoints (login, signup, password reset)?
- Principle of least privilege: do users have more access than needed?
- Input validation: are all user inputs validated and sanitized on the server?
- Check for missing security controls that should be architectural (not bolted on later)

## 5. Security Misconfiguration
- CORS: is it too permissive? (`Access-Control-Allow-Origin: *` with credentials)
- CSP headers: are they configured? Too permissive?
- Error handling: do error responses leak stack traces, DB schemas, internal paths?
- Default credentials: any default admin/password combinations?
- Unnecessary features enabled: directory listing, verbose server headers, unused HTTP methods
- Check security headers: HSTS, X-Frame-Options, X-Content-Type-Options

## 6. Vulnerable and Outdated Components
- Run `npm audit` or equivalent and review Critical/High findings
- Check for dependencies with known CVEs
- Verify all packages are pinned to specific versions (no `latest` or `*` in package.json)
- Look for unmaintained / abandoned packages
- Check that the project's runtime (Node.js, Python, etc.) is a supported LTS version

## 7. Identification and Authentication Failures
- Password policy: minimum length? Complexity requirements?
- Brute force protection: account lockout after N failed attempts?
- Session management: secure, httpOnly, SameSite cookie flags?
- MFA/2FA: is it available for sensitive operations?
- Check for weak password recovery flows (predictable tokens, lack of rate limiting)
- Verify session invalidation on logout and password change

## 8. Software and Data Integrity Failures
- Supply chain: are third-party scripts/CDN resources loaded with integrity hashes (subresource integrity)?
- Deserialization: any `unserialize()`, `pickle.loads()`, or similar with user-controlled data?
- CI/CD pipeline: are secrets properly managed in CI?
- Auto-update mechanisms: do they verify signatures before applying updates?
- Check for unvalidated redirects (`redirect_url` parameters without validation)

## 9. Security Logging and Monitoring Failures
- Are authentication failures logged? (failed login, password reset attempts)
- Are admin actions logged with user ID and timestamp?
- Check logging levels: are sensitive operations logged at the right level?
- Log integrity: can logs be tampered with?
- Are there monitoring/alerting triggers for suspicious patterns?
- Check that logs do NOT contain sensitive data (passwords, tokens, PII)

## 10. Server-Side Request Forgery (SSRF)
- Any user-controlled URLs being fetched by the server? (`fetch()`, `axios`, `curl` with user input)
- File imports/parsers that accept remote URLs?
- Webhook handlers — do they validate the destination?
- Check URL validation: is it blocklist-based (bypassable) or allowlist-based?
- Internal service access: can user input cause requests to internal IPs/endpoints?

---

## Final Instructions
After completing the audit, produce a summary with:
1. Total findings by severity
2. Top 5 most critical issues
3. Remediation priority order
4. Any patterns of recurring issues that suggest architectural improvements
