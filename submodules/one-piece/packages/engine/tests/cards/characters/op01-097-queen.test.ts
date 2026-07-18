import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01Queen097 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-097 Queen", () => {
  test("returns one DON!!, gains Rush, and gives an opposing Character -2000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01Queen097],
        activeDon: op01Queen097.cost + 1,
      },
      { character: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op01Queen097, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Queen's power target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const queenId = engine.findCardInZone("south", "character", op01Queen097);
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(5000);
    engine.declareAttack(queenId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.south.characters.find((card) => card?.instanceId === queenId)?.rested).toBe(
      true,
    );

    engine.endTurn("south");
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(eb01MountainGod018.power);
  });
});
