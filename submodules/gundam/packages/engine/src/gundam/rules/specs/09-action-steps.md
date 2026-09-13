# Section 9 — Action Steps

**Rules covered:** 9-1 through 9-5  
**Suite:** `effect-action-timing.rules.test.ts`

## AAA scenarios

### 9-2 / 9-3 Standby player acts first in Action Step

|             |                                                                                      |
| ----------- | ------------------------------------------------------------------------------------ |
| **Rules**   | 9-2, 9-3, 7-6-3-1                                                                    |
| **Arrange** | Main phase; optional Action Command in standby hand                                  |
| **Act**     | Active `passPhase`; standby has priority for first action/pass                       |
| **Assert**  | Standby can play Action Command before active; active Action rejected until priority |

### 9-3-1 Play 【Action】 Command

|             |                                                                                          |
| ----------- | ---------------------------------------------------------------------------------------- |
| **Rules**   | 9-3-1, 13-2-4                                                                            |
| **Arrange** | Published Main/Action command (e.g. ST01 Unforeseen Incident) in hand during Action Step |
| **Act**     | Play during Action Step after pass into end phase                                        |
| **Assert**  | Effect resolves; card to trash                                                           |

### 9-3-3 / 9-4-1 / 9-5 Consecutive passes end Action Step

|             |                                |
| ----------- | ------------------------------ |
| **Rules**   | 9-3-3, 9-4-1, 9-5              |
| **Arrange** | End-phase action-step          |
| **Act**     | Standby pass, active pass      |
| **Assert**  | Step advances past action-step |

### 9-3-2 【Activate･Action】 only in Action Step

|             |                                                                   |
| ----------- | ----------------------------------------------------------------- |
| **Rules**   | 9-3-2, 13-2-2                                                     |
| **Arrange** | Card with Activate Action (e.g. GD01 Gamow)                       |
| **Act**     | Activate in Main (fail); activate in battle Action Step (success) |
| **Assert**  | `WRONG_PHASE` in Main; success in Action                          |

### 13-2-4-2 Cannot pair Command-as-Pilot during Action Step

|             |                                          |
| ----------- | ---------------------------------------- |
| **Rules**   | 13-2-4-2, 9-3-1                          |
| **Arrange** | Pilot-Command in hand during Action Step |
| **Act**     | `playCommandAsPilot` in Action Step      |
| **Assert**  | Failure / wrong timing                   |
