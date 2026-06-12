import type { GamePhase } from "../types/match-state.ts";
import type { ActionLogEvent, ActionLogMessageKey } from "../types/game-events.ts";

export type { ActionLogMessageKey };

export { type PrivateField, privateField, stripPrivateFields } from "./private-field.ts";

export {
  type MoveLog,
  type MoveLogBase,
  type MoveLogType,
  type PlayCardLog,
  type SellCardLog,
  type CallLegendLog,
  type AttackUnitLog,
  type AttackRivalLog,
  type UseBlockerLog,
  type PassPhaseLog,
  type PhaseChangedLog,
  type GainGigLog,
  type MulliganLog,
  type KeepHandLog,
  type ResolveCardToPlayLog,
  type ResolveCardToMoveLog,
  type ResolveDiscardFromHandLog,
  type ResolveStealGigsLog,
  type ConcedeLog,
  type ActivateAbilityLog,
  type SearchDeckLog,
  type ResolveSearchDeckLog,
  type TurnStartedLog,
  type TurnEndedLog,
  type GameEndedLog,
  type GenericActionLog,
} from "./move-log.ts";

export type GameLogEntry =
  | { type: "moveExecuted"; move: string; moveNumber: number; playerId: string; data?: unknown }
  | { type: "phaseChanged"; moveNumber: number; from: GamePhase; to: GamePhase; playerId: string }
  | {
      type: "cardMoved";
      moveNumber: number;
      cardId: string;
      fromZone: string;
      toZone: string;
      playerId: string;
    }
  | { type: "cardPlayed"; moveNumber: number; cardId: string; playerId: string; cost: number }
  | { type: "cardDefeated"; moveNumber: number; cardId: string; playerId: string }
  | { type: "cardSold"; moveNumber: number; cardId: string; playerId: string }
  | {
      type: "gigStolen";
      moveNumber: number;
      dieId: string;
      fromPlayerId: string;
      toPlayerId: string;
    }
  | {
      type: "attackDeclared";
      moveNumber: number;
      attackerId: string;
      defenderId: string | null;
      kind: string;
    }
  | { type: "turnStarted"; moveNumber: number; playerId: string; turnNumber: number }
  | { type: "turnEnded"; moveNumber: number; playerId: string; turnNumber: number }
  | { type: "gameEnded"; moveNumber: number; winnerId: string | null; reason: string }
  | { type: "general"; moveNumber: number; message: string; playerId: string; data?: unknown };

export function createLogEntry(
  moveNumber: number,
  type: GameLogEntry["type"],
  data: Omit<GameLogEntry, "type" | "moveNumber" | "timestamp">,
): GameLogEntry & { timestamp: number } {
  return {
    moveNumber,
    type,
    timestamp: Date.now(),
    ...data,
  } as GameLogEntry & { timestamp: number };
}

// ── Action Log ──────────────────────────────────────────────────────────────

/**
 * Default English message templates. Params are interpolated with `{paramName}`
 * placeholders. Replace this map (or merge over it) to support other locales.
 *
 * Player identity is intentionally absent from card-centric templates — the
 * `playerId` field on the event itself carries that context. Templates that
 * describe turn-level events include `{playerId}` where needed.
 */
export const enMessages: Record<ActionLogMessageKey, string> = {
  "move.playCard": "Played {cardName} for {cost} eddies.",
  "move.playCard.gear": "Played {cardName} for {cost} eddies, attached to {attachedToName}.",
  "move.sellCard": "Sold {cardName}.",
  "move.callLegend": "Called {legendName}.",
  "move.attackUnit": "{attackerName} attacked {defenderName}.",
  "move.attackRival": "{attackerName} attacked directly.",
  "move.useBlocker": "{blockerName} blocked {attackerName}'s attack.",
  "move.resolveAttack.fight.attackerWins": "{attackerName} defeated {defenderName}.",
  "move.resolveAttack.fight.defenderWins": "{defenderName} defeated {attackerName}.",
  "move.resolveAttack.fight.mutual": "{attackerName} and {defenderName} destroyed each other.",
  "move.resolveAttack.direct":
    "{attackerName} stole {count} gig(s) from their opponent at {attackerPower} power.",
  "move.turnEnded": "Turn {turnNumber} ended.",
  "move.concede": "Player {playerId} conceded the game.",
  "move.activateAbility": "{cardName} activated its ability.",
  "move.searchDeck.reveal": "Revealed the top {count} cards of the deck.",
  "move.resolveSearchDeck": "Searched the top {looked} cards and found {count}.",
  "move.resolveAdjustGig": "Adjusted gig die {dieId} from {previousValue} to {value}.",
  "effect.draw.resolved": "{sourceCardName} drew {drawnCount} card(s).",
  "effect.draw.skipped": "{sourceCardName} did not draw: {reason}.",
  "trigger.autoResolved": "Auto-resolved {cardName}: {abilityText}",
  "trigger.resolved": "Resolved {cardName}: {abilityText}",
  "trigger.noValidTargets": "{cardName} had no valid targets.",
  "trigger.stealGig": "{cardName} stole {count} additional {dieTypes} {gigWord}.",
  "trigger.targetResolved": "Selected {targetNames} for {sourceCardName}.",
  "trigger.targetResolved.deckBottom":
    "Selected {targetNames} for {sourceCardName} to move to the bottom of the deck.",
  "trigger.grantRule.cantAttack":
    "{sourceCardName} made {targetNames} unable to attack until your next turn.",
  "trigger.defeatedTarget": "{sourceCardName} defeated {targetNames}.",
  "effect.callLegend.free": "{sourceCardName} called {legendName} for free.",
  "trigger.copyGigValue":
    "{sourceCardName} copied {sourceDieType}'s {sourceValue} to {targetDieType} ({previousValue} -> {newValue}).",
  "trigger.copyGigValueCapped":
    "{sourceCardName} could not copy {sourceDieType}'s {sourceValue} to {targetDieType}; {targetDieType} can show at most {targetMax}, so it {resultText}.",
  "trigger.delayedDefeat": "{sourceCardName} defeated {targetNames} at the end of the turn.",
};

/**
 * Render a localised string for an ActionLogEvent.
 *
 * @param event   - The event emitted by the engine.
 * @param messages - A locale message map (use `enMessages` or a translated variant).
 * @returns A human-readable sentence with all `{param}` placeholders replaced.
 *
 * @example
 * const text = formatActionLog(event, enMessages);
 * // "Goro Takemura - Hands Unclean attacked directly."
 */
export function formatActionLog(
  event: ActionLogEvent,
  messages: Record<ActionLogMessageKey, string>,
): string {
  const template = messages[event.messageKey] ?? event.messageKey;
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    if (key === "playerId") return event.playerId as string;
    return actionLogParamText(event.params[key], `{${key}}`);
  });
}

function actionLogParamText(value: unknown, fallback: string): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  return fallback;
}
