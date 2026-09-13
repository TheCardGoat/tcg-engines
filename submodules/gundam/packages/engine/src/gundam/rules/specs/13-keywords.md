# Section 13 — Keyword Effects and Keywords

**Rules covered:** 13-1, 13-2  
**Suites:** `suites/keywords.rules.test.ts`, `keyword-effects.real-cards.test.ts`, `keyword-timing-effects.real-cards.test.ts`

## AAA scenarios (keyword effects 13-1)

### 13-1-1 Repair at end of controller's turn

|             |                                                          |
| ----------- | -------------------------------------------------------- |
| **Rules**   | 13-1-1-1, 13-1-1-2                                       |
| **Arrange** | ST01-001 Gundam (Repair 2) damaged; optional Sayla grant |
| **Act**     | `endTurn`                                                |
| **Assert**  | Damage reduced by Repair amount; stacking adds values    |

### 13-1-2 Breach after battle-destroying enemy Unit

|             |                                                                 |
| ----------- | --------------------------------------------------------------- |
| **Rules**   | 13-1-2                                                          |
| **Arrange** | Breach Unit vs low-HP rested defender; Base or Shields present  |
| **Act**     | `resolveBattle`                                                 |
| **Assert**  | Base/Shield takes Breach damage; no effect if empty shield area |

### 13-1-3 Support rests source; buffs other friendly Unit

|             |                                               |
| ----------- | --------------------------------------------- |
| **Rules**   | 13-1-3                                        |
| **Arrange** | Support Unit + ally                           |
| **Act**     | `useSupport(source, other)`                   |
| **Assert**  | Source rested; other AP +N; self-target fails |

### 13-1-4 Blocker

|             |                                  |
| ----------- | -------------------------------- |
| **Rules**   | 13-1-4, 8-3                      |
| **Arrange** | Direct attack vs Blocker Unit    |
| **Act**     | `declareBlock`                   |
| **Assert**  | Target redirects; Blocker rested |

### 13-1-5 First Strike

|             |                                                      |
| ----------- | ---------------------------------------------------- |
| **Rules**   | 13-1-5, 8-5-3-2-2                                    |
| **Arrange** | First Strike attacker vs lethal defender             |
| **Act**     | `resolveBattle`                                      |
| **Assert**  | Defender destroyed first; no return damage if lethal |

### 13-1-6 High-Maneuver prevents Blocker

|             |                                       |
| ----------- | ------------------------------------- |
| **Rules**   | 13-1-6                                |
| **Arrange** | High-Maneuver attacker; enemy Blocker |
| **Act**     | Direct attack; declareBlock           |
| **Assert**  | `CANNOT_BLOCK_HIGH_MANEUVER`          |

### 13-1-7 Suppression damages first two Shields

|             |                                     |
| ----------- | ----------------------------------- |
| **Rules**   | 13-1-7                              |
| **Arrange** | Suppression Unit; 3 Shields no Base |
| **Act**     | Direct attack                       |
| **Assert**  | Two Shields destroyed; one remains  |

### 13-1-8 Development optional exile then effect

|             |                                           |
| ----------- | ----------------------------------------- |
| **Rules**   | 13-1-8                                    |
| **Arrange** | Development Unit deploy with trash fodder |
| **Act**     | Deploy; accept/decline exile              |
| **Assert**  | Follow-up only if accepted                |

## AAA scenarios (timing keywords 13-2)

Covered in `keyword-timing-effects.real-cards.test.ts`:

| Rule    | Keyword             | Observable              |
| ------- | ------------------- | ----------------------- |
| 13-2-1  | 【Activate･Main】   | Main only               |
| 13-2-2  | 【Activate･Action】 | Action only             |
| 13-2-3  | 【Main】            | Main command            |
| 13-2-4  | 【Action】          | Action command          |
| 13-2-5  | 【Burst】           | Shield destroy optional |
| 13-2-6  | 【Deploy】          | On deploy               |
| 13-2-7  | 【Attack】          | On attack declare       |
| 13-2-8  | 【Destroyed】       | On destroy              |
| 13-2-9  | 【When Paired】     | On pair                 |
| 13-2-10 | 【During Pair】     | While paired            |
| 13-2-11 | 【When Linked】     | On link                 |
| 13-2-12 | 【During Link】     | While linked            |
| 13-2-13 | 【Once per Turn】   | Second activation fails |
