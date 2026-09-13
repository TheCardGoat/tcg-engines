# CR Chapter 7 — Combat (AAA design)

**CR source:** `.../07-combat.md`  
**Existing suite:** `07-combat.test.ts` (CR printed examples) and `07-combat-lifecycle.test.ts` (state-machine transitions)  
**Focus:** 7.0–7.7 step order · defend · reaction · damage formula · close

**Rules Update overlay:** Ally attack-target → controller is defending hero but **cannot** declare defending cards / DRs (see errata pack). CR 7.3.2a “if attack-target is a hero” still gates declaring defending cards.

---

## Why

Combat is the majority of FaB play time. Step-order regressions break every attack.

### Canonical step order under test

`layer → attack → defend → reaction → damage → resolution → close`

---

## AAA cases

### CR-7.0–7.7 — Full step walk (primary script)

| Field                | Content                               |
| -------------------- | ------------------------------------- |
| **Citation**         | CR 7.0.1, 7.1–7.7                     |
| **Implementability** | `ready`                               |
| **Existing test**    | `07-combat.test.ts` · full step order |
| **Quality**          | `production`                          |

**Arrange**

- Bravo: hand Snatch (WTR167, power 4)
- Dash: life 20

**Act**

1. Bravo plays Snatch → expect `layer`
2. `passBoth` → `attack`
3. `passBoth` → `defend` (Dash priority)
4. Dash pass, Bravo pass → `reaction`
5. `passBoth` → `damage` (life 16)
6. `passBoth` → `resolution`
7. `passBoth` → combat `null`, Snatch in Bravo GY

**Assert** — Each step + life + GY as above

---

### CR-7.3 — Multi-block from hand

| Field                | Content                                        |
| -------------------- | ---------------------------------------------- |
| **Citation**         | CR 7.3.2                                       |
| **Implementability** | `ready`                                        |
| **Existing test**    | `07-combat.test.ts` · multiple defending cards |
| **Quality**          | `production`                                   |

**Arrange** — Dash hand two def-2 cards; Snatch 4  
**Act** — `blockWith([cardA, cardB])`; resolve  
**Assert** — Life 20 (4−2−2)

---

### CR-7.4 / 7.5 — Defense reaction in reaction step with real pitch cost

| Field                | Content                                 |
| -------------------- | --------------------------------------- |
| **Citation**         | CR 7.4.2b, 7.4.2d, 7.5                  |
| **Implementability** | `ready`                                 |
| **Existing test**    | `07-combat.test.ts` · DR pay with pitch |
| **Quality**          | `production`                            |

**Arrange**

- Attack Snatch
- Defender hand: Unmovable (WTR212, cost 3, def 7) + Nimblism Blue (pitch 3)

**Act**

1. Reach reaction; turn player passes priority to defender
2. Defender plays Unmovable with `pitch: [Nimblism Blue]`

**Assert**

- Unmovable becomes defending; life prevents Snatch damage (def 7 ≥ 4)
- Blue in pitch zone

---

### CR-7.5.2 — Damage formula power − sum defense

| Field                | Content                              |
| -------------------- | ------------------------------------ |
| **Citation**         | CR 7.5.2                             |
| **Implementability** | `ready`                              |
| **Existing test**    | `07-combat.test.ts` · damage formula |
| **Quality**          | `production`                         |

**Arrange** — Snatch 4 vs one def 2  
**Assert** — Life 18

---

### CR-7.5.5 — Hit event requires damage to attack-target

| Field                | Content                                       |
| -------------------- | --------------------------------------------- |
| **Citation**         | CR 7.5.5                                      |
| **Implementability** | `ready`                                       |
| **Existing test**    | Snatch hit draw cases in ch.6 / release-notes |
| **Quality**          | `production`                                  |

**Assert** — Full block → no hit triggers; partial → hit triggers

---

### CR-7.6 — Go again grants AP at resolution (cross-link ch.8)

| Field                | Content                        |
| -------------------- | ------------------------------ |
| **Citation**         | CR 7.6.2, 8.3.5                |
| **Implementability** | `ready`                        |
| **Existing test**    | `08-keywords.test.ts` go again |
| **Quality**          | `production` / `mixed`         |

**Arrange** — Scour the Battlescape (go again)  
**Act** — Resolve combat  
**Assert** — AP 0 at damage; AP 1 after resolution grant; second attack legal

---

### CR-7.3.2a + Rules Update — Ally target: no declare defending cards

| Field                | Content                                           |
| -------------------- | ------------------------------------------------- |
| **Citation**         | CR 7.3.2a · Rules Update 2026 ally defending hero |
| **Implementability** | `ready`                                           |
| **Existing test**    | `release-notes.test.ts` · ally_target_no_defend   |
| **Quality**          | `production`                                      |

**Arrange** — Dash arena Cintari Sellsword; hand block card  
**Act** — Attack ally; attempt defend with hand  
**Assert** — `errorCode === "ally_target_no_defend"`; ally takes damage; hero life unchanged

---

### CR-7.7.5 — Equipment returns from chain

See ch.3 equipment case (Scabskin).

---

## Deferred

| Topic                                                | Reason                                                                   |
| ---------------------------------------------------- | ------------------------------------------------------------------------ |
| Multi-attack-target clockwise declaration (7.3.2f)   | 1v1 product scope — MULTI-001/002 out of scope                           |
| Attack-proxy weapon chain replacement (1.4 / 7.2.2b) | Covered in `07-combat-lifecycle.test.ts` WPN-\*                          |
| Spectra destroy-before-attack edge (7.2.2c)          | Covered in `07-combat-lifecycle.test.ts` SPEC-001                        |
| Close Step 7.7.3 leftover reaction clear             | Forced Close clears stacked attacks/reactions to the graveyard (CLS-006) |
