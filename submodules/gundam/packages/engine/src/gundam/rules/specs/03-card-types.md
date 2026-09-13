# Section 3 — Card Types

**Rules covered:** 3-1 through 3-6  
**Suite:** `setup-turn-progression.rules.test.ts`, `combat-battle.rules.test.ts`

## AAA scenarios

### 3-2-1 / 5-8 Deploy Unit into battle area

|             |                                                                  |
| ----------- | ---------------------------------------------------------------- |
| **Rules**   | 3-2-1, 5-8-1, 7-5-2-1                                            |
| **Arrange** | Published Unit in hand + active resources                        |
| **Act**     | `deployUnit(card)`                                               |
| **Assert**  | Unit in `battleArea`; hand empty of that card; active by default |

### 3-2-4 Newly deployed Unit cannot attack same turn

|             |                                                                                       |
| ----------- | ------------------------------------------------------------------------------------- |
| **Rules**   | 3-2-4                                                                                 |
| **Arrange** | Deploy Unit this turn (hand → deploy)                                                 |
| **Act**     | `enterBattle(deployedId, "direct")`                                                   |
| **Assert**  | Failure (wrong timing / cannot attack); Unit remains active or not rested as attacker |

### 3-2-6-3 Link Unit can attack the turn it is deployed

|             |                                                           |
| ----------- | --------------------------------------------------------- |
| **Rules**   | 3-2-6-2, 3-2-6-3                                          |
| **Arrange** | Unit with link + matching Pilot in hand; enough resources |
| **Act**     | Deploy Unit, `assignPilot`, then `enterBattle` same turn  |
| **Assert**  | Attack succeeds; attacker becomes rested                  |

### 3-3-3 / 3-3-4 Pilot only exists paired; one Pilot per Unit

|             |                                                  |
| ----------- | ------------------------------------------------ |
| **Rules**   | 3-3-3, 3-3-4                                     |
| **Arrange** | Unit in play; Pilot in hand                      |
| **Act**     | `assignPilot`; second pilot attempt on same unit |
| **Assert**  | First pair sets `getPilotId`; second fails       |

### 3-3-6 Paired Pilot follows Unit leaving battle area

|             |                                        |
| ----------- | -------------------------------------- |
| **Rules**   | 3-3-6, 5-10-2                          |
| **Arrange** | Paired Unit destroyed by combat        |
| **Act**     | `resolveBattle` that destroys the Unit |
| **Assert**  | Unit and Pilot both in trash           |

### 3-4-4 Command goes to trash after resolution

|             |                                                        |
| ----------- | ------------------------------------------------------ |
| **Rules**   | 3-4-4, 4-9-1                                           |
| **Arrange** | 【Main】 Command in hand (e.g. ST01-013 Kai's Resolve) |
| **Act**     | `playCommand` + resolve targets                        |
| **Assert**  | Command in trash                                       |

### 3-4-6 Command as Pilot

|             |                                             |
| ----------- | ------------------------------------------- |
| **Rules**   | 3-4-6-2                                     |
| **Arrange** | Command with 【Pilot】 + Unit in play       |
| **Act**     | `playCommandAsPilot(command, unit)`         |
| **Assert**  | `getPilotId(unit)` is that command instance |

### 3-5-3 Base takes shield-area damage first

|             |                                                                 |
| ----------- | --------------------------------------------------------------- |
| **Rules**   | 3-5-3, 8-5-2-4                                                  |
| **Arrange** | P2 baseSection with published Base + optional shields           |
| **Act**     | Direct attack                                                   |
| **Assert**  | Base receives damage; shield count unchanged while Base remains |

### 3-6 Resources from resource deck

|             |                                                                                 |
| ----------- | ------------------------------------------------------------------------------- |
| **Rules**   | 3-6-1, 7-4-1                                                                    |
| **Arrange** | Resource deck populated; main phase after resource phase via full turn or setup |
| **Act**     | Advance through resource phase (or observe auto place)                          |
| **Assert**  | Resource area count increases by 1 when phase resolves                          |
