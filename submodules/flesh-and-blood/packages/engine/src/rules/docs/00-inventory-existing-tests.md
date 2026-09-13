# Inventory: existing real-fixture / real-move rules tests

**Audit date:** 2026-08-01  
**Workspace:** `submodules/flesh-and-blood/packages/engine`  
**Purpose:** Tell engineering what already exists, what style it uses, and which suites are production-grade vs residual-suspect — before writing new AAA cases from the design docs.

---

## 1. Layout map

```
packages/engine/src/
  testing/
    test-engine.ts          # FabTestEngine (production FabMatchRuntime + viewer projection)
    test-fixtures.ts        # createFabTestState / startFixture
    test-engine.test.ts
  rules/
    fixtures.ts             # Shared REAL catalog imports (packages/cards/...)
    # combat helpers live in the fluent harness (src/testing/helpers.ts:
    # game.helpers.attackToDefend / resolveRestOfCombat / expectStep / logHas)
    test-trainers.ts        # hitTrainer / equipmentTrainer (NOT production fixtures)
    COMPREHENSIVE-RULES-TEST-QA.md
    docs/
      comprehensive-rules/
        01-game-concepts.test.ts … 09-additional-rules.test.ts
        06-effects-leaf-contracts.test.ts + effect-leaf-contracts.ts
      release-notes/
        production/*.test.ts       # real-card production clusters
        specifications/*.test.ts   # source/specification suites
        residual/release-notes-residual-v*.test.ts
        inventory/claim-inventory.* + test-id-registry.json
    card-behavior/
      proven/*.test.ts             # executable proof
      plans/*.test.ts              # generated inventory, excluded from runs
      behavior-status.json          # planned/proven/blocked/out_of_scope overrides
    docs/                   # THIS design pack
```

Local CR text (citations):  
`submodules/flesh-and-blood/.agents/skills/fab-rules/references/flesh-and-blood-comprehensive-rules/{01..09}-*.md`

---

## 2. Harness style (canonical AAA shape)

All good tests follow the same shape:

```ts
const game = FabTestEngine.start(
  { hero: bravo, hand: [snatchRed], deck: 6 },
  { hero: dash, life: 20, deck: 6 },
);
const Bravo = game.as(bravo);
const Dash = game.as(dash);

Bravo.play(snatchRed, { target: Dash.id }); // or pitch / defend / pass
game.passBoth();
// …
expect(Dash.life()).toBe(16);
expect(Bravo.zone("graveyard")).toContain(snatchRed.canonicalId);
```

| Concern         | Implementation                                                                       |
| --------------- | ------------------------------------------------------------------------------------ |
| State authority | `FabMatchRuntime` inside `FabTestEngine` — no parallel rules engine                  |
| Projection      | Production `projectFabViewerState` for privacy assertions                            |
| Failures        | `expectFailure` → `errorCode` (e.g. `insufficient_resources`, `not_priority_player`) |
| Combat pacing   | `playAttackToDefend` / `resolveRestOfCombat` helpers                                 |

---

## 3. Shared real fixtures (`fixtures.ts`)

Subjects are **catalog modules**, not mocks. Representative table:

| Export                             | Catalog (approx.)      | Role                                    |
| ---------------------------------- | ---------------------- | --------------------------------------- |
| `bravo`                            | BVO002 Bravo           | Young Guardian hero                     |
| `dash`                             | ARC002 Dash            | Young Mechanologist opponent            |
| `snatchRed`                        | WTR167 Snatch          | Cost 0 / pwr 4; hit → draw              |
| `nimbleStrikeRed`                  | WTR185                 | Cost 1 attack                           |
| `nimblismBlue`                     | WTR220                 | Pitch 3 blue; def 2 block               |
| `scourTheBattlescapeRed`           | WTR194                 | Go again if played from arsenal         |
| `regurgitatingSlogRed`             | WTR197                 | Dominate / high power                   |
| `unmovableRed`                     | WTR212                 | Defense reaction                        |
| `scabskinLeathers`                 | WTR004                 | Battleworn equipment                    |
| `heartOfFyendal`                   | WTR000                 | Legendary; pitch while behind → +1 life |
| `pummelRed`                        | WTR206                 | Attack reaction (errata: hit hero)      |
| `frayingLifeforceRed`              | OMN007                 | Fragment subject                        |
| `cintariSellsword`                 | HVY134                 | Ally token                              |
| `commandAndConquerRed`             | ARC159                 | Hit → destroy arsenal                   |
| `drillShotRed` / `longShotRed` / … | DYN/OUT                | Production aim-arrow subjects           |
| …                                  | see full `fixtures.ts` | Release-note + CR coverage              |

---

## 4. Comprehensive Rules chapter suites

| File                                |        ~`it` count | Quality            | Notes                                                                      |
| ----------------------------------- | -----------------: | ------------------ | -------------------------------------------------------------------------- |
| `01-game-concepts.test.ts`          |                  5 | **production**     | Real cards; AP/pitch/priority/life                                         |
| `02-object-properties.test.ts`      |                  4 | **production**     | Pitch/color/cost/power/defense                                             |
| `03-zones.test.ts`                  |                  5 | **production**     | Privacy, chain, arsenal, equipment return                                  |
| `04-game-structure.test.ts`         |                  7 | **production**     | Phases, EOT pitch/RP, win/lose                                             |
| `05-layers-cards-abilities.test.ts` |                  5 | **production**     | Stack layer, inline pitch, arsenal play                                    |
| `06-effects.test.ts`                |                 18 | **production**     | Catalog Snatch/HoF + structural                                            |
| `06-effects-leaf-contracts.test.ts` | contract-generated | **production-ish** | Happy≠edge leaf contracts via production hit path                          |
| `07-combat.test.ts`                 |                  6 | **production**     | Full step order, multi-block, DR, damage formula                           |
| `08-keywords.test.ts`               |                 99 | **mixed**          | Many real fixtures **and** extensive `hitTrainer` usage for keyword matrix |
| `keyword-effect-inventory.test.ts`  |                ~10 | meta               | Completeness gate vs types source                                          |
| `09-additional-rules.test.ts`       |                  3 | **mixed**          | Marked flag; resource pitch; legendary registration                        |
| `core-skeleton.test.ts`             |                  3 | **production**     | Integration glue                                                           |

**CR QA guide:** `COMPREHENSIVE-RULES-TEST-QA.md` maps section-level defining behaviors (not one leaf per letter) and documents known simplifications (partial stack richness, free pitch staging, DFC/split non-goals, etc.).

### Quality flag: chapter 8 keyword matrix

- **Production path:** go again, dominate, battleworn (Scabskin), fragment (Fraying Lifeforce), etc. using real cards where present.
- **Trainer path:** `hitTrainer({ keywords, effect })` used heavily so leaf keywords can be isolated without a perfect catalog subject.
- **Engineering rule going forward:** new defining CR 8.3 cases should prefer a real catalog subject when one exists; trainers only as temporary bridges labeled in the AAA case.

---

## 5. Release-note suites

### 5.1 Production / fluent real-card suites

| File                                                                                                    |  ~`it` | Quality                | Focus                                                                                      |
| ------------------------------------------------------------------------------------------------------- | -----: | ---------------------- | ------------------------------------------------------------------------------------------ |
| `release-notes.test.ts`                                                                                 |     12 | **production**         | OMN Fragment; WTR Scar/Snatch/HoF; **Jan 2026 Rules Update** (ally defend, Pummel, layers) |
| `release-notes-expanded.test.ts`                                                                        |     14 | **production-leaning** | WTR keywords/cards, ARC Command and Conquer, …                                             |
| `release-notes-keywords.test.ts`                                                                        |     10 | **production-leaning** | ARC/PEN/SUP/HVY defining keywords                                                          |
| `release-notes-set-keywords.test.ts`                                                                    |     31 | **mixed**              | Broad set keyword coverage (some trainer assist)                                           |
| `release-notes-mechanics.test.ts`                                                                       |     24 | **mixed**              | Shared `mech-*` patterns                                                                   |
| `release-notes-production-v1.test.ts`                                                                   |      9 | **production**         | Real DYN/OUT aim arrows + Death Dealer bow path                                            |
| `release-notes-cluster.test.ts`                                                                         | varies | cluster                | Claim clusters                                                                             |
| `release-notes-draw-discard.test.ts` etc.                                                               | varies | mixed                  | Specialized mechanic files                                                                 |
| Card vignettes (`barraging-beatdown`, `crippling-crush`, `rhinar-trigger`, `bravo-activated-abilities`) |    few | **production**         | Named card paths                                                                           |

### 5.2 Residual trainer suites (suspect production coverage)

| Pattern                                   | Count / signal          |
| ----------------------------------------- | ----------------------- |
| Files `release-notes-residual-v*.test.ts` | **94 files**            |
| Files referencing trainers                | **~105** under `rules/` |
| `hitTrainer` call sites in residual files | **~1040**               |

**Official stance** (`release-notes/README.md`): residual suites advanced inventory counts with trainers + `unparsedSegments`. Treat those `tested` claims as **suspect production coverage**. New work must re-prove with real cards before trusting the inventory row as production-ready.

### 5.3 Claim inventory machine status

| Metric                         | Value (audit)                                                                                      |
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
| `claim-inventory.json` version | 6                                                                                                  |
| Total claims                   | 2989                                                                                               |
| `tested`                       | 2192                                                                                               |
| `n/a`                          | 478                                                                                                |
| `untested`                     | 317                                                                                                |
| `superseded`                   | 2                                                                                                  |
| `errataSources`                | `https://fabtcg.com/articles/rules-update/`                                                        |
| Required keyword sets          | WTR, ARC, CRU, MON, ELE, EVR, UPR, DYN, OUT, DTD, EVO, MST, HVY, HNT, ROS, SEA, SUP, MPG, PEN, OMN |

Integrity: `release-notes/claim-inventory.test.ts` enforces registry honesty (no false testId shares).

---

## 6. Style taxonomy (how to label a suite)

| Label                | Criteria                                                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **production**       | Real catalog imports; only production moves; asserts life/zones/AP/combat/legality; abilities come from card modules or hand-authored engine paths used by those modules |
| **mixed**            | Combination of real cards and trainers; still asserts play outcomes                                                                                                      |
| **residual-suspect** | Trainers / injected `unparsedSegments` are the **only** subject proving the claim                                                                                        |
| **meta / inventory** | Completeness gates, registry integrity — not a rules oracle                                                                                                              |
| **proposed**         | AAA design only (this docs pack); no test file yet                                                                                                                       |

---

## 7. Exemplar production AAA (already implemented)

### 7.1 CR 1.13.2 — AP spend (production)

- **File:** `01-game-concepts.test.ts`
- **Arrange:** Bravo hand Snatch; Dash empty
- **Act:** play Snatch to defend step
- **Assert:** Bravo AP 1→0; Dash AP 0

### 7.2 CR 7.0–7.7 — full combat step walk (production)

- **File:** `07-combat.test.ts`
- **Arrange:** Bravo Snatch; Dash life 20
- **Act:** play → passBoth through layer/attack/defend/reaction/damage/resolution/close
- **Assert:** each `combat().step`; life 16 at damage; GY contains Snatch; combat null

### 7.3 Rules Update — Pummel hits a hero (production, superseding oracle)

- **File:** `release-notes.test.ts`
- **Arrange:** Slog + Pummel + pitch vs hero **and** vs ally
- **Act:** attack, reaction Pummel `mode: "hit-hero"`, resolve
- **Assert:** hero hit → discard; ally hit → no discard

### 7.4 Production aim arrows (production)

- **File:** `release-notes-production-v1.test.ts`
- **Arrange:** arsenal Drill Shot + Death Dealer bow; aim counter staged
- **Act:** play from arsenal; defend with Ironrot Helm
- **Assert:** piercing/power/life/defenseDelta — not catalog-unconditional piercing

---

## 8. Gaps this design pack targets

| Gap                                               | Doc response                                              |
| ------------------------------------------------- | --------------------------------------------------------- |
| CR leaf encyclopedia                              | Section-level defining AAA only (`comprehensive-rules/*`) |
| Residual theater labeled “tested”                 | Explicit quality flags; production bar in README          |
| Release note vs errata conflict                   | `01-source-priority.md` + `errata-and-rules-updates/`     |
| Missing play-outcome cases for high-risk keywords | Proposed AAA tables with real card IDs                    |
| Untestable policy                                 | Explicit Non-goals / deferred lists                       |

---

## 9. What **not** to treat as production proof

1. A green residual suite alone.
2. `expect(hasKeyword(...)).toBe(true)` without a subsequent play outcome.
3. Injecting release-note prose into a trainer `unparsedSegments` field and matching it with runtime regex.
4. Inventory status `tested` without checking whether the `testId` maps to a production file.

---

## 10. Suggested engineering order (after this pack)

1. Keep CR ch.1–7 + `release-notes.test.ts` green as the golden path.
2. For each new feature: pick AAA cases from CR / release-notes / errata docs marked `ready`.
3. Demote or re-prove residual claims when touching the same keyword/card.
4. Extend `fixtures.ts` rather than inventing one-off trainers for permanent coverage.
