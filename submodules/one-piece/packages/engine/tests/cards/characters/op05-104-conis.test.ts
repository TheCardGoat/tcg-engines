import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op05Conis104, op05MaryGeoise097, op05UpperYard117 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-104 Conis", () => {
  test("places a chosen Stage at the bottom of the deck before drawing and trashing", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05Conis104, op05UpperYard117],
      deck: [eb01Doma005, eb01Doma005],
      stage: op05MaryGeoise097,
      activeDon: op05Conis104.cost,
    });
    const stageId = engine.findCardInZone("south", "stage", op05MaryGeoise097);
    const discardId = engine.findCardInZone("south", "hand", op05UpperYard117);

    engine.playCard(op05Conis104, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.stage).toBeNull();
    // Deck identities are hidden from player projections; this is the narrow movement boundary.
    expect(engine.getState().players.south.deck).toContain(stageId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05Conis104, op05UpperYard117],
      deck: [eb01Doma005, eb01Doma005],
      stage: op05MaryGeoise097,
      activeDon: op05Conis104.cost,
    });
    engine.playCard(op05Conis104, "south");
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
