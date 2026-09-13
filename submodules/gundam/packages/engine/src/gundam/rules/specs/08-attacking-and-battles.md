# Section 8 — Attacking and Battles

**Rules covered:** 8-1 through 8-6  
**Suite:** `combat-battle.rules.test.ts`

## AAA scenarios

### 8-2-1 Rest attacker; target player or rested enemy Unit

|             |                                                                                          |
| ----------- | ---------------------------------------------------------------------------------------- |
| **Rules**   | 8-2-1, 7-5-4-1                                                                           |
| **Arrange** | Active published attacker; rested enemy Unit; optional empty shields for direct          |
| **Act**     | `enterBattle(attacker, enemyId)` and `enterBattle(attacker, "direct")` in separate cases |
| **Assert**  | Attacker exhausted; reject active (non-rested) enemy as attack target                    |

### 8-3-1 / 13-1-4 Blocker redirects attack

|             |                                                                           |
| ----------- | ------------------------------------------------------------------------- |
| **Rules**   | 8-3-1, 8-3-2, 13-1-4                                                      |
| **Arrange** | Direct attack; defending published Blocker Unit (e.g. ST10 Mobile Worker) |
| **Act**     | `enterBattle(..., "direct")`; `declareBlock(blocker)`                     |
| **Assert**  | Blocker rested; pendingCombat.blockerId set                               |

### 8-3-3 Original target cannot Blocker itself

|             |                                                      |
| ----------- | ---------------------------------------------------- |
| **Rules**   | 8-3-3                                                |
| **Arrange** | Attack targeting a rested Unit that also has Blocker |
| **Act**     | Target tries `declareBlock` with itself              |
| **Assert**  | Failure                                              |

### 8-5-2-2 Empty shield area → player damage → defeat

|             |                                 |
| ----------- | ------------------------------- |
| **Rules**   | 8-5-2-2, 1-2-2-1                |
| **Arrange** | No Base, no Shields on defender |
| **Act**     | Direct attack resolve           |
| **Assert**  | Attacker player wins            |

### 8-5-2-3 Damage top Shield (1 HP)

|             |                                                        |
| ----------- | ------------------------------------------------------ |
| **Rules**   | 8-5-2-3, 4-6-4-2                                       |
| **Arrange** | One or more Shields, no Base                           |
| **Act**     | Direct attack resolve                                  |
| **Assert**  | Shield count −1; game continues if any defense remains |

### 8-5-2-4 Damage Base preferentially

|             |                                              |
| ----------- | -------------------------------------------- |
| **Rules**   | 8-5-2-4, 3-5-3                               |
| **Arrange** | Base in baseSection + Shields                |
| **Act**     | Direct attack                                |
| **Assert**  | Base takes AP damage; shield count unchanged |

### 8-5-3-2 Simultaneous unit battle damage

|             |                                                                 |
| ----------- | --------------------------------------------------------------- |
| **Rules**   | 8-5-3-2, 8-5-3-2-1                                              |
| **Arrange** | Attacker and rested defender with known AP/HP (no First Strike) |
| **Act**     | `resolveBattle`                                                 |
| **Assert**  | Both take each other's AP as damage; destroy if HP ≤ damage     |

### 8-5-3-2-2 First Strike orders damage first

|             |                                                                           |
| ----------- | ------------------------------------------------------------------------- |
| **Rules**   | 8-5-3-2-2, 13-1-5                                                         |
| **Arrange** | Published First Strike attacker; lethal defender that would kill attacker |
| **Act**     | `resolveBattle`                                                           |
| **Assert**  | Defender trashed; attacker survives with 0 damage from return             |

### 8-6-1 During-battle effects end

|             |                                     |
| ----------- | ----------------------------------- |
| **Rules**   | 8-6-1                               |
| **Arrange** | Effect granted "during this battle" |
| **Act**     | Resolve battle to end               |
| **Assert**  | Grant gone after return to main     |
