# CR Chapter 2 — Object Properties (AAA design)

**CR source:** `.../02-object-properties.md`  
**Existing suite:** `02-object-properties.test.ts`  
**Focus:** 2.1 Color · 2.2 Cost · 2.3 Defense · 2.4 Intellect · power/life as played properties

---

## Why

Printed cost/power/defense/pitch drive payment and damage. Tests must bind assertions to **printed catalog values**, not magic numbers invented in the test without card imports.

---

## Fixture cards

| Card                | Property under test                    |
| ------------------- | -------------------------------------- |
| Nimblism (blue)     | Color Blue; pitch 3                    |
| Snatch (red)        | Cost 0; power 4; defense 2             |
| Bravo / Dash heroes | Health / intelligence seed life & draw |

---

## AAA cases

### CR-2.1 / 2.8 — Blue pitch value 3

| Field                | Content                                       |
| -------------------- | --------------------------------------------- |
| **Citation**         | CR 2.1 Color, 2.8 Pitch                       |
| **Why**              | Pitch assets depend on printed pitch          |
| **Implementability** | `ready`                                       |
| **Existing test**    | `02-object-properties.test.ts` · Blue pitch 3 |
| **Quality**          | `production`                                  |

**Arrange** — Bravo hand Nimblism Blue  
**Act** — `pitch(Nimblism Blue)`  
**Assert** — RP === 3; card color Blue in instance/view as applicable

---

### CR-2.2 / 2.9 — Snatch cost and power drive play and damage

| Field                | Content                                   |
| -------------------- | ----------------------------------------- |
| **Citation**         | CR 2.2 Cost, power property               |
| **Why**              | Cost 0 + power 4 must match combat damage |
| **Implementability** | `ready`                                   |
| **Existing test**    | `02-object-properties.test.ts`            |
| **Quality**          | `production`                              |

**Arrange** — Bravo Snatch; Dash life 20  
**Act** — Undefended Snatch through damage  
**Assert** — Dash life 16; play accepted without RP

---

### CR-2.3 — Defense reduces damage

| Field                | Content                                             |
| -------------------- | --------------------------------------------------- |
| **Citation**         | CR 2.3 Defense · with CR 7.5.2 damage formula       |
| **Why**              | Defense property must apply when declared defending |
| **Implementability** | `ready`                                             |
| **Existing test**    | `02-object-properties.test.ts` · Defense            |
| **Quality**          | `production`                                        |

**Arrange** — Bravo Snatch (4); Dash hand card with defense 2 (e.g. Nimblism or Snatch)  
**Act** — Attack to defend; `blockWith` one def-2 card; resolve  
**Assert** — Dash life 18 (4−2)

---

### CR-2.4 / 2.5 — Hero intellect and life seed

| Field                | Content                                              |
| -------------------- | ---------------------------------------------------- |
| **Citation**         | CR 2.4 Intellect, 2.5 Life                           |
| **Why**              | Match start life and EOT draw count                  |
| **Implementability** | `ready`                                              |
| **Existing test**    | `02-object-properties.test.ts` · Hero intellect/life |
| **Quality**          | `production`                                         |

**Arrange** — `FabTestEngine.start` with heroes only (default life from `hero.health`)  
**Act** — Read seat state / complete turn draw path as covered in ch.4  
**Assert** — Life equals printed hero health when not overridden; intellect drives draw-to-intellect in ch.4 tests

---

## Deferred

| Topic                                  | Reason                               |
| -------------------------------------- | ------------------------------------ |
| Full supertype / specialization matrix | Deckbuilding meta                    |
| Hybrid class inclusion edge cases      | Rare; needs multi-card pool fixtures |
| X/\* dynamic power definition leaves   | Per-card when subject exists         |
