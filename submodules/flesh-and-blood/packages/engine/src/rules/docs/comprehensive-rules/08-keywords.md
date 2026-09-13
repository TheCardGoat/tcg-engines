# CR Chapter 8 — Keywords (AAA design)

**CR source:** `.../08-keywords.md`  
**Existing suite:** `08-keywords.test.ts`, `keyword-effect-inventory.ts`, `keyword-contracts.ts`  
**Focus:** 8.3 ability keywords (defining play outcomes) · crush as first-class

---

## Why

Keywords are the majority of set differentiation. Risk: inventory marks `tested` via trainers while catalog cards remain unparsed.

## Inventory honesty

- Every `FabKeyword` is listed in `keyword-effect-inventory.ts` as `tested` / `meta` / `noop` / `label-shell`.
- **Going forward:** prefer real catalog subjects (table below). Trainers are bridges, not the long-term production bar.

---

## Shared fixtures for production-leaning keyword cases

| Keyword            | Preferred real subject          | Fixture export / path           |
| ------------------ | ------------------------------- | ------------------------------- |
| go again           | Scour the Battlescape (arsenal) | `scourTheBattlescapeRed` WTR194 |
| dominate           | Regurgitating Slog              | `regurgitatingSlogRed` WTR197   |
| battleworn         | Scabskin Leathers               | `scabskinLeathers` WTR004       |
| blade break        | Ironrot Helm                    | `ironrotHelm` KSU005            |
| fragment           | Fraying Lifeforce               | `frayingLifeforceRed` OMN007    |
| crush              | Crippling Crush / Disable line  | card vignettes + set suites     |
| phantasm           | Phantasmaclasm                  | `phantasmaclasmRed` MON091      |
| temper / guardwell | Stonewall Impasse etc.          | HVY equipment fixtures          |
| aim / piercing     | Drill Shot + Death Dealer       | production-v1                   |

---

## AAA cases (defining)

### CR-8.3.5 — Go again grants 1 AP and enables second attack

| Field                | Content                                  |
| -------------------- | ---------------------------------------- |
| **Citation**         | CR 8.3.5, 7.6.2                          |
| **Implementability** | `ready`                                  |
| **Existing test**    | `08-keywords.test.ts` · go again         |
| **Quality**          | `production` (prefer real go-again card) |

**Arrange** — Bravo hand Scour + Snatch  
**Act** — Resolve Scour undefended; play Snatch  
**Assert** — AP granted at resolution; second attack deals damage; total life drop matches powers

---

### CR-8.3.5c — Double go again still one AP grant edge

| Field                | Content                           |
| -------------------- | --------------------------------- |
| **Citation**         | CR 8.3.5c                         |
| **Implementability** | `ready`                           |
| **Existing test**    | `08-keywords` go again stack edge |
| **Quality**          | `mixed`                           |

**Assert** — Only +1 AP from go again even if stamped twice

---

### CR-8.3.x — Dominate: cannot multi-block from hand

| Field                | Content                  |
| -------------------- | ------------------------ |
| **Citation**         | Dominate ability keyword |
| **Implementability** | `ready`                  |
| **Existing test**    | `08-keywords` dominate   |
| **Quality**          | `production` with Slog   |

**Arrange** — Dominate attack; defender two hand cards  
**Act** — Multi-block from hand  
**Assert** — Rejected (`dominate`); single hand block OK  
**Edge** — Hand + equipment legal (equipment not in hand limit)

---

### CR-8.3.x — Battleworn: −1 defense counter on defend

| Field                | Content                  |
| -------------------- | ------------------------ |
| **Citation**         | Battleworn               |
| **Implementability** | `ready`                  |
| **Existing test**    | `08-keywords` battleworn |
| **Quality**          | `production`             |

**Arrange** — Scabskin legs  
**Act** — Defend twice across combats  
**Assert** — defenseDelta −1 then −2; stays equipped; no-defend edge no counter

---

### CR-8.3.3 — Blade break destroys equipment on defend

| Field                | Content                   |
| -------------------- | ------------------------- |
| **Citation**         | Blade Break               |
| **Implementability** | `ready`                   |
| **Existing test**    | `08-keywords` blade-break |
| **Quality**          | `production`              |

**Arrange** — Ironrot Helm head  
**Act** — Defend with helm; resolve close  
**Assert** — Helm in GY when defended; stays if not defended

---

### CR-8.3.43 — Fragment: 2+ defense defender → −2 power

| Field                | Content                          |
| -------------------- | -------------------------------- |
| **Citation**         | CR fragment keyword · OMN notes  |
| **Implementability** | `ready`                          |
| **Existing test**    | `release-notes.test.ts` Fragment |
| **Quality**          | `production`                     |

**Arrange** — Fraying Lifeforce power 7; defender Nimblism def 2  
**Act** — Block  
**Assert** — Attack power 5; Bravo gains 1 life from Fraying trigger; no block → no fragment

---

### CR-8.3.22 — Overpower multi-action illegal

| Field                | Content                 |
| -------------------- | ----------------------- |
| **Citation**         | Overpower               |
| **Implementability** | `ready` / `mixed`       |
| **Existing test**    | `08-keywords` overpower |
| **Quality**          | `mixed`                 |

**Assert** — Two action cards defending rejected with `overpower`

---

### CR-8.3.x — Optional costs: boost / fusion / scrap / beat-chest

| Field                | Content                                                     |
| -------------------- | ----------------------------------------------------------- |
| **Citation**         | Respective 8.3.x optional additional costs                  |
| **Implementability** | `ready` with harness flags · prefer real cards when stamped |
| **Existing test**    | `08-keywords` optional cost matrix                          |
| **Quality**          | `mixed`                                                     |

**Assert** — Paying optional cost changes banished/hand/AP/fused flags; not paying does not

---

### Label-shell / meta keywords

| Field                | Content                               |
| -------------------- | ------------------------------------- |
| **Citation**         | 8.4 labels · deck-meta keywords       |
| **Implementability** | `untestable` as play outcome for many |
| **Quality**          | `meta`                                |

**Assert only** — Registration / `hasKeyword` when inventory marks `meta` or `label-shell`.  
**Do not** invent fake play outcomes for legendary deck limits in-match.

---

## Deferred

| Topic                                | Reason                         |
| ------------------------------------ | ------------------------------ |
| Full 8.5 effect-keyword encyclopedia | Leaf contracts + per-set notes |
| Token keyword creation lattice       | Per-card                       |
| Stealth full replace rules (Uzuri)   | Needs multi-card suite         |

---

## Engineering guidance

1. When adding a keyword case, update `keyword-effect-inventory.ts` status honestly.
2. If only a trainer proves it, mark AAA quality `residual-suspect` until a catalog subject is wired.
3. Re-prove residual release-note keyword claims with the preferred real subject from the table above.
