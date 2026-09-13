# Section 5 — Essential Game Terminology

**Rules covered:** 5-1 through 5-21  
**Suite:** distributed across combat, effect-timing, and rules-management suites

## AAA scenarios

### 5-4 Active / Rested orientations

|             |                                                      |
| ----------- | ---------------------------------------------------- |
| **Rules**   | 5-4-1, 5-4-2, 8-2-1                                  |
| **Arrange** | Active Unit in play                                  |
| **Act**     | Declare attack                                       |
| **Assert**  | Attacker `isExhausted` true after attack declaration |

### 5-5-2 / 11-3 Damage ≥ HP destroys

|             |                                                    |
| ----------- | -------------------------------------------------- |
| **Rules**   | 5-5-2, 11-3-1                                      |
| **Arrange** | Unit with known HP; damage path to exact HP        |
| **Act**     | Battle or effect damage                            |
| **Assert**  | Unit in trash; damage counters cleared after leave |

### 5-5-5 Zero damage is not dealt

|             |                                                       |
| ----------- | ----------------------------------------------------- |
| **Rules**   | 5-5-5                                                 |
| **Arrange** | Attacker with AP 0 or reduced to 0                    |
| **Act**     | Resolve combat damage step                            |
| **Assert**  | Defender damage stays 0; not destroyed by zero damage |

### 5-5-6 Excess damage on Base/Shield does not spill

|             |                                                                 |
| ----------- | --------------------------------------------------------------- |
| **Rules**   | 5-5-6, 8-5-2-3                                                  |
| **Arrange** | Single Shield (1 HP); attacker AP > 1                           |
| **Act**     | Direct attack                                                   |
| **Assert**  | One Shield destroyed; second shield (if any) untouched by spill |

### 5-6 HP Recovery does not over-heal

|             |                                                 |
| ----------- | ----------------------------------------------- |
| **Rules**   | 5-6-1, 5-6-2, 13-1-1                            |
| **Arrange** | Unit with Repair and 1 damage; Repair value ≥ 1 |
| **Act**     | `endTurn`                                       |
| **Assert**  | Damage is 0, never negative                     |

### 5-9 Pair

|             |                        |
| ----------- | ---------------------- |
| **Rules**   | 5-9-1                  |
| **Arrange** | Pilot + Unit           |
| **Act**     | `assignPilot`          |
| **Assert**  | `getPilotId(unit)` set |

### 5-10-3 Shield destroy reveals Burst choice

|             |                                                   |
| ----------- | ------------------------------------------------- |
| **Rules**   | 5-10-3, 13-2-5                                    |
| **Arrange** | Shield with 【Burst】 published card              |
| **Act**     | Direct attack destroying that Shield              |
| **Assert**  | Burst optional prompt; trash after accept/decline |

### 5-14 Draw adds top deck to hand privately

|             |                                                      |
| ----------- | ---------------------------------------------------- |
| **Rules**   | 5-14-1, 7-3-1                                        |
| **Arrange** | Known deck count; hand count                         |
| **Act**     | Full turn to draw phase / endTurn cycle              |
| **Assert**  | Hand +1, deck count −1; do not assert deck order/IDs |

### 5-17-3 EX Base / EX Resource at setup

|             |                                                  |
| ----------- | ------------------------------------------------ |
| **Rules**   | 5-17-3, 6-2-3, 6-2-4                             |
| **Arrange** | Full setup flow (`skipToMainPhase: false`)       |
| **Act**     | choose first player + alterHand both             |
| **Assert**  | Each baseSection has EX Base; P2 has EX Resource |

### 5-20 "If you do" vs "Then"

|             |                                                       |
| ----------- | ----------------------------------------------------- |
| **Rules**   | 5-20-1, 5-20-2                                        |
| **Arrange** | Published command with If-you-do / Then chain         |
| **Act**     | Decline optional first clause vs fail first clause    |
| **Assert**  | Dependent clause skipped only for "If you do" failure |
