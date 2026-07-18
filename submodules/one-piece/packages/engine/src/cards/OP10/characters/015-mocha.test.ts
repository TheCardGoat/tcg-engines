import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op10Mocha015 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-015 Mocha", () => {
  test("gives an opposing Character −1000 during this turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op10Mocha015], activeDon: op10Mocha015.cost },
      { character: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const powerBefore = engine
      .getView("south")
      .players.north.characters.find((card) => card?.instanceId === targetId)?.power;
    if (powerBefore === null || powerBefore === undefined)
      throw new Error("Expected target power.");

    engine.playCard(op10Mocha015, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Mocha's power target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(powerBefore - 1000);
    engine.endTurn("south");
    expect(
      engine.getView("north").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(powerBefore);
  });
});
