---
name: doc-gardening
description: Audit Gundam AGENTS, skills, and living documentation against current code after package moves or architectural changes. Use for semantic drift that deterministic link checks cannot prove.
---

# Gundam Doc Gardening

Run deterministic checks first:

```bash
pnpm run check:harness
pnpm run check:doc-drift
```

Then inspect only the living docs affected by recent code changes:

1. Read `docs/architecture.md` and `docs/design-docs/core-beliefs.md`.
2. Use the requested revision range, or recent package-moving commits, to find
   likely drift.
3. Verify named paths, symbols, commands, and package boundaries against the
   current tree.
4. Classify findings as a safe factual fix, a semantic change needing owner
   review, or historical documentation that should remain unchanged.
5. Re-run deterministic checks after factual edits.

`AGENTS.md` owns current instructions; adjacent `CLAUDE.md` is its alias. Do
not add divergent guidance to the alias. Keep completed execution plans as
historical records unless they claim to be current.

Report each finding with file and line, current evidence, proposed action, and
whether it was fixed or needs owner input.
