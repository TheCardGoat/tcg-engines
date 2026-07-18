import { describe, expect, test } from "vite-plus/test";
import {
  eb01Chambres020,
  eb01Doma005,
  op03MarshallDTeach012,
  op03Namule007,
  op08MobyDick056,
  op01TrafalgarLaw002,
  op13Higuma013,
  op13Otama043,
  op13WindmillVillage022,
  op13York094,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-056 Moby Dick", () => {
  test("observes a Whitebeard Pirates Character trashed as an effect cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        stage: op08MobyDick056,
        character: [
          { card: op03MarshallDTeach012, playedOnTurn: 0 },
          { card: op03Namule007, playedOnTurn: 0 },
        ],
        hand: [op13Otama043],
        deck: [op13Higuma013, op13WindmillVillage022],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const teachId = engine.findCardInZone("south", "character", op03MarshallDTeach012);
    const namuleId = engine.findCardInZone("south", "character", op03Namule007);

    engine.declareAttack(teachId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostTrashCharacter", "south").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected Teach's Character trash cost.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toContain(namuleId);
    engine.resolveDecision("effectCostTrashCharacter", { selectedIds: [namuleId] }, "south");

    const handDecision = engine.pendingDecision("effectTargetSelection", "south");
    expect(handDecision.actorId).toBe("south");
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      namuleId,
    );
    expect(engine.getView("south").players.south.handCount).toBe(3);
  });

  test("draws once when a Whitebeard Pirates Character leaves by an effect and executes the top-or-bottom choice", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01TrafalgarLaw002,
      stage: op08MobyDick056,
      character: [eb01Doma005, eb01Doma005],
      hand: [eb01Chambres020, eb01Chambres020, op13Otama043, op13York094],
      deck: [op13Higuma013, op13WindmillVillage022],
      activeDon: 2,
    });
    const firstDomaId = engine.findCardInZone("south", "character", eb01Doma005);
    const keptHandId = engine.findCardInZone("south", "hand", op13Otama043);
    const returnedHandId = engine.findCardInZone("south", "hand", op13York094);
    const drawnId = engine.findCardInZone("south", "deck", op13Higuma013);
    const untouchedDeckId = engine.findCardInZone("south", "deck", op13WindmillVillage022);

    engine.playCard(eb01Chambres020);

    const removalDecision = engine.pendingDecision("effectTargetSelection", "south");
    const removalStep = removalDecision.steps[0];
    expect(removalDecision.actorId).toBe("south");
    expect(removalStep?.kind).toBe("selectEntity");
    if (removalStep?.kind !== "selectEntity") {
      throw new Error("Expected Chambres to publish its Character selection.");
    }
    expect(removalStep.candidates).toHaveLength(2);

    engine.resolveDecision("effectTargetSelection", { selectedIds: [firstDomaId] }, "south");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");

    const handDecision = engine.pendingDecision("effectTargetSelection", "south");
    const handStep = handDecision.steps[0];
    expect(handDecision.actorId).toBe("south");
    expect(handStep?.kind).toBe("selectEntity");
    if (handStep?.kind !== "selectEntity") {
      throw new Error("Expected Moby Dick to publish its hand-card selection.");
    }
    expect(handStep).toMatchObject({ min: 1, max: 1 });
    expect(handStep.candidates.map((candidate) => candidate.ref.id)).toContain(drawnId);

    engine.resolveDecision("effectTargetSelection", { selectedIds: [drawnId] }, "south");

    const positionDecision = engine.pendingDecision("effectDeckPosition", "south");
    const positionStep = positionDecision.steps[0];
    expect(positionDecision.actorId).toBe("south");
    expect(positionStep?.kind).toBe("chooseOption");
    if (positionStep?.kind !== "chooseOption") {
      throw new Error("Expected Moby Dick to publish its deck-position choice.");
    }
    expect(positionStep.options.map((option) => option.id)).toEqual(["top", "bottom"]);

    engine.resolveDecision("effectDeckPosition", { optionId: "bottom" }, "south");

    let view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(firstDomaId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(keptHandId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(returnedHandId);
    expect(engine.getState().players.south.deck).toEqual([untouchedDeckId, drawnId]);

    const secondDomaId = engine.findCardInZone("south", "character", eb01Doma005);
    engine.playCard(eb01Chambres020);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");

    view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(secondDomaId);
    expect(engine.getState().players.south.deck).toEqual([untouchedDeckId, drawnId]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("lets the defending player use its Life Trigger to play it without paying DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op13Higuma013, playedOnTurn: 0 }],
        activeDon: 3,
      },
      {
        life: [op08MobyDick056],
      },
    );
    const attackerId = engine.findCardInZone("south", "character", op13Higuma013);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.attachDon(attackerId, 3, "south");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const triggerDecision = engine.pendingDecision("lifeTrigger", "north");
    expect(triggerDecision).toMatchObject({
      actorId: "north",
      kind: "confirm",
      submit: { commandType: "resolvePrompt", promptId: triggerDecision.id },
    });
    const activeDonBeforeTrigger = engine.getView("north").players.north.activeDon;

    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.stage?.cardId).toBe(op08MobyDick056.id);
    expect(view.players.north.activeDon).toBe(activeDonBeforeTrigger);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
