# Section 6 — Preparing to Play

**Rules covered:** 6-1, 6-2  
**Suite:** `setup-turn-progression.rules.test.ts` (setup path); deck legality also in `packages/engine/src/deck/`

## AAA scenarios

### 6-1-1 Deck 50 / resource deck 10 (construction)

|             |                                                        |
| ----------- | ------------------------------------------------------ |
| **Rules**   | 6-1-1                                                  |
| **Arrange** | Deck-list validator fixtures (unit-level deck package) |
| **Act**     | Validate legal vs illegal sizes                        |
| **Assert**  | 50/10 accepted; others rejected                        |

### 6-1-1-2 One or two colors only

|             |                       |
| ----------- | --------------------- |
| **Rules**   | 6-1-1-2               |
| **Arrange** | Three-color deck list |
| **Act**     | Validate              |
| **Assert**  | Illegal               |

### 6-1-1-3 Max four copies of same card number

|             |                                |
| ----------- | ------------------------------ |
| **Rules**   | 6-1-1-3, 2-1-2                 |
| **Arrange** | Five copies of one card number |
| **Act**     | Validate                       |
| **Assert**  | Illegal                        |

### 6-2-1 through 6-2-5 Setup sequence

|             |                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| **Rules**   | 6-2-1-4, 6-2-1-5, 6-2-1-6, 6-2-2, 6-2-3, 6-2-4, 6-2-5                                                   |
| **Arrange** | `GundamTestEngine.create({ deck: N, resourceDeck: 10 }, {...}, { skipToMainPhase: false })` with N ≥ 13 |
| **Act**     | `chooseFirstPlayer` → both `alterHand`                                                                  |
| **Assert**  | Hands 5; shields 6 each; EX Base each; EX Resource on P2 only; first turn Player One                    |

### 6-2-1-6 Mulligan redraw

|             |                                                          |
| ----------- | -------------------------------------------------------- |
| **Rules**   | 6-2-1-6-1                                                |
| **Arrange** | Setup at mulligan                                        |
| **Act**     | `alterHand` with wantsRedraw true for P1                 |
| **Assert**  | New hand size 5; deck still private (assert counts only) |
