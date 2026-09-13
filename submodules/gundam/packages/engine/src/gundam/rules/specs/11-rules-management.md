# Section 11 — Rules Management

**Rules covered:** 11-1 through 11-5  
**Suite:** `rules-management.rules.test.ts`

## AAA scenarios

### 11-2-1-1 Defeat from empty shield battle damage

|             |                               |
| ----------- | ----------------------------- |
| **Rules**   | 11-2-1-1, 1-2-2-1, 8-5-2-2    |
| **Arrange** | Empty shield area and no Base |
| **Act**     | Direct attack resolve         |
| **Assert**  | Defender defeated immediately |

### 11-2-1-2 Defeat from empty deck

|             |                                   |
| ----------- | --------------------------------- |
| **Rules**   | 11-2-1-2, 1-2-2-2                 |
| **Arrange** | Deck emptied by draw or effect    |
| **Act**     | Rules management after empty deck |
| **Assert**  | That player loses                 |

### 11-3-1 Destruction when HP becomes 0

|             |                                    |
| ----------- | ---------------------------------- |
| **Rules**   | 11-3-1, 5-5-2                      |
| **Arrange** | Unit HP 2; deal 2 damage in battle |
| **Act**     | `resolveBattle`                    |
| **Assert**  | Unit in trash                      |

### 11-3-1-1 Shields have 1 HP

|             |                                           |
| ----------- | ----------------------------------------- |
| **Rules**   | 11-3-1-1, 4-6-4-2                         |
| **Arrange** | Shield in shieldArea                      |
| **Act**     | Any 1+ damage to shield via direct attack |
| **Assert**  | Shield destroyed (count −1)               |

### 11-4 Battle area excess (max 6)

|             |                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------ |
| **Rules**   | 11-4-1, 11-4-2, 11-4-2-1, 5-10-4                                                                 |
| **Arrange** | Six Units in battleArea; seventh deployable                                                      |
| **Act**     | Deploy seventh Unit                                                                              |
| **Assert**  | Must choose one existing Unit to trash; trashed Unit is **not** destroyed (no Destroyed trigger) |

### 11-5 Base section excess (max 1)

|             |                                                         |
| ----------- | ------------------------------------------------------- |
| **Rules**   | 11-5-1, 11-5-2, 11-5-2-1                                |
| **Arrange** | Existing Base; deploy second Base                       |
| **Act**     | `deployBase`                                            |
| **Assert**  | Choose existing Base to trash; not treated as destroyed |
