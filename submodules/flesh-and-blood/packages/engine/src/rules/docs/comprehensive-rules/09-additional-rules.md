# CR Chapter 9 — Additional Rules (AAA design)

**CR source:** `.../09-additional-rules.md`  
**Existing suite:** `09-additional-rules.test.ts`  
**Focus:** 9.0 resources · 9.3 marked · honesty about DFC/split

---

## Why

Additional rules mix real play (resources, marked) with product features not yet in engine (DFC flips). Docs must prevent theater tests for unimplemented product paths.

---

## AAA cases

### CR-9.3 — Marked seat flag

| Field                | Content                                                    |
| -------------------- | ---------------------------------------------------------- |
| **Citation**         | CR 9.3 Marked                                              |
| **Implementability** | `ready` (flag) · full mark-from-card may be `needs-engine` |
| **Existing test**    | `09-additional-rules.test.ts` · Marked flag                |
| **Quality**          | `production` for seat flag only                            |

**Arrange** — Fixture sets Bravo marked  
**Assert** — State + viewer show marked true for Bravo  
**Note** — QA guide: seatable flag only; mark-granting card effects may still be incomplete

---

### CR-9.0 / resources — Cracked Bauble pitch

| Field                | Content                                        |
| -------------------- | ---------------------------------------------- |
| **Citation**         | Resource cards pitch without action cost       |
| **Implementability** | `ready`                                        |
| **Existing test**    | `09-additional-rules.test.ts` · Cracked Bauble |
| **Quality**          | `production`                                   |

**Arrange** — Hand Cracked Bauble (WTR224, pitch 2)  
**Act** — Pitch  
**Assert** — RP 2

---

### Legendary registration (meta)

| Field                | Content                                                        |
| -------------------- | -------------------------------------------------------------- |
| **Citation**         | Legendary meta-static (deckbuilding)                           |
| **Implementability** | `untestable` as in-match exclusivity without deck rules engine |
| **Existing test**    | `09-additional-rules` · HoF legendary keyword present          |
| **Quality**          | `meta`                                                         |

**Assert** — Keyword present on Heart of Fyendal catalog module  
**Do not** claim full deck-construction enforcement unless a deck validator exists and is under test

---

## Explicitly untestable / deferred (ch. 9)

| Topic                           | CR  | Reason                                                            |
| ------------------------------- | --- | ----------------------------------------------------------------- |
| Double-faced transform gameplay | 9.1 | No flip product path — **do not** test synthetic faceKind theater |
| Split-card meld richness        | 9.2 | Partial via ROS keyword suites; full meld lattice later           |
| Format-only additional rules    | —   | Policy                                                            |

---

## Engineering guidance

If a DFC or split rule becomes product-critical, write AAA cases with **real double-faced catalog modules** first, then engine flip moves — never synthetic face toggles that cannot occur in play.
