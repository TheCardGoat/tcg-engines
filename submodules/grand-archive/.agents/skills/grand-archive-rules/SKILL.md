---
name: grand-archive-rules
description: Explain and implement Grand Archive rules using the local mirror of the official Comprehensive Rules. Use for mechanics, card interactions, turn flow, deckbuilding, timing, prompts, and rules-facing tests.
---

# Grand Archive Rules

Use the official rules mirror before making a gameplay decision. Start with `references/grand-archive-comprehensive-rules/table-of-contents.md`, then load only the relevant pages. Cite the page heading and numbered rule(s) in implementation handoffs.

The mirror is synchronized from `https://rules.gatcg.com/`. Refresh it with `scripts/sync-comprehensive-rules.mjs` when the official source changes; never silently reconcile a stale local rule with a memory-based interpretation.

For card data, use the `grand-archive-card-catalog` skill. The Index’s text and metadata are catalog facts, not a substitute for a rules interpretation or an executable card implementation.
