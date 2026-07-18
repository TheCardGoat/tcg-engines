import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Laboon047, eb01MountainGod018 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-047 Laboon", () => {
  test("draws then maps a discard when Laboon itself is K.O.'d in battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        character: [{ card: eb01Laboon047, rested: true }],
        hand: [eb01Doma005],
        deck: [eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const laboonId = engine.findCardInZone("north", "character", eb01Laboon047);

    engine.declareAttack(attackerId, laboonId, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const discard = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    expect(discard?.kind).toBe("selectEntity");
    if (discard?.kind !== "selectEntity") {
      throw new Error("Expected Laboon's controller to choose the post-draw discard.");
    }
    expect(discard.candidates).toHaveLength(2);
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [discard.candidates[0]!.ref.id] },
      "north",
    );

    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      laboonId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
