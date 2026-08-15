---
title: TDD — Red-Green-Refactor with AI
description: Test-Driven Development workflow: write failing tests first, then implement, then refactor — assisted by AI but driven by tests.
---

# TDD — Red-Green-Refactor with AI

Guide me through building the target feature using strict Test-Driven Development. Tests are written FIRST — no implementation code before the test exists and fails.

## Input

Fill in the fields below, then start the cycle.

**Feature to build:**

```
[DESCRIBE FEATURE HERE]
```

**Test framework and test file path:**

```
Framework: [Jest / Pytest / Vitest / etc.]
Test file: [e.g., src/__tests__/feature.test.ts]
```

---

## The Cycle (Repeat for Each Small Increment)

### RED Phase — Write the Failing Test FIRST
1. I will describe the next small behavior we need.
2. You write a test that:
   - Is minimal — tests exactly ONE behavior
   - Is named descriptively: `test_[what]_[condition]_[expected]`
   - Follows AAA pattern (Arrange → Act → Assert) with labeled comments
   - Fails for the RIGHT reason (not a syntax error, but the missing behavior)
3. I confirm the test looks correct before we proceed.

### GREEN Phase — Minimal Implementation
4. You write the ABSOLUTE MINIMUM code to make the test pass.
   - No extra logic beyond what the test demands.
   - No "future-proofing" or "while we're at it" additions.
   - If the simplest thing is a hardcoded return, do it — the next test will force generalization.
5. I run the test to confirm it passes.

### REFACTOR Phase — Clean Up with Confidence
6. With passing tests as a safety net, improve the code:
   - Remove duplication (across both test and production code)
   - Improve names for clarity
   - Extract methods/classes where they clarify intent
   - Tests must stay GREEN throughout
7. I confirm tests still pass after refactoring.

## Critical Rules
- **Never write implementation before tests.** If you're tempted to "just sketch the code," stop. Write the test.
- **One behavior per cycle.** Don't batch multiple behaviors into one test.
- **Tests are the specification.** If the test doesn't describe the behavior clearly, fix the test before writing code.
- **Resist over-engineering.** The test constrains what you build. No more, no less.

## Before Each Cycle, Ask Yourself:
- "Does this test actually fail for the right reason, or am I seeing a false red?"
- "Is this the simplest test that drives the next increment, or am I testing too much at once?"
- "Am I writing implementation code before the test? Stop and write the test first."


