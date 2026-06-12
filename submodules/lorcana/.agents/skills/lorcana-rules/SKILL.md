---
name: "lorcana-rules"
description: "Explain and cite Disney Lorcana rules using indexed references, and produce implementation-ready behavior constraints for card development. Use when answering mechanic questions, resolving card interactions, or deriving test/implementation constraints from official rules."
---

# Lorcana Rules

Use indexed references first, then load only required deep sections.

## Required Memory Step

1. Read [`memory/schema.md`](./memory/schema.md). It points to the canonical schema in `lorcana-cards/memory/schema.md`.
2. Read the **Guardrails** and **Promoted Rules** sections of [`memory/bank.md`](./memory/bank.md). Skim Candidates if the request is in a domain with active observation.
3. Apply existing guardrails before answering. After substantive work, follow the canonical Memory Update Protocol.

## Source Priority

1. `references/disney-lorcana-comprehensive-rules/Disney-Lorcana-Comprehensive-Rules.md`
2. Relevant set release notes in `references/*-release-notes/`

When conflicts occur, prefer the newer official source.

## Retrieval Flow

1. Start at `indexes/master-index.md`.
2. Use `indexes/by-topic/*` for gameplay questions.
3. Use `indexes/by-section/*` for technical/numbered-rule questions.
4. Open only the minimal rule sections needed for final answer.

## Output Modes

### Mode A: Player/Rules Explanation

Return:

- concise ruling
- rule citations (`rule-id` style)
- caveats and edge conditions

### Mode B: Implementation Handoff for `lorcana-cards`

Return this JSON:

```json
{
  "citations": ["1.2.1", "6.3.4"],
  "behaviorConstraints": ["constraint statement"],
  "testImplications": ["what must be asserted"],
  "ambiguities": ["open interpretation risk"]
}
```

## Quality Rules

- Never provide rule guidance without citations when references exist.
- Distinguish confirmed rule text from inference.
- If references are insufficient, explicitly mark uncertainty.

## Post-Execution Memory Update

Follow the canonical Memory Update Protocol in [`memory/schema.md`](./memory/schema.md).

- Append an Observation for citation misses, wrong interpretation paths, and ambiguity patterns.
- Promote a Candidate to a Promoted Rule only when both a CR citation and a runnable section-spec test exist.
- Bump CR version pin in `bank.md` when the indexed comprehensive rules update.
