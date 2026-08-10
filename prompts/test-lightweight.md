---
title: Lightweight Tests — Fast, Focused, Non-Brittle
description: Write tests that are cheap to run, easy to maintain, and resistant to refactoring. Avoid over-mocking, false confidence, and test bloat.
---

# Lightweight Tests — Fast, Focused, Non-Brittle

Write lightweight tests for [FUNCTION / COMPONENT]. Lightweight means: fast to run, easy to understand, cheap to change, and worth the maintenance cost. Every test must earn its place.

## Principles

### 1. Speed: Tests Must Be Fast
- **Unit tests**: <5ms each. If a unit test takes longer, it's probably not a unit test — it's hitting I/O.
- **Integration tests**: <500ms each (with embedded infrastructure).
- **The entire unit test suite**: should run in under 10 seconds. If it doesn't, something is wrong.

### 2. Independence: No Test Order Dependencies
- Tests must pass in any order, in isolation, or in parallel.
- No shared mutable state between tests. Each test creates its own world.
- If test B fails because test A didn't run first, the tests are broken.

### 3. Resilience: Tests Survive Refactoring
- ✓ Test what the code DOES, not HOW it does it.
- ✓ If you rename a private method, no tests should break.
- ✗ Avoid testing: private methods, internal state shape, specific function call counts (unless it's a side effect contract).
- ✗ Avoid: over-specified mocks that encode implementation details.

### 4. Readability: Tests as Documentation
- Test names should complete the sentence: "It should..."
- Each test should tell a story: setup → action → verification
- A new developer should understand what the code does by reading only the test names.

### 5. One Assertion Concept Per Test
- Multiple assertions about the SAME logical outcome are fine.
- Assertions about DIFFERENT outcomes (e.g., "it returned 200 AND it logged a message AND it sent an email") should be separate tests.

## What NOT to Test (The Hard Part)

**Don't test:**
- Framework behavior (Express routing, React rendering, ORM query building)
- Language features (destructuring, spread operator, type coercion)
- Trivial code with no logic (getters, setters, pass-through functions)
- Configuration (unless configuration logic has branches)
- Third-party libraries (they have their own tests)

**Do test:**
- YOUR business logic (calculations, validations, transformations)
- YOUR error handling (what happens when deps fail)
- YOUR conditional branches (if/else, switch, pattern matching)
- YOUR data integrity rules

## Template

For each test:
```typescript
// What's being tested and why it matters
test('[unit] should [expected behavior] when [condition]', () => {
  // Arrange: minimal setup, only what this test needs
  // Act: one clear action
  // Assert: one logical outcome
});
```

## Lightweight ≠ Shallow
A lightweight test can still be rigorous. Example of a lightweight test that's deep:

```typescript
test('Order.total should exclude tax for wholesale customers when subtotal > $1000', () => {
  // This tests: customer type × subtotal threshold × tax rule — three conditions interacting
  const order = new Order({ customerType: 'wholesale', items: [{ price: 1200 }] });
  expect(order.total).toBe(1200); // No tax applied
});
```

## Self-Critique
After writing tests, verify:
- "Can I run this entire test file in under 2 seconds? If not, what's slow and can it be unit-tested instead?"
- "If I rename every private method, do these tests still pass? If not, they're coupled to implementation."
- "Do the test names tell a coherent story about what this code does? If names are vague like 'test_1' or 'works correctly', rewrite them."
- "Are any tests testing the same behavior through different inputs? Parameterize instead of duplicating."
- "Could I delete 20% of these tests and still catch 95% of bugs? If yes, do it."

## Code to Test
```
[PASTE CODE HERE]
```
