import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op02Koby098,
  op04Gyats080,
  op04Ideo077,
  op04Sabo083,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-083 Sabo", () => {
  test("draws two, trashes two, and protects all own Characters from effect K.O. until next turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op04Sabo083],
        character: [op04Ideo077],
        deck: [eb01Doma005, eb01Fourtricks025, op04Gyats080, op04Ideo077],
        activeDon: op04Sabo083.cost,
      },
      {
        hand: [op02Koby098, op02Koby098, eb01Doma005, eb01Fourtricks025],
        activeDon: 6,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const protectedId = engine.findCardInZone("south", "character", op04Ideo077);
    const trashedDrawIds = engine.getState().players.south.deck.slice(0, 2);
    const firstDiscardId = engine.findCardInZone("north", "hand", eb01Doma005);
    const secondDiscardId = engine.findCardInZone("north", "hand", eb01Fourtricks025);

    engine.playCard(op04Sabo083, "south");
    const saboId = engine.findCardInZone("south", "character", op04Sabo083);
    expect(engine.getView("south").players.south.hand).toHaveLength(0);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(trashedDrawIds),
    );

    engine.endTurn("south");
    engine.playCard(op02Koby098, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [firstDiscardId] }, "north");
    const protectedTarget = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(protectedTarget).toMatchObject({ kind: "selectEntity", min: 0, max: 0 });
    if (protectedTarget?.kind !== "selectEntity") {
      throw new Error("Expected Koby's filtered target choice.");
    }
    expect(protectedTarget.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      protectedId,
    );
    expect(protectedTarget.candidates).toHaveLength(0);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");
    let view = engine.getView("south");
    expect(view.prompts).toHaveLength(0);
    expect(view.players.south.characters.some((card) => card?.instanceId === protectedId)).toBe(
      true,
    );
    expect(view.players.south.characters.some((card) => card?.instanceId === saboId)).toBe(true);

    engine.endTurn("north");
    engine.endTurn("south");
    engine.playCard(op02Koby098, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [secondDiscardId] }, "north");
    const expiredProtectionTarget = engine.pendingDecision("effectTargetSelection", "north")
      .steps[0];
    expect(expiredProtectionTarget?.kind).toBe("selectEntity");
    if (expiredProtectionTarget?.kind !== "selectEntity") {
      throw new Error("Expected Koby's target after Sabo's protection expired.");
    }
    expect(expiredProtectionTarget.candidates.map((candidate) => candidate.ref.id)).toContain(
      protectedId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [protectedId] }, "north");

    view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(protectedId);
    expect(view.prompts).toHaveLength(0);
  });

  test("uses Blocker through the public battle decision", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Sabo083] },
      { character: [{ card: op04Ideo077, attachedDon: 5, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const saboId = engine.findCardInZone("south", "character", op04Sabo083);
    const attackerId = engine.findCardInZone("north", "character", op04Ideo077);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [saboId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(saboId);
    expect(view.prompts).toHaveLength(0);
  });
});
