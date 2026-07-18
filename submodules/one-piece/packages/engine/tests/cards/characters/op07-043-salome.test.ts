import { describe, expect, test } from "vite-plus/test";
import { op07BoaHancock038, op07BoaHancock051, op07Salome043 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-043 Salome", () => {
  test("on its controller's turn gives one Boa Hancock Leader or Character +2000 for the turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op07BoaHancock038,
      hand: [op07Salome043],
      character: [op07BoaHancock051],
      activeDon: op07Salome043.cost,
    });
    const hancockId = engine.findCardInZone("south", "character", op07BoaHancock051);
    const powerBefore = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === hancockId)?.power;

    engine.playCard(op07Salome043, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Salome's Boa Hancock choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), hancockId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [hancockId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === hancockId)?.power,
    ).toBe((powerBefore ?? 0) + 2000);

    engine.endTurn("south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === hancockId)?.power,
    ).toBe(powerBefore);
  });
});
