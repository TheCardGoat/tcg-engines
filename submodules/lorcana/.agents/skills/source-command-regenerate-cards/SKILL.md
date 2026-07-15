---
name: source-command-regenerate-cards
description: Regenerate Lorcana card sources with the current package scripts after parser, source-data, or generator changes.
---

# Regenerate Lorcana Cards

Use this only when generated output should change. From the Lorcana workspace:

```bash
# Cached source data; preferred while iterating on generator code
bun run --cwd packages/lorcana/lorcana-cards generate-cards:all --skip-fetch

# Refresh remote inputs and regenerate everything
bun run --cwd packages/lorcana/lorcana-cards generate-cards:all
```

The current generator does not expose per-card, per-set, `--dry-run`, or
`--force` modes. Ask before fetching remote data when reproducibility matters.

After generation:

1. Inspect the complete diff for unrelated source-data churn.
2. Run `bun run --cwd packages/lorcana/lorcana-cards check-types`.
3. Run focused tests for affected cards and generator behavior.
4. Report whether any output still has `missingImplementation: true`.

For parser or validation failures, use
[`improve-card-generator`](../improve-card-generator/SKILL.md).
