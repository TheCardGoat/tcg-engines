import { describe, expect, it } from "bun:test";
import {
  type CardInstanceId,
  type ChallengePreviewResult,
  type LorcanaEngineBase,
  type LorcanaProjectedBoardView,
  createEmptyMatchStaticResources,
  createPlayerId,
} from "@tcg/lorcana-engine";

import { LorcanaGameContext } from "@/features/simulator/context/game-context.svelte.js";
import type { MoveLogEntrySnapshot } from "@/features/simulator/model/contracts.js";
import { createLogEntry } from "@/features/simulator-devtools/test-data/factories.js";

const attackerId = "attacker-1" as CardInstanceId;
const defenderId = "defender-1" as CardInstanceId;

interface TestEngine {
  engine: LorcanaEngineBase["engine"];
  staticResources: LorcanaEngineBase["staticResources"];
  getBoard: () => LorcanaProjectedBoardView;
  getState: () => { ctx: { _stateID: number } };
  getStateID: () => number;
  getClientPlayerId: () => string | undefined;
  enumerateMoves: () => string[];
  getCachedLegalMoveIds: () => string[];
  canUndo?: (playerId?: string) => boolean;
  getMoveLog?: () => MoveLogEntrySnapshot[];
  previewChallenge?: (attackerId: string, defenderId: string) => ChallengePreviewResult | null;
}

interface MutableTestEngine extends TestEngine {
  setBoard: (nextBoard: LorcanaProjectedBoardView) => void;
  setMoveLogEntries: (nextMoveLogEntries: MoveLogEntrySnapshot[]) => void;
  callCounts: {
    enumerateMoves: number;
    getAvailableMoves: number;
    getMoveOptions: number;
    validateMove: number;
  };
}

function toEngine(engine: TestEngine): LorcanaEngineBase {
  return Object.assign(Object.create(null), engine) as LorcanaEngineBase;
}

function createBoard(stateID: number): LorcanaProjectedBoardView {
  const playerOne = createPlayerId("player_one");
  const playerTwo = createPlayerId("player_two");

  return {
    gameID: "game-1",
    matchID: "match-1",
    stateID,
    gameSegment: "main",
    phase: "mainPhase",
    playerOrder: [playerOne, playerTwo],
    priorityPlayer: playerOne,
    turnPlayer: playerOne,
    turnNumber: 1,
    openingTurnPlayer: playerOne,
    pendingMulligan: [],
    choosingFirstPlayer: null,
    status: "playing",
    winner: null,
    reason: null,
    timerView: {
      serverTimestamp: 0,
      players: {},
    },
    cards: {},
    players: {
      player_one: {
        canAddCardToInkwell: false,
        lore: 5,
        deckCount: 50,
        handCount: 7,
        hand: [],
        play: [],
        inkwell: [],
        discard: [],
      },
      player_two: {
        canAddCardToInkwell: false,
        lore: 3,
        deckCount: 50,
        handCount: 7,
        hand: [],
        play: [],
        inkwell: [],
        discard: [],
      },
    },
    activeEffects: [],
    bagEffects: [],
    pendingEffects: [],
  };
}

function createChallengeBoard(stateID: number): LorcanaProjectedBoardView {
  const board = createBoard(stateID);
  const playerOne = board.playerOrder[0]!;
  const playerTwo = board.playerOrder[1]!;

  return {
    ...board,
    cards: {
      [attackerId]: {
        id: attackerId,
        ownerId: playerOne,
        zone: "play",
        zoneIndex: 0,
        hidden: false,
        cardType: "character",
        fullName: "Attacker",
        exerted: false,
        drying: false,
        damage: 0,
        strength: 2,
        willpower: 2,
        lore: 1,
        playCost: 2,
        moveCost: 0,
        canBePutInInkwell: false,
        hasSupport: false,
        hasRush: false,
        hasReckless: false,
        hasEvasive: false,
        hasQuestRestriction: false,
        keywords: [],
        keywordValues: {},
        classifications: [],
      },
      [defenderId]: {
        id: defenderId,
        ownerId: playerTwo,
        zone: "play",
        zoneIndex: 0,
        hidden: false,
        cardType: "character",
        fullName: "Defender",
        exerted: true,
        drying: false,
        damage: 0,
        strength: 2,
        willpower: 2,
        lore: 1,
        playCost: 2,
        moveCost: 0,
        canBePutInInkwell: false,
        hasSupport: false,
        hasRush: false,
        hasReckless: false,
        hasEvasive: false,
        hasQuestRestriction: false,
        keywords: [],
        keywordValues: {},
        classifications: [],
      },
    },
    players: {
      ...board.players,
      player_one: {
        ...board.players.player_one,
        play: [attackerId],
      },
      player_two: {
        ...board.players.player_two,
        play: [defenderId],
      },
    },
  };
}

function createEngine(options?: {
  board?: LorcanaProjectedBoardView;
  moveLogEntries?: MoveLogEntrySnapshot[];
  enumerateMoves?: () => string[];
  getAvailableMoves?: () => Array<{ moveId: string; selectableCardIds: string[] }>;
  getMoveOptions?: () => Array<{ kind: "card"; cardId: CardInstanceId }>;
  validateMove?: () => { valid: boolean };
}): MutableTestEngine {
  let board = options?.board ?? createBoard(1);
  let moveLogEntries = options?.moveLogEntries ?? [];
  const callCounts = {
    enumerateMoves: 0,
    getAvailableMoves: 0,
    getMoveOptions: 0,
    validateMove: 0,
  };

  return {
    engine: Object.create(null) as LorcanaEngineBase["engine"],
    staticResources: createEmptyMatchStaticResources(),
    getBoard: () => board,
    getState: () => ({ ctx: { _stateID: board.stateID } }),
    getStateID: () => board.stateID,
    getClientPlayerId: () => "player_one",
    enumerateMoves: () => {
      callCounts.enumerateMoves += 1;
      return options?.enumerateMoves?.() ?? [];
    },
    getCachedLegalMoveIds: () => options?.enumerateMoves?.() ?? [],
    getAvailableMoves: () => {
      callCounts.getAvailableMoves += 1;
      return options?.getAvailableMoves?.() ?? [];
    },
    getMoveOptions: () => {
      callCounts.getMoveOptions += 1;
      return options?.getMoveOptions?.() ?? [];
    },
    validateMove: () => {
      callCounts.validateMove += 1;
      return options?.validateMove?.() ?? { valid: true };
    },
    getMoveLog: () => moveLogEntries,
    previewChallenge: () => null,
    callCounts,
    setBoard(nextBoard: LorcanaProjectedBoardView) {
      board = nextBoard;
    },
    setMoveLogEntries(nextMoveLogEntries: MoveLogEntrySnapshot[]) {
      moveLogEntries = nextMoveLogEntries;
    },
  } as MutableTestEngine;
}

describe("lorcana game context", () => {
  it("populates move log entries from the engine snapshot refresh", () => {
    const initialEntries = [createLogEntry("Played Stitch")];
    const engine = createEngine({ moveLogEntries: initialEntries });

    const context = new LorcanaGameContext(toEngine(engine));

    expect(context.moveLogEntries()).toEqual(initialEntries);
  });

  it("updates move log entries when the engine state changes", () => {
    const initialEntries = [createLogEntry("Played Stitch")];
    const updatedEntries = [createLogEntry("Quested with Ariel"), createLogEntry("Passed turn")];
    const engine = createEngine({
      board: createBoard(10),
      moveLogEntries: initialEntries,
    });

    const context = new LorcanaGameContext(toEngine(engine));

    engine.setBoard(createBoard(11));
    engine.setMoveLogEntries(updatedEntries);
    context.handleLocaleChanged();

    expect(context.moveLogEntries()).toEqual(updatedEntries);
  });

  it("reads move log entries from the supplied read model when the engine does not expose them", () => {
    const entries = [createLogEntry("Moved to the inkwell")];
    const engine = createEngine();
    const { getMoveLog: _unusedGetMoveLog, ...engineWithoutMoveLog } = engine;

    const context = new LorcanaGameContext(toEngine(engineWithoutMoveLog), {
      getMoveLog: () => entries,
    });

    expect(context.moveLogEntries()).toEqual(entries);
  });

  it("refreshes the board snapshot when the read model emits a state update", () => {
    const engine = createEngine({ board: createBoard(10) });
    let notifyRef: { notify: (() => void) | null } = { notify: null };
    const context = new LorcanaGameContext(toEngine(engine), {
      getMoveLog: () => [],
      subscribeStateUpdates(handler: (stateID: number) => void) {
        notifyRef.notify = () => handler(0);
        return () => {
          notifyRef.notify = null;
        };
      },
    });

    engine.setBoard(createBoard(11));
    notifyRef.notify?.();

    expect(context.boardSnapshot()?.stateID).toBe(11);
  });

  it("does not recompute derived moves when read-model revision changes without a state change", () => {
    const engine = createEngine({ board: createBoard(10) });
    let notifyRef: { notify: (() => void) | null } = { notify: null };
    new LorcanaGameContext(toEngine(engine), {
      getMoveLog: () => [],
      subscribeStateUpdates(handler: (stateID: number) => void) {
        notifyRef.notify = () => handler(1);
        return () => {
          notifyRef.notify = null;
        };
      },
    });

    expect(engine.callCounts.enumerateMoves).toBe(0);
    expect(engine.callCounts.getAvailableMoves).toBe(1);

    notifyRef.notify?.();

    expect(engine.callCounts.enumerateMoves).toBe(0);
    expect(engine.callCounts.getAvailableMoves).toBe(1);
  });

  it("reuses cached challenge target state when reselecting the same attacker in the same state", () => {
    const engine = createEngine({
      board: createChallengeBoard(20),
      enumerateMoves: () => ["challenge"],
      getAvailableMoves: () => [{ moveId: "challenge", selectableCardIds: [attackerId] }],
      getMoveOptions: () => [{ kind: "card", cardId: defenderId }],
      validateMove: () => ({ valid: false }),
    });

    const context = new LorcanaGameContext(toEngine(engine));

    context.setChallengeSourceCardId(attackerId);
    expect(engine.callCounts.getMoveOptions).toBe(1);
    expect(engine.callCounts.validateMove).toBe(0);

    context.setChallengeSourceCardId(null);
    context.setChallengeSourceCardId(attackerId);

    expect(engine.callCounts.getMoveOptions).toBe(1);
    expect(engine.callCounts.validateMove).toBe(0);
    expect(context.validChallengeTargetIds()).toEqual([defenderId]);
  });

  it("passes challenge previews through from the engine", () => {
    const preview: ChallengePreviewResult = {
      attackerId,
      defenderId,
      defenderKind: "character",
      attackerCurrentDamage: 1,
      defenderCurrentDamage: 2,
      attackerNextDamage: 4,
      defenderNextDamage: 5,
      attackerWillpower: 4,
      defenderWillpower: 5,
      attackerDamageDealt: 3,
      defenderDamageDealt: 3,
      attackerWouldBeBanished: true,
      defenderWouldBeBanished: true,
      attackerDamageIsReduced: false,
      defenderDamageIsReduced: false,
    };
    const engine = createEngine({
      board: createBoard(5),
    });
    engine.previewChallenge = (attackerId, defenderId) =>
      attackerId === "attacker-1" && defenderId === "defender-1" ? preview : null;

    const context = new LorcanaGameContext(toEngine(engine));

    expect(context.previewChallenge("attacker-1", "defender-1")).toEqual(preview);
    expect(context.previewChallenge("attacker-1", "missing")).toBeNull();
  });

  it("resolves player visual settings from owner ids and seat mapping", () => {
    const context = new LorcanaGameContext(toEngine(createEngine()), undefined, {
      player_one: { cardBack: "white", playmat: "elsa" },
      player_two: { cardBack: "yellow", playmat: "mulan" },
    });

    expect(context.getPlayerVisualSettingsByOwnerId("player_one")).toMatchObject({
      cardBack: {
        id: "white",
      },
      playmat: {
        id: "elsa",
      },
    });
    expect(context.getPlayerVisualSettings("playerOne")).toMatchObject({
      cardBack: {
        id: "white",
      },
      playmat: {
        id: "elsa",
      },
    });
    expect(context.getPlayerVisualSettings("playerTwo")).toMatchObject({
      cardBack: {
        id: "yellow",
      },
      playmat: {
        id: "mulan",
      },
    });
  });
});
