import { createMockResource, createMockUnit } from "@tcg/gundam-engine";
import { st04HawkOfEndymion013 } from "@tcg/gundam-cards";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";

/**
 * Rule 10-1-8-1-1 fixture — viewer holds Hawk of Endymion (ST04-013),
 * whose 【Main】/【Action】 effect requires choosing 1 enemy Unit with
 * HP ≤ 3. The opponent has no legal target available, so the engine's
 * `playCommand.enumerateCandidates` must NOT include this card id in
 * `selectableCardIds` — and consequently `useCardLegality` must return
 * `"disabled"` (not `"playable"`).
 *
 * Three scenarios are exposed:
 *   - empty enemy battle area
 *   - opponent has a single Unit with HP > 3 (filter never matches)
 *   - opponent has HP≤3 Units sitting in shields/trash, but none on the
 *     field — the live-game regression. "Choose 1 enemy Unit" must be
 *     read as "Unit on the field" (rules 1-2 / 10-2-2-1); off-board
 *     copies of the same printed type don't count.
 */
function makeFixture(scenario: "empty" | "tough-only" | "off-board-only"): DevRuntime {
  const p2BattleArea =
    scenario === "tough-only" ? [createMockUnit({ ap: 3, hp: 5, name: "Tough Mock" })] : [];
  const p2ShieldArea =
    scenario === "off-board-only"
      ? [
          createMockUnit({ ap: 1, hp: 2, name: "Shielded Fragile A" }),
          createMockUnit({ ap: 1, hp: 3, name: "Shielded Fragile B" }),
        ]
      : undefined;
  const p2Trash =
    scenario === "off-board-only"
      ? [createMockUnit({ ap: 2, hp: 3, name: "Trashed Fragile" })]
      : undefined;

  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [st04HawkOfEndymion013],
      resourceArea: [createMockResource(), createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: p2BattleArea,
      shieldArea: p2ShieldArea,
      trash: p2Trash,
      deck: 30,
      resourceDeck: 10,
    },
  });
}

export function loadNoLegalTargetEmptyDemo(): DevRuntime {
  return makeFixture("empty");
}

export function loadNoLegalTargetToughOnlyDemo(): DevRuntime {
  return makeFixture("tough-only");
}

export function loadNoLegalTargetOffBoardOnlyDemo(): DevRuntime {
  return makeFixture("off-board-only");
}
