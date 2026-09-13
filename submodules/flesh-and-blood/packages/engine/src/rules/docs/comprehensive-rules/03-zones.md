# CR Chapter 3 — Zones (AAA design)

**CR source:** `.../03-zones.md`  
**Existing suite:** `03-zones.test.ts`  
**Focus:** privacy (3.0), pitch (public), combat chain (3.6), arsenal (3.9), equipment return (with 7.7.5)

---

## Why

Zone privacy and combat-chain membership are simulator-facing; wrong face-up/down or wrong GY vs equipment return is player-visible corruption.

---

## Fixture cards

Snatch, Nimblism, Scabskin Leathers (legs battleworn), arsenal-capable attack, heroes Bravo/Dash.

---

## AAA cases

### CR-3.0 — Deck/hand privacy in viewer projection

| Field                | Content                                       |
| -------------------- | --------------------------------------------- |
| **Citation**         | CR 3.0 General (private zones)                |
| **Why**              | Opponent must not see private card identities |
| **Implementability** | `ready`                                       |
| **Existing test**    | `03-zones.test.ts` · Deck/hand privacy        |
| **Quality**          | `production`                                  |

**Arrange** — Both players with non-empty decks and hands  
**Act** — Project viewer state for Bravo  
**Assert** — Own deck face-down / no opp hand canonicals; opponent hand face-down in Bravo’s view

---

### CR-3.x — Pitch zone public

| Field                | Content                              |
| -------------------- | ------------------------------------ |
| **Citation**         | Pitch as public zone (CR zone table) |
| **Why**              | Opponent may see pitched card        |
| **Implementability** | `ready`                              |
| **Existing test**    | `03-zones.test.ts` · Pitch public    |
| **Quality**          | `production`                         |

**Arrange / Act** — Bravo pitches Nimblism  
**Assert** — Opponent viewer can see pitch instance id / identity

---

### CR-3.6 — Combat chain membership

| Field                | Content                                                   |
| -------------------- | --------------------------------------------------------- |
| **Citation**         | CR 3.6 Combat chain / 7.0.2                               |
| **Why**              | Attack and defending cards must be on chain during combat |
| **Implementability** | `ready`                                                   |
| **Existing test**    | `03-zones.test.ts` · Combat chain                         |
| **Quality**          | `production`                                              |

**Arrange** — Snatch vs defending Nimblism  
**Act** — Play attack; block; inspect combat  
**Assert** — Both on chain during combat; attack in GY after close

---

### CR-3.9 — Arsenal put + privacy

| Field                | Content                                         |
| -------------------- | ----------------------------------------------- |
| **Citation**         | CR 3.9 Arsenal                                  |
| **Why**              | Arsenal face-down to opponent; EOT arsenal path |
| **Implementability** | `ready`                                         |
| **Existing test**    | `03-zones.test.ts` · Arsenal put + privacy      |
| **Quality**          | `production`                                    |

**Arrange** — Path that puts a card into arsenal (EOT arsenal or reload/effect)  
**Assert** — Card in arsenal; opponent view face-down

---

### CR-7.7.5 / equipment — Equipment returns to zone, not GY

| Field                | Content                                             |
| -------------------- | --------------------------------------------------- |
| **Citation**         | CR 7.7.5 (close) + equipment zone rules             |
| **Why**              | Battleworn equipment stays equipped after defending |
| **Implementability** | `ready`                                             |
| **Existing test**    | `03-zones.test.ts` · Equipment return               |
| **Quality**          | `production`                                        |

**Arrange** — Dash legs Scabskin; Bravo Snatch  
**Act** — Defend with Scabskin; resolve combat  
**Assert** — Life reduced by net damage; Scabskin still in `legs` (not GY); defenseDelta may apply (battleworn)

---

## Deferred

| Topic                             | Reason                                       |
| --------------------------------- | -------------------------------------------- |
| Soul / banished face-down nuances | Covered partially via MON keywords elsewhere |
| Stack as zone edge cases          | Ch.5                                         |
| Multi-arsenal (future rules)      | If CR changes; not current baseline          |
