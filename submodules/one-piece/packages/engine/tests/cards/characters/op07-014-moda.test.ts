import { describe, expect, test } from "vite-plus/test";
import { op02PortgasDAce013, op03PortgasDAce001, op07Moda014 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-014 Moda", () => {
  test("on its controller's turn gives one Leader or Character named Portgas.D.Ace +2000 for the turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op03PortgasDAce001,
      hand: [op07Moda014],
      character: [op02PortgasDAce013],
      activeDon: op07Moda014.cost,
    });
    const aceId = engine.findCardInZone("south", "character", op02PortgasDAce013);
    const powerBefore = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === aceId)?.power;

    engine.playCard(op07Moda014, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Moda's Ace choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), aceId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [aceId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === aceId)
        ?.power,
    ).toBe((powerBefore ?? 0) + 2000);

    engine.endTurn("south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === aceId)
        ?.power,
    ).toBe(powerBefore);
  });
});
