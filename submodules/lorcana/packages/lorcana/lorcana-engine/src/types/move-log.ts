/**
 * MoveLog Type System
 *
 * One self-contained canonical log entry per move. Public messages are always
 * visible, and viewer-specific private details are appended at delivery time.
 */

import type { CardInstanceId, PlayerId } from "#core";
import type { PrivateField } from "../core/runtime/private-field";
import type { LorcanaLogMessage } from "./log-messages";

// =============================================================================
// Canonical Move Logs
// =============================================================================

export interface LorcanaVisibleMoveLog {
  moveType: MoveLogType;
  playerId: PlayerId;
  timestamp: number;
  public: LorcanaLogMessage[];
  privateByPlayerId?: Partial<Record<PlayerId, LorcanaLogMessage[]>>;
}

export type LegacyFlatMoveLog = {
  type: string;
  playerId: PlayerId;
  timestamp: number;
} & Record<string, unknown>;

export type MoveLogType =
  | "playCard"
  | "shiftCard"
  | "singCard"
  | "challenge"
  | "quest"
  | "questWithAll"
  | "inkCard"
  | "lookAtInkwell"
  | "activateAbility"
  | "moveToLocation"
  | "passTurn"
  | "concede"
  | "forfeitGame"
  | "alterHand"
  | "chooseFirstPlayer"
  | "resolveBag"
  | "resolveEffect"
  | "turnStart"
  | "gameEnd"
  | "turnSkipped"
  | "playerDropped";

// =============================================================================
// Aggregated Outcomes — projected into canonical messages by the log factory
// =============================================================================

export interface DamageEntry {
  sourceId: CardInstanceId;
  targetId: CardInstanceId;
  amount: number;
  kind: "combat" | "effect";
}

export interface MovedDamageEntry {
  sourceCharacterId: CardInstanceId;
  targetId: CardInstanceId;
  amount: number;
}

export interface MoveOutcomes {
  cardsDrawn?: Array<{
    playerId: PlayerId;
    amount: number;
    detail?: PrivateField<CardInstanceId[]>;
  }>;
  cardsDiscarded?: Array<{ playerId: PlayerId; amount: number; detail: CardInstanceId[] }>;
  cardsBanished?: CardInstanceId[];
  damageDealt?: DamageEntry[];
  damageMoved?: MovedDamageEntry[];
  loreChanged?: { playerId: PlayerId; amount: number; operation: "add" | "remove" };
  cardsExerted?: CardInstanceId[];
  cardsReadied?: CardInstanceId[];
  cardsMilled?: { playerId: PlayerId; amount: number; cardIds?: PrivateField<CardInstanceId[]> };
  cardsReturnedToHand?: CardInstanceId[];
  cardsMovedToZone?: Array<{ cardId: CardInstanceId; zone: string }>;
  cardsInked?: Array<{
    /**
     * Public when from a public zone (play). Private when from a private zone
     * (hand/deck via an effect); projected into private appendices by the log factory.
     */
    cardId: CardInstanceId | PrivateField<CardInstanceId>;
    exerted: boolean;
  }>;
}

export type MoveLog = LorcanaVisibleMoveLog;
