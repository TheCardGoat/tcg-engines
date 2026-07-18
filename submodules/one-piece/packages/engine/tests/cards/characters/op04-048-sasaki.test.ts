import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02EdwardNewgate001,
  op02Squard009,
  op04Kuro023,
  op04Sasaki048,
  op12Kalgara099,
  op14eb04Killer005,
} from "@tcg/op-cards";

import { processEffectAction } from "../../../src/effects/actions.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-048 Sasaki", () => {
  test("returns and shuffles the hand without redrawing while own-effect draws are locked", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op02EdwardNewgate001,
      character: [op12Kalgara099],
      hand: [op02Squard009, op04Sasaki048, eb01Doma005],
      life: [op14eb04Killer005],
      deck: [eb01Fourtricks025, eb01MountainGod018, op04Kuro023, eb01Doma005],
      activeDon: op02Squard009.cost + op04Sasaki048.cost,
    });

    engine.playCard(op02Squard009, "south");
    const handBeforeSasaki = engine.getState().players.south.hand.length;
    const deckBeforeSasaki = engine.getState().players.south.deck.length;

    engine.playCard(op04Sasaki048, "south");

    expect(engine.getState().players.south.hand).toHaveLength(0);
    expect(engine.getState().players.south.deck).toHaveLength(
      deckBeforeSasaki + handBeforeSasaki - 1,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("returns its post-play hand, shuffles, and redraws exactly the returned count", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op04Sasaki048, eb01Doma005, eb01Fourtricks025],
        deck: [eb01MountainGod018, op04Kuro023, eb01Doma005],
        activeDon: 3,
      },
      {},
      { seed: "op04-sasaki-redraw" },
    );
    const returnedIds = [
      engine.findCardInZone("south", "hand", eb01Doma005),
      engine.findCardInZone("south", "hand", eb01Fourtricks025),
    ];
    const redrawPool = [...returnedIds, ...engine.getState().players.south.deck];
    const eventStart = engine.getState().eventHistory.length;

    engine.playCard(op04Sasaki048, "south");

    const state = engine.getState();
    const view = engine.getView("south");
    const spectatorView = engine.getView("spectator");
    const returnedMoveEvents = state.eventHistory
      .slice(eventStart)
      .filter(
        (event) =>
          event.type === "cardMoved" &&
          event.payload.fromZone === "hand" &&
          event.payload.toZone === "deck" &&
          event.sourceInstanceId !== null &&
          returnedIds.includes(event.sourceInstanceId),
      );
    expect(view.players.south.hand).toHaveLength(returnedIds.length);
    expect(state.players.south.deck).toHaveLength(3);
    expect(new Set([...state.players.south.hand, ...state.players.south.deck])).toEqual(
      new Set(redrawPool),
    );
    expect([...state.players.south.hand, ...state.players.south.deck]).not.toEqual(redrawPool);
    expect(view.players.south.characters.some((card) => card?.cardId === op04Sasaki048.id)).toBe(
      true,
    );
    expect(returnedMoveEvents).toHaveLength(returnedIds.length);
    expect(returnedMoveEvents.every((event) => event.visibility === "public")).toBe(true);
    expect(returnedMoveEvents.every((event) => event.sourceCardId !== null)).toBe(true);
    expect(new Set(returnedMoveEvents.map((event) => event.sourceInstanceId))).toEqual(
      new Set(returnedIds),
    );
    expect(
      returnedIds.every((instanceId) => state.cards[instanceId]!.publicKnowledge === false),
    ).toBe(true);
    const publicLogText = spectatorView.logs.map((log) => log.message).join(" ");
    expect(publicLogText).toContain("returns 2 cards from hand to their deck");
    expect(publicLogText).not.toContain(eb01Doma005.name);
    expect(publicLogText).not.toContain(eb01Fourtricks025.name);
    expect(publicLogText).not.toContain("Order:");
    expect(view.players.south.deckTop).toMatchObject({ hidden: true, instanceId: null });
    expect(spectatorView.players.south.deckTop).toMatchObject({ hidden: true, instanceId: null });
    expect(view.prompts).toHaveLength(0);
    expect(state.capabilityHistory).toHaveLength(0);
  });

  test("with no post-play hand, shuffles but draws zero cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04Sasaki048],
      deck: [eb01Doma005, eb01Fourtricks025],
      activeDon: 3,
    });
    const deckIds = [...engine.getState().players.south.deck];

    engine.playCard(op04Sasaki048, "south");

    const state = engine.getState();
    const spectatorView = engine.getView("spectator");
    expect(state.players.south.hand).toHaveLength(0);
    expect(new Set(state.players.south.deck)).toEqual(new Set(deckIds));
    expect(
      state.players.south.deck.every((instanceId) => !state.cards[instanceId]!.publicKnowledge),
    ).toBe(true);
    expect(spectatorView.players.south.deckTop).toMatchObject({ hidden: true, instanceId: null });
    expect(spectatorView.logs.map((log) => log.message).join(" ")).toContain(
      "has no cards to return from hand",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(state.capabilityHistory).toHaveLength(0);
  });

  test("conceals returned identities, routes all cards to the specified deck, then redraws privately", () => {
    const engine = OnePieceTestEngine.create(
      {},
      {
        hand: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01MountainGod018, op04Kuro023, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
    );
    const state = engine.getState();
    const returnedIds = [...state.players.north.hand];
    const returnedNames = [eb01Doma005.name, eb01Fourtricks025.name];
    const newlyDrawnNames = [eb01MountainGod018.name, op04Kuro023.name];
    const foreignOwnedId = engine.findCardInZone("north", "hand", eb01Doma005);
    state.cards[foreignOwnedId]!.owner = "south";
    const eventStart = state.eventHistory.length;
    const logSequenceBefore = state.logHistory.at(-1)?.sequence ?? 0;

    expect(
      processEffectAction(state, "south", engine.leader("south"), {
        action: "redrawHand",
        player: "opponent",
        drawCount: 5,
      }),
    ).toBe(true);

    expect(state.players.north.hand).toHaveLength(5);
    expect(state.players.north.deck).toHaveLength(2);
    expect(state.players.south.deck).not.toContain(foreignOwnedId);
    expect(state.cards[foreignOwnedId]).toMatchObject({
      owner: "south",
      controller: "north",
    });
    const controllerView = engine.getView("south");
    const spectatorView = engine.getView("spectator");
    expect(controllerView.players.north.hand.every((card) => card.hidden)).toBe(true);
    expect(controllerView.players.north.deckTop).toMatchObject({ hidden: true, instanceId: null });
    expect(spectatorView.players.north.deckTop).toMatchObject({ hidden: true, instanceId: null });
    expect(
      returnedIds.every((instanceId) => state.cards[instanceId]!.publicKnowledge === false),
    ).toBe(true);
    const visibleLogText = controllerView.logs
      .filter((log) => log.sequence > logSequenceBefore)
      .map((log) => log.message)
      .join(" ");
    const spectatorLogText = spectatorView.logs
      .filter((log) => log.sequence > logSequenceBefore)
      .map((log) => log.message)
      .join(" ");
    for (const cardName of returnedNames) {
      expect(visibleLogText).not.toContain(cardName);
      expect(spectatorLogText).not.toContain(cardName);
    }
    expect(visibleLogText).toContain("returns 2 cards from hand to their deck");
    expect(spectatorLogText).toContain("returns 2 cards from hand to their deck");
    expect(visibleLogText).not.toContain("Order:");
    expect(spectatorLogText).not.toContain("Order:");
    for (const cardName of newlyDrawnNames) {
      expect(visibleLogText).not.toContain(cardName);
      expect(spectatorLogText).not.toContain(cardName);
    }
    const subsequentEvents = state.eventHistory.slice(eventStart);
    const returnedMoveEvents = subsequentEvents.filter(
      (event) =>
        event.type === "cardMoved" &&
        event.payload.fromZone === "hand" &&
        event.payload.toZone === "deck" &&
        event.sourceInstanceId !== null &&
        returnedIds.includes(event.sourceInstanceId),
    );
    expect(returnedMoveEvents).toHaveLength(returnedIds.length);
    expect(returnedMoveEvents.every((event) => event.visibility === "public")).toBe(true);
    expect(returnedMoveEvents.every((event) => event.sourceCardId !== null)).toBe(true);
    expect(returnedMoveEvents.every((event) => event.payload.toOwner === "north")).toBe(true);
    expect(new Set(returnedMoveEvents.map((event) => event.sourceInstanceId))).toEqual(
      new Set(returnedIds),
    );
    const drawEvents = subsequentEvents.filter(
      (event) =>
        event.type === "cardMoved" &&
        event.payload.fromZone === "deck" &&
        event.payload.toZone === "hand",
    );
    expect(drawEvents).toHaveLength(5);
    expect(drawEvents.every((event) => event.visibility === "private")).toBe(true);
    expect(state.capabilityHistory).toHaveLength(0);
  });
});
