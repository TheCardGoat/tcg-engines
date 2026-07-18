import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op01RoronoaZoro025,
  op05Hotori111,
  op05Kotori103,
  op05Yama113,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-111 Hotori", () => {
  test("may decline without playing Kotori or moving an opposing Character to Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op05Hotori111, op05Kotori103],
        activeDon: op05Hotori111.cost,
      },
      { character: [op05Yama113] },
    );
    const kotoriId = engine.findCardInZone("south", "hand", op05Kotori103);
    const targetId = engine.findCardInZone("north", "character", op05Yama113);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.playCard(op05Hotori111, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(kotoriId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
  });

  test("resolves Hotori and the played Kotori's On Play effects in order", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op05Hotori111, op05Kotori103], activeDon: op05Hotori111.cost },
      { character: [eb01Doma005, op01RoronoaZoro025] },
    );
    const lifeTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const koTargetId = engine.findCardInZone("north", "character", op01RoronoaZoro025);

    engine.playCard(op05Hotori111, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const afterPayment = engine.getView("south");
    expect(afterPayment.players.south.handCount).toBe(0);
    expect(afterPayment.players.south.characters.map((card) => card?.cardId)).toContain(
      op05Kotori103.id,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lifeTargetId] }, "south");
    engine.resolveDecision("effectLifePosition", { optionId: "bottom" }, "south");

    const kotoriTarget = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (kotoriTarget?.kind !== "selectEntity") throw new Error("Expected Kotori's K.O. target.");
    expect(kotoriTarget.candidates.map((candidate) => candidate.ref.id)).toEqual([koTargetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [koTargetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.life.map((card) => card.instanceId)).toContain(lifeTargetId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(koTargetId);
    expect(view.prompts).toHaveLength(0);
  });
});
