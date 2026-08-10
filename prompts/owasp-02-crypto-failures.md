---
title: OWASP #2 — Cryptographic Failures
description: Detect exposed secrets, hardcoded API keys, weak encryption, and improper key management across the codebase.
---

# OWASP #2 — Cryptographic Failures Audit

Search for exposed secrets, weak cryptography, and improper key management. Do NOT assume secrets are properly managed just because the framework "usually" handles it — grep the actual code.

## Audit Steps

### 1. Hardcoded Secrets Scan
Run these searches and inspect EVERY match:
- `grep -rn "apiKey\|api_key\|API_KEY\|secret\|SECRET\|password\|PASSWORD" --include="*.ts" --include="*.js" --include="*.py" --include="*.go"`
- `grep -rn "-----BEGIN" --include="*"` (private keys in source)
- `grep -rn "token\|TOKEN" --include="*.ts" --include="*.js"` (look for hardcoded tokens)
- `grep -rn "sk-\|pk-\|xoxb-\|ghp_\|github_pat_" --include="*"` (known API key patterns)

For each match, determine: is this a hardcoded production secret, a test/dev placeholder, or a reference to an env variable?

### 2. Environment Variable Hygiene
- Verify `.env` is in `.gitignore`
- Verify `.env.example` exists and contains NO real values
- Check that all secrets use environment variables, never hardcoded
- Look for secrets in config files, CI/CD configs, Dockerfiles

### 3. Encryption Practices
- Password hashing: verify bcrypt, argon2, or scrypt is used (NOT MD5, SHA1, SHA256 for passwords)
- Check for custom crypto implementations (almost always wrong)
- Verify TLS is enforced in production config
- Check for hardcoded encryption keys or IVs
- Are cookies marked `Secure` and `HttpOnly`?

### 4. Data at Rest
- Is sensitive user data (PII, credentials) encrypted in the database?
- Are backups encrypted?

### 5. Output Format
```
SEVERITY: [Critical|High|Medium|Low]
FILE: exact/path.ts:line
ISSUE: [description of exposed secret or weak crypto]
EVIDENCE: [redacted excerpt — do NOT output the actual secret!]
FIX: [specific remediation]
```
