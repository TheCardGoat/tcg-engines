# CR Chapter 5 — Layers, Cards & Abilities (AAA design)

**CR source:** `.../05-layers-cards-abilities.md`  
**Existing suite:** `05-layers-cards-abilities.test.ts`  
**Focus:** 5.1 Playing cards · stack layers · simplified 5.3 resolution · arsenal origin

**Related Rules Update:** layers **still resolve** when targets gone — see errata pack (not “fail entire layer”).

---

## Why

Stack order and legal play origins are the backbone of reactions, instants, and go-again continuity.

---

## AAA cases

### CR-5.1 — Play opens Layer on stack

| Field                | Content                                                |
| -------------------- | ------------------------------------------------------ |
| **Citation**         | CR 5.1, 7.1 Layer step                                 |
| **Implementability** | `ready`                                                |
| **Existing test**    | `05-layers-cards-abilities.test.ts` · Play opens Layer |
| **Quality**          | `production`                                           |

**Arrange** — Bravo Snatch  
**Act** — `play(Snatch, { target })`  
**Assert** — `combat().step === "layer"`; stack non-empty / attack layer present

---

### CR-5.1 / 1.14 — Inline pitch pays cost

| Field                | Content                                            |
| -------------------- | -------------------------------------------------- |
| **Citation**         | CR 5.1 play procedure + 1.14 costs                 |
| **Implementability** | `ready`                                            |
| **Existing test**    | `05-layers-cards-abilities.test.ts` · Inline pitch |
| **Quality**          | `production`                                       |

**Arrange** — Nimble Strike + blue pitch in hand  
**Act** — `play(Nimble Strike, { pitch: [Nimblism Blue], target })`  
**Assert** — pitch zone has blue; leftover RP as printed math; attack layer accepted

---

### CR-5.1.4 — Play-then-select target

| Field                | Content                                                |
| -------------------- | ------------------------------------------------------ |
| **Citation**         | Attack target declaration timing                       |
| **Implementability** | `ready`                                                |
| **Existing test**    | `05-layers-cards-abilities.test.ts` · Play-then-select |
| **Quality**          | `production`                                           |

**Arrange** — Snatch without target in play payload  
**Act** — Play; answer `select-attack-target` prompt  
**Assert** — Prompt then layer; combat target set

---

### CR-5.3 / 7.1 — Layer → chain after successive passes

| Field                | Content                                           |
| -------------------- | ------------------------------------------------- |
| **Citation**         | CR 5.3 resolution · 7.1–7.2                       |
| **Implementability** | `ready`                                           |
| **Existing test**    | `05-layers-cards-abilities.test.ts` · Layer→chain |
| **Quality**          | `production`                                      |

**Act** — Play Snatch; `passBoth`  
**Assert** — step `attack`; stack empty of that layer

---

### CR-5.1 — Play from arsenal

| Field                | Content                                                 |
| -------------------- | ------------------------------------------------------- |
| **Citation**         | Legal origin arsenal                                    |
| **Implementability** | `ready`                                                 |
| **Existing test**    | `05-layers-cards-abilities.test.ts` · Play from arsenal |
| **Quality**          | `production`                                            |

**Arrange** — Attack action in arsenal  
**Act** — `playFromArsenal` / `play` with `from: "arsenal"`  
**Assert** — arsenal empty; combat proceeds; damage as printed

---

### CR-5.3 + Rules Update — Targeted layer resolves when target gone

| Field                | Content                                                       |
| -------------------- | ------------------------------------------------------------- |
| **Citation**         | Rules Update 2026 · layers still resolve · CR 5.3 interaction |
| **Implementability** | `ready`                                                       |
| **Existing test**    | `release-notes.test.ts` · Rattle Bones + Pass Over            |
| **Quality**          | `production`                                                  |

**Arrange**

- Bravo: Rattle Bones (CRU143) + pitch; GY has Runerager Swarm
- Dash: Pass Over (MST097)

**Act**

1. Bravo plays Rattle Bones targeting GY card
2. Dash plays Pass Over banishing that GY card
3. Resolve stack top-down

**Assert**

- Targeted banish on Rattle Bones fails
- Go again still grants Bravo 1 AP
- Rattle Bones in GY after resolve

---

## Deferred

| Topic                                | Reason       |
| ------------------------------------ | ------------ |
| Full activated ability timing matrix | Per-card     |
| Meta-static outside game             | Deckbuilding |
| Connected ability pair edge lattice  | Per-card     |
