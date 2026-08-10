---
title: Edge Case Discovery — Find What You Missed
description: Given existing tests, discover edge cases, boundary conditions, and failure modes that are not yet covered. LLMs excel at seeing what humans overlook.
---

# Edge Case Discovery — Find What You Missed

Given the existing tests below, discover edge cases that are NOT covered. Your job is to find the cracks — the scenarios that would break the code but aren't tested.

## Process

### Step 1: Understand the System Under Test
First, read the implementation code. Then read the existing tests. Map what's covered onto what the code actually does. You MUST read the actual code — do not guess from test names.

### Step 2: Hunt by Category
For each category below, propose edge cases the existing tests miss:

**Input Boundaries:**
- Empty values: `""`, `[]`, `{}`, `null`, `undefined`
- Maximum values: max int, max string length, max array size
- Minimum values: `0`, `-1`, `Number.MIN_VALUE`
- Type surprises: string where number expected, array where object expected
- Unicode/special chars: emoji, zero-width chars, right-to-left markers, null bytes

**State & Timing:**
- What happens if called twice in quick succession?
- What happens if called before initialization?
- What happens during an in-progress operation?
- What happens after a previous error?

**Resource Constraints:**
- What if the database connection drops mid-operation?
- What if the response is larger than expected?
- What if a timeout fires during processing?

**Authorization & Ownership:**
- What if the user is authenticated but doesn't own the resource?
- What if the user's role changed between login and this request?
- What if the user is deactivated mid-session?

**Combinations:**
- What if TWO things go wrong simultaneously? (e.g., validation error + network timeout)
- What if a valid input in one field makes another field invalid?

### Step 3: Propose New Tests
For each uncovered edge case, produce:
```
NAME: test_[scenario description]
INPUT: [exact inputs]
EXPECTED: [exact expected behavior — result or error]
PRIORITY: [Critical|High|Medium|Low] — based on likelihood × impact
RATIONALE: [one sentence explaining why this matters]
```

### Step 4: Filter Ruthlessly
After listing edge cases, filter them:
- **KEEP**: realistic scenarios that could occur in production
- **KEEP**: scenarios that map to a known past bug
- **DISCARD**: physically impossible scenarios (e.g., "integer overflow" when the value comes from a <select>)
- **DISCARD**: "testing the language" (e.g., testing that `Array.push` works)

## Self-Audit
Before outputting, ask:
- "Did I actually read the implementation code, or did I guess from test names?"
- "Am I proposing edge cases to appear clever, or because they would catch real bugs?"
- "Could I delete half of these and still catch 90% of the bugs? If yes, I'm proposing too many."
- "Did I mark everything as 'Critical'? Re-evaluate — true criticals should be rare."

## Existing Tests
```
[PASTE EXISTING TEST FILE(S) HERE]
```

## Implementation (for reference)
```
[PASTE THE CODE BEING TESTED HERE]
```
