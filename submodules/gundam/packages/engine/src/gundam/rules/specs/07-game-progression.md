# Section 7 — Game Progression

**Rules covered:** 7-1 through 7-6  
**Suite:** `setup-turn-progression.rules.test.ts`

## AAA scenarios

### 7-1-1 Five phases in order

|             |                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------ |
| **Rules**   | 7-1-1                                                                                      |
| **Arrange** | Engine mid-main; deck/resource decks sized                                                 |
| **Act**     | `endTurn` / phase advances                                                                 |
| **Assert**  | After full endTurn, active player is opponent in main phase (start/draw/resource auto-run) |

### 7-2-3 Active Step readies rested cards

|             |                                                        |
| ----------- | ------------------------------------------------------ |
| **Rules**   | 7-2-3-1                                                |
| **Arrange** | Rested Unit and rested Resources for turn player       |
| **Act**     | Complete turn so next Start Phase runs for that player |
| **Assert**  | Cards `isExhausted` false                              |

### 7-3-1 Draw one card

|             |                                                   |
| ----------- | ------------------------------------------------- |
| **Rules**   | 7-3-1                                             |
| **Arrange** | Known hand and deck counts for next active player |
| **Act**     | `endTurn` so opponent becomes active and draws    |
| **Assert**  | Opponent hand +1 vs pre-turn baseline             |

### 7-4-1 Resource placement

|             |                                                |
| ----------- | ---------------------------------------------- |
| **Rules**   | 7-4-1                                          |
| **Arrange** | Resource deck non-empty                        |
| **Act**     | Full turn cycle into resource phase resolution |
| **Assert**  | Resource area count +1 for active player       |

### 7-5-2 Play card: level + cost

|             |                                                       |
| ----------- | ----------------------------------------------------- |
| **Rules**   | 7-5-2-2                                               |
| **Arrange** | Unit with known level/cost; matching active resources |
| **Act**     | `deployUnit`                                          |
| **Assert**  | Success; resources rested by cost amount              |

### 7-5-5 Ending main phase

|             |                                       |
| ----------- | ------------------------------------- |
| **Rules**   | 7-5-5-1, 7-5-5-2                      |
| **Arrange** | Main phase                            |
| **Act**     | `passPhase` / `passTurn`              |
| **Assert**  | Phase becomes end-phase (action-step) |

### 7-6-5 Hand step discard

|             |                                           |
| ----------- | ----------------------------------------- |
| **Rules**   | 7-6-5-1, 4-8-4                            |
| **Arrange** | Hand size 11+                             |
| **Act**     | Pass into hand-step; `discardToHandLimit` |
| **Assert**  | Hand reduced to 10                        |

### 7-6-6 Cleanup clears "during this turn" effects

|             |                                     |
| ----------- | ----------------------------------- |
| **Rules**   | 7-6-6-1, 13-1-3                     |
| **Arrange** | Support AP buff applied this turn   |
| **Act**     | `endTurn` fully                     |
| **Assert**  | Temporary AP buff gone on next main |
