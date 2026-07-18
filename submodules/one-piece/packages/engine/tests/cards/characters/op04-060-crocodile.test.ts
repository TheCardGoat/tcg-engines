import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Crocodile062,
  op04Crocodile060,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function acceptReturnDon(engine: OnePieceTestEngine, amount: number, seat: "south" | "north") {
  engine.resolveDecision("effectOptional", { optionId: "yes" }, seat);
  const hasPaymentPrompt = engine
    .getState()
    .promptQueue.some(
      (prompt) =>
        prompt.status === "pending" && prompt.resolutionContext?.intent === "effectCostReturnDon",
    );
  if (hasPaymentPrompt) {
    const payment = engine.pendingDecision("effectCostReturnDon", seat).steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected Crocodile's DON!! payment.");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: payment.candidates.slice(0, amount).map((candidate) => candidate.ref.id) },
      seat,
    );
  }
}

describe("OP04-060 Crocodile", () => {
  test("may return 2 DON!! on play before adding the deck top to Life", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01Crocodile062,
      hand: [op04Crocodile060],
      deck: [eb01Doma005, eb01Fourtricks025],
      activeDon: 10,
    });
    const deckTopId = engine.getState().players.south.deck[0]!;
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op04Crocodile060, "south");
    acceptReturnDon(engine, 2, "south");
    const addLife = engine.pendingDecision("effectAddToLifeFromDeck", "south").steps[0];
    expect(addLife?.kind).toBe("chooseOption");
    if (addLife?.kind !== "chooseOption") throw new Error("Expected Crocodile's Life choice.");
    expect(addLife.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    expect(engine.getState().players.south.life[0]).toBe(deckTopId);
    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 0,
      donDeckCount: donDeckBefore + 2,
      lifeCount: lifeBefore + 1,
      deckCount: 1,
    });
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline the On Play DON!! cost", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01Crocodile062,
      hand: [op04Crocodile060],
      deck: [eb01Doma005],
      activeDon: 10,
    });
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;
    engine.playCard(op04Crocodile060, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 2,
      donDeckCount: donDeckBefore,
      lifeCount: lifeBefore,
    });
  });

  test("may pay the On Play cost with another Leader but adds no Life", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04Crocodile060],
      deck: [eb01Doma005],
      activeDon: 10,
    });
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;
    engine.playCard(op04Crocodile060, "south");
    acceptReturnDon(engine, 2, "south");

    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 0,
      donDeckCount: donDeckBefore + 2,
      lifeCount: lifeBefore,
      deckCount: 1,
    });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("on an opponent's attack draws before trashing and activates only once", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op04Crocodile060],
        hand: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01MountainGod018, eb01Doma005],
        activeDon: 2,
      },
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const firstAttacker = engine.findCardInZone("north", "character", eb01Doma005);
    const secondAttacker = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const drawnId = engine.getState().players.south.deck[0]!;

    engine.declareAttack(firstAttacker, engine.leader("south"), "north");
    acceptReturnDon(engine, 1, "south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected Crocodile's hand trash.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toContain(drawnId);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [drawnId] }, "south");

    expect(engine.getView("south").players.south).toMatchObject({ handCount: 2, deckCount: 1 });
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      drawnId,
    );

    engine.declareAttack(secondAttacker, engine.leader("south"), "north");
    expect(
      engine
        .getState()
        .promptQueue.some(
          (prompt) =>
            prompt.status === "pending" && prompt.resolutionContext?.intent === "effectOptional",
        ),
    ).toBe(false);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline the opponent-attack effect without changing hand or DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op04Crocodile060],
        hand: [eb01Doma005],
        deck: [eb01Fourtricks025],
        activeDon: 2,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 2,
      handCount: 1,
      deckCount: 1,
    });
    expect(
      engine
        .getState()
        .promptQueue.some(
          (prompt) =>
            prompt.status === "pending" && prompt.resolutionContext?.intent === "effectOptional",
        ),
    ).toBe(false);
  });

  test("does not offer the opponent-attack effect without a DON!! card to return", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op04Crocodile060],
        deck: [eb01Fourtricks025],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");

    expect(engine.getView("south").players.south).toMatchObject({
      lifeCount: lifeBefore - 1,
      handCount: 1,
      deckCount: 1,
    });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
