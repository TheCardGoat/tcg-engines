import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01Crocodile067,
  op02Minotaur087,
  op05Enel098,
  op03IkokuSovereignty118,
  op13WindmillVillage022,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-098 Enel", () => {
  test.each([1, 2])(
    "Enel checks Life at removal before Ikoku resolves, starting with %s Life",
    (initialLife) => {
      let engine = OnePieceTestEngine.create(
        { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
        {
          leaderCardId: op05Enel098,
          life:
            initialLife === 1 ? [op03IkokuSovereignty118] : [op03IkokuSovereignty118, eb01Doma005],
          hand: [eb01Doma005, eb01Doma005],
          deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
        },
        { firstPlayer: "north", activeSeat: "south" },
      );
      engine.declareAttack(
        engine.findCardInZone("south", "character", eb01MountainGod018),
        engine.leader("north"),
        "south",
      );
      engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
      engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "north");
      expect(engine.getView("north").players.north).toMatchObject({
        lifeCount: 2,
        handCount: 0,
        deckCount: initialLife === 1 ? 1 : 2,
      });
      expect(engine.getView("north").prompts).toHaveLength(0);
    },
  );

  test("preserves the current non-Trigger Double Attack scheduling", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02Minotaur087, attachedDon: 1, playedOnTurn: 0 }] },
      {
        leaderCardId: op05Enel098,
        life: [eb01Doma005],
        deck: [eb01MountainGod018, eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.declareAttack(
      engine.findCardInZone("south", "character", op02Minotaur087),
      engine.leader("north"),
      "south",
    );
    const view = engine.getView("north");
    expect(view.players.north).toMatchObject({ lifeCount: 1, handCount: 0, deckCount: 2 });
    expect(engine.findCardInZone("north", "life", eb01MountainGod018)).toBeDefined();
    expect(view.players.north.trash[0]?.cardId).toBe(eb01Doma005.id);
    expect(view.prompts).toHaveLength(0);
  });

  test("rebuilds zero Life once on the opponent's turn, then maps the hand-trash choice", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op01Crocodile067, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      {
        leaderCardId: op05Enel098,
        hand: [op13WindmillVillage022, op13WindmillVillage022],
        deck: [eb01Doma005, eb01MountainGod018],
        life: [op13WindmillVillage022],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const rebuiltLifeId = engine.findCardInZone("north", "deck", eb01Doma005);
    const paymentId = engine.findCardInZone("north", "hand", op13WindmillVillage022);

    engine.declareAttack(
      engine.findCardInZone("south", "character", op01Crocodile067),
      engine.leader("north"),
      "south",
    );

    const payment = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    expect(payment?.kind).toBe("selectEntity");
    if (payment?.kind !== "selectEntity") {
      throw new Error("Expected Enel's controller to choose the mandatory hand trash.");
    }
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toContain(paymentId);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [paymentId] }, "north");

    expect(engine.findCardInZone("north", "life", eb01Doma005)).toBe(rebuiltLifeId);
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      paymentId,
    );

    engine.declareAttack(
      engine.findCardInZone("south", "character", eb01MountainGod018),
      engine.leader("north"),
      "south",
    );

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(0);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
