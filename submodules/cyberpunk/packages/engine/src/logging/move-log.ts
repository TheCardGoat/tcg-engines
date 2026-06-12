/**
 * MoveLog — one self-contained record per command.
 *
 * Each successful command yields zero or more {@link MoveLog} entries on the
 * {@link CommandSuccess.moveLogs} array. The contract is "one player-attributed
 * log per move", but a single command may also emit follow-on system logs
 * (turn transitions, game end) inside the same execution.
 *
 * Private fields (deck reveals, mulligan card ids, etc.) are wrapped in
 * {@link PrivateField} and filtered per viewer at delivery time.
 */

import type { CardInstanceId, GigDieId, PlayerId } from "../types/branded.ts";
import type { ActionLogMessageKey } from "../types/game-events.ts";
import type { PrivateField } from "./private-field.ts";

export interface MoveLogBase {
  /** Unix-ms timestamp when the log was emitted. */
  timestamp: number;
  /** Player attributed with the action. System logs use the active player. */
  playerId: PlayerId;
  /** Engine turn number at the moment the log was emitted. */
  turnNumber: number;
}

// ── Player-driven moves ─────────────────────────────────────────────────────

export interface PlayCardLog extends MoveLogBase {
  type: "playCard";
  cardId: CardInstanceId;
  cardName: string;
  cost: number;
}

export interface SellCardLog extends MoveLogBase {
  type: "sellCard";
  cardId: CardInstanceId;
  cardName: string;
}

export interface CallLegendLog extends MoveLogBase {
  type: "callLegend";
  cardId: CardInstanceId;
  legendName: string;
}

export interface AttackUnitLog extends MoveLogBase {
  type: "attackUnit";
  attackerId: CardInstanceId;
  defenderId: CardInstanceId;
  attackerName: string;
  defenderName: string;
}

export interface AttackRivalLog extends MoveLogBase {
  type: "attackRival";
  attackerId: CardInstanceId;
  attackerName: string;
}

export interface UseBlockerLog extends MoveLogBase {
  type: "useBlocker";
  blockerId: CardInstanceId;
  attackerId: CardInstanceId;
  blockerName: string;
  attackerName: string;
}

export interface PassPhaseLog extends MoveLogBase {
  type: "passPhase";
  fromPhase: string;
  toPhase: string;
}

export interface PhaseChangedLog extends MoveLogBase {
  type: "phaseChanged";
  fromPhase: string;
  toPhase: string;
}

export interface GainGigLog extends MoveLogBase {
  type: "gainGig";
  dieId: GigDieId;
  dieType: string;
  faceValue: number;
}

export interface MulliganLog extends MoveLogBase {
  type: "mulligan";
  /** Hidden from the rival; drawn card identities. */
  drawn?: PrivateField<CardInstanceId[]>;
  /** Public count — always visible. */
  drawnCount: number;
}

export interface KeepHandLog extends MoveLogBase {
  type: "keepHand";
}

export interface ResolveCardToPlayLog extends MoveLogBase {
  type: "resolveCardToPlay";
  cardId: CardInstanceId;
  cardName: string;
}

export interface ResolveCardToMoveLog extends MoveLogBase {
  type: "resolveCardToMove";
  cardId?: CardInstanceId;
  cardName?: string;
  passed?: boolean;
}

export interface ResolveDiscardFromHandLog extends MoveLogBase {
  type: "resolveDiscardFromHand";
  discardedCount: number;
  passed?: boolean;
}

export interface ResolveStealGigsLog extends MoveLogBase {
  type: "resolveStealGigs";
  attackerName?: string;
  attackerPower?: number;
  stolenCount: number;
}

export interface ConcedeLog extends MoveLogBase {
  type: "concede";
}

export interface UndoLog extends MoveLogBase {
  type: "undo";
  scope: "lastMove" | "turnStart";
}

export interface ActivateAbilityLog extends MoveLogBase {
  type: "activateAbility";
  cardId: CardInstanceId;
  cardName: string;
}

export interface SearchDeckLog extends MoveLogBase {
  type: "searchDeck";
  /** Number of cards revealed from the top of the deck. */
  revealedCount: number;
  /** Hidden card identities behind the search — visible only to the searcher. */
  revealed?: PrivateField<CardInstanceId[]>;
}

export interface ResolveSearchDeckLog extends MoveLogBase {
  type: "resolveSearchDeck";
  lookedAt: number;
  found: number;
}

// ── System (non-player-driven) ──────────────────────────────────────────────

export interface TurnStartedLog extends MoveLogBase {
  type: "turnStarted";
  turnNumber: number;
}

export interface TurnEndedLog extends MoveLogBase {
  type: "turnEnded";
  turnNumber: number;
}

export interface GameEndedLog extends MoveLogBase {
  type: "gameEnded";
  winnerId: PlayerId | null;
  reason: string;
}

// ── Generic fallback ────────────────────────────────────────────────────────

type GenericActionLogParam =
  | string
  | number
  | readonly string[]
  | PrivateField<string | number | readonly string[]>;

/**
 * Generic log used when a move emits an `actionLog` event without an explicit
 * typed `MoveLog`. Carries the same `messageKey` + `params` as the underlying
 * event so the UI can render the localized template.
 */
export interface GenericActionLog extends MoveLogBase {
  type: "action";
  messageKey: ActionLogMessageKey;
  params: Record<string, GenericActionLogParam>;
}

// ── Union ───────────────────────────────────────────────────────────────────

export type MoveLog =
  | PlayCardLog
  | SellCardLog
  | CallLegendLog
  | AttackUnitLog
  | AttackRivalLog
  | UseBlockerLog
  | PassPhaseLog
  | PhaseChangedLog
  | GainGigLog
  | MulliganLog
  | KeepHandLog
  | ResolveCardToPlayLog
  | ResolveCardToMoveLog
  | ResolveDiscardFromHandLog
  | ResolveStealGigsLog
  | ConcedeLog
  | UndoLog
  | ActivateAbilityLog
  | SearchDeckLog
  | ResolveSearchDeckLog
  | TurnStartedLog
  | TurnEndedLog
  | GameEndedLog
  | GenericActionLog;

export type MoveLogType = MoveLog["type"];
