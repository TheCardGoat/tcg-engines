// Match rule options (Pack Rush, CR 10.2): opening hand size (10.2.3), lore to
// win (10.2.4), reshuffle the discard on an empty deck (10.2.5) and a locked
// starting inkwell (10.2.2). Every option defaults to the normal game.
import { describe, expect, it } from "bun:test";
import { createRecordCardCatalog, createZoneId, type PlayerId } from "#core";
import { LorcanaServer } from "../../lorcana-server";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
} from "../../testing";
import type { LorcanaMatchRulesInput, LorcanaMatchState } from "../../types";
import { normalizeLorcanaMatchRules } from "./match-rules";

const PACK_RUSH = {
  openingHandSize: 5,
  loreToWin: 15,
  emptyDeck: "reshuffle-discard",
} as const satisfies LorcanaMatchRulesInput;

const filler = createMockCharacter({ id: "match-rules-filler", name: "Filler", cost: 1 });

function createServer(deckSize: number, matchRules?: LorcanaMatchRulesInput, seed = "match-rules") {
  const cardInstances: Record<string, string> = {};
  const owners: Record<string, string[]> = { [PLAYER_ONE]: [], [PLAYER_TWO]: [] };
  for (const playerId of [PLAYER_ONE, PLAYER_TWO]) {
    for (let index = 0; index < deckSize; index++) {
      const instanceId = `${playerId}-card-${index}`;
      cardInstances[instanceId] = filler.id;
      owners[playerId]!.push(instanceId);
    }
  }
  const players = [{ id: PLAYER_ONE }, { id: PLAYER_TWO }];
  return new LorcanaServer({
    seed,
    matchID: "match-rules-match",
    gameID: "match-rules-game",
    goingFirst: PLAYER_ONE as PlayerId,
    cardCatalog: createRecordCardCatalog("match-rules-cards", { [filler.id]: filler }),
    players,
    cardsMaps: { cardInstances, owners },
    capturePatches: true,
    ...(matchRules ? { matchRules } : {}),
  });
}

/** The state as JSON, without the ruleset hash (it embeds the creation time). */
function stateJson(server: LorcanaServer): string {
  const state = structuredClone(server.getState()) as LorcanaMatchState;
  return JSON.stringify({ ...state, ctx: { ...state.ctx, rulesetHash: undefined } });
}

function zone(state: LorcanaMatchState, zoneName: string, playerId: string): string[] {
  return state.ctx.zones.private.zoneCards[`${zoneName}:${playerId}`] ?? [];
}

describe("match rules: defaults", () => {
  it("a match created with every option at its default is identical to one created without options", () => {
    const plain = createServer(24);
    const defaults = createServer(24, {
      openingHandSize: 7,
      loreToWin: 20,
      emptyDeck: "lose",
    });

    expect(stateJson(defaults)).toBe(stateJson(plain));
    expect(plain.getState().G.matchRules).toBeUndefined();
    expect(plain.getState().G.loreToWin).toBeUndefined();

    expect(plain.chooseFirstPlayer(PLAYER_ONE, PLAYER_ONE)).toBeSuccessfulCommand();
    expect(defaults.chooseFirstPlayer(PLAYER_ONE, PLAYER_ONE)).toBeSuccessfulCommand();
    expect(stateJson(defaults)).toBe(stateJson(plain));
    expect(zone(plain.getState() as LorcanaMatchState, "hand", PLAYER_ONE)).toHaveLength(7);
  });

  it("stores only the options that differ from the normal game", () => {
    expect(normalizeLorcanaMatchRules(undefined)).toBeUndefined();
    expect(normalizeLorcanaMatchRules({ openingHandSize: 7, emptyDeck: "lose" })).toBeUndefined();
    expect(normalizeLorcanaMatchRules({ ...PACK_RUSH, openingHandSize: 7 })).toEqual({
      loreToWin: 15,
      emptyDeck: "reshuffle-discard",
    });
  });

  it("rejects invalid options when the match is created", () => {
    expect(() => createServer(24, { openingHandSize: -1 })).toThrow("openingHandSize");
    expect(() => createServer(24, { openingHandSize: 2.5 })).toThrow("openingHandSize");
    expect(() => createServer(24, { loreToWin: 0 })).toThrow("loreToWin");
    expect(() => createServer(24, { emptyDeck: "draw-nothing" as unknown as "lose" })).toThrow(
      "emptyDeck",
    );
    expect(() => createServer(24, { startingInkwell: { source: "deck-top", count: 25 } })).toThrow(
      "startingInkwell.count",
    );
    expect(() =>
      createServer(24, {
        startingInkwell: {
          source: "card-ids",
          cardIds: { [PLAYER_ONE]: [`${PLAYER_TWO}-card-0`] },
        },
      }),
    ).toThrow(`is not a card of ${PLAYER_ONE}`);
  });
});

describe("match rules: Pack Rush setup (CR 10.2.2-10.2.4)", () => {
  it("puts 2 locked cards in each inkwell before opening hands of 5, and sets the lore goal to 15", () => {
    const server = createServer(24, {
      ...PACK_RUSH,
      startingInkwell: { source: "deck-top", count: 2 },
    });
    const created = server.getState() as LorcanaMatchState;

    expect(created.G.matchRules).toEqual({
      openingHandSize: 5,
      loreToWin: 15,
      emptyDeck: "reshuffle-discard",
    });
    expect(created.G.loreToWin).toEqual({ [PLAYER_ONE]: 15, [PLAYER_TWO]: 15 } as never);
    for (const playerId of [PLAYER_ONE, PLAYER_TWO]) {
      const inkwell = zone(created, "inkwell", playerId);
      expect(inkwell).toHaveLength(2);
      expect(zone(created, "deck", playerId)).toHaveLength(22);
      expect(created.ctx.zones.public.zoneSummaries[`inkwell:${playerId}`]?.count).toBe(2);
      expect(created.ctx.zones.public.zoneSummaries[`deck:${playerId}`]?.count).toBe(22);
      for (const cardId of inkwell) {
        expect(created.ctx.zones.private.cardIndex[cardId]?.zoneKey).toBe(`inkwell:${playerId}`);
        expect(created.ctx.zones.private.cardMeta[cardId]).toMatchObject({
          state: "ready",
          publicFaceState: "faceDown",
          lockedInInkwell: true,
        });
      }
    }

    expect(server.chooseFirstPlayer(PLAYER_ONE, PLAYER_ONE)).toBeSuccessfulCommand();
    const dealt = server.getState() as LorcanaMatchState;
    for (const playerId of [PLAYER_ONE, PLAYER_TWO]) {
      expect(zone(dealt, "hand", playerId)).toHaveLength(5);
      expect(zone(dealt, "deck", playerId)).toHaveLength(17);
      expect(zone(dealt, "inkwell", playerId)).toEqual(zone(created, "inkwell", playerId));
    }

    expect(server.mulligan(PLAYER_ONE, [])).toBeSuccessfulCommand();
    expect(server.mulligan(PLAYER_TWO, [])).toBeSuccessfulCommand();
    expect(server.getAvailableInk(PLAYER_ONE)).toBe(2);
    const started = server.getState() as LorcanaMatchState;
    for (const cardId of zone(started, "inkwell", PLAYER_TWO)) {
      expect(started.ctx.zones.private.cardMeta[cardId]?.lockedInInkwell).toBe(true);
    }
  });

  it("puts the named cards in the inkwell and never writes their ids into G", () => {
    const named = {
      [PLAYER_ONE]: [`${PLAYER_ONE}-card-3`, `${PLAYER_ONE}-card-15`],
      [PLAYER_TWO]: [`${PLAYER_TWO}-card-0`, `${PLAYER_TWO}-card-23`],
    };
    const server = createServer(24, {
      ...PACK_RUSH,
      startingInkwell: { source: "card-ids", cardIds: named },
    });
    const state = server.getState() as LorcanaMatchState;

    for (const playerId of [PLAYER_ONE, PLAYER_TWO]) {
      expect([...zone(state, "inkwell", playerId)].sort()).toEqual([...named[playerId]].sort());
      for (const cardId of named[playerId]) {
        expect(zone(state, "deck", playerId)).not.toContain(cardId);
      }
    }
    const publicG = JSON.stringify(state.G);
    for (const cardId of [...named[PLAYER_ONE], ...named[PLAYER_TWO]]) {
      expect(publicG).not.toContain(cardId);
    }
  });

  it("can place unlocked starting ink", () => {
    const server = createServer(24, {
      startingInkwell: { source: "deck-top", count: 1, locked: false },
    });
    const state = server.getState() as LorcanaMatchState;
    const [cardId] = zone(state, "inkwell", PLAYER_ONE);
    expect(cardId).toBeDefined();
    expect(state.ctx.zones.private.cardMeta[cardId!]?.lockedInInkwell).toBeUndefined();
    expect(state.G.matchRules).toBeUndefined();
  });
});

describe("match rules: lore to win (CR 10.2.4)", () => {
  const quester = createMockCharacter({
    id: "match-rules-quester",
    name: "Quester",
    cost: 1,
    lore: 1,
  });

  it("a player at 14 lore wins by questing to 15", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [quester], lore: 14, deck: 5 },
      { deck: 5 },
      { matchRules: { loreToWin: 15 } },
    );
    expect(g.asPlayerOne().quest(quester)).toBeSuccessfulCommand();
    expect(g.asServer().getWinner()).toBe(PLAYER_ONE);
  });

  it("without the option 15 lore does not win", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [quester], lore: 14, deck: 5 },
      { deck: 5 },
    );
    expect(g.asPlayerOne().quest(quester)).toBeSuccessfulCommand();
    expect(g.asServer().getWinner()).toBeUndefined();
  });

  it("a win-condition modification still raises the goal above the match's base", () => {
    const raiser = createMockCharacter({
      id: "match-rules-raiser",
      name: "Raiser",
      cost: 1,
      abilities: [
        {
          type: "static",
          effect: { type: "win-condition-modification", loreRequired: 25, target: "OPPONENTS" },
        } as never,
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [raiser], deck: 5 },
      { play: [quester], lore: 14, deck: 5 },
      { matchRules: { loreToWin: 15 } },
    );
    const G = g.getAuthoritativeState().G;
    expect(G.loreToWin).toEqual({ [PLAYER_ONE]: 15, [PLAYER_TWO]: 25 } as never);
  });
});

describe("match rules: empty deck (CR 10.2.5)", () => {
  const drawThree = createMockAction({
    id: "match-rules-draw-three",
    name: "Draw Three",
    cost: 0,
    abilities: [{ type: "action", effect: { type: "draw", amount: 3, target: "CONTROLLER" } }],
  });

  it("ending a turn with an empty deck reshuffles the discard instead of losing", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 0, discard: 3 },
      { deck: 5 },
      { matchRules: { emptyDeck: "reshuffle-discard" } },
    );
    // The post-move refill already made the discard the new deck.
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asServer().getWinner()).toBeUndefined();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toHaveLength(3);
    expect(g.getCardInstanceIdsInZone("discard", PLAYER_ONE)).toHaveLength(0);
    expect(g.asServer().getTurnNumber()).toBe(2);
  });

  it("with an empty deck and an empty discard the player still does not lose", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 0 },
      { deck: 5 },
      { matchRules: { emptyDeck: "reshuffle-discard" } },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asServer().getWinner()).toBeUndefined();
    expect(g.asServer().getTurnNumber()).toBe(2);
  });

  it("without the option the same player loses", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({ deck: 0, discard: 3 }, { deck: 5 });
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asServer().getWinner()).toBe(PLAYER_TWO);
  });

  it("a draw that empties the deck continues from the reshuffled discard", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [drawThree], deck: 1, discard: 4 },
      { deck: 5 },
      { matchRules: { emptyDeck: "reshuffle-discard" } },
    );
    expect(g.asPlayerOne().playCard(drawThree)).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(3);
    // 1 + 4 cards: 3 drawn, 2 left in the deck; Draw Three itself is in the discard.
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toHaveLength(2);
    expect(g.getCardInstanceIdsInZone("discard", PLAYER_ONE)).toEqual([
      g.findCardInstanceId(drawThree, "discard", PLAYER_ONE),
    ]);
  });

  it("a deck emptied by a move is refilled once the move settles", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [drawThree], deck: 3 },
      { deck: 5 },
      { matchRules: { emptyDeck: "reshuffle-discard" } },
    );
    expect(g.asPlayerOne().playCard(drawThree)).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(3);
    // The deck ran out; the discard (Draw Three) became the new deck.
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual([
      g.findCardInstanceId(drawThree, "deck", PLAYER_ONE),
    ]);
    expect(g.getCardInstanceIdsInZone("discard", PLAYER_ONE)).toHaveLength(0);
  });

  it("without the option a draw from an empty deck draws nothing and nothing is reshuffled", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [drawThree], deck: 1, discard: 4 },
      { deck: 5 },
    );
    expect(g.asPlayerOne().playCard(drawThree)).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(1);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toHaveLength(0);
    expect(g.getCardInstanceIdsInZone("discard", PLAYER_ONE)).toHaveLength(5);
  });
});

describe("match rules: locked starting ink (CR 10.2.2.1-10.2.2.2)", () => {
  const ink = (id: string) => createMockCharacter({ id, name: `Ink ${id}`, cost: 1 });
  const lockedA = ink("match-rules-locked-a");
  const lockedB = ink("match-rules-locked-b");
  const freeA = ink("match-rules-free-a");
  const freeB = ink("match-rules-free-b");

  it("can't be chosen: an effect choosing a card in the inkwell offers only unlocked cards", () => {
    const returnInk = createMockAction({
      id: "match-rules-return-ink",
      name: "Return Ink",
      cost: 0,
      abilities: [
        {
          type: "action",
          effect: {
            type: "return-to-hand",
            target: { selector: "chosen", count: 1, owner: "you", zones: ["inkwell"] },
          },
        },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [returnInk],
        inkwell: [{ card: lockedA, lockedInInkwell: true }, freeA],
        deck: 5,
      },
      { deck: 5 },
    );

    expect(g.asPlayerOne().playCard(returnInk, { targets: [lockedA] })).toMatchObject({
      success: false,
      errorCode: "INVALID_ACTION_TARGET",
    });
    expect(g.asPlayerOne().getCardZone(lockedA)).toBe("inkwell");
    expect(g.asPlayerOne().playCard(returnInk, { targets: [freeA] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(lockedA)).toBe("inkwell");
    expect(g.asPlayerOne().getCardZone(freeA)).toBe("hand");
  });

  it("can't leave the inkwell: a random return takes only unlocked cards", () => {
    const returnTwo = createMockAction({
      id: "match-rules-return-two",
      name: "Return Two",
      cost: 0,
      abilities: [
        { type: "action", effect: { type: "return-random-from-inkwell", count: 2 } as never },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [returnTwo],
        inkwell: [
          { card: lockedA, lockedInInkwell: true },
          { card: lockedB, lockedInInkwell: true },
          freeA,
          freeB,
        ],
        deck: 5,
      },
      { deck: 5 },
    );

    expect(g.asPlayerOne().playCard(returnTwo)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(lockedA)).toBe("inkwell");
    expect(g.asPlayerOne().getCardZone(lockedB)).toBe("inkwell");
    expect(g.asPlayerOne().getCardZone(freeA)).toBe("hand");
    expect(g.asPlayerOne().getCardZone(freeB)).toBe("hand");
  });

  it("can't leave the inkwell: a direct move of a locked card is ignored", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { inkwell: [{ card: lockedA, lockedInInkwell: true }], deck: 5 },
      { deck: 5 },
    );
    const lockedId = g.findCardInstanceId(lockedA, "inkwell", PLAYER_ONE);

    g.asServer().manualMoveCard(lockedId, createZoneId(`hand:${PLAYER_ONE}`));
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toEqual([lockedId]);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(0);
  });

  it("is exerted to pay costs and readied like any ink", () => {
    const costsTwo = createMockCharacter({
      id: "match-rules-costs-two",
      name: "Costs Two",
      cost: 2,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [costsTwo],
        inkwell: [
          { card: lockedA, lockedInInkwell: true },
          { card: lockedB, lockedInInkwell: true },
        ],
        deck: 5,
      },
      { deck: 5 },
    );

    expect(g.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(g.asPlayerOne().playCard(costsTwo)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
  });
});
