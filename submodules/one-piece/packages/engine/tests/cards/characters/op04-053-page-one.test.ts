import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02IceAge117,
  op02Seaquake021,
  op04BadMannersKickCourse016,
  op04PageOne053,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-053 Page One", () => {
  test("after your Main Event, draws before choosing a physical hand card for deck-bottom once per turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op02IceAge117, op02IceAge117, eb01MountainGod018],
        character: [op04PageOne053],
        deck: [eb01Doma005, eb01Fourtricks025, eb01Doma005],
        activeDon: 3,
      },
      { character: [eb01MountainGod018] },
    );
    const pageOneId = engine.findCardInZone("south", "character", op04PageOne053);
    const existingHandId = engine.findCardInZone("south", "hand", eb01MountainGod018);
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    const eventStart = engine.getState().eventHistory.length;
    const logSequenceBefore = engine.getState().logHistory.at(-1)?.sequence ?? 0;

    engine.attachDon(pageOneId, 1, "south");
    engine.playCard(op02IceAge117, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const returnDecision = engine.pendingDecision("effectTargetSelection", "south");
    expect(returnDecision.actorId).toBe("south");
    const returnStep = returnDecision.steps[0];
    expect(returnStep?.kind).toBe("selectEntity");
    if (returnStep?.kind !== "selectEntity")
      throw new Error("Expected Page One's hand-to-deck choice.");
    expect(returnStep).toMatchObject({ min: 1, max: 1 });
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([existingHandId, drawnId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [existingHandId] }, "south");

    // Deck order is hidden; raw state is the narrow physical-identity boundary.
    const state = engine.getState();
    expect(state.players.south.deck.at(-1)).toBe(existingHandId);
    expect(state.cards[existingHandId]).toMatchObject({
      zone: "deck",
      faceUp: false,
      publicKnowledge: false,
    });
    expect(state.cards[drawnId]).toMatchObject({
      zone: "hand",
      faceUp: false,
      publicKnowledge: false,
    });
    const returnEvent = engine
      .getState()
      .eventHistory.slice(eventStart)
      .find(
        (event) =>
          event.type === "cardMoved" &&
          event.sourceInstanceId === existingHandId &&
          event.payload.fromZone === "hand" &&
          event.payload.toZone === "deck",
      );
    expect(returnEvent).toMatchObject({
      sourceCardId: eb01MountainGod018.id,
      sourceInstanceId: existingHandId,
      visibility: "public",
    });
    const spectatorView = engine.getView("spectator");
    const spectatorLog = spectatorView.logs
      .filter((log) => log.sequence > logSequenceBefore)
      .map((log) => log.message)
      .join(" ");
    expect(spectatorLog).toContain("places a card from their hand at the bottom");
    expect(spectatorLog).not.toContain(eb01MountainGod018.name);
    expect(spectatorLog).not.toContain("Order:");
    expect(spectatorLog).not.toContain(eb01Doma005.name);
    expect(spectatorView.players.south.deckTop).toMatchObject({
      hidden: true,
      instanceId: null,
      name: null,
    });
    expect(
      spectatorView.players.south.hand.every(
        (card) => card.hidden && card.instanceId === null && card.cardId === null,
      ),
    ).toBe(true);
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      drawnId,
    );
    const deckAfterFirstActivation = engine.getView("south").players.south.deckCount;

    engine.playCard(op02IceAge117, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckAfterFirstActivation);
    expect(view.prompts).toHaveLength(0);
  });

  test("your Counter Event also triggers the draw-and-deck-bottom effect", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      {
        hand: [op04BadMannersKickCourse016, eb01Fourtricks025],
        character: [op04PageOne053],
        deck: [eb01Doma005, eb01MountainGod018],
        activeDon: 1,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const pageOneId = engine.findCardInZone("north", "character", op04PageOne053);
    const counterId = engine.findCardInZone("north", "hand", op04BadMannersKickCourse016);
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const drawnId = engine.findCardInZone("north", "deck", eb01Doma005);

    engine.attachDon(pageOneId, 1, "north");
    engine.endTurn("north");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [counterId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "north");

    const returnDecision = engine.pendingDecision("effectTargetSelection", "north");
    expect(returnDecision.actorId).toBe("north");
    const returnStep = returnDecision.steps[0];
    expect(returnStep?.kind).toBe("selectEntity");
    if (returnStep?.kind !== "selectEntity")
      throw new Error("Expected Page One's Counter Event return choice.");
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toContain(drawnId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [drawnId] }, "north");

    expect(engine.getState().players.north.deck.at(-1)).toBe(drawnId);
    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(counterId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not trigger without attached DON!! or for the opponent's Event", () => {
    const noDon = OnePieceTestEngine.create(
      {
        hand: [op02IceAge117, eb01Fourtricks025],
        character: [op04PageOne053],
        deck: [eb01Doma005, eb01MountainGod018],
        activeDon: 1,
      },
      { character: [eb01MountainGod018] },
    );
    const noDonHandId = noDon.findCardInZone("south", "hand", eb01Fourtricks025);
    const noDonDeckBefore = noDon.getView("south").players.south.deckCount;

    noDon.playCard(op02IceAge117, "south");
    noDon.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    let view = noDon.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([noDonHandId]);
    expect(view.players.south.deckCount).toBe(noDonDeckBefore);
    expect(view.prompts).toHaveLength(0);

    const opponentEvent = OnePieceTestEngine.create(
      {
        character: [op04PageOne053],
        deck: [eb01Doma005, eb01MountainGod018],
        activeDon: 1,
      },
      {
        hand: [op02IceAge117],
        character: [eb01MountainGod018],
        activeDon: 1,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const pageOneId = opponentEvent.findCardInZone("south", "character", op04PageOne053);
    const southDeckBefore = opponentEvent.getView("south").players.south.deckCount;
    const southHandBefore = opponentEvent.getView("south").players.south.hand.length;

    opponentEvent.attachDon(pageOneId, 1, "south");
    opponentEvent.endTurn("south");
    opponentEvent.playCard(op02IceAge117, "north");
    opponentEvent.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");

    view = opponentEvent.getView("south");
    expect(view.players.south.hand).toHaveLength(southHandBefore);
    expect(view.players.south.deckCount).toBe(southDeckBefore);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not trigger when your Event's Life Trigger effect is activated", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        character: [{ card: op04PageOne053, attachedDon: 1 }],
        life: [op02Seaquake021],
        deck: [eb01Doma005, eb01Fourtricks025],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const deckCountBefore = engine.getView("north").players.north.deckCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");

    expect(engine.getView("north").players.north).toMatchObject({
      handCount: 0,
      deckCount: deckCountBefore,
    });
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
