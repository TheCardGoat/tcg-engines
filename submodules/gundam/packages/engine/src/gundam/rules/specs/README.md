# Gundam comprehensive-rules test specifications

Source: [Gundam Card Game Comprehensive Rules](https://www.gundam-gcg.com/en/pdf/comprehensiverules_en.pdf?v) (PDF Ver. 1.8.0 preferred; in-repo skill copy currently Ver. 1.7.0).

These files are the **contract** for rules conformance tests. Each scenario lists:

- **Rules** — official rule numbers covered
- **Arrange** — `GundamTestEngine.create` fixture (prefer published cards when identity matters)
- **Act** — public `asPlayer` moves only
- **Assert** — player-visible outcomes (zones, damage, exhausted, prompts, winner)

Executable suites live in `../suites/` and share AAA helpers from
`../../testing/rules-aaa.ts` (exported via `@tcg/gundam-engine`).

## Scope

| Section                 | Spec file                                                    | Executable suite                                          |
| ----------------------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| 1 Game Overview         | [01-game-overview.md](./01-game-overview.md)                 | `game-overview.rules.test.ts`                             |
| 2 Card Information      | [02-card-information.md](./02-card-information.md)           | `card-information.rules.test.ts`                          |
| 3 Card Types            | [03-card-types.md](./03-card-types.md)                       | `card-types.rules.test.ts`                                |
| 4 Game Locations        | [04-game-locations.md](./04-game-locations.md)               | `zones-locations.rules.test.ts`                           |
| 5 Terminology           | [05-terminology.md](./05-terminology.md)                     | `terminology.rules.test.ts`                               |
| 6 Preparing to Play     | [06-preparing-to-play.md](./06-preparing-to-play.md)         | `setup-turn-progression.rules.test.ts`                    |
| 7 Game Progression      | [07-game-progression.md](./07-game-progression.md)           | `setup-turn-progression.rules.test.ts`                    |
| 8 Attacking and Battles | [08-attacking-and-battles.md](./08-attacking-and-battles.md) | `combat-battle.rules.test.ts`                             |
| 9 Action Steps          | [09-action-steps.md](./09-action-steps.md)                   | `effect-action-timing.rules.test.ts`                      |
| 10 Effect Activation    | [10-effect-activation.md](./10-effect-activation.md)         | `effect-action-timing.rules.test.ts`                      |
| 11 Rules Management     | [11-rules-management.md](./11-rules-management.md)           | `rules-management.rules.test.ts`                          |
| **12 Multiplayer**      | [12-multiplayer-deferred.md](./12-multiplayer-deferred.md)   | **out of scope (1v1 only)**                               |
| 13 Keywords             | [13-keywords.md](./13-keywords.md)                           | `keywords.rules.test.ts` + `keyword-*.real-cards.test.ts` |

## AAA pattern (required)

```ts
import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  expectSuccess,
  expectFailure,
  resolveBattle,
  endTurn,
  zoneCount,
} from "@tcg/gundam-engine";
import { st01Gundam001 } from /* published card */;

describe("Section N — title (rules N-x)", () => {
  it("N-x-y: short observable sentence", () => {
    // Arrange
    const engine = GundamTestEngine.create({ play: [st01Gundam001] }, { deck: 5 });
    // Act
    // Assert
  });
});
```

## Executable coverage

Each in-scope spec scenario is implemented as an `it("rule-id: …")` case under
`../suites/`. Section 12 remains deferred. Keyword timing breadth also lives in
`keyword-effects.real-cards.test.ts` and `keyword-timing-effects.real-cards.test.ts`.

```bash
vp test packages/engine/src/gundam/rules/suites --run
```
