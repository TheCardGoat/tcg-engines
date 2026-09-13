import { describe, expect, test } from "vite-plus/test";
import {
  eb01Blueno017,
  eb01Doma005,
  eb01Fourtricks025,
  eb02Blueno047,
  op03Jerry084,
  op03RobLucci092,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-047 Blueno", () => {
  test("pays both trash costs before playing only an eligible included CP Character", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: eb02Blueno047, attachedDon: 2 }],
      hand: [eb01Doma005, eb01Fourtricks025],
      trash: [op03Jerry084, eb01Blueno017, op03RobLucci092, eb01Doma005],
    });
    const bluenoId = engine.findCardInZone("south", "character", eb02Blueno047);
    const handCostId = engine.findCardInZone("south", "hand", eb01Doma005);
    const legalId = engine.findCardInZone("south", "trash", op03Jerry084);
    const excludedNameId = engine.findCardInZone("south", "trash", eb01Blueno017);
    const tooExpensiveId = engine.findCardInZone("south", "trash", op03RobLucci092);
    const wrongTraitId = engine.findCardInZone("south", "trash", eb01Doma005);

    engine.activateEffect(bluenoId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const handCost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(handCost?.kind).toBe("payCost");
    if (handCost?.kind !== "payCost") throw new Error("Expected Blueno's hand-trash cost.");
    expect(handCost.candidates).toHaveLength(2);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [handCostId] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Blueno's CP play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([legalId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedNameId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [legalId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([bluenoId, handCostId]),
    );
    expect(view.players.south.characters.some((card) => card?.instanceId === legalId)).toBe(true);
    expect(engine.getState().cards[bluenoId]?.attachedDon).toBe(0);
    expect(view.players.south.restedDon).toBe(2);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: eb02Blueno047, attachedDon: 2 }],
      hand: [eb01Doma005, eb01Fourtricks025],
      trash: [op03Jerry084, eb01Blueno017, op03RobLucci092, eb01Doma005],
    });
    const bluenoId = engine.findCardInZone("south", "character", eb02Blueno047);
    engine.activateEffect(bluenoId, "activateMain", "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
