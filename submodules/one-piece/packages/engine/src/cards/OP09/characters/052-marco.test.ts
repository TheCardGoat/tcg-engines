import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import { eb01Doma005, eb01MountainGod018, op09Marco052 } from "@tcg/op-cards";

import { registerCards } from "../../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../index.ts";

const koMarcoByEffect: EventCard = {
  id: "TEST-OP09-052-KO-BY-EFFECT",
  canonicalId: "TEST-OP09-052-KO-BY-EFFECT",
  slug: "test-op09-052-ko-by-effect",
  name: "K.O. Marco by Effect",
  printings: [],
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "TEST",
  cost: 0,
  traits: [],
  effect: "[Main] K.O. up to 1 of your opponent's Characters.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
          },
        ],
      },
    ],
  },
  i18n: { en: { name: "K.O. Marco by Effect" } },
};

registerCards([koMarcoByEffect]);

describe("OP09-052 Marco", () => {
  test("on the opponent's turn may trash one physical hand card to replay itself rested after an effect K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op09Marco052], hand: [eb01Doma005, eb01MountainGod018] },
      { hand: [koMarcoByEffect] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const marcoId = engine.findCardInZone("south", "character", op09Marco052);
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(koMarcoByEffect, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [marcoId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const payment = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected Marco's hand payment.");
    expect(payment).toMatchObject({ min: 1, max: 1 });
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toContain(paymentId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === marcoId),
    ).toMatchObject({ rested: true });
    expect(view.prompts).toHaveLength(0);
  });

  test("does not trigger when K.O.'d in battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op09Marco052, rested: true }] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const marcoId = engine.findCardInZone("south", "character", op09Marco052);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, marcoId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(marcoId);
    expect(view.prompts).toHaveLength(0);
  });
});
