---
name: op-rules
description: One Piece Card Game comprehensive rules, glossary, and implementation constraints for this repository. Use when answering One Piece rules questions or changing One Piece gameplay logic, card behavior, turn flow, battle, DON!! handling, Life, triggers, counters, deck validation, simulator prompts, tests, AI behavior, or player-facing rules copy.
---

# One Piece Rules

Use the glossary first, then load only the indexed sections needed for the rule, card, engine, or simulator behavior under review.

## Required Loading

1. Read `references/glossary.md` and keep the terms in context for the full task.
2. Read `indexes/master-index.md` to identify the relevant rule sections.
3. Open `comprehensive-rules.md` only for the exact sections needed.

## Source Priority

1. `comprehensive-rules.md` - One Piece Card Game Comprehensive Rules Version 1.2.0, last updated January 16, 2026.
2. `references/rule_comprehensive.md` - alternate parsed copy of the same rules source.

When the two parsed copies disagree, verify against the PDF-derived source in `references/rule_comprehensive.pdf` before changing behavior.

## Output Modes

### Player or Rules Answer

Return a concise ruling, cite rule numbers, and separate confirmed rule text from implementation inference.

### Implementation Handoff

Return this JSON shape when rules need to become tests or code:

```json
{
  "citations": ["1-3-1", "7-1-4-1-1"],
  "behaviorConstraints": ["constraint statement"],
  "testImplications": ["what must be asserted"],
  "ambiguities": ["open interpretation risk"]
}
```

## Quality Rules

- Do not import assumptions from another TCG when One Piece rules are silent.
- Preserve One Piece wording for native concepts such as DON!!, Life, Leader, Character, Stage, [Trigger], [Counter], and [Blocker].
- Treat card text as overriding base rules when they conflict.
- If the rules expose an engine gap, fix the gap with a focused behavior test instead of only updating copy.
