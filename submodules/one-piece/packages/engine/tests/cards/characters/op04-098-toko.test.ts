import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Komachiyo010,
  op01KurozumiOrochi098,
  op04KouzukiHiyori103,
  op04Toko098,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-098 Toko", () => {
  test("trashes two included Land of Wano hand cards before adding the deck top to Life", () => {
    const engine = OnePieceTestEngine.create({
      hand: [
        op04Toko098,
        op01Komachiyo010,
        op01KurozumiOrochi098,
        op04KouzukiHiyori103,
        eb01Doma005,
      ],
      life: [eb01Fourtricks025],
      deck: [eb01MountainGod018, eb01Doma005],
      activeDon: op04Toko098.cost,
    });
    const firstPaymentId = engine.findCardInZone("south", "hand", op01Komachiyo010);
    const secondPaymentId = engine.findCardInZone("south", "hand", op01KurozumiOrochi098);
    const thirdEligibleId = engine.findCardInZone("south", "hand", op04KouzukiHiyori103);
    const ineligibleId = engine.findCardInZone("south", "hand", eb01Doma005);
    const deckTopId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op04Toko098, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Toko's hand-trash cost.");
    expect(cost).toMatchObject({ min: 2, max: 2 });
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([firstPaymentId, secondPaymentId, thirdEligibleId]),
    );
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    engine.resolveDecision(
      "effectCostTrashFromHand",
      { selectedIds: [firstPaymentId, secondPaymentId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstPaymentId, secondPaymentId]),
    );
    expect(engine.getState().players.south.life[0]).toBe(deckTopId);
    expect(view.players.south.lifeCount).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay the printed cost above one Life without adding a Life card", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04Toko098, op01Komachiyo010, op01KurozumiOrochi098],
      life: [eb01Fourtricks025, eb01Doma005],
      deck: [eb01MountainGod018, eb01Doma005],
      activeDon: op04Toko098.cost,
    });
    const firstPaymentId = engine.findCardInZone("south", "hand", op01Komachiyo010);
    const secondPaymentId = engine.findCardInZone("south", "hand", op01KurozumiOrochi098);
    const deckTopId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op04Toko098, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstPaymentId, secondPaymentId]),
    );
    expect(view.players.south.lifeCount).toBe(2);
    expect(engine.getState().players.south.deck[0]).toBe(deckTopId);
    expect(view.prompts).toHaveLength(0);
  });
});
