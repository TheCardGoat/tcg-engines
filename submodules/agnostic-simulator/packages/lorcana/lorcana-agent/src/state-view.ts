import type { ServerGameEngine } from "@tcg/shared/game-engine";

/**
 * Compact, player-scoped Lorcana state view fed to the LLM. We intentionally
 * **omit** card images, full effect text, and timing-clock detail — the model
 * only needs the move-relevant signals (phase, lore, hand IDs + card defs,
 * board positions, pending choices) to rank legal moves. Anything heavier
 * inflates token cost without improving decisions.
 *
 * Schema is hand-written rather than echoing the full engine projection so
 * the JSON stays stable across engine internals refactors.
 */
export interface LorcanaAgentStateView {
  gameId: string;
  matchId: string;
  stateId: number;
  turn: number;
  phase?: string;
  step?: string | null;
  /** True when it is the actor's turn (their priority); informational only. */
  isActorTurn: boolean;
  /** "playing" while in-progress; "finished" when terminal. */
  status: "playing" | "finished" | "unknown";
  /** Populated only when a player owes a forced choice (mulligan, target pick, etc.). */
  pendingChoice?: { type: string; forPlayer: string };
  /** Active bag effects awaiting resolution (top-of-stack first). */
  pendingBag: ReadonlyArray<{ id: string; type: string; chooserId: string }>;
  /** Effects waiting on player resolution. */
  pendingEffects: ReadonlyArray<{ id: string }>;
  actor: LorcanaAgentPlayerView;
  opponent: LorcanaAgentPlayerView;
}

export interface LorcanaAgentPlayerView {
  id: string;
  lore: number;
  canAddCardToInkwell: boolean;
  handCount: number;
  deckCount: number;
  discardCount: number;
  inkwellCount: number;
  inkwellReadyCount: number;
  /** Card IDs visible to the actor — own hand IDs in full; opponent hand IDs hidden. */
  hand?: ReadonlyArray<LorcanaAgentCardView>;
  play: ReadonlyArray<LorcanaAgentCardView>;
  inkwell: ReadonlyArray<LorcanaAgentCardView>;
  discard: ReadonlyArray<LorcanaAgentCardView>;
}

export interface LorcanaAgentCardView {
  id: string;
  definitionId?: string;
  cardType?: string;
  exerted?: boolean;
  drying?: boolean;
  damage?: number;
  strength?: number;
  willpower?: number;
  lore?: number;
  playCost?: number;
  classifications?: ReadonlyArray<string>;
  keywords?: ReadonlyArray<string>;
}

/**
 * Lorcana-specific narrowing of the agent-core engine handle. Carries the
 * projected board view through `getBoard()` and the Lorcana state through
 * `getState()`. We avoid importing `LorcanaServer` directly to keep the
 * agent decoupled from the server-adapter package's internals.
 */
interface LorcanaLikeBoard {
  gameID?: string;
  matchID?: string;
  stateID?: number;
  turnNumber?: number;
  phase?: string;
  step?: string | null;
  turnPlayer?: string | null;
  priorityPlayer?: string | null;
  status?: "playing" | "finished";
  pendingChoice?: { type: string; playerID: string };
  pendingEffects?: ReadonlyArray<{ id: string }>;
  bagEffects?: ReadonlyArray<{ id: string; type: string; chooserId: string }>;
  players?: Record<string, LorcanaLikePlayerBoard>;
  cards?: Record<string, LorcanaLikeCard>;
}

interface LorcanaLikePlayerBoard {
  lore?: number;
  canAddCardToInkwell?: boolean;
  handCount?: number;
  deckCount?: number;
  hand?: ReadonlyArray<string>;
  play?: ReadonlyArray<string>;
  inkwell?: ReadonlyArray<string>;
  discard?: ReadonlyArray<string>;
}

interface LorcanaLikeCard {
  id: string;
  definitionId?: string;
  cardType?: string;
  exerted?: boolean;
  drying?: boolean;
  damage?: number;
  strength?: number;
  willpower?: number;
  lore?: number;
  playCost?: number;
  classifications?: ReadonlyArray<string>;
  keywords?: ReadonlyArray<string>;
  hidden?: boolean;
}

interface LorcanaLikeEngineHandle {
  getBoard?(): LorcanaLikeBoard;
}

interface LorcanaLikeServerEngine extends ServerGameEngine {
  /** LorcanaServerEngine exposes `.engine: LorcanaServer`; LorcanaServer exposes getBoard(). */
  readonly engine?: LorcanaLikeEngineHandle;
}

const EMPTY_PLAYER: LorcanaLikePlayerBoard = {};

/**
 * Render a Lorcana state for the LLM. Defensive against missing fields —
 * returns a usable view even if the engine's board projection is partial.
 */
export function serializeLorcanaState(input: {
  engine: ServerGameEngine;
  actorId: string;
}): LorcanaAgentStateView {
  const engine = input.engine as LorcanaLikeServerEngine;
  const board = engine.engine?.getBoard?.() ?? {};
  const cards = board.cards ?? {};
  const players = board.players ?? {};

  const opponentId = pickOpponentId(players, input.actorId);

  const actorBoard = players[input.actorId] ?? EMPTY_PLAYER;
  const opponentBoard = opponentId ? (players[opponentId] ?? EMPTY_PLAYER) : EMPTY_PLAYER;

  return {
    gameId: board.gameID ?? "",
    matchId: board.matchID ?? "",
    stateId: board.stateID ?? 0,
    turn: board.turnNumber ?? 0,
    phase: board.phase,
    step: board.step,
    isActorTurn: board.priorityPlayer === input.actorId,
    status: board.status ?? "unknown",
    pendingChoice: board.pendingChoice
      ? { type: board.pendingChoice.type, forPlayer: board.pendingChoice.playerID }
      : undefined,
    pendingBag: (board.bagEffects ?? []).map((eff) => ({
      id: eff.id,
      type: eff.type,
      chooserId: eff.chooserId,
    })),
    pendingEffects: (board.pendingEffects ?? []).map((eff) => ({ id: eff.id })),
    actor: serializePlayerBoard({
      id: input.actorId,
      board: actorBoard,
      cards,
      revealHand: true,
    }),
    opponent: serializePlayerBoard({
      id: opponentId ?? "unknown",
      board: opponentBoard,
      cards,
      revealHand: false,
    }),
  };
}

function pickOpponentId(
  players: Record<string, LorcanaLikePlayerBoard>,
  actorId: string,
): string | undefined {
  for (const id of Object.keys(players)) {
    if (id !== actorId) return id;
  }
  return undefined;
}

function serializePlayerBoard(input: {
  id: string;
  board: LorcanaLikePlayerBoard;
  cards: Record<string, LorcanaLikeCard>;
  revealHand: boolean;
}): LorcanaAgentPlayerView {
  const { id, board, cards, revealHand } = input;
  const inkwellIds = board.inkwell ?? [];
  const inkwellCards = inkwellIds.map((cardId) => cards[cardId]).filter(isDefined);
  const inkwellReadyCount = inkwellCards.filter((c) => !c.exerted).length;

  return {
    id,
    lore: board.lore ?? 0,
    canAddCardToInkwell: board.canAddCardToInkwell ?? false,
    handCount: board.handCount ?? board.hand?.length ?? 0,
    deckCount: board.deckCount ?? 0,
    discardCount: (board.discard ?? []).length,
    inkwellCount: inkwellIds.length,
    inkwellReadyCount,
    hand: revealHand
      ? (board.hand ?? []).map((cid) => projectCard(cards[cid] ?? { id: cid }))
      : undefined,
    play: (board.play ?? []).map((cid) => projectCard(cards[cid] ?? { id: cid })),
    inkwell: inkwellIds.map((cid) => projectCard(cards[cid] ?? { id: cid })),
    discard: (board.discard ?? []).map((cid) => projectCard(cards[cid] ?? { id: cid })),
  };
}

function projectCard(card: LorcanaLikeCard): LorcanaAgentCardView {
  return {
    id: card.id,
    definitionId: card.definitionId,
    cardType: card.cardType,
    exerted: card.exerted,
    drying: card.drying,
    damage: card.damage,
    strength: card.strength,
    willpower: card.willpower,
    lore: card.lore,
    playCost: card.playCost,
    classifications: card.classifications,
    keywords: card.keywords,
  };
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}
