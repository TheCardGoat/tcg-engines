# Section 10 — Effect Activation and Resolution

**Rules covered:** 10-1 through 10-3  
**Suite:** `effect-action-timing.rules.test.ts`

## AAA scenarios

### 10-1-3 Optional "you may" effects

|             |                                                        |
| ----------- | ------------------------------------------------------ |
| **Rules**   | 10-1-3                                                 |
| **Arrange** | Published optional Deploy/Development (e.g. ST10 Zeta) |
| **Act**     | Decline optional                                       |
| **Assert**  | Follow-up does not fire                                |

### 10-1-5 Constant effects apply while conditions hold

|             |                                                   |
| ----------- | ------------------------------------------------- |
| **Rules**   | 10-1-5                                            |
| **Arrange** | Constant during-pair / during-link published Unit |
| **Act**     | Pair / unpair or turn change                      |
| **Assert**  | Visible stats/keywords track condition            |

### 10-1-6-1 Triggered Deploy / Attack / Destroyed

|             |                                                |
| ----------- | ---------------------------------------------- |
| **Rules**   | 10-1-6-1, 13-2-6, 13-2-7, 13-2-8               |
| **Arrange** | Card with Deploy trigger                       |
| **Act**     | Deploy via public move                         |
| **Assert**  | Pending choice or observable effect fires once |

### 10-1-6-6 Active player resolves triggered effects first

|             |                                                                              |
| ----------- | ---------------------------------------------------------------------------- |
| **Rules**   | 10-1-6-6                                                                     |
| **Arrange** | Simultaneous triggers for both players (combat mutual destroy with triggers) |
| **Act**     | Resolve battle                                                               |
| **Assert**  | Active player's pending effects resolve before standby's                     |

### 10-1-7 / 13-2-1 Activated Main with cost before colon

|             |                                                        |
| ----------- | ------------------------------------------------------ |
| **Rules**   | 10-1-7, 13-2-1                                         |
| **Arrange** | Unit with Activate Main (e.g. Support or paid ability) |
| **Act**     | `activateAbility` / `useSupport`                       |
| **Assert**  | Cost paid (rested); effect applied                     |

### 10-1-8-1-1 Command requires legal target to play

|             |                                          |
| ----------- | ---------------------------------------- |
| **Rules**   | 10-1-8-1-1, 10-2-2                       |
| **Arrange** | Targeted Main Command; no legal targets  |
| **Act**     | `playCommand`                            |
| **Assert**  | Failure `NO_LEGAL_TARGETS` or equivalent |

### 10-1-8-1-2 Later Then / If-you-do choose does not block play

|             |                                                                       |
| ----------- | --------------------------------------------------------------------- |
| **Rules**   | 10-1-8-1-2, 10-3-3-1                                                  |
| **Arrange** | Command with a legal first choose and no later Then/If-you-do target  |
| **Act**     | `playCommand` then resolve the first choose                           |
| **Assert**  | Play succeeds; first portion resolves; later choose does not activate |

### 10-2-2 Target must be choosable

|             |                                                          |
| ----------- | -------------------------------------------------------- |
| **Rules**   | 10-2-2, 10-2-2-1                                         |
| **Arrange** | Effect targeting enemy Unit; only friendly Units present |
| **Act**     | Play / activate                                          |
| **Assert**  | Cannot choose friendly as enemy target                   |

### 10-1-6-8 Burst priority among triggers

|             |                                            |
| ----------- | ------------------------------------------ |
| **Rules**   | 10-1-6-8, 13-2-5                           |
| **Arrange** | Shield Burst + other simultaneous triggers |
| **Act**     | Destroy Shield                             |
| **Assert**  | Burst prompt prioritized                   |
