/**
 * Runtime Types - MatchState<G> and TCGCtx
 *
 * Implements the boardgame.io-style state split:
 * - G: game-owned state (game-specific)
 * - ctx: framework-owned runtime state
 */

import type { LorcanaDomainEvent } from "../../types/domain-events";
import type { LorcanaG } from "../../types/runtime-state";
import type { PlayerId } from "../types";
import type { Player } from "./match-runtime.types";

// Re-export for runtime module consumers (e.g. match-runtime)
export type { PlayerId };

type CardMeta<M = unknown> = Record<string, M>;
type ZoneId = string;
type CardInstanceId = string;
// =============================================================================
// Match State Envelope
// =============================================================================

/**
 * Unified authoritative match state envelope
 */
export type MatchState = {
  G: LorcanaG; // game-specific state (developer-owned)
  ctx: TCGCtx; // framework-owned runtime state (engine-owned)
};

// =============================================================================
// TCG Context (ctx)
// =============================================================================

/**
 * Framework-managed runtime context
 *
 * All fields are serializable and authoritative.
 * Filtered before network delivery based on role.
 */
export type TCGCtx = {
  protocolVersion: number;
  matchID: string;
  gameID: string;
  rulesetHash: string;
  _stateID: number; // monotonically increasing state version
  /** Canonical ordered list of player IDs for this match. */
  playerIds: PlayerId[];
  zones: ZoneRuntimeState;
  status: CtxStatus;
  priority: CtxPriority;
  time: TimeContext;
  random: CtxRandom;
};

// =============================================================================
// Status (Flow / Game Status)
// =============================================================================

export type CtxStatus = {
  gameSegment?: string;
  phase?: string;
  step?: string;
  turn: number;
  gameEnded: boolean;
  winner?: string;
  reason?: string;
  /** Canonical active turn owner. Separate from `priority.holder`. */
  turnOwnerId?: string;
  /** Player id who is on the play (goes first). Set when first player is chosen. */
  otp?: string;
  /** Player id who has priority to choose who goes first (e.g. winner of tiebreaker). */
  choosingFirstPlayer?: string;
  /** Player ids who have not yet completed mulligan. When empty, mulligan phase can end. */
  pendingMulligan?: string[];
};

// =============================================================================
// Priority (TCG Response Window State)
// =============================================================================

export type CtxPriority = {
  holder?: string; // current priority player
  windowOpen: boolean;
  passSequence: string[]; // consecutive pass order tracking
  stackDepth: number;
  pendingChoice?: {
    type: string;
    playerID: string;
    requestID: string;
  };
};

// =============================================================================
// Zones (First-Class Runtime State)
// =============================================================================

export type ZoneRuntimeState = {
  public: {
    zoneSummaries: Record<ZoneId, PublicZoneSummary>;
  };
  reveals: {
    active: ZoneRevealWindow[];
    nextSeq?: number;
  };
  private: {
    zoneCards: Record<ZoneId, CardInstanceId[]>;
    cardIndex: Record<CardInstanceId, ZoneCardIndexEntry>;
    cardMeta: Record<CardInstanceId, CardMeta>;
  };
};

export type ZoneRuntimeDef = {
  id: ZoneId;
  name: string;
  visibility: "public" | "private" | "secret";
  ordered: boolean;
  ownerScoped: boolean;
  faceDown?: boolean;
  maxSize?: number;
};

export type PublicZoneSummary = {
  revision: number;
  count: number;
  topPublicCardID?: string;
};

export type ZoneCardIndexEntry = {
  zoneKey: ZoneId;
  index?: number;
  ownerID: PlayerId;
  controllerID: PlayerId;
};

export type ZoneRevealWindow = {
  revealID: string;
  cardIDs: CardInstanceId[];
  visibleTo: "all" | string[];
  expiresAtStateID?: number;
};

// =============================================================================
// Time Control (Passive Clock Management)
// =============================================================================

export type TimeContext =
  | { mode: "none" }
  | ChessClockContext
  | PriorityClockContext
  | DynamicClockContext;

export type ClockPauseReason =
  | "ENGINE_RESOLVING"
  | "SIMULTANEOUS_CHOICE"
  | "JUDGE_PAUSE"
  | "DISCONNECTED"
  | "MATCH_NOT_STARTED"
  | "GAME_ENDED"
  | "SERVER_RECOVERY";

export type ChessClockContext = {
  mode: "chess";
  running: boolean;
  activePlayerID?: string;
  startedAtMs?: number;
  pausedReason?: ClockPauseReason;
  players: Record<string, ChessClockPlayerState>;
  config: ChessClockConfig;
  /**
   * Time (ms) the current `activePlayerID` has held this priority window, as
   * settled so far. Resets to 0 each time `activePlayerID` changes. Combined
   * with `(now - startedAtMs)` while the clock is running this gives the full
   * "how long has this player been holding priority" value used by the
   * per-decision cap (`config.maxDecisionTimeMs`).
   */
  activePlayerAccumulatedMs?: number;
};

export type PriorityClockContext = {
  mode: "priority";
  running: boolean;
  activePlayerID?: string;
  startedAtMs?: number;
  pausedReason?: ClockPauseReason;
  prioritySeq: number;
  activeWindow?: {
    playerID: string;
    prioritySeq: number;
    windowMs: number;
    deadlineMs: number;
  };
  players: Record<string, PriorityClockPlayerState>;
  config: PriorityClockConfig;
};

export type ClockPlayerState = {
  reserveMsRemaining: number;
  totalConsumedMs: number;
  movesMade: number;
  lastUpdatedAtMs: number;
};

export type ChessClockPlayerState = ClockPlayerState & {
  timeoutCount: number;
  isInNegativeTime: boolean;
};

export type PriorityClockPlayerState = ClockPlayerState & {
  totalWindowOverageMs: number;
  moveBonusMsGranted: number;
  windowTimeouts: number;
};

export type DynamicClockPlayerState = ClockPlayerState & {
  timeoutCount: number;
  isInNegativeTime: boolean;
  actionBonusMsGranted: number;
  turnPassBonusMsGranted: number;
};

export type ChessClockConfig = {
  initialReserveMs: number;
  incrementMs: number;
  delayMs: number;
  graceMs: number;
  resetTimeOnSkipMs: number;
  lossPolicy: "lose-on-time";
  /**
   * Optional per-decision-window hard cap in ms. If the player who currently
   * holds priority (`time.activePlayerID`) consumes more than this on a
   * single priority window, `checkTimeout` reports a "first" timeout so the
   * opponent can invoke `skip_opponent_turn`. The cap resets every time
   * priority changes hands (turn pass, opponent trigger/target selection, etc.)
   * so legitimate multi-action turns are never penalised — only single
   * decisions that stall for too long. Independent of reserve.
   */
  maxDecisionTimeMs?: number;
};

export type PriorityClockConfig = {
  perPriorityWindowMs: number;
  reserveMs: number;
  perMoveBonusMs: number;
  endGameBaselineMs: number;
  graceMs: number;
  onWindowExpiry: "auto-pass-if-legal-else-forfeit";
  onReserveExpiry: "lose-on-time";
};

export type DynamicClockConfig = {
  initialReserveMs: number;
  reserveCapMs: number;
  perActionBonusMs: number;
  perTurnPassBonusMs: number;
  resetTimeOnSkipMs: number;
  graceMs: number;
  /** See `ChessClockConfig.maxDecisionTimeMs`. */
  maxDecisionTimeMs?: number;
};

export type DynamicClockContext = {
  mode: "dynamic";
  running: boolean;
  activePlayerID?: string;
  startedAtMs?: number;
  pausedReason?: ClockPauseReason;
  players: Record<string, DynamicClockPlayerState>;
  config: DynamicClockConfig;
  /** See `ChessClockContext.activePlayerAccumulatedMs`. */
  activePlayerAccumulatedMs?: number;
};

export type TimeControlConfig =
  | { mode: "none" }
  | { mode: "chess"; config: ChessClockConfig }
  | { mode: "priority"; config: PriorityClockConfig }
  | { mode: "dynamic"; config: DynamicClockConfig };

// =============================================================================
// Random, Log, Authz
// =============================================================================

export type CtxRandom = {
  seed: string;
  state: unknown; // server-private in filtered views
  draws: number;
};

// =============================================================================
// Roles and View Filtering
// =============================================================================

export type Role = "player" | "spectator" | "judge";

export type ViewRoleContext = {
  role: Role;
  playerID?: string; // set when role is "player"
};

// =============================================================================
// Commands and Events
// =============================================================================

export type CommandEnvelope<TInput extends MoveInput = MoveInput> = {
  commandID: string;
  move: string;
  input?: TInput;
  optimisticHint?: boolean;
  redactInput?: boolean;
};

export interface PacketAnimation<TKind extends string = string, TPayload = unknown> {
  id: string;
  kind: TKind;
  payload: TPayload;
}

export interface MoveTargetIntent<TTargetDSL = unknown> {
  argKey: string;
  target?: TTargetDSL;
  candidates?: readonly string[];
}

export interface MoveIntent<TArgs = unknown, TTargetDSL = unknown> {
  id: string;
  fixedArgs?: Partial<TArgs>;
  targets: readonly MoveTargetIntent<TTargetDSL>[];
}

export interface MoveInput<TArgs = unknown> {
  args: TArgs;
}

export const REDACTED_MOVE_INPUT = "[REDACTED]" as const;

export type RedactedMoveInput = typeof REDACTED_MOVE_INPUT;

export type SanitizedCommandEnvelope<TInput extends MoveInput = MoveInput> = Omit<
  CommandEnvelope<TInput>,
  "input"
> & {
  input: TInput | RedactedMoveInput;
};

export type LogValue = string | number | boolean | null;
export type EventDataValue = LogValue | EventDataValue[] | { [key: string]: EventDataValue };

export type EventCause =
  | {
      kind: "COMMAND";
      commandId?: string;
      move?: string;
    }
  | {
      kind: "TRIGGER";
      triggerId: string;
    }
  | {
      kind: "SYSTEM";
      source: "ZONE_OPERATION" | "STACK" | "STATE_BASED_ACTION" | "RUNTIME" | "UNKNOWN";
    };

export type CardFilterRef =
  | {
      kind: "definitionId";
      value: string;
    }
  | {
      kind: "tag";
      value: string;
    };

export type TriggerMatcher =
  | {
      on: "CARD_ENTERED_ZONE";
      zone?: string;
      cardFilter?: CardFilterRef;
    }
  | {
      on: "CARD_LEFT_ZONE";
      zone?: string;
      cardFilter?: CardFilterRef;
    }
  | {
      on: "DAMAGE_DEALT";
      minAmount?: number;
      targetKind?: "card" | "player";
      sourceFilter?: CardFilterRef;
    }
  | {
      on: "TURN_STARTED";
      player?: "self" | "opponent" | "any";
    }
  | {
      on: "CUSTOM";
      customType: string;
    };

export type TriggerDescriptor = {
  matcher: TriggerMatcher;
  optional?: boolean;
  effectRef?: string;
};

export type GameEvent =
  | {
      kind: "MOVE_EXECUTED";
      commandId: string;
      move: string;
      playerId: string;
      inputRedacted: boolean;
      input: unknown;
    }
  | {
      kind: "TURN_STARTED";
      playerId?: string;
      turn: number;
      phase?: string;
    }
  | {
      kind: "PRIORITY_PASSED";
      playerId: string;
    }
  | {
      kind: "GAME_ENDED";
      winner?: string;
      reason: string;
    }
  | LorcanaDomainEvent
  | {
      kind: "CARD_MOVED";
      cardId: string;
      fromZone?: string;
      toZone: string;
      index?: number;
      faceDown?: boolean;
      cause: EventCause;
    }
  | {
      kind: "CARD_ENTERED_ZONE";
      cardId: string;
      toZone: string;
      controllerId?: string;
      ownerId?: string;
      cause: EventCause;
    }
  | {
      kind: "CARD_LEFT_ZONE";
      cardId: string;
      fromZone: string;
      cause: EventCause;
    }
  | {
      kind: "CARDS_DRAWN";
      cardIds: string[];
      fromZone: string;
      toZone: string;
      playerId?: string;
      cause: EventCause;
    }
  | {
      kind: "CARDS_MILLED";
      cardIds: string[];
      fromZone: string;
      toZone: string;
      playerId?: string;
      cause: EventCause;
    }
  | {
      kind: "ZONE_SHUFFLED";
      zoneId: string;
      playerId?: string;
      cause: EventCause;
    }
  | {
      kind: "REVEAL_CREATED";
      revealId: string;
      cardIds: string[];
      visibleTo: "all" | string[];
      cause: EventCause;
    }
  | {
      kind: "REVEAL_CLEARED";
      revealId: string;
      cause: EventCause;
    }
  | {
      kind: "MULLIGAN_PERFORMED";
      playerId: string;
      returnedCardIds: string[];
      drawnCardIds: string[];
      cause: EventCause;
    }
  | {
      kind: "DAMAGE_DEALT";
      sourceCardId?: string;
      sourcePlayerId?: string;
      targetCardId?: string;
      targetPlayerId?: string;
      amount: number;
      damageKind: "combat" | "effect" | "loss_of_life";
      cause: EventCause;
    }
  | {
      kind: "CARD_DEFEATED";
      cardId: string;
      reason: "lethal_damage" | "zero_toughness" | "destroy_effect" | "rule";
      cause: EventCause;
    }
  | {
      kind: "TRIGGER_PREVENTED";
      triggerId: string;
      sourceId: string;
    }
  | {
      kind: "TRIGGER_QUEUED";
      triggerId: string;
      sourceId: string;
      controllerId: string;
      trigger: TriggerDescriptor;
      causedBy: string[];
    }
  | {
      kind: "TRIGGER_RESOLVED";
      triggerId: string;
      sourceId: string;
    }
  | {
      kind: "STACK_ITEM_ADDED";
      itemId: string;
      itemType: "spell" | "ability" | "trigger" | "effect";
      playerId: string;
      name: string;
    }
  | {
      kind: "STACK_ITEM_RESOLVED";
      itemId: string;
      itemType: "spell" | "ability" | "trigger" | "effect";
      playerId: string;
      name: string;
    }
  | {
      kind: "STATE_BASED_ACTION_APPLIED";
      action: "zeroToughness" | "lethalDamage" | "emptyLibraryDraw" | string;
    };

export type PublishedGameEvent = {
  seq: number;
  timestamp: number;
  stateId: number;
  event: GameEvent;
};

export type LogMessage = {
  key: string;
  values: Record<string, LogValue>;
};

export type LogVisibility =
  | { mode: "PUBLIC" }
  | { mode: "PRIVATE"; visibleTo: string[] }
  | { mode: "PUBLIC_WITH_OVERRIDES"; overrides: Record<string, LogMessage> };

// =============================================================================
// Filtered Views
// =============================================================================

/**
 * Filtered match view based on role
 *
 * Secret information is removed based on visibility rules.
 */
export type FilteredMatchView = {
  G: LorcanaG;
  ctx: FilteredTCGCtx;
};

export type FilteredTCGCtx = Omit<TCGCtx, "zones" | "random"> & {
  zones: FilteredZoneRuntimeState;
  random: FilteredCtxRandom;
};

export type FilteredZoneRuntimeState = {
  public: {
    zoneSummaries: Record<string, PublicZoneSummary>;
  };
  reveals: {
    active: ZoneRevealWindow[];
  };
  private?: {
    // only present for authorized views
    zoneCards: Record<ZoneId, CardInstanceId[]>;
    cardIndex: Record<CardInstanceId, ZoneCardIndexEntry>;
    cardMeta: Record<CardInstanceId, CardMeta>;
  };
};

export type FilteredCtxRandom = {
  seed: string;
  draws: number;
  // state is removed (server-only)
};

// =============================================================================
// Validation Types (runtime move validation)
// =============================================================================

/**
 * Runtime validation result type for move validation.
 * For targeting/selection validation, use ValidationResult from @tcg/core/targeting.
 */
export type RuntimeValidationResult =
  | { valid: true }
  | { valid: false; error: string; errorCode?: string };

// =============================================================================
// Initial State Factory
// =============================================================================

export interface InitialStatusConfig {
  initialGameSegment?: string;
  initialPhase?: string;
}

export type CreateInitialTCGCtxParams = {
  matchID: string;
  gameID: string;
  rulesetHash: string;
  timeConfig?: TimeControlConfig;
  seed?: string;
  statusConfig?: InitialStatusConfig;
  choosingFirstPlayer?: string;
  players?: Player[];
};

export function createInitialTCGCtx(params: CreateInitialTCGCtxParams): TCGCtx {
  const {
    matchID,
    gameID,
    rulesetHash,
    timeConfig = { mode: "none" },
    seed = "default-seed",
    statusConfig,
    choosingFirstPlayer,
    players = [],
  } = params;
  return {
    protocolVersion: 1,
    matchID,
    gameID,
    rulesetHash,
    _stateID: 0,
    playerIds: players.map((player) => player.id as PlayerId),
    status: {
      // We start in turn zero
      turn: 0,
      gameEnded: false,
      gameSegment: statusConfig?.initialGameSegment,
      phase: statusConfig?.initialPhase,
      choosingFirstPlayer,
      pendingMulligan: undefined,
    },
    priority: {
      holder: choosingFirstPlayer, // Give priority to the choosing player
      windowOpen: choosingFirstPlayer !== undefined, // Open priority window if there's a chooser
      passSequence: [],
      stackDepth: 0,
    },
    zones: {
      public: {
        zoneSummaries: {},
      },
      private: {
        zoneCards: {},
        cardIndex: {},
        cardMeta: {},
      },
      reveals: {
        active: [],
        nextSeq: 0,
      },
    },
    time: createInitialTimeContext(timeConfig),
    random: {
      seed,
      state: null,
      draws: 0,
    },
  };
}

function createInitialTimeContext(config: TimeControlConfig): TimeContext {
  if (config.mode === "none") {
    return { mode: "none" };
  }

  if (config.mode === "chess") {
    return {
      mode: "chess",
      running: false,
      pausedReason: "MATCH_NOT_STARTED",
      players: {},
      config: config.config,
    };
  }

  if (config.mode === "priority") {
    return {
      mode: "priority",
      running: false,
      prioritySeq: 0,
      pausedReason: "MATCH_NOT_STARTED",
      players: {},
      config: config.config,
    };
  }

  return {
    mode: "dynamic",
    running: false,
    pausedReason: "MATCH_NOT_STARTED",
    players: {},
    config: config.config,
  };
}

// =============================================================================
// Type Guards
// =============================================================================

export function isChessClockContext(ctx: TimeContext): ctx is ChessClockContext {
  return ctx.mode === "chess";
}

export function isPriorityClockContext(ctx: TimeContext): ctx is PriorityClockContext {
  return ctx.mode === "priority";
}

export function isDynamicClockContext(ctx: TimeContext): ctx is DynamicClockContext {
  return ctx.mode === "dynamic";
}

export function isClockRunning(ctx: TimeContext): boolean {
  if (ctx.mode === "none") return false;
  return ctx.running;
}
