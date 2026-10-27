---
title: Report a Bug — Observed, Expected, Environment
description: Structure a bug report before diagnosing it. Splits what the human saw from what the code says, asks only for what code cannot answer, and ends with either a reproduction or a named reason none was possible.
---

# Report a Bug — Observed, Expected, Environment

Turn a vague complaint into something both sides can act on. Fill in the three blocks in order, writing each answer down before moving to the next.

## 1. Observed

Restate the symptom in one sentence, in the human's words, quoting the titles, labels or numbers they used. Keep two things separate:

- **What happened**: the visible behaviour, not your theory about the cause.
- **When**: the steps that led to it, and how often. "Every time" and "sometimes, after a podcast" are different bugs.

A symptom phrased as a cause ("the playing flag is stale") is a hypothesis. Put it on its own line labelled *hypothesis* so it cannot pass for the report.

## 2. Expected

Say what should have happened, and name the source that says so: a state spec, an ADR, an existing test, or the human's explicit statement. "Obvious from the code" is not a source.

## 3. Environment

Answer these before opening the code, because each one moves where the bug can live:

- **Build**: APK on a device, web build, or both. A device-only bug cannot be reproduced in a browser that lacks the WebView's event ordering, so say which one you can actually run.
- **State**: which library, folder, account or saved data. For a persisted app, the storage keys and the seeded fixture.
- **Versions**: app version, and for native issues the device and OS version.

## Ask, then reproduce

Ask the human only for what the code cannot answer: the visible symptom, which build, and whether a related thing still works. For an audio bug, "do you still hear it?" splits a transport fault from a playback fault. Batch the questions into one call, 2 to 5 concrete options each.

Then attempt a reproduction and state plainly which path you exercised: a committed spec, a throwaway probe, a device, or none. A diagnosis traced only through code says so in those words, because that is a weaker claim.

## Done when

All three blocks are written, every hypothesis is labelled as one, and the reproduction attempt has a named outcome. A report that ends on "probably X" with no reproduction attempt is unfinished.
