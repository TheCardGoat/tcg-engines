# Cyberpunk shared rule engine audit (2026-09-24)

## Rule basis

- CR 10.3, 10.3.3, 10.16.1: check a trigger condition when the event occurs; check a resolution condition during resolution.
- CR 10.10.1, 10.15: a pending effect retains last valid game-piece information and does not disappear because state later changes.
- CR 9.18–9.19: fight-loss triggers resolve before the fight's resulting defeats. CR 11.19.2: a Defeated trigger enters pending after the card moves to trash.
- CR 10.20.3–10.20.4, 10.7–10.9: legal targets and choices precede payment of activation costs.
- CR 5.11.4.2: Null Street Cred compares lower than zero. CR 6.1.4: fixer dice are not effect targets.

## Selection and condition inventory

| Path                                       | Input                                    | Decision                                      | Status                                                                                                                                                                                                                                                  |
| ------------------------------------------ | ---------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `effects/target-resolver.ts`               | `TargetDSL`, `Condition`, `NumericValue` | Live card/Gig selection, comparisons, counts  | Shared owner; static per-card fields now use one exhaustive field registry. Dynamic selection stays in resolver.                                                                                                                                        |
| `ability-executor.ts`                      | `GameEvent`, trigger event filter        | Event-time match and pending trigger creation | Card event filters now share per-card predicates. Defeat filters read captured last-valid facts; see below.                                                                                                                                          |
| `triggers/index.ts`                        | Event and card abilities                 | Targeted and broadcast trigger enumeration    | Correctly scans active zones for broadcasts and also checks defeated/fight participants by ID.                                                                                                                                                          |
| `moves/activate-ability.ts`                | Activated costs, bindings, conditions    | Pre-activation legality                       | Reuses resolver and shared Gig-pair check.                                                                                                                                                                                                              |
| `ability-executor.ts` binding continuation | Pending selectable binding               | Candidate and pair legality                   | Reuses same Gig-pair check.                                                                                                                                                                                                                             |
| `moves/resolve-effect-target.ts`           | Selected pair and pending prompt         | Reject invalid choices before costs/effect    | Uses shared Gig-pair validation and specific error text.                                                                                                                                                                                                |
| `automation/resolvers/choose-target.ts`    | Public prompt/view                       | Chooses legal target order                    | Shares pair ownership and die-type rules; selects target before value for staged adjust-Gig prompts.                                                                                                                                                    |
| `active-effects/index.ts`                  | Static abilities, conditions             | Recomputes persistent modifiers               | Uses shared target and condition resolver. Recalculating an imperative formula before old static entries are removed could matter for future formulas that count power-filtered cards; present `recalculate:true` consumer counts face-up Legends only. |
| `effects/handlers/index.ts`                | Effect target/value                      | Performs effect                               | Uses shared resolver; removed duration casts that hid `untilSourceNextTurn`.                                                                                                                                                                            |
| `view/player-prompt.ts`                    | Pending choice                           | Projects public legal candidates              | Presents engine-produced candidate IDs. It must preserve atomic versus staged adjustment marker.                                                                                                                                                        |

The field registry uses `satisfies Record<keyof CardTargetDSL, ...>` and is the live per-card evaluator. A new card selector field now requires classification and a predicate or selection handling before TypeScript accepts the engine. This does not supply missing historical event facts.

## Changes with focused proof

- Shared card predicates cover controller, zone, type, color, classification, keyword, spent/ready, face, cost, self exclusion, attached Gear, and Lag in live selection and event matching. `cardPlayed` and `cardAttacks` now use the same matcher as `cardSpent` and `cardDefeated`. Target, numeric, and comparison variants use exhaustive `assertNever`.
- Gig-copy ordered pairs reject duplicate dice and, for effects that say “another player's Gig,” same-player pairs. CR 6.4.4–6.4.5 permit choosing a Gig even when the instructed set cannot change its value; the set fails during effect resolution and later instructions still resolve. Padre and Peace Offering tests: 24/24 pass. The pure die limits and pair ownership rule now live in `@tcg/cyberpunk-types`, so automation uses the same rule data without crossing the engine's player boundary.
- The automation chooser sends `resolveEffectTarget` for staged Gig adjustments and `resolveAdjustGig` only for atomic prompts. Default resolver tests: 36/36 pass. The generated legal deck pool reproduction passes.
- A suspended `ifYouDo` discard now carries its conditional follow-up through the discard choice. Panam's mandatory discard draws after the chosen card is discarded; its empty-hand case does not draw. Panam tests: 7/7 pass.
- A dedicated event-filter consistency test proves an attacker's spent/ready filter matches the same live selector after attack declaration. Event test: 2/2 pass. Target resolver tests: 17/17 pass after fixing the test's Gig fixture to provide every requested die. Modified files pass focused `vp check`.
- Pure Gig die limits, die recognition, and cross-player pair ownership live in `@tcg/cyberpunk-types`. Automation no longer imports private Gig state or effect internals, and no longer keeps a duplicate die-limit table. The automation boundary and resolver suites pass; a type-boundary test rejects inherited object keys such as `toString`.
- Gameplay guide Gear tests now follow CR 4.12.1–4.12.2: Gear moves with the host but detaches outside play; replaying the Unit leaves Gear in hand. A Legend moved to hand is removed from the game under CR 4.4.1 while its Gear remains in hand. Guide and type-boundary tests: 30/30 pass.
- The full-engine acceptance fixture now keeps the rival's five remaining fixer dice, so the test proves the normal next-turn win path rather than entering overtime. Acceptance suite: 2/2 pass.
- Numeric discard instructions now choose and discard as many eligible hand cards as possible under CR 10.2.1, 10.6.2, and 10.31.2. One shared discard plan supplies the ordinary handler and both `ifYouDo` branches. A partial discard does not complete the requested instruction, so the conditional payoff is withheld; an optional partial discard may be accepted or declined. An empty `discard all` performs no action for both required and optional paths. The pending choice carries the executable count, and the existing move and automation resolver use that count. New mandatory-partial and empty-hand tests, Maman Brigitte's one/two-Program and decline cases, and Panam's mandatory single-discard suite pass: 19/19.

The follow-up attachment audit removed the separate Gear-host loop and the
`attachCard` payment/move/log implementation. Normal play, effect play, and
pending choices use `listLegalGearAttachHosts`, including the intersection of
the Gear's printed restriction and the effect's target. A preselected host is
preserved; multiple legal hosts require a choice. Bound and unbound Gear
selection, disjoint Gear restrictions, and full payment have public-engine
regressions. The follow-up full gate passed 2,272 tests with the same three
known failures (combat ordering and Eddie visibility).

## Approved design corrections

1. **Historical card event facts.** All defeat emitters now capture a typed
   snapshot before movement: effective types, controller, zone, face, spent
   state, Lag, power, and attachments. Event matching shares static predicates
   and reads captured facts; effect resolution continues to read current state.
   A defeated Go Solo Legend retains Unit and Legend membership for its event.
   Dynamic defeat selectors are excluded from the authored type and rejected at
   runtime instead of silently returning false.
2. **Fight trigger order.** A discriminated `fightResult` state stores the
   comparison outcome. Fight-result triggers and choices resolve before result
   defeats. If the winning Unit leaves during a trigger, its captured power
   still determines the losing Unit's defeat. The filtered view and simulator
   preserve this step, and a serialized adapter fixture resumes it correctly.
3. **Scry selection.** Pending choices retain full resolution context in the
   engine. The shared selector computes destination eligibility. Prompts expose
   only revealed eligible IDs and display labels; bot and adapter no longer
   reimplement a subset of target filters. Viewer hydration does not invent
   private scry command state.

Snapshot and replay version 3 is required. Old versions are rejected rather
than resumed with missing last-valid information or fight continuation data.

## Other findings

- Flathead and Modded Muramasa tests expecting friendly Null Street Cred not to be less than rival numeric Street Cred conflict with CR 5.11.4.2. The engine's negative-infinity ordering is correct; card-test owner is updating those expectations.
- Historical Gig event filters read live die state for some predicates. The [ten-card consumer audit](historical-gig-event-audit.md) now records captured facts, mutable reads, and reachability limits. Trigger-admission predicates need event facts; conditional instructions during resolution must not be frozen without a rules basis. No authored sequence causing mutation before event matching was demonstrated. These unproven windows are recorded separately from the implemented defeat snapshot fix.
- Defeat filters support `self`, `host`, and static `card` facts through the captured snapshot, including detached host relations.
- Dynamic targets such as `lowestPower` still use the live selection set on non-defeat events. Defeat filters reject them because one captured card cannot establish a historical selection set.
- No current catalog card requires a numeric discard above one; Maman Brigitte's optional two-Program discard is the present partial-choice exposure. The generic engine test covers mandatory multi-card instructions for future cards.
- River Ward's private scry test passed after its assertion inspected a structured clone of the pending choice; direct matcher inspection had mutated the live `destinations` array under Bun. Engine validation remains unchanged. River Ward suite: 8/8 pass under `vp test`.
- The two hidden-Eddie comprehensive-rule tests expect a sold card to become unreadable immediately. `moves/sell-card.ts` instead marks it revealed until turn cleanup as an explicitly documented online presentation extension, then `view/filter.ts` projects its identity. CR 5.8.3.1 says face-down Eddies cannot be looked at. This conflict needs an explicit product/rules decision and a privacy-path audit; it was not changed as a small test-only fix.
