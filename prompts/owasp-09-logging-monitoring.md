---
title: OWASP #9 — Security Logging & Monitoring Failures
description: Verify that security-relevant events are logged, logs are tamper-proof, sensitive data is excluded from logs, and alerting is configured.
---

# OWASP #9 — Security Logging & Monitoring Failures Audit

Audit the application's logging and monitoring capabilities. You MUST read the actual logging code and configuration — do not assume "of course it's logged."

## Audit Steps

### 1. What Is Being Logged?
Verify the following events are logged (find the actual log statements):

**Authentication events:**
- Successful login (user ID, timestamp, IP)
- Failed login attempts
- Account lockouts
- Password changes
- Password reset requests and completions
- MFA enrollment and verification

**Authorization events:**
- Access denied / 403 responses
- Admin actions (create, update, delete operations by privileged users)
- Role changes

**Data events:**
- Sensitive data access (PII viewed/exported)
- Data modifications (especially bulk operations)
- File uploads and downloads

**System events:**
- Application startup/shutdown
- Configuration changes
- Errors and exceptions (with correlation IDs)

### 2. Log Quality
- Do log entries include: timestamp (ISO 8601), user ID, IP address, correlation/request ID, event type?
- Are log levels used correctly? (DEBUG for dev, INFO for normal ops, WARN for anomalies, ERROR for failures)
- Are logs structured? (JSON format preferred for machine parsing)
- Can the sequence of a user's actions be reconstructed from logs?

### 3. Log Integrity
- Where are logs stored? (Local files? Centralized service? Database?)
- Can an attacker who compromises the application also delete/alter the logs?
- Are logs shipped off-server in real-time?
- Is there log rotation and retention policy?

### 4. Sensitive Data in Logs
- Search for data that should NOT be in logs:
  - Passwords (even hashed) in log messages
  - Full credit card numbers, SSNs, or other PII
  - Session tokens or API keys
  - Full request/response bodies that may contain sensitive data
- Check: `grep -rn "console\.log\|logger\." --include="*.ts" --include="*.js"` — inspect what's being logged

### 5. Monitoring & Alerting
- Are there alerts configured for: multiple failed logins, unusual activity patterns, error rate spikes?
- Is there a health check endpoint being monitored?
- Are 5xx error rates tracked and alerted on?
- Is there a dashboard or notification system for security events?

### 6. Audit Trail Completeness
- Can you trace a full user session from login to logout via logs?
- Are logs sufficient for forensic analysis after an incident?

### 7. Output Format
```
SEVERITY: [Critical|High|Medium|Low]
FILE: exact/path.ext:line (or config)
ISSUE: [what's not being logged / what's logged inappropriately]
EVIDENCE: [missing log statement location, or example of sensitive data in logs]
FIX: [add logging / redact sensitive data / configure alerting]
```
