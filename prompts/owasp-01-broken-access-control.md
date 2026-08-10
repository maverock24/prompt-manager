---
title: OWASP #1 — Broken Access Control
description: Verify all endpoints check user ownership and enforce proper authorization. Detects IDOR, missing role checks, and client-only access control.
---

# OWASP #1 — Broken Access Control Audit

Verify that every endpoint, server action, and API route enforces proper authorization. You MUST read the actual source files for every route handler before concluding anything. Do NOT assume a middleware covers all routes just because one exists.

## Audit Steps

### 1. Map All Endpoints
First, list every API route and server action. For each one, record:
- Route path and HTTP method
- File and line number where the handler is defined
- Whether it handles user-owned data

### 2. For Each Endpoint, Verify:
- **Ownership check**: If the endpoint returns or modifies user-specific data, does it verify the requesting user owns that data? Look for patterns like `WHERE user_id = ?` with the authenticated user's ID, or explicit ownership checks before returning data.
- **Role checks**: For admin/superuser endpoints, is there a server-side role check BEFORE any data access?
- **No client-only gating**: Is there any route where the only "protection" is hiding a button in the UI? (Red flag — must verify server-side)
- **Direct object references**: Can changing a numeric ID in the URL give access to another user's data? Test: if `GET /api/invoices/123` returns invoice 123 for user A, would it return invoice 123 for user B?

### 3. Specific Patterns to Hunt For

**Missing ownership in queries:**
```sql
-- VULNERABLE: no user filter
SELECT * FROM orders WHERE id = $1
-- SAFE:
SELECT * FROM orders WHERE id = $1 AND user_id = $2
```

**ORM without ownership:**
```javascript
// VULNERABLE:
const order = await Order.findByPk(req.params.id)
// SAFE:
const order = await Order.findOne({ where: { id: req.params.id, userId: req.user.id } })
```

**Missing authorization decorators/middleware:**
```javascript
// VULNERABLE: no auth check
app.get('/api/admin/users', handler)
// SAFE:
app.get('/api/admin/users', requireAdmin, handler)
```

### 4. Output Format
For every finding:
```
SEVERITY: [Critical|High|Medium|Low]
FILE: exact/path.ts:line
ISSUE: [endpoint] does not verify [ownership/role] before [action]
EVIDENCE: [quote the actual code that's missing the check]
FIX: [specific code change]
```

### 5. Final Check
After reviewing all endpoints, ask yourself:
- "Have I physically read every route handler, or did I assume some are protected?"
- "Did I find at least one actual file:line reference for each claim?"
- "If I were an attacker, which 3 endpoints would I target first and why?"
