import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op07JewelryBonney019 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-019 Jewelry Bonney", () => {
  test("offers the optional response, pays one DON!!, and maps the opposing rest target", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      { leaderCardId: op07JewelryBonney019, activeDon: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const restTargetId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");

    const optional = engine.pendingDecision("effectOptional", "north").steps[0];
    expect(optional?.kind).toBe("confirm");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity")
      throw new Error("Expected Bonney's opposing target choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), restTargetId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [restTargetId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(
      view.players.south.characters.find((card) => card?.instanceId === restTargetId)?.rested,
    ).toBe(true);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
