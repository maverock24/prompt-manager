---
title: Improve Test Coverage — Audit & Strategy
description: Analyze current test coverage, find critical gaps, and create a prioritized plan to improve coverage where it matters most.
---

# Improve Test Coverage — Audit & Strategy

Analyze the test coverage for [MODULE / PROJECT] and create a prioritized plan to improve it. Coverage percentage alone is meaningless — we need coverage where bugs actually happen.

## Phase 1: Coverage Audit

### Step 1: Run Coverage & Read the Report
Run the test suite with coverage enabled and read the report. DO NOT just look at the overall percentage — drill into every file.

```
[Jest]: npx jest --coverage
[Pytest]: pytest --cov=src --cov-report=term-missing
```

### Step 2: Identify the Real Gaps
For each file with <80% coverage, answer:
1. **Which lines are uncovered?** List exact line numbers.
2. **What do those lines do?** Error handling? Edge case? Configuration? Dead code?
3. **Would a bug on those lines cause production issues?** Rate: Critical / High / Medium / Low

### Step 3: Categorize the Gaps
```
CRITICAL (must cover now):
  - Authorization checks (missing coverage = privilege escalation risk)
  - Payment/financial logic
  - Data mutation paths that are untested
  - Error recovery paths (what happens when the DB is down?)

HIGH (cover this sprint):
  - Input validation edge cases
  - Race conditions and concurrent access
  - Transaction rollback behavior

MEDIUM (cover when possible):
  - Logging and metrics code
  - Response formatting
  - Configuration loading

LOW (may not be worth covering):
  - Trivial getters/setters
  - Framework boilerplate
  - Dead code (DELETE IT instead of testing it)
```

## Phase 2: Test Generation Strategy

For each Critical and High gap, generate tests following this order:
1. **Unit tests first** — test the logic in isolation. Cheaper, faster, more precise.
2. **Integration tests second** — test the seams between components.
3. **E2E tests last** — only for critical user journeys. Expensive and brittle.

For each test, specify:
- What it covers (exact lines from the coverage report)
- Test type (unit / integration / e2e)
- Expected coverage improvement (%)
- Risk addressed (what production bug this prevents)

## Phase 3: Self-Critique

Before finalizing the plan, challenge it:
- "Am I chasing 100% coverage, or am I covering the code that actually fails?"
- "Which of these tests would I bet $100 will catch a bug in the next 6 months?"
- "Are there files with 100% coverage but weak assertions? Coverage without meaningful assertions is false confidence."
- "Am I testing the framework or my code? Testing that Express routes work is a waste — test YOUR route handlers."
- "Could any of these tests be deleted without meaningfully reducing bug detection? If yes, they're noise."

## Current State
```
[PASTE COVERAGE REPORT OR DESCRIBE CURRENT TEST STATE]
```
