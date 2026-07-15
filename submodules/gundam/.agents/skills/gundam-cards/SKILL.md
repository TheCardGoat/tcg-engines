---
name: gundam-cards
description: Implement, debug, or review one Gundam Card Game card in packages/cards, including any focused engine or types support required by its printed behavior.
---

# Gundam Card Implementation

Use this when the unit of work is one card. Printed text and current rules are
the behavior contract; generated structure and older implementations are
evidence, not authority.

## Required Context

1. Read `references/glossary.md` in the `gundam-tcg-rules` skill, then load the
   rules skill itself.
2. Read the card definition and sibling test.
3. Find a current card of the same type with similar timing, cost, targeting,
   or zone behavior.
4. Use `gundam-test-generation` for the behavior test shape.

## Workflow

1. Decompose each printed ability into timing, conditions, costs, choices,
   targets, effects, and duration.
2. Compare that contract with the card's structured `effects` data and the
   engine handlers that consume it.
3. Add the smallest failing observable behavior test. Cover every printed
   branch that changes legality or outcome.
4. Fix the narrowest owner:
   - Card data for card-specific structure.
   - Engine for reusable rules behavior.
   - Types only when the engine contract genuinely needs a new variant.
5. Keep cards declarative. Card files must not import engine runtime internals.
6. Run the targeted card test, close siblings, and engine tests when a shared
   primitive changed.

## Boundaries

- Preserve deterministic runtime behavior and `GameLogger` ownership.
- Do not replace behavior coverage with `effects` snapshots.
- Do not add a one-card special case to a shared handler when a typed primitive
  expresses the rule.
- Keep parser-generated output under review; non-trivial text can require a
  hand-corrected structured effect.

Report the printed contract, test path, owning root cause, files changed, exact
checks, and any unsupported rules edge.
