---
name: source-command-implement-batch
description: Implement a bounded batch of Lorcana cards with isolated ownership, focused tests, and shared-engine backpressure. Use when the user supplies a card list or asks to process missing implementations.
---

# Implement Lorcana Card Batch

Use `lorcana-cards` as the behavior owner and `lorcana-find-card` to resolve
each card. There is no maintained source-file queue; never delete source rows
as a completion signal.

## Workflow

1. Build a bounded queue from the user's list or an explicit
   `missingImplementation: true` search.
2. Record each card's definition and test paths before assigning work.
3. Parallelize only cards with disjoint definition and test files. Keep shared
   engine, types, exports, and generator files under one owner.
4. Require one focused behavior test and one structured result per card:
   `implemented`, `already-done`, `skipped`, or `blocked`.
5. If two cards expose the same engine gap, stop the batch and fix that shared
   primitive once before continuing.
6. Review the combined diff, run affected card tests, then run the package
   check once.

Do not remove source records, stage broad paths, or let concurrent workers edit
the same shared file.
