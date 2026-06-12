import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import type {
  MatchState,
  GameState,
  EngineCtx,
  PlayerState,
  CardCatalog,
  DeckList,
  PlayerSetup,
} from "../types/match-state.ts";
import type { GigDie, DieType } from "../types/gig-die.ts";
import type { TimeControlConfig } from "@tcg/engine-core";
import {
  createCardInstanceId,
  createGigDieId,
  createPlayerId,
  createMatchId,
} from "../types/branded.ts";
import { createCardInstance } from "../types/card-instance.ts";
import { STANDARD_GIG_DICE } from "../types/gig-die.ts";
import { SeededRNG } from "./rng.ts";
import { setCardRegistry } from "./card-registry.ts";

/** Number of cards drawn for the opening hand. (Rules: Setup → Draw 6.) */
const OPENING_HAND_SIZE = 6;

/** Spent-legend count given to the first player at game start. (Rules: Setup.) */
const FIRST_PLAYER_SPENT_LEGENDS = 2;

// ── Helpers — board state ────────────────────────────────────────────────

/**
 * Empty per-player state. Zones are empty; no eddies; mulligan flag clear.
 * Use {@link populatePlayerBoard} to fill zones from a deck list.
 */
export function createEmptyPlayerState(playerId: PlayerId, isFirst: boolean): PlayerState {
  // playerId is part of the function signature so callers can keep track of
  // which state belongs to whom even before the player is wired into G.players.
  void playerId;
  return {
    zones: {
      legendArea: [],
      field: [],
      hand: [],
      deck: [],
      trash: [],
      gigArea: [],
      eddieArea: [],
    },
    eddies: 0,
    spentEddies: 0,
    fixerArea: [],
    gigArea: [],
    soldThisTurn: false,
    calledLegendThisTurn: false,
    calledLegendThisRivalTurn: false,
    firstPlayer: isFirst,
    mulliganDone: false,
    eddieCardIds: [],
  };
}

/**
 * Empty {@link GameState}. No players, no card index, no gig dice — call
 * {@link createMatchState} to produce a runnable state.
 */
export function createInitialGameState(): GameState {
  return {
    players: {},
    cardIndex: {},
    gigDice: {},
    overtime: false,
    turnMetadata: {
      turnNumber: 1,
      activePlayerId: createPlayerId("p1"),
      previousTurnNoGigTaken: false,
      gigTakenThisTurn: false,
      overtimeActive: false,
      abilityFiredThisTurn: [],
      triggerQueue: [],
      nextTriggerId: 1,
    },
    activeEffects: [],
    nextEffectId: 0,
    effectBag: [],
    gamePhase: "setup",
    attackState: null,
    gameEnded: false,
    winnerId: null,
    winReason: null,
  };
}

interface IdGenerator {
  next(prefix: string): string;
}

function makeIdGenerator(rng: SeededRNG): IdGenerator {
  const used = new Set<string>();
  return {
    next(prefix) {
      let id: string;
      do {
        id = `${prefix}_${rng.nextInt(0, 999999999)}`;
      } while (used.has(id));
      used.add(id);
      return id;
    },
  };
}

/**
 * Place a player's legends face-down (random order), shuffle the main deck,
 * and seed all 6 gig dice into the fixer area. Mutates `state` and returns
 * the populated {@link PlayerState}.
 *
 * Rules: Setup → "Place 3 Legends face-down in random order. Shuffle every
 * non-Legend card into the deck. Put all Gig Dice in the fixer area."
 */
export function populatePlayerBoard(
  state: MatchState,
  playerId: PlayerId,
  deckList: DeckList,
  catalog: CardCatalog,
  rng: SeededRNG,
  ids: IdGenerator,
): PlayerState {
  const player = state.G.players[playerId as string];
  if (!player) throw new Error(`Player ${playerId as string} not found in state`);

  // Legends — random order, face-down (createCardInstance auto-sets faceDown
  // when zone is "legendArea").
  for (const defId of rng.shuffle([...deckList.legends])) {
    const def = catalog.get(defId);
    if (!def) throw new Error(`Legend card not found: ${defId}`);
    const instanceId = createCardInstanceId(ids.next("ci"));
    const instance = createCardInstance(instanceId, def, playerId, "legendArea");
    instance.meta.faceDown = true;
    state.G.cardIndex[instanceId as string] = instance;
    player.zones.legendArea.push(instanceId);
  }

  // Main deck — shuffled.
  for (const defId of rng.shuffle([...deckList.mainDeck])) {
    const def = catalog.get(defId);
    if (!def) throw new Error(`Card not found: ${defId}`);
    const instanceId = createCardInstanceId(ids.next("ci"));
    const instance = createCardInstance(instanceId, def, playerId, "deck");
    state.G.cardIndex[instanceId as string] = instance;
    player.zones.deck.push(instanceId);
  }

  // Fixer area — all 6 standard gig dice, face value 0 (unrolled).
  for (const dieType of STANDARD_GIG_DICE) {
    const dieId = createGigDieId(ids.next("gd"));
    const die: GigDie = {
      id: dieId,
      dieType: dieType as DieType,
      faceValue: 0,
      location: "fixerArea",
      ownerId: playerId,
    };
    state.G.gigDice[dieId as string] = die;
    player.fixerArea.push(dieId);
  }

  return player;
}

/**
 * Pick the first player uniformly at random from the seeded RNG. Returns the
 * chosen id without mutating `state`.
 *
 * Rules: Setup → "Randomly choose the first player."
 */
export function chooseFirstPlayer(playerIds: PlayerId[], rng: SeededRNG): PlayerId {
  const idx = rng.nextInt(0, playerIds.length - 1);
  return playerIds[idx]!;
}

/**
 * Apply the rules' opening-hand step: stamp 2 legends spent for the first
 * player, then draw 6 cards into each player's hand.
 *
 * Rules: Setup →
 *   - "Make the first player begin the game with 2 spent Legends."
 *   - "Draw 6 cards for the opening hand."
 *
 * The mulligan window opens *after* this step (gamePhase remains `setup`);
 * the mulligan move is what swaps a hand back for 6 fresh cards.
 */
export function applyOpeningHand(state: MatchState, firstPlayerId: PlayerId): void {
  for (const playerId of state.ctx.playerIds) {
    const player = state.G.players[playerId as string]!;
    const isFirst = playerId === firstPlayerId;

    if (isFirst && player.zones.legendArea.length >= FIRST_PLAYER_SPENT_LEGENDS) {
      for (let i = 0; i < FIRST_PLAYER_SPENT_LEGENDS; i++) {
        const legId = player.zones.legendArea[i]!;
        state.G.cardIndex[legId as string]!.meta.spent = true;
      }
    }

    const drawn: CardInstanceId[] = [];
    for (let c = 0; c < OPENING_HAND_SIZE; c++) {
      const cardId = player.zones.deck.shift();
      if (cardId) {
        state.G.cardIndex[cardId as string]!.zone = "hand";
        drawn.push(cardId);
      }
    }
    player.zones.hand = drawn;
  }
}

// ── Production entry point ───────────────────────────────────────────────

export interface CreateMatchStateOptions {
  players: PlayerSetup[];
  catalog: CardCatalog;
  deckLists: DeckList[];
  seed?: string;
  matchId?: string;
  timeControl?: TimeControlConfig;
}

/**
 * Build a {@link MatchState} ready for the setup phase.
 *
 * Resulting state:
 * - Each player's legends placed face-down in random order.
 * - Each player's main deck shuffled.
 * - All 6 gig dice in each fixer area.
 * - First player chosen randomly; their first 2 legends start spent.
 * - Both players holding a 6-card opening hand.
 * - `gamePhase = "setup"` so the mulligan move and legacy setup-start `passPhase`
 *   are still legal. `turnNumber = 1`.
 *
 * Use this from {@link LocalEngine} for production sessions. The matching
 * test helper is `createTestMatchState` (see `testing/test-state.ts`).
 */
export function createMatchState(options: CreateMatchStateOptions): MatchState {
  if (options.players.length !== 2) {
    throw new Error(`createMatchState expects exactly 2 players, got ${options.players.length}`);
  }
  if (options.deckLists.length !== options.players.length) {
    throw new Error(
      `createMatchState expects one deck list per player (got ${options.deckLists.length} for ${options.players.length} players)`,
    );
  }

  setCardRegistry(options.catalog);

  // Determinism: when no seed is provided we use a stable default so a fresh
  // `createMatchState({...})` produces the same shuffle, first-player choice,
  // and legend layout on every call. Production sessions that need
  // per-match uniqueness must supply their own seed (and matchId).
  const seed = options.seed ?? "default";
  const rng = new SeededRNG(seed);
  const ids = makeIdGenerator(rng);

  const playerIds = options.players.map((p) => createPlayerId(p.id));
  const matchId = createMatchId(options.matchId ?? `match_${seed}`);
  const firstPlayerId = chooseFirstPlayer(playerIds, rng);

  const G = createInitialGameState();
  G.turnMetadata.activePlayerId = firstPlayerId;

  for (let i = 0; i < playerIds.length; i++) {
    const pid = playerIds[i]!;
    G.players[pid as string] = createEmptyPlayerState(pid, pid === firstPlayerId);
  }

  const ctx: EngineCtx = {
    matchId,
    stateID: 0,
    playerIds,
    seed,
    rngState: rng.getState(),
  };
  const timeControl = options.timeControl;
  if (timeControl && timeControl.mode !== "none") {
    const now = Date.now();
    ctx.timeControl = timeControl;
    ctx.clockState = Object.fromEntries(
      playerIds.map((playerId) => [
        playerId as string,
        {
          reserveMsRemaining: initialReserveMs(timeControl),
          totalConsumedMs: 0,
          movesMade: 0,
          lastUpdatedAtMs: now,
          isOnClock: playerId === firstPlayerId,
        },
      ]),
    );
  }

  const state: MatchState = { G, ctx };

  for (let i = 0; i < playerIds.length; i++) {
    populatePlayerBoard(state, playerIds[i]!, options.deckLists[i]!, options.catalog, rng, ids);
  }

  applyOpeningHand(state, firstPlayerId);

  // Persist RNG advance from setup so tests + replays see deterministic
  // post-setup randomness.
  ctx.rngState = rng.getState();

  return state;
}

function initialReserveMs(config: TimeControlConfig): number {
  switch (config.mode) {
    case "none":
      return 0;
    case "chess":
    case "dynamic":
      return config.config.initialReserveMs;
    case "priority":
      return config.config.reserveMs;
  }
}

export function getOpponentId(state: MatchState, playerId: PlayerId): PlayerId {
  return state.ctx.playerIds.find((id) => id !== playerId)!;
}
