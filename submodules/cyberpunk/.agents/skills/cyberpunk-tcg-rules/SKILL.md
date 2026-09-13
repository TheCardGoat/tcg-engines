---
name: cyberpunk-tcg-rules
description: Explain and implement Cyberpunk TCG rules from the local mirror of the official Comprehensive Rules. Use for mechanics, card interactions, turn flow, combat, deckbuilding, timing, prompts, AI, and rules-facing tests or copy.
---

# Cyberpunk TCG Rules

Use the local mirror of the official Comprehensive Rules before making a
gameplay decision. It is an exhaustive, numbered reference—not a teaching
guide—so retrieve only the material needed for the question.

## Required Loading

1. Read [references/glossary.md](references/glossary.md) and keep its native
   terms and keywords in context.
2. Read [indexes/master-index.md](indexes/master-index.md) to choose the
   relevant chapter.
3. Search [references/comprehensive-rules.md](references/comprehensive-rules.md)
   by heading, term, or rule number, then open only the matching rule range.

## Source Priority

1. `references/comprehensive-rules.md`—local mirror of the official reader at
   `https://cyberpunktcg.com/comprehensive-rules`.
2. The live official reader, when the local mirror has changed or does not
   resolve an ambiguity.

The prior Alpha Gameplay Guide is teaching material, not an authority for this
skill. Do not use it to override the Comprehensive Rules. Refresh the mirror
with `scripts/sync-comprehensive-rules.mjs` when the live official rules
change; do not silently resolve discrepancies from memory or another TCG.

## Output Modes

### Player or Rules Answer

Return a concise ruling with exact citations in the official rule-number style
(for example, `1.10.1` or `9.3.2`), including material caveats and any
inference.

### Implementation Handoff

Return this JSON shape when rules need to become tests or code:

```json
{
  "citations": ["1.10.1", "9.3.2"],
  "behaviorConstraints": ["constraint statement"],
  "testImplications": ["what must be asserted"],
  "ambiguities": ["open interpretation risk"]
}
```

## Quality Rules

- Cite the smallest applicable official rule or rules; separate confirmed text
  from implementation inference.
- Apply the official two-player scope; `Rival` refers to the sole opponent.
- Follow card text when it contradicts the Comprehensive Rules, and let a
  prohibiting effect take precedence over a permitting effect.
- Preserve Cyberpunk TCG terms such as Gig, Street Cred, Eddies, Legend, Lag,
  and `QUICK`; do not import assumptions from another TCG when the rules are
  silent.
- When the rules expose an engine gap, fix the owning engine path with a
  focused behavior test rather than only changing player-facing copy.
