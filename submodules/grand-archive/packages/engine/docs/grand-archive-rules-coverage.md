# Grand Archive Rules Coverage

This document describes the current coverage contract without duplicating thousands of lines of
source-specific audit notes. The authoritative per-rule status is
[`../reports/comprehensive-rules-audit-status.json`](../reports/comprehensive-rules-audit-status.json),
and `pnpm run audit:rules:complete` validates it against every rule-bearing section reachable from
the official table of contents.

## Current Verified Baseline

Last verified on 2026-08-25:

- 105 official rule-bearing files discovered.
- 300 stable rule units discovered.
- 300 units marked implemented.
- 0 external, partial, missing, or pending units.
- 4,545 generated catalog abilities represented as executable definitions.
- 0 generated catalog abilities represented as `unparsed`.
- The complete Grand Archive workspace gate passes.

Run these commands instead of copying the numbers into another report:

```sh
pnpm run audit:rules
pnpm run audit:rules:complete
pnpm run ci-check
```

## What Implemented Means

A rule unit may be marked `implemented` only when the engine has all of the following:

1. A typed representation for the rule or a documented reason that no runtime state is required.
2. An authoritative production owner under `src`, rather than logic duplicated in a simulator,
   test helper, or bot.
3. Admission and failure behavior that rejects illegal commands or malformed executable data.
4. Behavior-focused evidence through the production runtime for rules that affect gameplay.

Catalog admission proves that a card is structurally executable. It does not, by itself, prove
that every sentence was compiled with perfect semantics or that every interaction among cards has
been tested.

## Coverage Owners

| Rules family | Primary engine owners | Representative evidence |
| --- | --- | --- |
| Formats, setup, players, and outcomes | `src/procedures/game-flow`, `src/game` | `pregame.test.ts`, `game-ending.test.ts` |
| Card characteristics, types, and zones | `src/game`, `src/kernel` | `catalog-admission.test.ts`, `double-faced-rules.test.ts`, `zone-operations.test.ts` |
| Hidden and public information | `src/projection`, `src/log` | `view-permissions.test.ts`, `private-zone-rules.test.ts`, `log-projection.test.ts` |
| Timing, Opportunity, phases, and turns | `src/procedures/game-flow` | `turn-phase-sequencing.test.ts`, `phase-ending.test.ts`, `phase-skips.test.ts` |
| Activation, materialization, costs, and payments | `src/procedures/activation`, `src/commands` | `activation-payment.test.ts`, `cost-rules.test.ts`, `legal-command-enumeration.test.ts` |
| Effect and Effects Stack resolution | `src/procedures/effects`, `src/procedures/decisions` | `effect-activation.test.ts`, `stack-targeting.test.ts` |
| Combat, retaliation, damage, and weapons | `src/procedures/combat` | `attack-rules.test.ts`, `retaliation-keyword-scope.test.ts`, `weapon-participation.test.ts` |
| Abilities, keywords, and triggers | `src/rules/abilities` | `ability-layer.test.ts`, `trigger-abilities.test.ts`, keyword-specific regressions |
| Continuous rules and state-based checks | `src/rules/state` | `continuous-timestamps.test.ts`, `state-based-order.test.ts`, `characteristic-layers.test.ts` |
| Replacement and prevention effects | `src/rules/replacements`, `src/kernel` | `replacement-effect-execution.test.ts`, `replacement-capacity.test.ts`, `pre-commit-replacements.test.ts` |
| Persistence and resumable choices | `src/snapshot`, `src/procedures/decisions` | `snapshot-admission.test.ts`, continuation tests, opt-in snapshot fuzzing |
| Simulator and automated-player contracts | `src/projection`, `src/testing`, `src/automation` | test-engine, catalog-match, and deterministic bench tests |

The evidence labels in `comprehensive-rules-audit-status.json` are stable historical checkpoint
names. This table maps those checkpoints to the current post-reorganization owners; file moves do
not require rewriting 300 rule statuses.

## Stable Evidence Labels

The machine-readable audit uses these labels to retain the semantic checkpoint reviewed for each
rule unit. They are grouped into the current owners in the table above.

- `Ability lifecycle, tracking, and restrictions`
- `activation and entry keyword cluster`
- `Aenean Progression`
- `Aethercalling and Loaded Cards`
- `Agility`
- `all-zone bonus restrictions`
- `all-zone bonus restrictions and Class Locked`
- `Ambush and Steadfast`
- `Brew`
- `Bulwark`
- `Card characteristics and double-faced cards`
- `Card types, functional subtypes, and supertypes`
- `Card/object information, last-known information, and copies`
- `Cascade`
- `Cleave`
- `Combat phase, declaration, retaliation, and damage`
- `Counter lifecycle and inherent counter abilities`
- `Critical, Commanded Will, and Divine Relic`
- `Damage and damage prevention`
- `Distant and durability counters`
- `Draw, Main, and End`
- `Drawing cards`
- `Efficiency`
- `Elysian Aura`
- `Ending phases and turns`
- `Exalted and Norm element enablement`
- `Facing and end-of-game disclosure`
- `Field, Effects Stack, Intent, and information visibility`
- `Foster`
- `Game, replacement, and continuous effects`
- `Glossary terminology and categorical type list`
- `Imbue`
- `Inherited Effect`
- `Inherited Effect; generated lineage; host incarnation`
- `Intercept`
- `Lineage`
- `Link`
- `Link Shield reference substitution`
- `Main Deck, Material Deck, and Pantheon`
- `Masteries and named mastery state`
- `Match formats and pre-game setup`
- `Miscellaneous rules, special actions, and state stabilization`
- `Multiple Command abilities`
- `Multiple Prepare abilities`
- `named trigger keyword family`
- `Objects, non-objects, targeting, and redirect`
- `Ordered private placements`
- `Parameterized keyword provenance`
- `Player-owned destination zones`
- `Players, objectives, and ending the game`
- `Playing cards lifecycle`
- `preservation, payment, and combat permission keyword tail`
- `Pride and obedience`
- `Printed card parts`
- `Properties, orientation, and rules-derived states`
- `restricted destinations and Renewable regression`
- `restriction, payment, and protection keyword cluster`
- `Shared game-zone and object-specific-zone contract`
- `Shroud, Stealth, and True Sight`
- `Skipping phases`
- `Statuses and Crowd's Favor`
- `Timing, Opportunity, and special play permissions`
- `Token classification, control, and lifetime`
- `Turn order and phase boundaries`
- `Vigor`
- `Wake Up, Materialize, and Recollection`

## Coverage Boundaries

The completed audit means the current local rules mirror has no known unowned rule section. It does
not mean:

- every possible combination of catalog cards has a dedicated test;
- future cards cannot require a new combination of effect primitives;
- a successful parse guarantees the intended semantic interpretation;
- official rules changes are covered before the mirror is refreshed;
- the browser simulator, networking, persistence service, or replay UI is complete;
- opt-in fuzz and performance workloads run on every ordinary CI invocation.

When a new card exposes a shared rule gap, fix the owning engine path and add the card-backed
regression together. Do not add a card-only workaround or infer behavior from Index text at runtime.

## Updating Coverage

1. Refresh the official mirror through the Grand Archive rules skill.
2. Run `pnpm run audit:rules:list` and inspect every new or changed rule-bearing section.
3. Implement the rule in its architectural owner and add behavior-focused evidence.
4. Update `comprehensive-rules-audit-status.json` only after the evidence exists.
5. Run `pnpm run audit:rules:complete` and `pnpm run ci-check`.

The roadmap strengthens this process by fingerprinting rule content, so changed prose under an
existing heading cannot retain an old status silently.
