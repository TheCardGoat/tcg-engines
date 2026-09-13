# CR Chapter 6 — Effects (AAA design)

**CR source:** `.../06-effects.md`  
**Existing suites:** `06-effects.test.ts`, `06-effects-leaf-contracts.test.ts`, `effect-leaf-contracts.ts`, `keyword-effect-inventory.ts`  
**Focus:** discrete vs continuous; hit-triggered effects; catalog anchors Snatch / Heart of Fyendal

---

## Why

Effects are the payload of every ability. Theater risk: asserting AST shape without proposing, committing, and resolving the corresponding rules events through normal priority.

---

## Production bar for this chapter

| Allowed                               | Banned as sole proof                                  |
| ------------------------------------- | ----------------------------------------------------- |
| Catalog Snatch hit → draw at damage   | Empty-stack “negate” theater                          |
| HoF pitch conditional life            | Leaf listed only in inventory without happy≠edge      |
| Contract map with production hit path | Trainer text-only effects that never hit real catalog |

---

## AAA cases

### CR-6 / 7.5.5 — Snatch hit draws at damage step

| Field                | Content                                  |
| -------------------- | ---------------------------------------- |
| **Citation**         | Hit event 7.5.5 + Snatch ability         |
| **Implementability** | `ready`                                  |
| **Existing test**    | `06-effects.test.ts` · Snatch hit → draw |
| **Quality**          | `production`                             |

**Arrange** — Bravo Snatch; deck top known (e.g. Heart of Fyendal copies); Dash life 20  
**Act** — Undefended combat through damage  
**Assert** — At damage: Dash life 16; Bravo hand gains 1 card; draw not before damage

---

### CR-6 / 7.5.5 — Partial block still hits; full block does not

| Field                | Content              |
| -------------------- | -------------------- |
| **Citation**         | Hit iff damage > 0   |
| **Implementability** | `ready`              |
| **Existing test**    | `06-effects.test.ts` |
| **Quality**          | `production`         |

**Arrange / Act** — Block for 2 vs Snatch 4 → draw; block for 4 → no draw  
**Assert** — Life + hand as expected

---

### CR-6 — Heart of Fyendal pitch while behind gains life

| Field                | Content                                        |
| -------------------- | ---------------------------------------------- |
| **Citation**         | Conditional discrete effect · HoF printed text |
| **Implementability** | `ready`                                        |
| **Existing test**    | `06-effects.test.ts` / release-notes HoF       |
| **Quality**          | `production`                                   |

**Arrange** — Bravo life 10, hand HoF; Dash life 15  
**Act** — Pitch HoF  
**Assert** — Life 11; RP 3

---

### CR-6 — Heart of Fyendal pitch while ahead: no gain (negative)

| Field                | Content             |
| -------------------- | ------------------- |
| **Citation**         | Conditional false   |
| **Implementability** | `ready`             |
| **Existing test**    | QA guide ch.6 row 4 |
| **Quality**          | `production`        |

**Arrange** — Bravo life ≥ Dash  
**Act** — Pitch HoF  
**Assert** — Life unchanged; RP 3

---

### CR-6.1 — Leaf contract matrix (happy ≠ edge)

| Field                | Content                             |
| -------------------- | ----------------------------------- |
| **Citation**         | CR 6 discrete leaves as inventoried |
| **Implementability** | `ready` (existing contracts)        |
| **Existing test**    | `06-effects-leaf-contracts.test.ts` |
| **Quality**          | `production-ish`                    |

**Engineering rule:** Each leaf type has primary happy path and edge path with **different** observable outcomes. Removing a leaf from production apply path must fail the contract test.

---

### CR-6 / 8.5 — Negate via real card (Aetherize)

| Field                | Content                                     |
| -------------------- | ------------------------------------------- |
| **Citation**         | Negate effect keyword                       |
| **Implementability** | `ready`                                     |
| **Existing test**    | `release-notes-set-keywords` Aetherize path |
| **Quality**          | `production`                                |

**Arrange** — Stack layer + Aetherize (CRU164)  
**Act** — Play Aetherize targeting layer; resolve  
**Assert** — Targeted layer does not produce its effect; not empty-stack theater

---

## Deferred

| Topic                                                                                      | Reason                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Outside-game booster events                                                                | Non-engine                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| start-game meta effects                                                                    | Registration only                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Weave Earth's parameter-dependent self-replacement (CR 6.4.7b second sentence)             | The same-batch preceding-effect self-replacement mechanism is **LANDED** (a `self-replacement` sequence step: condition at generation, the preceding events never commit — the instead-effect occurs in their place; Tome of Divinity remodeled onto it, covered by `tome-of-divinity-alternatives.test.ts`). Remaining: conditions whose parameters are only determined when a FUTURE card is played ("+3{p}, if fused instead +4{p}") need the replacement resolved at future-object application time.                   |
| Optional effect additional-cost payment (Nimble Strike "banish a Nimblism from graveyard") | **LANDED**: payable via the begin-play `banishCostInstanceId` declaration — `play/banish-cost.ts` banishes the chosen graveyard card and applies the printed `then` benefit as compiled continuous effects (boost pattern); declinable outright; the legality carve-out no longer requires the unmigrated "effect-cost" declaration. Regression: `WTR185-nimble-strike-red.test.ts`.                                                                                                                                       |
| Controller-anchored durations (CR 6.2.2a)                                                  | **LANDED** (commit 7b1a38464): `until-end-of-own-next-turn` / `until-end-of-their-next-turn` compile to a `player-turn-end` expiry anchored to that seat's next turn, fixed at generation (generating during the anchor's own turn correctly survives the opponent's intervening turn). Tests: `continuous/player-anchored-expiry.test.ts`. Unlocks Infiltrate / Tiger-Eye Reflex / Break Tide / Erase Face durations.                                                                                                     |
| Inline-triggered behavioral distinction (CR 6.6.2 / 6.6.2a)                                | **LANDED**: an inline-triggered effect is discrete — for sources functional outside the stack it may only trigger in its generation window (the first boundary it is observed in, consumed whether or not the condition holds), so a later matching event or a state that turns true afterwards never fires it. Stack-functional sources (a resolving card's own "When this…" clause) are inside their generation/resolution window and keep lifetime semantics. Tests: `trigger-matcher.test.ts` (CR 6.6.2/6.6.2a block). |

### Verified (CR §6 work landed)

- **CR 6.4.10j — shielding prevention carryover** is implemented via the consumption protocol: registration resolves evaluatable amounts (Bone Head Barrier's die roll) to a numeric budget, the consumption boundary attaches the points actually prevented (`FabReplacementConsumption.preventedAmount`), and the consume-replacement-effects reducer decrements the budget instead of removing the effect, ceasing at 0. CR 6.4.10h (unpreventable damage spends no budget) falls out of `preventedAmount 0`. E2E: `06-4-replacement-examples.test.ts` (Bone Head Barrier absorbing two attacks). Note: fixed preventions (Dissipation Shield, CR 6.4.10i) intentionally do NOT carry over — that is their rule.
- **CR 6.6.5f — continuous trigger suppression** is wired (`trigger-prevention.ts` + `runtime.ts` `isTriggerPrevented`). Verified non-vacuous: the Katsu+Tripwire e2e in `06-6-triggered-examples.test.ts` fails when the hook is removed.
- **CR 6.6.5d — ordinals relative to the window** (`trigger-matcher.ts` `globalOccurrenceKey` / `bumpGlobalEventOccurrences`): a "first each turn" trigger whose source becomes functional after the ordinal event no longer mis-fires. Unit-tested in `trigger-matcher.test.ts`; broad regression (214 tests) green.
- The staging system (§6.3), replacement kernel + §6.5 ordering (§6.4/6.5), and the three trigger variants (§6.6) remain covered by their synthetic unit suites (`rules-evaluator.test.ts`, `transaction-kernel.test.ts`, `trigger-matcher.test.ts`).
