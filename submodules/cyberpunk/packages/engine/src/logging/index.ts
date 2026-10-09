import type { GamePhase } from "../types/match-state.ts";
import type { ActionLogEvent, ActionLogMessageKey } from "../types/game-events.ts";

export type { ActionLogMessageKey };

export { formatStolenGigSummary, type StolenGigLogEntry } from "./stolen-gig-summary.ts";

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
  type ReactPassLog,
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
  type ResolveRevealDestinationLog,
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
  "move.rejected": "Action failed: {reason}.",
  "move.playCard": "Played {cardName} for {cost} eddies.",
  "move.playCard.gear": "Played {cardName} for {cost} eddies, attached to {attachedToName}.",
  "move.sellCard": "Sold {cardName}.",
  "move.callLegend": "Called {legendName}.",
  "move.attackUnit": "Attack: {attackerName} spent to attack {defenderName}.",
  "move.attackRival": "Attack: {attackerName} spent to attack the rival Gig area.",
  "move.useBlocker":
    "React: {blockerName} ({blockerPower} power) used BLOCKER to redirect {attackerName} ({attackerPower} power).",
  "move.resolveAttack.fight.attackerWins":
    "Fight: {attackerName} ({attackerPower}) won against {defenderName} ({defenderPower}).",
  "move.resolveAttack.fight.attackerWins.prevented":
    "Fight: {attackerName} ({attackerPower}) won against {defenderName} ({defenderPower}); {sourceCardName} prevents the resulting defeat.",
  "move.resolveAttack.fight.defenderWins":
    "Fight: {defenderName} ({defenderPower}) won against {attackerName} ({attackerPower}).",
  "move.resolveAttack.fight.defenderWins.prevented":
    "Fight: {defenderName} ({defenderPower}) won against {attackerName} ({attackerPower}); {sourceCardName} prevents the resulting defeat.",
  "move.resolveAttack.fight.mutual":
    "Fight: both Units lost ({attackerName} {attackerPower}, {defenderName} {defenderPower}).",
  "move.resolveAttack.fight.mutual.prevented":
    "Fight: both Units lost at {attackerPower} power; {sourceCardName} prevents {defenderName}'s resulting defeat.",
  "move.resolveAttack.fight.mutual.attackerPrevented":
    "Fight: both Units lost ({attackerName} {attackerPower}, {defenderName} {defenderPower}); {sourceCardName} prevents {attackerName}'s resulting defeat.",
  "move.resolveAttack.fight.mutual.bothPrevented":
    "Fight: both Units lost ({attackerName} {attackerPower}, {defenderName} {defenderPower}); {sourceCardName} prevents both resulting defeats.",
  "move.resolveAttack.direct": "Steal: {attackerName} stole {stolenGigs} at {attackerPower} power.",
  "move.resolveAttack.ended": "Attack: {attackerName}'s attack ended before a fight or steal.",
  "move.resolveRedirectDefeat":
    "{replacementCardName} spent {cost} Eddie to prevent {protectedCardName}'s defeat and was removed from the game instead.",
  "move.readyStep.cantReady": "{cardName} did not ready because of {sourceDescription}.",
  "move.turnEnded": "Turn {turnNumber} ended.",
  "game.overtimeStarted": "Overtime began. The first player to hold 7 Gigs wins immediately.",
  "game.overtimeFirstEmptyTurn":
    "Both Fixer areas began empty. Overtime begins after one more turn that starts this way.",
  "game.overtimeFinalTurn":
    "Both Fixer areas began empty for a second turn. Overtime begins when this turn ends.",
  "move.concede": "Player {playerId} conceded the game.",
  "move.activateAbility": "{cardName} activated its ability.",
  "move.activateAbility.attached": "{attachedToName} activated {cardName}.",
  "move.searchDeck.reveal": "Revealed the top {count} cards of the deck.",
  "move.searchDeck.revealNamed": "Revealed the top {count} cards of the deck: {revealedCardNames}.",
  "move.searchDeck.revealSelected": "Revealed {count} searched card(s): {revealedCardNames}.",
  "move.resolveSearchDeck": "Searched the top {looked} cards and found {count}.",
  "move.resolveSearchDeckNamed":
    "Searched the top {looked} cards and added {selectedCardNames} to {destination}. Bottom-decked {remainderCount}.",
  "move.resolveRevealDestination":
    "{chooserLabel} chose {destination}: moved {count} revealed card(s) to {destination}.",
  "move.resolveAdjustGig": "Adjusted {dieLabel} gig die from {previousValue} to {value}.",
  "move.manualSetGigValue": "Board correction: set {dieLabel} from {previousValue} to {value}.",
  "move.manualMoveGig": "Board correction: moved {dieLabel} to {destination}.",
  "move.manualMoveCard": "Board correction: moved {cardName} to {destination}.",
  "move.manualAttachGear": "Board correction: attached {gearName} to {hostName}.",
  "move.manualDetachGear": "Board correction: unattached {gearName}.",
  "move.manualExertCard": "Board correction: spent {cardName}.",
  "move.manualReadyCard": "Board correction: readied {cardName}.",
  "move.manualDrawCard": "Board correction: drew {cardName} from the {destination}.",
  "move.manualClearPendingResolution": "Board correction: skipped {cardName}'s pending resolution.",
  "move.manualClearTriggerStack": "Board correction: cleared {count} queued trigger(s).",
  "move.manualResetCombat": "Board correction: reset combat ({attackerName}).",
  "move.manualForcePassTurn": "Board correction: force-passed the turn.",
  "move.manualSetEddies": "Board correction: set Eddies to {count}.",
  "move.manualResetOncePerTurn":
    "Board correction: reset once-per-turn limits (cleared {count} ability ledger entries).",
  "move.manualSetCardFace": "Board correction: set {cardName} {face}.",
  "move.manualReadyAll": "Board correction: readied {count} card(s).",
  "move.manualRecomputeActiveEffects": "Board correction: recomputed effects ({count} active).",
  "move.manualDropEffectBagEntry": "Board correction: removed delayed effect: {abilityText}",
  "effect.discard.resolved":
    "{sourceCardName} discarded {discardedCardName} (cost {discardedCost}).",
  "effect.draw.resolved": "{sourceCardName} drew {drawnCount} card(s).",
  "effect.draw.skipped": "{sourceCardName} did not draw: {reason}.",
  "effect.skipped": "{sourceCardName}'s {effectName} effect was skipped: {reason}.",
  "effect.noAction":
    "{sourceCardName}'s {effectName} effect did nothing because its requirements were not met.",
  "effect.noValidTargets": "{sourceCardName}'s {effectName} effect had no valid targets.",
  "effect.modifyPower.resolved": "{sourceCardName} gave {targetNames} {powerChange} power.",
  "trigger.resolutionFailed": "{cardName}'s ability could not resolve: {reason}.",
  "effect.insufficientTargets":
    "{sourceCardName}'s {effectName} effect needed {requiredCount} valid targets but found {availableCount}; it did nothing.",
  "effect.spend.skippedAlreadySpent":
    "{sourceCardName}'s spend did nothing: {targetName} is already spent.",
  "effect.trashFromDeck.resolved":
    "{sourceCardName} trashed {trashedCount} card(s) from the top of the deck: {trashedCardNames}.",
  "effect.sellFromDeck.resolved": "{sourceCardName} sold {soldCardNames} from the top of the deck.",
  "trigger.autoResolved": "Auto-resolved {cardName}: {abilityText}",
  "trigger.resolved": "Resolved {cardName}: {abilityText}",
  "trigger.orderPending": "Trigger order pending: choose 1 of {triggerCount}: {triggerNames}.",
  "trigger.orderSelected":
    "Trigger order selected: {cardName} resolves next; {remainingCount} remain ({remainingTriggerNames}).",
  "trigger.noValidTargets": "{cardName} had no valid targets: {reason}.",
  "trigger.requiredTargetUnavailable":
    "{cardName} had no legal {targetDescription}; target-dependent effects were skipped.",
  "trigger.insufficientTargets":
    "{cardName} needed {requiredCount} legal {targetDescription} targets but found {availableCount}; target-dependent effects were skipped.",
  "trigger.stealGig": "{cardName} stole {stolenGigs}.",
  "trigger.targetResolved": "Selected {targetNames} for {sourceCardName}.",
  "trigger.targetResolved.deckBottom":
    "Selected {targetNames} for {sourceCardName} to move to the bottom of the deck.",
  "trigger.targetResolved.rerollGig":
    "Selected {targetNames} for {sourceCardName}: {previousValue} -> {newValue}.",
  "trigger.grantRule.cantAttack":
    "{sourceCardName} made {targetNames} unable to attack until your next turn.",
  "trigger.defeatedTarget": "{sourceCardName} defeated {targetNames}.",
  "trigger.defeatFailed":
    "{sourceCardName} did not defeat {targetNames}; the target was unavailable or its defeat was prevented.",
  "effect.callLegend.free": "{sourceCardName} called {legendName} for free.",
  "effect.callLegend.skippedAlreadyCalled":
    "{sourceCardName} skipped calling a Legend because a Legend was already called this turn.",
  "trigger.copyGigValue":
    "{sourceCardName} copied {sourceDieType}'s {sourceValue} to {targetDieType} ({previousValue} -> {newValue}).",
  "trigger.copyGigValueFailed":
    "{sourceCardName} could not set {targetDieType} from {previousValue} to {sourceDieType}'s {sourceValue}: a {targetDieType} only has values 1–{targetMax}. It remains at {previousValue}.",
  "trigger.delayedDefeat": "{sourceCardName} defeated {targetNames} at the end of the turn.",
  "trigger.revealTopCardType.hit":
    "{sourceCardName} selected {chosenType}, revealed {revealedCardName} ({revealedType}), and because it matched, added it to hand.",
  "trigger.revealTopCardType.miss":
    "{sourceCardName} selected {chosenType}, revealed {revealedCardName} ({revealedType}), and because it did not match, trashed it.",
  "setup.blankEddie": "Added {count} blank Eddie(s) from the top of the deck.",
  "setup.firstPlayerChoice": "Chose to go {order}.",
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
