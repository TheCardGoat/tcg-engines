# Section 1 — Game Overview

**Rules covered:** 1-1, 1-2, 1-3  
**Suite:** `suites/game-overview.rules.test.ts`

## AAA scenarios

### 1-1-1 Two-player game

|             |                                                                           |
| ----------- | ------------------------------------------------------------------------- |
| **Arrange** | `GundamTestEngine.create` with two players only                           |
| **Act**     | None (fixture identity)                                                   |
| **Assert**  | Board view exposes exactly `player_one` and `player_two`; no third player |

### 1-2-2-1 / 8-5-2-2 / 11-2-1-1 Defeat by battle damage with empty shield area

|             |                                                                                    |
| ----------- | ---------------------------------------------------------------------------------- |
| **Rules**   | 1-2-2-1, 8-5-2-2, 11-2-1-1                                                         |
| **Arrange** | P1 published Unit in play (e.g. ST01-001 Gundam); P2 no baseSection, no shieldArea |
| **Act**     | `enterBattle(attacker, "direct")` then `passBattleWithoutBlock` / `resolveBattle`  |
| **Assert**  | `getBoardView().winner === PLAYER_ONE`; game ended                                 |

### 1-2-2-2 / 11-2-1-2 Defeat when deck is empty

|             |                                                                                                       |
| ----------- | ----------------------------------------------------------------------------------------------------- |
| **Rules**   | 1-2-2-2, 11-2-1-2, 7-3-1-1                                                                            |
| **Arrange** | Fixture that leaves a player with deck count 0 after a legal draw, or mill-to-empty via public effect |
| **Act**     | Legal draw / effect that empties deck                                                                 |
| **Assert**  | That player loses; winner is opponent                                                                 |

### 1-2-4 Concede

|             |                                                |
| ----------- | ---------------------------------------------- |
| **Rules**   | 1-2-4                                          |
| **Arrange** | Minimal two-player main-phase fixture          |
| **Act**     | `asPlayer(PLAYER_ONE).concede()`               |
| **Assert**  | Winner is `PLAYER_TWO`; game ended immediately |

### 1-3-2 Impossible / partial actions

|             |                                                                                                       |
| ----------- | ----------------------------------------------------------------------------------------------------- |
| **Rules**   | 1-3-2, 1-3-2-1                                                                                        |
| **Arrange** | Unit already rested; effect or action that would rest it again (or mock command if no published card) |
| **Act**     | Public rest / Support path that targets already-rested Unit                                           |
| **Assert**  | No second rest event; Unit stays rested; no crash                                                     |

### 1-3-1 Card text precedence

|             |                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------ |
| **Rules**   | 1-3-1                                                                                            |
| **Arrange** | Published card whose text overrides a base restriction (e.g. Link Unit attack-on-deploy 3-2-6-3) |
| **Act**     | Deploy + pair satisfying link; attack same turn                                                  |
| **Assert**  | Attack succeeds where non-Link deploy would fail (cross-ref 3-2-4 / 3-2-6-3)                     |
