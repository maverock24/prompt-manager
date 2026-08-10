---
title: OWASP #8 — Software and Data Integrity Failures
description: Audit for insecure deserialization, missing subresource integrity, CI/CD secret leaks, unvalidated redirects, and supply chain risks.
---

# OWASP #8 — Software & Data Integrity Failures Audit

Audit for integrity failures across the software supply chain and data processing pipeline. Read actual config files, CI/CD definitions, and deserialization points — do not assume integrity checks exist.

## Audit Steps

### 1. Insecure Deserialization
- Search for deserialization functions: `grep -rn "\.parse\|unserialize\|pickle.loads\|yaml.load\|JSON.parse" --include="*.ts" --include="*.js" --include="*.py"`
- For each: is the input user-controlled?
- Check if `yaml.load()` is used instead of `yaml.safe_load()` (Python)
- Check if `eval()` or `new Function()` is used on parsed data
- Prototype pollution in JavaScript: object spread with user input, `Object.assign()`, deep merge libraries

### 2. Subresource Integrity (SRI)
- Find all external scripts loaded from CDNs: `grep -rn "cdn\|unpkg\|jsdelivr" --include="*.html" --include="*.tsx" --include="*.jsx"`
- Do they have `integrity` attributes with SHA hashes?
- Are external stylesheets also missing integrity checks?

### 3. CI/CD Pipeline Security
- Check CI config files: `.github/workflows/*.yml`, `.gitlab-ci.yml`, `Jenkinsfile`, etc.
- Are secrets managed via the CI platform's secret manager (not hardcoded)?
- Can CI pipelines be triggered by forked PRs? (Supply chain risk)
- Are there branch protection rules on the main branch?
- Check for unpinned actions: `uses: actions/checkout@v3` vs `uses: actions/checkout@v3.5.2`

### 4. Unvalidated Redirects
- Search for redirect logic: `grep -rn "redirect\|Redirect\|location.href\|window.location" --include="*.ts" --include="*.js"`
- Is the redirect URL from user input? (query params, request body, headers)
- Is the URL validated against an allowlist?
- Check for open redirect patterns:
  ```javascript
  // VULNERABLE:
  res.redirect(req.query.redirect)
  // SAFE:
  const allowed = ['/dashboard', '/settings', '/profile'];
  res.redirect(allowed.includes(req.query.redirect) ? req.query.redirect : '/');
  ```

### 5. Auto-Update & Plugin Systems
- Does the application have an auto-update mechanism?
- Are updates verified with digital signatures before applying?
- Plugin/extension systems: are plugins sandboxed? Code-signed?

### 6. Output Format
```
SEVERITY: [Critical|High|Medium|Low]
FILE: exact/path.ext:line
TYPE: [Deserialization|SRI|CI/CD|Redirect|SupplyChain]
ISSUE: [specific integrity failure]
EVIDENCE: [code or config excerpt]
FIX: [specific remediation]
```
