# OWASP Security Prompt Library for pi

A **general-purpose prompt manager** extension for pi coding agent that ships with a comprehensive OWASP Top 10 security audit prompt library. Add new prompts by committing `.md` files to the `prompts/` directory — all clients get them on `pi update`.

## Features

- **`/prompts`** — list all available prompt templates
- **`/prompt <name>`** — load and inject a prompt into the conversation
- **`load_prompt`** tool — LLM can load prompts by name
- **`list_prompts`** tool — LLM can discover available prompts
- **Automatic critical-thinking preamble** — every prompt enforces evidence-based reasoning

## Included Prompts

| # | Prompt | Focus |
|---|--------|-------|
| 1 | Broken Access Control | Verify all endpoints check ownership and enforce authorization |
| 2 | Cryptographic Failures | Detect exposed secrets, hardcoded keys, weak encryption |
| 3 | Injection | SQL/NoSQL/command injection vectors |
| 4 | Insecure Design | Missing rate limiting, lack of least privilege |
| 5 | Security Misconfiguration | CORS, CSP headers, verbose errors, default configs |
| 6 | Vulnerable Components | Outdated dependencies, known CVEs |
| 7 | Auth Failures | Weak password policy, missing session management |
| 8 | Software & Data Integrity | Unvalidated redirects, deserialization, supply chain |
| 9 | Logging & Monitoring | Are auth failures and admin actions logged? |
| 10 | SSRF | User-controlled URLs being fetched |
| — | **owasp-full** | Complete OWASP Top 10 comprehensive audit |

## Install

```bash
pi install git:github.com/maverock24/owasp-security
```

## Add New Prompts

1. Add a `.md` file to the `prompts/` directory
2. Include YAML frontmatter with `title` and `description`
3. Commit and push
4. Clients run `pi update` to get the new prompt instantly

```markdown
---
title: My Custom Audit
description: Audits the application for custom vulnerability patterns
---

## My Custom Audit

Review the codebase for...
```

## Critical Thinking Mantra

Every prompt automatically includes this preamble in the system prompt:

> **Before answering:** Challenge your own assumptions. Do not move forward without concrete evidence. If you're unsure about something, explicitly state what you need to verify rather than guessing. Prefer reading actual code/files over relying on memory of how a framework "usually" works. Cite exact file paths and line numbers for every finding.
