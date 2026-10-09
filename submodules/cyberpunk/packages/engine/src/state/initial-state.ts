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
import type { DieType } from "@tcg/cyberpunk-types";
import type { GameEvent } from "../types/game-events.ts";
import type { GigDie } from "../types/gig-die.ts";
import type { TimeControlConfig } from "@tcg/engine-core";
import {
  createCardInstanceId,
  createGigDieId,
  createPlayerId,
  createMatchId,
} from "../types/branded.ts";
import { createCardInstance } from "../types/card-instance.ts";
import { STANDARD_GIG_DICE } from "@tcg/cyberpunk-types";
import { SeededRNG } from "./rng.ts";
import { setCardRegistry } from "./card-registry.ts";

/** Number of cards drawn for the opening hand. (Rules: Setup → Draw 6.) */
const OPENING_HAND_SIZE = 6;

/** Constructed crews are three Legends. D.2.2 allows fewer and fills the rest with blank Eddies. */
const LEGEND_CREW_SIZE = 3;

/** Viewer projections use this prefix for cards whose identity was not sent. */
const PLACEHOLDER_DEFINITION_PREFIX = "viewer:";

/** A hidden or unknown card. The opening deal must never move one into a hand. */
export function isOpeningHandPlaceholderIdentity(definitionId: string): boolean {
  return definitionId.length === 0 || definitionId.startsWith(PLACEHOLDER_DEFINITION_PREFIX);
}

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
      removedFromGame: [],
    },
    combatPriority: "automatic",
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
    eventLogVersion: 2,
    players: {},
    cardIndex: {},
    gigDice: {},
    overtime: false,
    turnMetadata: {
      turnNumber: 1,
      activePlayerId: createPlayerId("p1"),
      previousTurnBeganWithEmptyFixer: false,
      turnBeganWithEmptyFixer: false,
      gigTakenThisTurn: false,
      playedCardTypesThisTurn: {},
      overtimeActive: false,
      abilityFiredThisTurn: [],
      firstTimeEventsThisTurn: [],
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
 * Present a player's Legends face-up in deck-list order, shuffle the main
 * deck into a face-down pile, and seed all 6 gig dice into the fixer area.
 * Mutates `state` and returns the populated {@link PlayerState}.
 *
 * Tournament Game 1 presents both decks and face-up Legends before anyone
 * chooses who goes first. CR 7.7 hides and randomizes Legends only after
 * that choice ({@link concealPresentedLegends}).
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

  // Burn the historical legend-shuffle draws so the main-deck order for a
  // seed stays on the same random stream. The presented order is the
  // registered list, not that discarded permutation.
  rng.shuffle([...deckList.legends]);
  // Legends stay in registration order and face-up until the first-player
  // choice. createCardInstance would otherwise mark the zone face-down.
  for (const defId of deckList.legends) {
    const def = catalog.get(defId);
    if (!def) throw new Error(`Legend card not found: ${defId}`);
    const instanceId = createCardInstanceId(ids.next("ci"));
    const instance = createCardInstance(instanceId, def, playerId, "legendArea", {
      faceDown: false,
    });
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
/**
 * Hide every presented Legend, then randomize each Legends area.
 *
 * Tournament play sequence: after the first-player choice, the three Legends
 * are placed face-down in random order (CR 4.3, 5.7.1, 7.7.1–7.7.3). The
 * first player's two left-most spent Legends are applied only after this.
 */
export function concealPresentedLegends(state: MatchState): GameEvent[] {
  const events: GameEvent[] = [];
  for (const playerId of state.ctx.playerIds) {
    const player = state.G.players[playerId as string];
    if (!player || player.zones.legendArea.length === 0) continue;
    for (const cardId of player.zones.legendArea) {
      const card = state.G.cardIndex[cardId as string];
      if (card) card.meta.faceDown = true;
    }
    // Separate from the match stream so hiding Legends does not reshuffle
    // the main deck or later die rolls.
    const rng = new SeededRNG(`${state.ctx.seed}:legends:${playerId as string}`);
    player.zones.legendArea = rng.shuffle(player.zones.legendArea);
    events.push({ type: "legendsShuffled", playerId });
  }
  return events;
}

export function applyChooserGoesFirstIfPending(state: MatchState): void {
  const choice = state.G.turnMetadata.pendingChoice;
  if (!choice || choice.type !== "chooseFirstPlayer") return;
  applyFirstPlayerChoice(state, choice.chooserId);
}

/** Apply an authoritative turn-order decision during setup or game creation. */
export function applyFirstPlayerChoice(
  state: MatchState,
  firstPlayerId: PlayerId,
): { events: GameEvent[]; blankEddieCounts: Record<string, number> } {
  const choice = state.G.turnMetadata.pendingChoice;
  if (choice?.type !== "chooseFirstPlayer" || !state.ctx.playerIds.includes(firstPlayerId)) {
    throw new Error("Invalid first-player choice for this game");
  }
  const events = concealPresentedLegends(state);
  for (const pid of state.ctx.playerIds) {
    const player = state.G.players[pid as string];
    if (player) player.firstPlayer = pid === firstPlayerId;
  }
  state.G.turnMetadata.activePlayerId = firstPlayerId;
  state.G.turnMetadata.pendingChoice = undefined;
  if (state.ctx.clockState) {
    for (const [playerId, clock] of Object.entries(state.ctx.clockState)) {
      clock.isOnClock = playerId === firstPlayerId;
    }
  }
  return { events, ...applyOpeningHand(state, firstPlayerId) };
}

/**
 * Move the top of the deck into the Eddies area for each Legend short of a
 * full crew. The card stays face-down and unrevealed (CR 5.8.3.1). This is
 * not a sell, so it does not spend the once-per-turn sell.
 */
function placeBlankEddies(state: MatchState, playerId: PlayerId): number {
  const player = state.G.players[playerId as string];
  if (!player) return 0;
  const missing = Math.max(0, LEGEND_CREW_SIZE - player.zones.legendArea.length);
  let placed = 0;
  for (let index = 0; index < missing; index += 1) {
    const nextId = player.zones.deck[0];
    if (!nextId) break;
    const card = state.G.cardIndex[nextId as string];
    if (!card) break;
    player.zones.deck.shift();
    card.zone = "eddieArea";
    card.meta.faceDown = true;
    card.meta.revealed = false;
    card.meta.spent = false;
    player.zones.eddieArea.push(nextId);
    player.eddieCardIds.push(nextId);
    player.eddies += 1;
    placed += 1;
  }
  return placed;
}

export function applyOpeningHand(
  state: MatchState,
  firstPlayerId: PlayerId,
): { blankEddieCounts: Record<string, number> } {
  const blankEddieCounts: Record<string, number> = {};
  if (state.G.blankEddiesForMissingLegends && !state.G.blankEddiesPlaced) {
    state.G.blankEddiesPlaced = true;
    for (const playerId of state.ctx.playerIds) {
      blankEddieCounts[playerId as string] = placeBlankEddies(state, playerId);
    }
  }

  for (const playerId of state.ctx.playerIds) {
    const player = state.G.players[playerId as string]!;
    const isFirst = playerId === firstPlayerId;
    const legendsToSpend = state.G.blankEddiesForMissingLegends
      ? Math.min(FIRST_PLAYER_SPENT_LEGENDS, player.zones.legendArea.length)
      : player.zones.legendArea.length >= FIRST_PLAYER_SPENT_LEGENDS
        ? FIRST_PLAYER_SPENT_LEGENDS
        : 0;

    if (isFirst && legendsToSpend > 0) {
      for (let i = 0; i < legendsToSpend; i++) {
        const legId = player.zones.legendArea[i]!;
        state.G.cardIndex[legId as string]!.meta.spent = true;
      }
    }

    // Already dealt. A second call must not take more cards or rewrite faces.
    if (player.zones.hand.length > 0) continue;

    const drawn: CardInstanceId[] = [];
    for (let c = 0; c < OPENING_HAND_SIZE; c++) {
      const nextId = player.zones.deck[0];
      if (!nextId) break;
      const card = state.G.cardIndex[nextId as string];
      if (!card || isOpeningHandPlaceholderIdentity(card.definitionId)) break;
      player.zones.deck.shift();
      card.zone = "hand";
      card.meta.faceDown = false;
      drawn.push(nextId);
    }
    if (drawn.length > 0) player.zones.hand = drawn;
  }
  return { blankEddieCounts };
}

// ── Production entry point ───────────────────────────────────────────────

export interface CreateMatchStateOptions {
  players: PlayerSetup[];
  catalog: CardCatalog;
  deckLists: DeckList[];
  seed?: string;
  matchId?: string;
  timeControl?: TimeControlConfig;
  /** Series chooser assigned by the host; omit to select a chooser at random. */
  firstPlayerChooserId?: string;
  /** Decision already made during hosted pregame; omit for an in-engine choice. */
  firstTurnPlayerId?: string;
  /** Format setup that constructed Alpha does not use. */
  setup?: {
    blankEddiesForMissingLegends?: boolean;
  };
}

/**
 * Build a {@link MatchState} ready for the setup phase.
 *
 * Resulting state:
 * - Each player's Legends presented face-up in deck-list order.
 * - Each player's main deck shuffled into a face-down pile.
 * - All 6 gig dice in each fixer area.
 * - A chooser is assigned by the host or selected at random, then chooses who starts.
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
  const designatedChooserId = options.firstPlayerChooserId
    ? createPlayerId(options.firstPlayerChooserId)
    : undefined;
  if (designatedChooserId && !playerIds.includes(designatedChooserId)) {
    throw new Error(`First-player chooser ${designatedChooserId} is not seated in this game`);
  }
  const firstPlayerChooserId = designatedChooserId ?? chooseFirstPlayer(playerIds, rng);

  const G = createInitialGameState();
  G.turnMetadata.activePlayerId = firstPlayerChooserId;
  if (options.setup?.blankEddiesForMissingLegends) G.blankEddiesForMissingLegends = true;

  for (let i = 0; i < playerIds.length; i++) {
    const pid = playerIds[i]!;
    G.players[pid as string] = createEmptyPlayerState(pid, false);
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
          isOnClock: playerId === firstPlayerChooserId,
        },
      ]),
    );
  }

  const state: MatchState = { G, ctx };

  for (let i = 0; i < playerIds.length; i++) {
    populatePlayerBoard(state, playerIds[i]!, options.deckLists[i]!, options.catalog, rng, ids);
  }

  G.turnMetadata.pendingChoice = {
    type: "chooseFirstPlayer",
    chooserId: firstPlayerChooserId,
    effectId: "",
    payload: {},
  };

  if (options.firstTurnPlayerId) {
    applyFirstPlayerChoice(state, createPlayerId(options.firstTurnPlayerId));
  }

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
