import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op01Caribou007 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-007 Caribou", () => {
  test("after battle K.O., K.O.s only an opponent Character with 4000 power or less", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op01Caribou007, rested: true, playedOnTurn: 0 }] },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const caribouId = engine.findCardInZone("south", "character", op01Caribou007);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, caribouId, "north");

    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(ko?.kind).toBe("selectEntity");
    if (ko?.kind !== "selectEntity") throw new Error("Expected Caribou's On K.O. target.");
    expect(ko.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(ko.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(caribouId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });
});
