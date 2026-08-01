/**
 * Action protocol (12 action types). `applyAction` returns the SAME state
 * reference for illegal actions, so callers can detect no-ops by identity.
 */

import type { AttackerKind, PlayerId, TargetKind } from "./types";

interface ActionBase {
  readonly player: PlayerId;
}

/** Only the `awaitingMulligan` player; keep=false shuffles hand back, redraws 5. */
export interface MulliganAction extends ActionBase {
  readonly type: "MULLIGAN";
  readonly keep: boolean;
}

/** Main phase, your turn; 1 normal summon/turn; EX characters go through the exRequirement choice flow. */
export interface SummonAction extends ActionBase {
  readonly type: "SUMMON";
  readonly handUid: string;
}

/** Place a support-capable card face-down in a free support slot. */
export interface SetSupportAction extends ActionBase {
  readonly type: "SET_SUPPORT";
  readonly handUid: string;
}

/** Reveal a set support, pay its chakra cost, put it on the chain. */
export interface ActivateSupportAction extends ActionBase {
  readonly type: "ACTIVATE_SUPPORT";
  readonly slot: number;
}

/** Play a support straight from hand (your turn only, per provisional rules). */
export interface ActivateSupportFromHandAction extends ActionBase {
  readonly type: "ACTIVATE_SUPPORT_FROM_HAND";
  readonly handUid: string;
}

/** Character "Activate: Main" abilities (currently only N-011 Ino). */
export interface ActivateCharacterAction extends ActionBase {
  readonly type: "ACTIVATE_CHARACTER";
  readonly uid: string;
}

/** Leader "Activate: Main" effect (once/turn, costs chakra). */
export interface LeaderEffectAction extends ActionBase {
  readonly type: "LEADER_EFFECT";
}

/** From turn 2, if leader not rested and chakra not locked: rest leader, flip ALL chakra face-up. */
export interface RecoveryAction extends ActionBase {
  readonly type: "RECOVERY";
}

/** Opens the counter window; priority passes to the defender. */
export interface DeclareAttackAction extends ActionBase {
  readonly type: "DECLARE_ATTACK";
  readonly attackerUid: string;
  readonly attackerKind: AttackerKind;
  readonly targetKind: TargetKind;
  readonly targetUid: string | null;
}

/** Pass priority; two consecutive passes resolve the chain/attack. */
export interface PassCounterAction extends ActionBase {
  readonly type: "PASS_COUNTER";
}

/** Answer a `pendingChoice`; `key: null` cancels (if cancellable). */
export interface ResolveChoiceAction extends ActionBase {
  readonly type: "RESOLVE_CHOICE";
  readonly key: string | null;
}

/** Wipes damage/bonuses, passes the turn, runs startTurn for the next player. */
export interface EndTurnAction extends ActionBase {
  readonly type: "END_TURN";
}

export type Action =
  | MulliganAction
  | SummonAction
  | SetSupportAction
  | ActivateSupportAction
  | ActivateSupportFromHandAction
  | ActivateCharacterAction
  | LeaderEffectAction
  | RecoveryAction
  | DeclareAttackAction
  | PassCounterAction
  | ResolveChoiceAction
  | EndTurnAction;

export type ActionType = Action["type"];
