---
title: Test Value Audit — Are These Tests Worth It?
description: Critically audit existing tests for actual value. Identify tests that provide false confidence, are redundant, or cost more to maintain than they save.
---

# Test Value Audit — Are These Tests Worth It?

Perform a critical audit of the test suite for [MODULE / PROJECT]. Not all tests are created equal. Some tests cost more in maintenance than they save in bug prevention. This audit identifies tests that should be rewritten, removed, or kept.

## The Uncomfortable Questions

For each test file and each individual test, answer honestly:

### 1. Bug Detection Value
- "When was the last time this test actually caught a real bug?" (Not a refactoring breakage — a real bug.)
- "If I deleted this test right now, would any behavior go unverified?"
- "Is this test redundant — testing the same thing as another test through a different path?"

### 2. Maintenance Cost
- "How many times has this test been updated in the last 6 months?"
- "When requirements changed, did this test correctly fail, or was it updated just to match the new code?"
- "Does this test break when we refactor internal implementation details?"

### 3. False Confidence
- "This test passes. Does that actually mean the feature works?"
- "Are the assertions specific enough to catch a bug, or would any plausible output pass?"
- "Is this test testing the mock, not the code?" (Common with over-mocked tests.)

### 4. Speed Tax
- "How long does this test take to run?"
- "Is there a faster way to verify the same behavior?" (Integration test → unit test, e2e → integration test)
- "Could this be run less frequently?" (On merge to main instead of every commit)

## Classification

For each test, assign one label:

| Label | Meaning | Action |
|-------|---------|--------|
| **KEEP** | Catches real bugs, survives refactoring, runs fast | Maintain as-is |
| **REWRITE** | Tests the right thing but poorly (brittle, slow, unclear) | Rewrite for resilience |
| **DEMOTE** | E2E testing what an integration test could verify | Convert to cheaper test type |
| **MERGE** | Two+ tests verifying the same behavior | Combine into one parameterized test |
| **DELETE** | Never catches bugs OR tests framework/language OR duplicate | Remove without replacement |

## Common Patterns to Flag

### The "Getter Test" — DELETE
```
test('should return the name', () => {
  const user = new User({ name: 'Alice' });
  expect(user.getName()).toBe('Alice');
});
```
This tests JavaScript assignment, not your code. Delete immediately.

### The "Mock Mirror" — REWRITE
```
test('should call repository with correct args', () => {
  mockRepo.findByEmail.mockResolvedValue({ id: 1 });
  await service.getUser('test@test.com');
  expect(mockRepo.findByEmail).toHaveBeenCalledWith('test@test.com');
});
```
This tests that your code calls a mock. If the mock's return value is wrong, this test still passes. Test the OUTPUT, not the internal call.

### The "Snapshot of Everything" — DELETE or REWRITE
Tests that snapshot large objects. When they fail, nobody reads the 200-line diff. If you must snapshot, snapshot only the specific fields that matter.

### The "Sleep Test" — REWRITE
```
await setTimeout(1000);
expect(result).toBe('something');
```
Sleeps in tests hide race conditions; they slow the suite and still fail intermittently. Use proper async primitives.

## Output Format

```
## File: [path/to/test.ts]

### Test: "[test name]" → [KEEP|REWRITE|DEMOTE|MERGE|DELETE]
**Reason**: [one sentence explaining the classification]
**Evidence**: [when it last caught a bug, or why it provides false confidence]

### Test: "[test name]" → ...
...

## Summary
- Total tests: N
- KEEP: N (X%)
- REWRITE: N (X%)
- DEMOTE: N (X%)
- MERGE: N (X%)
- DELETE: N (X%)
- Estimated time saved by removing/degrading: X seconds per run
```

## Final Challenge
Before submitting, ask yourself:
- "Did I actually read each test, or did I skim and classify by pattern?"
- "Am I being honest about bug detection value, or am I keeping tests because deleting them feels wrong?"
- "If I had to cut the test suite in half, which tests would I keep? Start there."
- "Do my DELETE recommendations actually remove safety, or just remove noise?"

## Scope
```
[DESCRIBE WHICH TEST FILES TO AUDIT, OR "ALL TESTS"]
```
