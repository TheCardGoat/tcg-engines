import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01GeckoMoria068 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-068 Gecko Moria", () => {
  test("deals double damage on its turn only at the five-card hand threshold", () => {
    const eligible = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        character: [{ card: op01GeckoMoria068, playedOnTurn: 0 }],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const eligibleId = eligible.findCardInZone("south", "character", op01GeckoMoria068);
    const eligibleLifeBefore = eligible.getView("south").players.north.lifeCount;

    eligible.declareAttack(eligibleId, eligible.leader("north"), "south");

    expect(eligible.getView("south").players.north.lifeCount).toBe(eligibleLifeBefore - 2);

    const belowThreshold = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        character: [{ card: op01GeckoMoria068, playedOnTurn: 0 }],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const ineligibleId = belowThreshold.findCardInZone("south", "character", op01GeckoMoria068);
    const ineligibleLifeBefore = belowThreshold.getView("south").players.north.lifeCount;

    belowThreshold.declareAttack(ineligibleId, belowThreshold.leader("north"), "south");

    expect(belowThreshold.getView("south").players.north.lifeCount).toBe(ineligibleLifeBefore - 1);
  });
});
