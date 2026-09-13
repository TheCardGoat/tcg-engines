# CR Chapter 1 — Game Concepts (AAA design)

**CR source:** `.../flesh-and-blood-comprehensive-rules/01-game-concepts.md`  
**Existing suite:** `packages/engine/src/rules/docs/comprehensive-rules/01-game-concepts.test.ts`  
**Focus sections:** 1.11 Priority · 1.13 Assets · 1.14 Costs (defining, playable behaviors)

---

## Why this chapter

Priority, action/resource points, and legal cost payment are the root of every other rules path. Illegal unpaid plays and wrong priority ownership are high-frequency engine bugs.

---

## Fixture cards

| Card                | Set ID | Catalog path (representative)         | Use                  |
| ------------------- | ------ | ------------------------------------- | -------------------- |
| Bravo               | BVO002 | `BVO/heroes/BVO002-bravo.ts`          | Turn player          |
| Dash                | ARC002 | `ARC/heroes/ARC002-dash.ts`           | Opponent             |
| Snatch (red)        | WTR167 | `WTR/actions/WTR167-snatch.ts`        | Cost 0 attack action |
| Nimble Strike (red) | WTR185 | `WTR/actions/WTR185-nimble-strike.ts` | Cost 1 attack        |
| Nimblism (blue)     | WTR220 | `WTR/actions/WTR220-nimblism-*.ts`    | Pitch 3 resource     |

---

## AAA cases

### CR-1.13.2 — AP spend on playing an action

| Field                | Content                                                               |
| -------------------- | --------------------------------------------------------------------- |
| **Citation**         | CR 1.13.2                                                             |
| **Why**              | Turn player must spend AP; non-turn player has none                   |
| **Implementability** | `ready`                                                               |
| **Existing test**    | `01-game-concepts.test.ts` · `1.13.2: turn player has action points…` |
| **Quality**          | `production`                                                          |

**Arrange**

- Bravo: hero Bravo, hand `[Snatch]`, deck ≥6, start in action phase with 1 AP
- Dash: hero Dash, empty hand, deck ≥6, 0 AP

**Act**

1. Bravo `play(Snatch, { target: Dash })`
2. Advance with `passBoth` until defend step (via `playAttackToDefend` helper is fine)

**Assert**

- After play: Bravo AP === 0
- Dash AP remains 0 throughout

---

### CR-1.13.3 / 1.14.3 — Pitch generates resource points

| Field                | Content                                                             |
| -------------------- | ------------------------------------------------------------------- |
| **Citation**         | CR 1.13.3, 1.14.3                                                   |
| **Why**              | Pitch is the primary RP generation path                             |
| **Implementability** | `ready`                                                             |
| **Existing test**    | `01-game-concepts.test.ts` · `1.13.3 / 1.14.3: pitching generates…` |
| **Quality**          | `production`                                                        |

**Arrange**

- Bravo hand: `[Nimblism Blue, Nimble Strike]`, deck ≥6

**Act**

1. Bravo `pitch(Nimblism Blue)` (staging allowed in harness; prefer also covering inline pitch at play elsewhere)

**Assert**

- Bravo RP === 3 (printed pitch)
- Bravo zone `pitch` contains Nimblism canonicalId
- Nimblism not in hand

---

### CR-1.14 — Insufficient resources rejects play

| Field                | Content                                                                   |
| -------------------- | ------------------------------------------------------------------------- |
| **Citation**         | CR 1.14 / 1.14.2b                                                         |
| **Why**              | Illegal unpaid costs must reverse; never soft-accept                      |
| **Implementability** | `ready`                                                                   |
| **Existing test**    | `01-game-concepts.test.ts` · `1.14: playing with insufficient resources…` |
| **Quality**          | `production`                                                              |

**Arrange**

- Bravo hand: `[Nimble Strike]` only, RP 0, no pitchable extra cards

**Act**

1. Bravo `expectFailure({ move: "play", payload: { cardId, target: Dash } })`

**Assert**

- `errorCode === "insufficient_resources"`
- Card remains in hand; no combat opened

---

### CR-1.11 — Only priority player may pass; passes advance combat

| Field                | Content                                                                 |
| -------------------- | ----------------------------------------------------------------------- |
| **Citation**         | CR 1.11, 1.11.4                                                         |
| **Why**              | Priority ownership bugs desync combat steps                             |
| **Implementability** | `ready`                                                                 |
| **Existing test**    | `01-game-concepts.test.ts` · `1.11: only the priority player may pass…` |
| **Quality**          | `production`                                                            |

**Arrange**

- Bravo hand Snatch; Dash empty

**Act**

1. Bravo plays Snatch targeting Dash → step `layer`, Bravo has priority
2. Dash `expectFailure({ move: "pass" })`
3. `passBoth()` → step `attack`

**Assert**

- Dash failure `errorCode === "not_priority_player"`
- After legal double pass: `combat().step === "attack"`

---

### CR-1.13 — Life reduced by combat damage

| Field                | Content                                                                       |
| -------------------- | ----------------------------------------------------------------------------- |
| **Citation**         | CR 1.13.4 / combat damage interaction with life asset                         |
| **Why**              | Life is an asset; damage must reduce hero life total                          |
| **Implementability** | `ready`                                                                       |
| **Existing test**    | `01-game-concepts.test.ts` · `1.13 life is an asset reduced by combat damage` |
| **Quality**          | `production`                                                                  |

**Arrange**

- Bravo Snatch; Dash life 20

**Act**

1. Play Snatch undefended through damage (`playAttackToDefend` + `resolveRestOfCombat`)

**Assert**

- Dash life === 16 (power 4, 0 defense)

---

### CR-1.14.3b — Prefer pitch only when paying a cost (proposed edge)

| Field                | Content                                                       |
| -------------------- | ------------------------------------------------------------- |
| **Citation**         | CR 1.14.3b                                                    |
| **Why**              | Free open-action pitch is a known harness simplification      |
| **Implementability** | `needs-engine` (if free pitch currently allowed unrestricted) |
| **Existing test**    | `none` (QA guide documents simplification)                    |
| **Quality**          | `proposed`                                                    |

**Arrange**

- Bravo hand: blue pitch card; no pending cost; open action phase

**Act**

1. Attempt free `pitch` with no cost to pay

**Assert (oracle when engine strict)**

- Rejected **or** only allowed when an effect instructs pitch
- Document current simplification if deferred

---

## Deferred / untestable (ch. 1)

| Topic                                       | Reason                                                                |
| ------------------------------------------- | --------------------------------------------------------------------- |
| 1.0.1b tournament supersession              | Policy layer                                                          |
| 1.1.3 full card-pool class legality         | Deckbuilding; pre-match                                               |
| 1.5 macros                                  | Format/tournament                                                     |
| Full last-known-information lattice (1.2.3) | Covered partially via go-again / destroy interactions; not every leaf |

---

## Mapping to engineering

Implement new cases only when they fail on current HEAD. Prefer extending `01-game-concepts.test.ts` with the same fixtures rather than new trainer subjects.
