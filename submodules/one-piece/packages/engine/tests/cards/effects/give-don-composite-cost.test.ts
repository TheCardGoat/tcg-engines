import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import type { CharacterCard } from "@tcg/op-types";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const compositeGiveDonCostCard: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-GIVE-DON-COMPOSITE-COST",
  canonicalId: "TEST-GIVE-DON-COMPOSITE-COST",
  name: "Give DON Composite Cost Test",
  cost: 0,
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          { cost: "giveDon", amount: 1 },
          { cost: "trashFromHand", amount: 1 },
          { cost: "returnDon", amount: 1 },
        ],
        actions: [{ action: "draw", player: "self", amount: 1 }],
      },
    ],
  },
};

registerCards([compositeGiveDonCostCard]);

describe("give-DON!! composite activation costs", () => {
  test("retains the chosen recipient through later hand-trash and return-DON!! prompts", () => {
    const engine = OnePieceTestEngine.create({
      hand: [compositeGiveDonCostCard, eb01Doma005, eb01Fourtricks025],
      character: [eb01MountainGod018],
      deck: [eb01Doma005, eb01Fourtricks025],
      activeDon: 2,
      restedDon: 1,
    });
    const recipientId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(compositeGiveDonCostCard, "south");
    engine.resolveDecision("effectCostGiveDon", { selectedIds: [recipientId] }, "south");

    const trash = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(trash).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardedId] }, "south");

    const returnDon = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    if (returnDon?.kind !== "payCost") throw new Error("Expected the return-DON!! payment.");
    const restedDonId = returnDon.candidates.find((candidate) =>
      candidate.ref.id.startsWith("rested-don:"),
    )?.ref.id;
    if (!restedDonId) throw new Error("Expected a rested DON!! candidate.");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: [restedDonId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === recipientId)?.attachedDon,
    ).toBe(1);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south).toMatchObject({
      activeDon: 1,
      restedDon: 0,
      donDeckCount: donDeckBefore + 1,
    });
    expect(view.prompts).toHaveLength(0);
  });
});
