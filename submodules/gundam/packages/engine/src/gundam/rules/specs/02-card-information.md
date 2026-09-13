# Section 2 — Card Information

**Rules covered:** 2-1 through 2-12 (identity fields used by engine)  
**Suite:** Lv./cost exercised in `setup-turn-progression.rules.test.ts` and card suites

## AAA scenarios

### 2-9-1 / 2-10-1 Level and cost gates when playing

|             |                                                                                           |
| ----------- | ----------------------------------------------------------------------------------------- |
| **Rules**   | 2-9-1, 2-10-1, 7-5-2-2                                                                    |
| **Arrange** | Published Unit in hand; `resourceArea: activeResources(n)` with n below level and/or cost |
| **Act**     | `deployUnit(card)`                                                                        |
| **Assert**  | `expectFailure(..., "INSUFFICIENT_RESOURCES")` or level-failure code; card stays in hand  |

### 2-9-1 Level satisfied by total resources (active or rested)

|             |                                                                 |
| ----------- | --------------------------------------------------------------- |
| **Rules**   | 2-9-1                                                           |
| **Arrange** | Enough total resources for Lv., but only some active for cost   |
| **Act**     | Deploy with mixed active/rested                                 |
| **Assert**  | Level check uses total count; cost still needs active resources |

### 2-7 / 2-8 / 3-3-8 Pilot AP/HP modifiers on pair

|             |                                                                |
| ----------- | -------------------------------------------------------------- |
| **Rules**   | 2-7-3, 2-8-4, 3-3-8-1                                          |
| **Arrange** | Published Unit + Pilot with +AP/+HP (e.g. ST01 Amuro + Gundam) |
| **Act**     | `assignPilot(pilot, unit)`                                     |
| **Assert**  | `getVisibleCard(unit).effectiveAp/Hp` include pilot modifiers  |

### 2-4-3 / 2-5-5 Pair does not change Unit color or traits

|             |                                                             |
| ----------- | ----------------------------------------------------------- |
| **Rules**   | 2-4-3, 2-5-5                                                |
| **Arrange** | Unit color A, Pilot color B with different traits           |
| **Act**     | Pair                                                        |
| **Assert**  | Unit color/traits unchanged; pilot traits not added to unit |

### 2-12 / 3-2-6 Link condition on Unit only

|             |                                                   |
| ----------- | ------------------------------------------------- |
| **Rules**   | 2-12-1, 2-12-2, 3-2-6                             |
| **Arrange** | Link Unit + matching Pilot name in link condition |
| **Act**     | Pair matching pilot                               |
| **Assert**  | Link Unit status / may attack same turn (3-2-6-3) |
