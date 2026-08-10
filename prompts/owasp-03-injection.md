---
title: OWASP #3 — Injection
description: Hunt for SQL, NoSQL, command, and code injection vectors. Check all database queries and system calls for unsanitized user input.
---

# OWASP #3 — Injection Audit

Hunt for every injection vector in the codebase: SQL, NoSQL, command, LDAP, XPath, code injection. You MUST inspect every database query and every system call. Do not assume the ORM handles it — verify.

## Audit Steps

### 1. SQL Injection
- Find all raw SQL queries: `grep -rn "\.query\|\.execute\|\.raw\|db\.run\|rawQuery" --include="*.ts" --include="*.js"`
- For each raw query, check: is user input concatenated, interpolated, or properly parameterized?
- Red flag patterns:
  ```javascript
  // VULNERABLE:
  `SELECT * FROM users WHERE email = '${email}'`
  `SELECT * FROM users WHERE email = '` + email + `'`
  // SAFE:
  `SELECT * FROM users WHERE email = ?` (with parameter binding)
  db.query('SELECT * FROM users WHERE email = $1', [email])
  ```
- Check ORM "escape hatches" — many ORMs allow raw queries

### 2. NoSQL Injection
- Check MongoDB queries with `$where`, `$regex`, or object spread with user input
- Verify that user input used in query operators is sanitized:
  ```javascript
  // VULNERABLE: user can inject $ne, $gt, etc.
  db.collection.find({ username: req.body.username })
  // SAFE:
  db.collection.find({ username: String(req.body.username) })
  ```

### 3. Command Injection
- Find all `exec()`, `spawn()`, `execSync()`, `system()`, `popen()` calls
- Create file operations with user-controlled paths: `fs.readFile(userInput)`
- Template engines with user-controlled templates
- Check: is ANY part of the command string from user input?

### 4. Other Injection Vectors
- LDAP injection: `grep -rn "ldap\|LDAP"`
- XPath injection: `grep -rn "xpath\|XPath"`
- Code injection: `eval()`, `Function()`, `vm.runInNewContext()`
- Regular expression DoS: user-controlled regex patterns

### 5. Output Format
```
SEVERITY: [Critical|High|Medium|Low]
FILE: exact/path.ts:line
TYPE: [SQL|NoSQL|Command|Code|Other]
ISSUE: [description of injection vulnerability]
EVIDENCE: [quote the vulnerable code with user input flow]
FIX: [use parameterized queries / input sanitization / allowlisting]
```
