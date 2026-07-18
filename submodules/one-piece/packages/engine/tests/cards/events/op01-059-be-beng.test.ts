import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01BeBeng059,
  op01Komachiyo010,
  op01Okiku035,
  op01Otama006,
  op01Otsuru036,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-059 BE-BENG!!", () => {
  test("trashes a chosen Land of Wano hand card before reactivating an eligible Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01BeBeng059, op01Otama006, op01Komachiyo010, eb01Doma005],
      character: [
        { card: op01Okiku035, rested: true },
        { card: op01Otsuru036, rested: true },
        { card: eb01MountainGod018, rested: true },
        { card: eb01Doma005, rested: true },
      ],
      activeDon: 3,
    });
    const eventId = engine.findCardInZone("south", "hand", op01BeBeng059);
    const paymentId = engine.findCardInZone("south", "hand", op01Otama006);
    const otherPaymentId = engine.findCardInZone("south", "hand", op01Komachiyo010);
    const ineligibleHandId = engine.findCardInZone("south", "hand", eb01Doma005);
    const eligibleId = engine.findCardInZone("south", "character", op01Okiku035);
    const otherEligibleId = engine.findCardInZone("south", "character", op01Otsuru036);
    const costlyId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const wrongTraitId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(op01BeBeng059);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const costDecision = engine.pendingDecision("effectCostTrashFromHand", "south");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected the controller to choose a Land of Wano hand cost.");
    }
    expect(costStep).toMatchObject({ min: 1, max: 1 });
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      paymentId,
      otherPaymentId,
    ]);
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      ineligibleHandId,
    );
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to choose the Character to set active.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      eligibleId,
      otherEligibleId,
    ]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(costlyId);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(false);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === otherEligibleId)?.rested,
    ).toBe(true);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([
      otherPaymentId,
      ineligibleHandId,
    ]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eventId, paymentId]),
    );
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 3 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
