---
name: gundam-tcg-rules
description: Official Gundam Card Game comprehensive rules, glossary, and implementation constraints for this repository. Use when answering Gundam rules questions or changing gameplay logic, turn flow, combat, shields, damage, deckbuilding, resources, card behavior, effect resolution, keywords, pairing/linking, simulator prompts, tests, AI behavior, or player-facing rules copy.
---

# Gundam TCG Rules

Use the glossary first, then load only the indexed sections needed for the rule, card, engine, or simulator behavior under review.

## Required Loading

1. Read `references/glossary.md` and keep the terms in context for the full task.
2. Read `indexes/master-index.md` to identify the relevant rule sections.
3. Open `references/comprehensive-rules.md` only for the exact sections needed.

## Source Priority

1. `references/comprehensive-rules.md` - Gundam Card Game Comprehensive Rules Ver. 1.7.0, updated May 22, 2026.
2. Legacy flat summaries in the parent skill directory are secondary and must not override the 1.7.0 comprehensive rules.

## Output Modes

### Player or Rules Answer

Return a concise ruling, cite rule numbers, and separate confirmed rule text from implementation inference.

### Implementation Handoff

Return this JSON shape when rules need to become tests or code:

```json
{
  "citations": ["1-3-1", "8-5-2-3-1"],
  "behaviorConstraints": ["constraint statement"],
  "testImplications": ["what must be asserted"],
  "ambiguities": ["open interpretation risk"]
}
```

## Quality Rules

- Do not import assumptions from another TCG when Gundam rules are silent.
- Preserve Gundam wording for native concepts such as Unit, Pilot, Command, Base, Resource, Shield, Burst, Pair, Link, Lv., AP, and HP.
- Treat card text as overriding base rules when they conflict.
- If the rules expose an engine gap, fix the gap with a focused behavior test instead of only updating copy.
