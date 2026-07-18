import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb02Sogeking024,
  op03UsoppSPirateCrew042,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-024 Sogeking", () => {
  test("draws, bottoms an ordered hand choice, then returns a cost-1 Character from either field", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb02Sogeking024, eb01Fourtricks025],
        character: [eb01Doma005],
        deck: [eb01Doma005, eb01MountainGod018, eb01Fourtricks025],
        activeDon: 4,
      },
      { character: [op03UsoppSPirateCrew042] },
    );
    const existingHandId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const firstDrawId = engine.findCardInZone("south", "deck", eb01Doma005);
    const ownTargetId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingTargetId = engine.findCardInZone("north", "character", op03UsoppSPirateCrew042);

    engine.playCard(eb02Sogeking024, "south");
    const bottom = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(bottom?.kind).toBe("selectEntity");
    if (bottom?.kind !== "selectEntity") throw new Error("Expected Sogeking's hand-bottom choice.");
    expect(bottom.candidates.map((candidate) => candidate.ref.id)).toContain(firstDrawId);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [firstDrawId, existingHandId] },
      "south",
    );

    const returned = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(returned?.kind).toBe("selectEntity");
    if (returned?.kind !== "selectEntity") throw new Error("Expected Sogeking's return choice.");
    expect(returned.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownTargetId, opposingTargetId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingTargetId] }, "south");

    expect(engine.getState().players.south.deck.slice(-2)).toEqual([firstDrawId, existingHandId]);
    expect(engine.getState().players.north.hand).toContain(opposingTargetId);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("is eligible as Usopp while in trash", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03UsoppSPirateCrew042],
      trash: [eb02Sogeking024],
      activeDon: 1,
    });
    const sogekingId = engine.findCardInZone("south", "trash", eb02Sogeking024);

    engine.playCard(op03UsoppSPirateCrew042, "south");
    const returnChoice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(returnChoice?.kind).toBe("selectEntity");
    if (returnChoice?.kind !== "selectEntity") throw new Error("Expected the Usopp trash choice.");
    expect(returnChoice.candidates.map((candidate) => candidate.ref.id)).toEqual([sogekingId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [sogekingId] }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      sogekingId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
