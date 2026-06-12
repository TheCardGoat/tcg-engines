import { expect, test } from "vite-plus/test";
import { createMatchState, getOpponentId } from "../src/state/initial-state.ts";
import { LocalEngine } from "../src/transport/local-engine.ts";
import { createPlayerId } from "../src/types/branded.ts";
import type { CardCatalog, DeckList } from "../src/types/match-state.ts";
import { registerMoves } from "../src/command/index.ts";
import { allMoves } from "../src/moves/index.ts";
import { filterMatchView } from "../src/view/filter.ts";

function createTestCatalog(): CardCatalog {
  const cards = new Map<string, any>();
  const makeCard = (
    id: string,
    type: string,
    cost: number,
    power: number,
    extra: Record<string, any> = {},
  ) => {
    cards.set(id, {
      id,
      type,
      cost,
      power,
      color: "blue",
      keywords: [],
      classifications: [],
      hasSellTag: false,
      abilities: [],
      ...extra,
    });
  };

  makeCard("legend-1", "legend", 5, 8, { hasSellTag: true });
  makeCard("legend-2", "legend", 4, 6, { hasSellTag: true });
  makeCard("legend-3", "legend", 3, 5, { hasSellTag: true });
  for (let i = 1; i <= 40; i++) {
    makeCard(`unit-${i}`, "unit", 2 + (i % 4), 2 + (i % 5));
  }

  return {
    get(id: string) {
      return cards.get(id);
    },
    *entries() {
      yield* cards.entries();
    },
    get size() {
      return cards.size;
    },
  };
}

function createTestDeckList(): DeckList {
  const mainDeck: string[] = [];
  for (let i = 1; i <= 40; i++) {
    mainDeck.push(`unit-${i}`);
  }
  return {
    playerId: "p1",
    playerName: "Player 1",
    legends: ["legend-1", "legend-2", "legend-3"],
    mainDeck,
  };
}

function createTestDeckList2(): DeckList {
  const mainDeck: string[] = [];
  for (let i = 1; i <= 40; i++) {
    mainDeck.push(`unit-${i}`);
  }
  return {
    playerId: "p2",
    playerName: "Player 2",
    legends: ["legend-1", "legend-2", "legend-3"],
    mainDeck,
  };
}

test("createMatchState produces valid initial state", () => {
  const catalog = createTestCatalog();
  const state = createMatchState({
    players: [
      { id: createPlayerId("p1"), name: "Player 1" },
      { id: createPlayerId("p2"), name: "Player 2" },
    ],
    catalog,
    deckLists: [createTestDeckList(), createTestDeckList2()],
    seed: "test-seed",
  });

  expect(state.G.gamePhase).toBe("setup");
  expect(state.G.gameEnded).toBe(false);
  expect(state.G.winnerId).toBe(null);
  expect(state.ctx.stateID).toBe(0);
  expect(state.ctx.playerIds).toHaveLength(2);

  const p1 = state.G.players["p1"];
  const p2 = state.G.players["p2"];

  expect(p1.zones.legendArea).toHaveLength(3);
  expect(p2.zones.legendArea).toHaveLength(3);
  expect(p1.zones.hand).toHaveLength(6);
  expect(p2.zones.hand).toHaveLength(6);
  expect(p1.zones.deck).toHaveLength(34);
  expect(p2.zones.deck).toHaveLength(34);
  expect(p1.fixerArea).toHaveLength(6);
  expect(p2.fixerArea).toHaveLength(6);
  expect(p1.gigArea).toHaveLength(0);
  expect(p2.gigArea).toHaveLength(0);

  const firstPlayerId = state.G.turnMetadata.activePlayerId;
  const firstPlayer = state.G.players[firstPlayerId as string];
  expect(firstPlayer.firstPlayer).toBe(true);

  let spentLegends = 0;
  for (const id of firstPlayer.zones.legendArea) {
    const card = state.G.cardIndex[id as string];
    if (card?.meta.spent) spentLegends++;
  }
  expect(spentLegends).toBe(2);
});

test("all legends start face-down", () => {
  const catalog = createTestCatalog();
  const state = createMatchState({
    players: [
      { id: createPlayerId("p1"), name: "P1" },
      { id: createPlayerId("p2"), name: "P2" },
    ],
    catalog,
    deckLists: [createTestDeckList(), createTestDeckList2()],
    seed: "test",
  });

  for (const pid of state.ctx.playerIds) {
    const player = state.G.players[pid as string];
    for (const cardId of player.zones.legendArea) {
      const card = state.G.cardIndex[cardId as string];
      expect(card?.meta.faceDown).toBe(true);
    }
  }
});

test("getOpponentId returns the other player", () => {
  const catalog = createTestCatalog();
  const state = createMatchState({
    players: [
      { id: createPlayerId("p1"), name: "P1" },
      { id: createPlayerId("p2"), name: "P2" },
    ],
    catalog,
    deckLists: [createTestDeckList(), createTestDeckList2()],
    seed: "test",
  });

  const p1 = createPlayerId("p1");
  const opponent = getOpponentId(state, p1);
  expect(opponent as string).toBe("p2");
});

test("LocalEngine processes commands", () => {
  registerMoves(allMoves);
  const catalog = createTestCatalog();
  const state = createMatchState({
    players: [
      { id: createPlayerId("p1"), name: "P1" },
      { id: createPlayerId("p2"), name: "P2" },
    ],
    catalog,
    deckLists: [createTestDeckList(), createTestDeckList2()],
    seed: "test-engine",
  });

  const engine = new LocalEngine(state);
  const activeId = state.G.turnMetadata.activePlayerId;

  const result = engine.processCommand(
    { commandID: "cmd-1", move: "passPhase", input: { args: {} } },
    activeId,
  );

  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.stateID).toBe(1);
    expect(result.gameEvents.length).toBeGreaterThan(0);
  }
});

test("filterMatchView hides opponent hand details", () => {
  const catalog = createTestCatalog();
  const state = createMatchState({
    players: [
      { id: createPlayerId("p1"), name: "P1" },
      { id: createPlayerId("p2"), name: "P2" },
    ],
    catalog,
    deckLists: [createTestDeckList(), createTestDeckList2()],
    seed: "test-view",
  });

  const p1View = filterMatchView(state, createPlayerId("p1"));

  const p1Zone = p1View.players["p1"];
  const p2Zone = p1View.players["p2"];

  expect(Array.isArray(p1Zone.zones["hand"])).toBe(true);
  expect(typeof p2Zone.zones["hand"]).toBe("number");

  expect(p1Zone.zones["deck"]).toBe(34);
  expect(p2Zone.zones["deck"]).toBe(34);
});

test("concede ends game", () => {
  registerMoves(allMoves);
  const catalog = createTestCatalog();
  const state = createMatchState({
    players: [
      { id: createPlayerId("p1"), name: "P1" },
      { id: createPlayerId("p2"), name: "P2" },
    ],
    catalog,
    deckLists: [createTestDeckList(), createTestDeckList2()],
    seed: "test-concede",
  });

  const engine = new LocalEngine(state);

  const result = engine.processCommand(
    { commandID: "cmd-1", move: "concede", input: { args: {} } },
    createPlayerId("p1"),
  );

  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.state.G.gameEnded).toBe(true);
    expect(result.state.G.winnerId as string).toBe("p2");
    expect(result.state.G.winReason).toBe("concede");
  }
});

test("mulligan reshuffles and draws 6", () => {
  registerMoves(allMoves);
  const catalog = createTestCatalog();
  const state = createMatchState({
    players: [
      { id: createPlayerId("p1"), name: "P1" },
      { id: createPlayerId("p2"), name: "P2" },
    ],
    catalog,
    deckLists: [createTestDeckList(), createTestDeckList2()],
    seed: "test-mulligan",
  });

  const engine = new LocalEngine(state);
  const p1 = createPlayerId("p1");

  const result = engine.processCommand(
    { commandID: "cmd-1", move: "mulligan", input: { args: {} } },
    p1,
  );

  expect(result.success).toBe(true);
  if (result.success) {
    const player = result.state.G.players["p1"];
    expect(player.zones.hand).toHaveLength(6);
    expect(player.mulliganDone).toBe(true);
    expect(
      result.state.G.cardIndex[result.state.G.players["p1"].zones.hand[0] as string],
    ).toBeDefined();
  }
});

test("undo restores previous state", () => {
  registerMoves(allMoves);
  const catalog = createTestCatalog();
  const state = createMatchState({
    players: [
      { id: createPlayerId("p1"), name: "P1" },
      { id: createPlayerId("p2"), name: "P2" },
    ],
    catalog,
    deckLists: [createTestDeckList(), createTestDeckList2()],
    seed: "test-undo",
  });

  const engine = new LocalEngine(state);
  const originalStateID = engine.getState().ctx.stateID;

  engine.processCommand(
    { commandID: "cmd-1", move: "concede", input: { args: {} } },
    createPlayerId("p1"),
  );

  expect(engine.getState().G.gameEnded).toBe(true);

  const undone = engine.undo();
  expect(undone).toBe(true);
  expect(engine.getState().G.gameEnded).toBe(false);
  expect(engine.getState().ctx.stateID).toBe(originalStateID);
});

test("hidden-information moves can be undone in the local simulator", () => {
  registerMoves(allMoves);
  const catalog = createTestCatalog();
  const state = createMatchState({
    players: [
      { id: createPlayerId("p1"), name: "P1" },
      { id: createPlayerId("p2"), name: "P2" },
    ],
    catalog,
    deckLists: [createTestDeckList(), createTestDeckList2()],
    seed: "test-undo-hidden-info",
  });

  const engine = new LocalEngine(state);

  const keepResult = engine.processCommand(
    { commandID: "cmd-1", move: "keepHand", input: { args: {} } },
    createPlayerId("p1"),
  );
  expect(keepResult.success).toBe(true);
  expect(engine.canUndo()).toBe(true);

  const mulliganResult = engine.processCommand(
    { commandID: "cmd-2", move: "mulligan", input: { args: {} } },
    createPlayerId("p2"),
  );
  expect(mulliganResult.success).toBe(true);
  if (mulliganResult.success) {
    expect(mulliganResult.undoable).toBe(true);
  }
  // After both players have acted, the engine auto-advances to the start
  // phase, which resets the undo stack (turn-start checkpoint).
  expect(engine.canUndo()).toBe(false);
});

test("playing a hidden hand card can be undone in the local simulator", () => {
  registerMoves(allMoves);
  const catalog = createTestCatalog();
  const state = createMatchState({
    players: [
      { id: createPlayerId("p1"), name: "P1" },
      { id: createPlayerId("p2"), name: "P2" },
    ],
    catalog,
    deckLists: [createTestDeckList(), createTestDeckList2()],
    seed: "test-undo-play-card",
  });
  const activePlayerId = state.G.turnMetadata.activePlayerId;
  const activePlayer = state.G.players[activePlayerId as string]!;
  state.G.gamePhase = "main";
  state.G.turnMetadata.pendingChoice = undefined;
  activePlayer.eddies = 10;
  const cardId = activePlayer.zones.hand[0] as string;

  const engine = new LocalEngine(state);
  const result = engine.processCommand(
    { commandID: "cmd-1", move: "playCard", input: { args: { cardId } } },
    activePlayerId,
  );

  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.undoable).toBe(true);
  }
  expect(engine.canUndo()).toBe(true);
  expect(engine.undo()).toBe(true);
  expect(engine.getState().G.players[activePlayerId as string]!.zones.hand).toContain(cardId);
});

test("enumerateMoves returns available moves", async () => {
  registerMoves(allMoves);
  const catalog = createTestCatalog();
  const state = createMatchState({
    players: [
      { id: createPlayerId("p1"), name: "P1" },
      { id: createPlayerId("p2"), name: "P2" },
    ],
    catalog,
    deckLists: [createTestDeckList(), createTestDeckList2()],
    seed: "test-enumerate",
  });

  const { enumerateMoves } = await import("../src/command/index.ts");
  const activeId = state.G.turnMetadata.activePlayerId;
  const moves = enumerateMoves(state, activeId);

  expect(moves.length).toBeGreaterThan(0);
  expect(moves).toContain("mulligan");
  expect(moves).toContain("concede");
});
