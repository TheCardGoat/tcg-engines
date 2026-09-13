# Section 4 — Game Locations

**Rules covered:** 4-1 through 4-9  
**Suite:** `zones-locations.rules.test.ts`

## AAA scenarios

### 4-1-3 Zone counts are public

|             |                                                        |
| ----------- | ------------------------------------------------------ |
| **Rules**   | 4-1-3                                                  |
| **Arrange** | Known counts in hand, battleArea, trash, shieldArea    |
| **Act**     | Query via `getCardsInZone` / board view counts         |
| **Assert**  | Counts match fixture for own and opponent public zones |

### 4-5-4 Battle area limit six Units

|             |                                                                                   |
| ----------- | --------------------------------------------------------------------------------- |
| **Rules**   | 4-5-4, 11-4-1                                                                     |
| **Arrange** | Six Units already in battleArea; seventh in hand                                  |
| **Act**     | Deploy seventh                                                                    |
| **Assert**  | Excess management prompt or trash of one existing Unit (not "destroyed" 11-4-2-1) |

### 4-6-3 / 4-6-4 Shield section private; base public; Shields have 1 HP

|             |                                                                                                       |
| ----------- | ----------------------------------------------------------------------------------------------------- |
| **Rules**   | 4-6-3, 4-6-4-2, 8-5-2-3                                                                               |
| **Arrange** | P2 shieldArea with N face-down published fodder; no Base                                              |
| **Act**     | Direct attack with AP ≥ 1                                                                             |
| **Assert**  | Shield count −1; trash +1; no winner if shields remain; never assert face-down identity before reveal |

### 4-8-4 Hand limit ten during end phase

|             |                                                    |
| ----------- | -------------------------------------------------- |
| **Rules**   | 4-8-4, 7-6-5-1                                     |
| **Arrange** | Active player hand with 11+ cards                  |
| **Act**     | `passMainIntoEndAction` then `discardToHandLimit`  |
| **Assert**  | Must discard to 10; cannot proceed without discard |

### 4-9 Trash is public destination for destroyed Units and spent Commands

|             |                                                  |
| ----------- | ------------------------------------------------ |
| **Rules**   | 4-9-1, 5-10-2                                    |
| **Arrange** | Combat destroying a Unit                         |
| **Act**     | `resolveBattle`                                  |
| **Assert**  | Destroyed Unit `getCardZone` is `trash:player_*` |

### 4-4-2 Resource area limit 15 / EX Resource limit 5

|             |                                                                |
| ----------- | -------------------------------------------------------------- |
| **Rules**   | 4-4-2, 4-4-2-1                                                 |
| **Arrange** | Near-cap resource area                                         |
| **Act**     | Resource phase placement                                       |
| **Assert**  | Placement refused or capped per engine implementation of limit |
