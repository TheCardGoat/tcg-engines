import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01IWantToLive050, op13Higuma013 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-050 ...I Want to Live!!", () => {
  test("reaches 30 trash with its Counter payment and privately adds the top deck card to top Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01Doma005, playedOnTurn: 0 }],
      },
      {
        hand: [eb01IWantToLive050],
        deck: [op13Higuma013, eb01Fourtricks025],
        trash: 29,
        activeDon: 3,
        life: 4,
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const eventId = engine.findCardInZone("north", "hand", eb01IWantToLive050);

    engine.endTurn("south");
    engine.endTurn("north");
    const topDeckId = engine.getState().players.north.deck[0]!;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    const beforeCounter = engine.getView("north").players.north;
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const lifeDecision = engine.pendingDecision("effectAddToLifeFromDeck", "north");
    const lifeStep = lifeDecision.steps[0];
    expect(lifeDecision.actorId).toBe("north");
    expect(lifeStep?.kind).toBe("chooseOption");
    if (lifeStep?.kind !== "chooseOption") {
      throw new Error("Expected the defender to receive an optional Life count choice.");
    }
    expect(lifeStep.options.map((option) => option.id)).toEqual(["0", "1"]);
    expect(JSON.stringify(engine.getView("south").decisions)).not.toContain(eb01Fourtricks025.name);

    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "north");

    const view = engine.getView("north");
    expect(engine.getState().players.north.life[0]).toBe(topDeckId);
    expect(view.players.north.lifeCount).toBe(beforeCounter.lifeCount + 1);
    expect(view.players.north.deckCount).toBe(beforeCounter.deckCount - 1);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.north).toMatchObject({
      activeDon: beforeCounter.activeDon - 3,
      restedDon: beforeCounter.restedDon + 3,
    });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may be played from 28 trash but remains below 30 after the Event enters trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01Doma005, playedOnTurn: 0 }],
      },
      {
        hand: [eb01IWantToLive050],
        trash: 28,
        activeDon: 3,
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const eventId = engine.findCardInZone("north", "hand", eb01IWantToLive050);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    const beforeCounter = engine.getView("north").players.north;

    const counterDecision = engine.pendingDecision("battleCounter", "north");
    const counterStep = counterDecision.steps[0];
    expect(counterStep?.kind).toBe("selectEntity");
    if (counterStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to receive the normal Counter choice.");
    }
    expect(counterStep.candidates.map((candidate) => candidate.ref.id)).toContain(eventId);
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(beforeCounter.lifeCount);
    expect(view.players.north.deckCount).toBe(beforeCounter.deckCount);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.north).toMatchObject({
      activeDon: beforeCounter.activeDon - 3,
      restedDon: beforeCounter.restedDon + 3,
    });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
