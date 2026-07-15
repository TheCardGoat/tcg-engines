---
name: fix-ci
description: Diagnose and fix an exact failing Lorcana CI check with a focused reproduction before broader validation.
user_invokable: true
---

# Fix Lorcana CI

Start from the supplied PR, check, job, log, or command. If none is supplied,
inspect the current branch's failing checks before choosing scope.

1. Capture the first actionable failure and owning package.
2. Reproduce it with the smallest package command.
3. Apply one narrow fix without bundling unrelated cleanup.
4. Re-run the focused command and explain every remaining failure.
5. Run `pnpm run ci-check` only after focused validation passes and the change
   needs the workspace gate.

Do not assume a nonexistent `ci-fixer` agent or hard-coded local checkout.
Do not push, rerun remote jobs, or merge unless requested.
