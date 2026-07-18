import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op07Foxy059, op07Foxy071 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-071 Foxy", () => {
  test("with an included Foxy Pirates Leader reduces every opposing Character only on the opponent's turn", () => {
    const originalTraits = op07Foxy059.traits;
    op07Foxy059.traits = ["Special Foxy Pirates"];
    try {
      const opponentTurn = OnePieceTestEngine.create(
        { leaderCardId: op07Foxy059, character: [op07Foxy071] },
        { character: [eb01Doma005, eb01Doma005] },
        { firstPlayer: "south", activeSeat: "north" },
      );
      expect(
        opponentTurn
          .getView("south")
          .players.north.characters.filter(Boolean)
          .map((card) => card?.power)
          .filter((power): power is number => power !== undefined),
      ).toEqual([2000, 2000]);

      const ownTurn = OnePieceTestEngine.create(
        { leaderCardId: op07Foxy059, character: [op07Foxy071] },
        { character: [eb01Doma005] },
      );
      expect(ownTurn.getView("south").players.north.characters[0]?.power).toBe(3000);
    } finally {
      op07Foxy059.traits = originalTraits;
    }
  });

  test("adds up to one rested DON!! only once per turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [op07Foxy071],
      donDeckCount: 2,
    });
    const foxyId = engine.findCardInZone("south", "character", op07Foxy071);

    engine.activateEffect(foxyId, "activateMain", "south");
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Foxy's DON!! choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({
      restedDon: 1,
      donDeckCount: 1,
    });
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: foxyId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });
});
