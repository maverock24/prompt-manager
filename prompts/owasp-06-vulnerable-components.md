---
title: OWASP #6 — Vulnerable and Outdated Components
description: Scan dependencies for known vulnerabilities, outdated packages, and unmaintained libraries. Run actual audit tools, don't guess.
---

# OWASP #6 — Vulnerable and Outdated Components Audit

Audit all project dependencies for known vulnerabilities. You MUST run the actual audit tools — do NOT guess or estimate vulnerability status.

## Audit Steps

### 1. Dependency Audit
Run these commands and analyze the output:
- **Node.js**: `npm audit --json` (and review Critical/High findings individually)
- **Python**: `pip-audit` or `safety check`
- **Go**: `govulncheck ./...`
- **Rust**: `cargo audit`
- **Ruby**: `bundle audit`

For each Critical/High finding, determine:
- Is there an available fix? What version patches it?
- Is the vulnerability actually exploitable in this application's context?
- What's the CVE ID and CVSS score?

### 2. Outdated Packages
- Run `npm outdated` or equivalent
- Check for packages pinned to specific versions — are they current?
- Look for `latest`, `*`, or unpinned version ranges
- Are any packages more than 1 year out of date?

### 3. Unmaintained / Abandoned Packages
- Check npm downloads trend (declining → possible abandonment)
- Check GitHub: last commit date, open issues, maintainer activity
- Look for packages with no updates in 12+ months
- Are there known replacements for abandoned packages?

### 4. Runtime & Framework Versions
- Node.js: is it an LTS version? Still supported?
- Web framework: latest major version? Still getting security patches?
- Database driver: up to date?
- Any packages that have announced end-of-life?

### 5. Transitive Dependencies
- Are there deeply nested dependencies with vulnerabilities?
- Can vulnerable transitive deps be forced to upgrade via overrides/resolutions?
- Check lockfile integrity

### 6. Output Format
```
SEVERITY: [Critical|High|Medium|Low]
PACKAGE: name@version (type: direct|transitive)
CVE: [CVE ID if applicable]
ISSUE: [what's the vulnerability]
EXPLOITABLE: [yes|no|maybe — with reasoning specific to this codebase]
FIX: [upgrade to version X or replace with Y]
```
