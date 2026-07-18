import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025 } from "@tcg/op-cards";
import type { CharacterCard } from "@tcg/op-types";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const variableReturnDonCard: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-VARIABLE-RETURN-DON",
  canonicalId: "TEST-VARIABLE-RETURN-DON",
  name: "Variable Return DON Test",
  cost: 1,
  effects: {
    effects: [
      {
        trigger: "onPlay",
        optional: true,
        costs: [{ cost: "returnDon", minimumAmount: 1 }],
        actions: [{ action: "draw", player: "self", amount: 1 }],
      },
    ],
  },
};

const exactReturnDonCard: CharacterCard = {
  ...variableReturnDonCard,
  id: "TEST-EXACT-RETURN-DON",
  canonicalId: "TEST-EXACT-RETURN-DON",
  name: "Exact Return DON Test",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        optional: true,
        costs: [{ cost: "returnDon", amount: 2 }],
        actions: [{ action: "draw", player: "self", amount: 1 }],
      },
    ],
  },
};

registerCards([variableReturnDonCard, exactReturnDonCard]);

describe("return-DON!! cost bounds", () => {
  test("allows any selected count from the printed minimum through all available DON!!", () => {
    const engine = OnePieceTestEngine.create({
      hand: [variableReturnDonCard],
      deck: [eb01Doma005, eb01Fourtricks025],
      activeDon: 3,
    });
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(variableReturnDonCard, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(payment).toMatchObject({ kind: "payCost", min: 1, max: 3 });
    if (payment?.kind !== "payCost") throw new Error("Expected a variable DON!! payment.");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: payment.candidates.slice(0, 2).map((candidate) => candidate.ref.id) },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 2);
    expect(view.players.south.activeDon + view.players.south.restedDon).toBe(1);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.prompts).toHaveLength(0);
  });

  test("retains exact minimum and maximum bounds for fixed return costs", () => {
    const engine = OnePieceTestEngine.create({
      hand: [exactReturnDonCard],
      deck: [eb01Doma005, eb01Fourtricks025],
      activeDon: 3,
    });

    engine.playCard(exactReturnDonCard, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(payment).toMatchObject({ kind: "payCost", min: 2, max: 2 });
  });
});
