---
title: TDD on Existing Code — Red-Green-Refactor with a Safety Net
description: Apply TDD to an existing, often untested codebase: characterize current behavior, lock it in with tests, then refactor or extend using red-green-refactor. No single feature required — works across the whole repo.
---

# TDD on Existing Code — Red-Green-Refactor with a Safety Net

Guide me through applying Test-Driven Development to an **existing codebase** that may have little or no test coverage. This is not feature-first TDD: we start from the code that already exists, capture its current behavior, and only then refactor or extend — using the red-green-refactor cycle as a safety net so changes never break hidden behavior.

## Input

Fill in the fields below, then start.

**Target — whole repo or a specific area:**

```
[REPO ROOT, or a path / package / module to focus on]
```

**Language and test framework:**

```
Language: [TypeScript / Go / Python / etc.]
Test framework: [Jest / Vitest / Go testing / Pytest / etc.]
```

**Goal (optional):**

```
[e.g., general coverage improvement, refactor a specific module, add a feature, or clean up tech debt]
```

---

## Phase 0 — Reconnaissance: Map the Existing Code

Before writing a single test, understand the terrain.

1. **Get the lay of the land:**
   - `git ls-files | head -100` — repo layout and language distribution
   - `git log --oneline -20` — recent activity and where work actually happens
2. **Find the high-risk, high-churn code** — this is where tests pay off first:
   - `git log --name-only --pretty=format: | sort | uniq -c | sort -rn | head -30` (most-changed files)
   - `find . -type f \( -name '*.ts' -o -name '*.js' -o -name '*.go' -o -name '*.py' \) -not -path '*/node_modules/*' | head -100`
3. **Check existing coverage:**
   - `find . \( -name '*_test.go' -o -name '*.test.ts' -o -name '*.spec.ts' -o -name 'test_*.py' \) -not -path '*/node_modules/*'`
   - Run the test suite once to establish the current baseline: `npm test` / `go test ./...` / `pytest`
4. **Pick ONE starting point** — a module with high churn, high risk, and no tests. State the choice and why, then wait for my confirmation before proceeding.

## Phase 1 — Characterize: Lock In Current Behavior

Do NOT change behavior yet. First, capture what the code already does — even if it looks buggy.

1. **Identify inputs and observable outputs** for the target module: return values, emitted events, written files, DB writes, API responses.
2. **Write characterization tests** that assert the CURRENT behavior, not what you think it should be:
   - Pure functions → assert exact outputs for representative inputs.
   - Stateful/effectful code → capture effects with fakes/spies, or snapshot the output (e.g., Jest `toMatchSnapshot()`, golden-master files).
   - Cover the happy path, each error path, and each boundary you can find.
3. **Run them until green** — these tests document reality, so they should pass against today's code.
4. **Document suspected bugs** in comments/notes instead of "fixing" them during characterization. A characterization test that encodes a bug is valuable evidence, not a mistake.

## Phase 2 — The Red-Green-Refactor Cycle

Now use TDD for every change to the existing code — one small increment at a time.

### RED — Write the failing test first
1. I will describe the next small change (refactor step or new behavior).
2. You write a minimal test that:
   - Is named descriptively: `test_[what]_[condition]_[expected]`
   - Follows AAA (Arrange → Act → Assert)
   - Fails for the RIGHT reason — the missing/changed behavior, not a syntax error
3. I confirm the test before we proceed.

### GREEN — Minimal implementation
4. You write the smallest change that makes the test pass. No extra logic, no "while we're at it" additions.
5. I run the full suite — the new test passes AND all characterization tests stay green.

### REFACTOR — Clean up under the safety net
6. With green tests, improve the code: remove duplication, clarify names, extract functions/classes, break hidden dependencies at seams.
7. Tests must stay green throughout. If a characterization test breaks, STOP — you changed behavior; reconcile with me before continuing.

## Critical Rules
- **Never change behavior without a failing test first.** If there's no test for the behavior you're about to touch, write a characterization test first.
- **Characterization tests are not optional** — they're the safety net that makes refactoring safe on untested code.
- **One increment per cycle.** Don't batch refactors and features into one step.
- **Identify seams before you refactor.** To make code testable, find the boundaries (interfaces, DI, module exports, config) where you can substitute fakes — mock only at those seams.
- **Resist over-engineering.** The simplest change that makes the test pass and keeps the suite green is the right change.

## Before Each Cycle, Ask Yourself:
- "Have I locked in the current behavior with a characterization test, or am I about to change untested code?"
- "Does this test fail for the right reason, or is it a false red?"
- "Am I changing behavior while refactoring? If a characterization test broke, did I intend that?"
- "Is this the simplest change that satisfies the test, or am I adding speculative complexity?"
