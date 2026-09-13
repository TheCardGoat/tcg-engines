import { describe, expect, test } from "vite-plus/test";
import {
  eb01ArmyWolves032,
  eb01Doma005,
  eb01Hannyabal021,
  eb01PrinceBellett026,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

/**
 * EB01-021 Hannyabal Leader: [End of Your Turn] You may return 1 Impel Down
 * Character with cost ≥2 to hand → add up to 1 active DON!! from the DON!! deck.
 */
describe("EB01-021 Hannyabal", () => {
  test("returns an eligible Impel Down Character before adding active DON at end of turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: eb01Hannyabal021,
      character: [eb01PrinceBellett026, eb01ArmyWolves032, eb01Doma005],
      donDeckCount: 4,
    });
    const paymentId = engine.findCardInZone("south", "character", eb01PrinceBellett026);
    const otherEligibleId = engine.findCardInZone("south", "character", eb01ArmyWolves032);
    const excludedId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.endTurn("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostReturnCharacter", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") {
      throw new Error("Expected the filtered Character-return payment choice.");
    }
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([
      paymentId,
      otherEligibleId,
    ]);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectCostReturnCharacter", { selectedIds: [paymentId] }, "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south").players.south;
    expect(view.hand.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.characters.some((card) => card?.instanceId === excludedId)).toBe(true);
    expect(view.activeDon).toBe(1);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline end-of-turn so Impel Down stays and no DON!! is added", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: eb01Hannyabal021,
      // Eligible Impel Down (cost ≥2) so the optional is offered.
      character: [eb01PrinceBellett026, eb01Doma005],
      donDeckCount: 4,
    });
    const paymentId = engine.findCardInZone("south", "character", eb01PrinceBellett026);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;
    const activeDonBefore = engine.getView("south").players.south.activeDon;

    engine.endTurn("south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south").players.south;
    // Character not returned; no DON!! from the deck.
    expect(view.characters.some((card) => card?.instanceId === paymentId)).toBe(true);
    expect(view.hand.map((card) => card.instanceId)).not.toContain(paymentId);
    expect(view.donDeckCount).toBe(donDeckBefore);
    expect(view.activeDon).toBe(activeDonBefore);
  });
});
