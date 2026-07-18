import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01JustShutUpAndComeWithUs009,
  eb01LittleoarsJr008,
  eb01MiniMerry011,
  op08BurnBlade117,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-008 LittleOars Jr.", () => {
  test("maps Event-or-Stage payment when replacing an effect K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01JustShutUpAndComeWithUs009, eb01MiniMerry011, eb01Doma005],
        character: [eb01LittleoarsJr008],
      },
      {
        hand: [op08BurnBlade117],
        life: [eb01Doma005],
        activeDon: 5,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const littleOarsId = engine.findCardInZone("south", "character", eb01LittleoarsJr008);
    const eventId = engine.findCardInZone("south", "hand", eb01JustShutUpAndComeWithUs009);
    const stageId = engine.findCardInZone("south", "hand", eb01MiniMerry011);
    const characterId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op08BurnBlade117, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [littleOarsId] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");

    const payment = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(payment?.kind).toBe("selectEntity");
    if (payment?.kind !== "selectEntity") {
      throw new Error("Expected LittleOars Jr.'s replacement payment.");
    }
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual([eventId, stageId]);
    expect(payment.candidates.map((candidate) => candidate.ref.id)).not.toContain(characterId);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [stageId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === littleOarsId)).toBe(
      true,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(stageId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eventId, characterId]),
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("does not offer the effect-only replacement for a battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01MiniMerry011],
        character: [{ card: eb01LittleoarsJr008, rested: true }],
      },
      {
        character: [{ card: eb01LittleoarsJr008, playedOnTurn: 0 }],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const targetId = engine.findCardInZone("south", "character", eb01LittleoarsJr008);
    const attackerId = engine.findCardInZone("north", "character", eb01LittleoarsJr008);

    engine.declareAttack(attackerId, targetId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
