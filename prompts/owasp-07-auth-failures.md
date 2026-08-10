---
title: OWASP #7 — Identification & Authentication Failures
description: Audit password policy, brute force protection, session management, MFA availability, and password recovery flows.
---

# OWASP #7 — Identification & Authentication Failures Audit

Audit the entire authentication system — from password policy to session management to account recovery. You MUST read the actual auth code, not assume the auth library handles everything correctly.

## Audit Steps

### 1. Password Policy
- What is the minimum password length? (Recommend: 8+ for basic, 12+ for sensitive apps)
- Are complexity requirements enforced (or is NIST-style length-over-complexity used)?
- Is there a password deny-list? (Block `password123`, `admin123`, etc.)
- Can users reuse previous passwords?

### 2. Brute Force & Rate Limiting
- Is there account lockout after N failed login attempts?
- Is lockout temporary (increasing delays) or permanent (requires admin reset)?
- Does lockout apply per-account or per-IP? (Per-IP can be bypassed)
- Are there rate limits on: login, signup, password reset, MFA verification, magic link generation?
- Check for timing attacks: does login response time differ for valid vs invalid users?

### 3. Session Management
- Session IDs: are they generated with a cryptographically secure random generator?
- Cookie flags: `Secure`, `HttpOnly`, `SameSite=Lax` (or `Strict`)?
- Session fixation: is the session ID regenerated after login?
- Session timeout: absolute timeout? Idle timeout?
- Logout: does it invalidate the session server-side, or just clear the client cookie?
- Concurrent sessions: can the same user be logged in from multiple devices? Is that intentional?

### 4. Multi-Factor Authentication (MFA / 2FA)
- Is MFA available? Is it required for sensitive operations?
- MFA implementation: TOTP (time-based), SMS, email, WebAuthn?
- MFA recovery: are backup codes handled securely? Encrypted at rest?
- MFA bypass: are there any endpoints that skip MFA?

### 5. Password Recovery
- Token security: are reset tokens cryptographically random? (Not timestamp-based or predictable)
- Token expiry: do reset tokens expire? (Recommend: 15-60 minutes)
- Token storage: are reset tokens hashed in the database? (Like passwords)
- Rate limiting: is the reset endpoint rate-limited?
- User enumeration: does the reset flow reveal whether an account exists?
- One-time use: are tokens invalidated after use?

### 6. Credential Storage
- Are passwords hashed with bcrypt, argon2, scrypt, or PBKDF2? (NOT MD5, SHA1, SHA256)
- What's the work factor / cost factor?
- Are API keys hashed in the DB, or stored in plaintext?

### 7. Output Format
```
SEVERITY: [Critical|High|Medium|Low]
FILE: exact/path.ts:line
ISSUE: [specific auth failure]
EVIDENCE: [quote the vulnerable code or config]
FIX: [specific remediation with code example]
```
