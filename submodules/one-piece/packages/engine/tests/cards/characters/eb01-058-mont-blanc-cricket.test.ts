import { describe, expect, test } from "vite-plus/test";
import { eb01MontBlancCricket058 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-058 Mont Blanc Cricket", () => {
  test("gains power only with attached DON!!, two-or-less Life, and its controller's turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [eb01MontBlancCricket058],
        life: 2,
        activeDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const cricketId = engine.findCardInZone("south", "character", eb01MontBlancCricket058);

    engine.attachDon(cricketId, 1, "south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === cricketId)?.power,
    ).toBe(6000);

    engine.endTurn("south");
    const opponentTurnCard = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === cricketId);
    expect(opponentTurnCard?.attachedDon).toBe(1);
    expect(opponentTurnCard?.power).toBe(3000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
