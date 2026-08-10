---
title: OWASP #4 — Insecure Design
description: Audit for missing rate limiting, lack of least privilege, absent security controls in the architecture itself before implementation flaws.
---

# OWASP #4 — Insecure Design Audit

Audit the application's architecture for missing security controls that should be designed in from the start. This is about what's ABSENT from the design, not what's implemented incorrectly. You MUST verify each claim by reading actual code — don't assume rate limiting exists just because it "should."

## Audit Steps

### 1. Rate Limiting
- Check auth endpoints (login, signup, password reset, MFA) for rate limiting
- Check API endpoints for rate limiting — can an attacker flood them?
- Verify rate limits are per-user / per-IP, not just global
- Look for rate limiting implementation: middleware, reverse proxy config, WAF rules
- Test: what happens if you send 1000 requests to the login endpoint?

### 2. Principle of Least Privilege
- Does the application run with the minimum necessary database permissions? (or does it use a superuser DB account?)
- Are there different access levels, or is everyone either "user" or "admin"?
- Can a regular user access any admin functionality?
- Check file system permissions for the running process

### 3. Input Validation Strategy
- Is there a centralized validation layer, or is it ad-hoc per endpoint?
- Are all inputs validated on the SERVER (not just client-side)?
- Check for missing validation: file uploads (size, type, content), URL parameters, headers
- Are there any endpoints that accept arbitrary user input without validation?

### 4. Security Architecture Gaps
- Is there a content security policy?
- Is there audit logging for sensitive operations?
- How are secrets managed in CI/CD?
- Is there an incident response plan visible in the repo?
- Multi-tenancy: if SaaS, is tenant isolation enforced at the data layer?

### 5. Output Format
```
SEVERITY: [Critical|High|Medium|Low]
CATEGORY: [Rate Limiting|Least Privilege|Input Validation|Architecture]
ISSUE: [what security control is missing from the design]
EVIDENCE: [show where the control should be and that it's absent]
FIX: [what architectural change is needed — not just a code patch]
```
