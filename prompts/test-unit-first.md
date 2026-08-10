---
title: Unit Tests First — Write Tests Before Code
description: Generate unit tests BEFORE writing any implementation. Prioritize unit tests over other test types. Test behavior not implementation.
---

# Unit Tests First — Write Tests Before Code

I need unit tests for [FUNCTION / COMPONENT / MODULE]. **Write the tests FIRST.** Do NOT write implementation code — only tests that define the expected behavior.

## Test Generation Process

### Step 1: Analyze the Specification
Before writing any test, explain:
1. What are the inputs and their valid ranges?
2. What are the possible outputs for each input category?
3. What errors or exceptions can occur?
4. What external dependencies does this unit interact with?

### Step 2: List All Branches
Enumerate every code path the implementation will need:
- Happy path (normal operation)
- Each error condition
- Each boundary value (empty, zero, max, min, null, undefined)
- Each edge case (concurrent calls, large inputs, malformed data)

### Step 3: Write the Tests
For each branch, write a unit test that:
- **Tests behavior, not implementation** — the test should survive refactoring. Don't test private methods or internal state directly.
- **Is independent** — each test sets up its own state, no shared mutable fixtures
- **Is isolated** — mock ALL external dependencies (databases, APIs, file system, clock). A unit test that hits a database is an integration test.
- **Is named clearly**: `test_[unit]_[scenario]_[expectedOutcome]`
- **Follows AAA**: `// Arrange` → `// Act` → `// Assert`
- **Has ONE assertion concept** per test (multiple assertions about the same logical outcome are fine)

### Step 4: Prioritize
Order the tests from highest to lowest priority:
1. Critical path tests (if these fail, the feature is broken)
2. Error handling tests
3. Edge case tests
4. Regression tests (for bugs previously fixed)

## Framework-Specific Requirements

**Jest / Vitest:**
```
- Use jest.mock() for module-level mocking
- Use jest.spyOn() when verifying specific function calls
- Avoid jest.fn() without clear return values — specify behavior explicitly
- Each test in a describe() block, grouped by scenario category
```

**Pytest:**
```
- Use pytest.fixture for shared setup (but keep state fresh per test)
- Use pytest.mark.parametrize for input/output table tests
- Use mocker.patch from pytest-mock for dependency isolation
- Test functions, not methods — no class wrappers unless needed
```

## After Writing Tests, Critical Self-Review
Answer honestly:
- "How many of these tests would actually catch a real bug?" (If the answer is "few," the tests are too shallow.)
- "If I refactored the implementation completely, how many tests would survive unchanged?" (If the answer is "few," the tests are coupled to implementation details.)
- "Did I test the truly dangerous edge cases, or just the convenient ones?"
- "Are any tests redundant — testing the same behavior through different paths? Delete them."

## Specification
```
[PASTE FUNCTION SIGNATURE, COMPONENT PROPS, OR FEATURE DESCRIPTION HERE]
```
