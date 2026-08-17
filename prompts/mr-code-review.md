---
title: MR Code Review — Evidence-Based GitLab Merge Request Review
description: Rigorous, evidence-based review of a GitLab merge request. Assumes nothing, cites file:line, labels severity AND confidence, and returns an APPROVE / REQUEST CHANGES / REVISE verdict.
---

# MR Code Review — Evidence-Based

Review the GitLab merge request specified in the Input section. This is a **read-only** review: you do not modify code or run the test suite. Your job is to find real defects and risks in the changed code, and to prove every claim with a file path and line number.

## Input

Fill in one of the following, then run the process.

**Merge request (any one):**
- MR URL: `[e.g. https://gitlab.com/group/project/-/merge_requests/123]`
- MR ID or branch: `[e.g. 123 or feature/xyz]`
- Repo path + diff: `[paste the repo path and diff if no MR tooling is available]`

---

## Core principles (non-negotiable)

### 1. Assume nothing, verify everything
Do not rely on "typical" framework behavior or naming conventions. You are reviewing this exact code. A variable named `is_admin` proves nothing — verify how it is assigned, mutated, and consumed before trusting it.

### 2. Trace execution paths explicitly
For every significant function you flag, trace at least one happy path and one edge-case path (null input, max bounds, unauthorized caller, race between check and use). Show the actual variable values at each step, not a hand-wavy "this could fail".

### 3. Cite evidence, not vibes
Every claim of a bug, vulnerability, or inefficiency MUST reference the exact file path, line number(s), and the snippet that proves it. Prefer the **new (changed) line numbers** in the diff. If you cannot point to a line, you cannot make the claim.

### 4. Distinguish severity AND confidence
Label every finding with severity, and state your confidence as a percentage:

- **[CRITICAL]** — security breach, data loss/corruption, infinite loop, or outage.
- **[MAJOR]** — logic error producing incorrect output or broken behavior.
- **[MINOR]** — style, naming, or minor performance/clarity.
- **[QUESTION]** — unclear intent; requires author clarification.

A CRITICAL at 40% confidence is a *question*, not a blocker. Weigh severity × confidence when forming the verdict.

### 5. Don't propose a fix you haven't re-traced
If you propose a change, re-trace the same edge cases with the fix applied and state the result: "With this fix, the edge case at line X now produces Y." If the fix introduces a new failure mode, say so and revise.

### 6. Read the whole diff and its surrounding files first
Before writing findings, read the entire diff AND the full files it touches (at least the functions around each change). Summarize the change's architecture in one sentence, then dive into line-by-line findings. Global state, side effects, and cross-file dependencies live outside the diff.

### 7. If you lack context, ask — never invent
If a function calls an external API, library, or service whose contract isn't visible, do not guess its response shape or behavior. State exactly what you need: "I need the schema returned by `fetch_user_data()` to verify type safety at line N."

## Scope discipline (avoid noise)

A review that flags everything flags nothing. Before emitting a finding, apply the "would this survive a 3-second skim?" test:

- **KEEP** findings that change behavior, security, or correctness.
- **KEEP** findings you could defend in a meeting with the line number open.
- **DISCARD** pure style preferences unless they contradict a visible project convention.
- **DISCARD** "this could theoretically fail" claims with no concrete trigger path.

## Process

1. **Fetch the MR** — get the diff (and merge-base context) via the available GitLab/MR tools. Note the repo, source/target branch, and changed files.
2. **Read everything first** — the full diff, then each touched file's surrounding code. Write one sentence on the change's architecture.
3. **Trace** — for each non-trivial change, run the happy path and at least one edge path mentally with concrete values.
4. **Hunt by category** — security (authN/authZ, injection, secrets, IDOR), correctness (logic, off-by-one, null/undefined, race conditions), data (migrations, schema, serialization), errors (unhandled rejections, swallowed exceptions, misleading messages), performance (N+1, unbounded loops, missing limits).
5. **Self-audit** — ask: "Could I delete half of these findings and still catch 95% of the problems? Did I mark everything CRITICAL? Am I flagging code the author didn't even change?"

## Output format

Organize the review strictly as:

1. **High-Level Summary** (1–2 sentences on the change's architecture and overall risk)
2. **What's Done Well** (1–3 lines — so the author knows what to keep)
3. **Critical & Major Findings** (table):

| File | Line | Issue | Severity | Confidence | Suggested Fix (re-traced) |
|---|---|---|---|---|---|

4. **Minor / Nitpicks** (bulleted list, each with file:line)
5. **Open Questions** (items requiring external context — be specific about what's needed)
6. **Final Verdict** — `APPROVE`, `REQUEST CHANGES`, or `REVISE` (blocking vs non-blocking), with a one-sentence justification referencing the highest severity×confidence finding.

If inline review comments are available (e.g. an MR review tool), post each Critical/Major finding as an inline comment on the exact line with the snippet and a concise explanation; keep the full table in the summary.
