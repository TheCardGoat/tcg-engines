/**
 * Build the final {@link MoveLog} array attached to a CommandSuccess.
 *
 * Most moves do not yet emit a typed {@link MoveLog} explicitly — they emit
 * `actionLog` events and let the processor synthesize a generic log entry for
 * them. Specific moves that need stronger structure (e.g. mulligan with
 * private card ids) call `operations.log.emit(...)` directly; those entries
 * pass through verbatim.
 *
 * System events (`turnStarted`, `turnEnded`, `gameEnded`) always become
 * dedicated system logs so the UI can render turn dividers and game-end
 * banners regardless of which move emitted them.
 */

import { defOf } from "../state/lookups.ts";
import type { MatchState } from "../types/match-state.ts";
import type { GameEvent, ActionLogEvent } from "../types/game-events.ts";
import type { PlayerId } from "../types/branded.ts";
import type {
  MoveLog,
  GenericActionLog,
  PhaseChangedLog,
  TurnStartedLog,
  TurnEndedLog,
  GameEndedLog,
} from "../logging/move-log.ts";

interface SynthesizeArgs {
  explicitLogs: MoveLog[];
  events: GameEvent[];
  playerId: PlayerId;
  moveId: string;
  state: MatchState;
}

/**
 * Message keys whose content is already covered by a dedicated system log,
 * so the GenericActionLog synthesizer should skip them to avoid duplicates.
 */
const SYSTEM_MIRRORED_MESSAGE_KEYS = new Set<string>(["move.turnEnded"]);
const ADDITIONAL_GENERIC_MESSAGE_KEYS = new Set<string>([
  "game.overtimeStarted",
  "game.overtimeFirstEmptyTurn",
  "game.overtimeFinalTurn",
  "move.searchDeck.reveal",
  "move.searchDeck.revealNamed",
  "move.searchDeck.revealSelected",
  "move.resolveSearchDeck",
  "move.resolveSearchDeckNamed",
  "move.readyStep.cantReady",
]);

function isAdditionalGenericMessageKey(key: ActionLogEvent["messageKey"]): boolean {
  return (
    key.startsWith("setup.") ||
    key.startsWith("effect.") ||
    key.startsWith("trigger.") ||
    ADDITIONAL_GENERIC_MESSAGE_KEYS.has(key)
  );
}

const EXPLICIT_TYPES_THAT_REPLACE_GENERIC = new Set<string>([
  "playCard",
  "sellCard",
  "callLegend",
  "attackUnit",
  "attackRival",
  "useBlocker",
  "reactPass",
  "passPhase",
  "phaseChanged",
  "gainGig",
  "mulligan",
  "keepHand",
  "resolveCardToPlay",
  "resolveCardToMove",
  "resolveDiscardFromHand",
  "resolveStealGigs",
  "concede",
  "activateAbility",
  "resolveScry",
  "action",
]);

export function synthesizeMoveLogs(args: SynthesizeArgs): MoveLog[] {
  const { explicitLogs, events, playerId, state } = args;
  const turnNumber = state.G.turnMetadata.turnNumber;
  const now = Date.now();
  const out: MoveLog[] = [];

  const hasExplicitPlayerLog = explicitLogs.some((l) =>
    EXPLICIT_TYPES_THAT_REPLACE_GENERIC.has(l.type),
  );

  // 1) Carry through every explicit log.
  for (const log of explicitLogs) {
    out.push(log);
  }

  // 2) For each actionLog event, synthesize a GenericActionLog only if the
  //    move didn't already emit a typed player log. We also skip messages
  //    whose content is already captured by a dedicated system log emitted
  //    in the same command (e.g. "move.turnEnded" duplicates TurnEndedLog).
  let emittedPrimaryGeneric = false;
  for (const event of events) {
    if (event.type !== "actionLog") continue;
    const actionEvent = event as ActionLogEvent;
    if (SYSTEM_MIRRORED_MESSAGE_KEYS.has(actionEvent.messageKey)) continue;

    const isAdditional = isAdditionalGenericMessageKey(actionEvent.messageKey);
    if (hasExplicitPlayerLog && !isAdditional) continue;
    if (!hasExplicitPlayerLog && emittedPrimaryGeneric && !isAdditional) continue;

    const generic: GenericActionLog = {
      type: "action",
      playerId: actionEvent.playerId,
      turnNumber,
      timestamp: now,
      messageKey: actionEvent.messageKey,
      params: { ...actionEvent.params },
    };
    out.push(generic);
    if (!isAdditional) {
      emittedPrimaryGeneric = true;
    }
  }

  // Persist semantic defeats; zone exits also include sales and returns.
  for (const [index, event] of events.entries()) {
    if (event.type !== "cardDefeated") continue;
    const card = state.G.cardIndex[event.cardId];
    if (!card) throw new Error(`Defeated card missing from index: ${event.cardId}`);
    const definition = defOf(card);
    const movement = events
      .slice(0, index)
      .reverse()
      .find((entry) => entry.type === "cardMoved" && entry.cardId === event.cardId);
    out.push({
      type: "cardDefeated",
      wasUnit:
        definition.type === "unit" ||
        (definition.type === "legend" &&
          movement?.type === "cardMoved" &&
          movement.fromZone === "field"),
      playerId: event.playerId,
      turnNumber,
      timestamp: now,
      cardId: event.cardId,
      cardName: defOf(card).displayName,
    });
  }

  // Persist every public face change, including effects that do not emit a
  // separate action message. Existing detailed adjustment/copy/reroll messages
  // already contain the same transition and should not be repeated.
  const detailedChanges = events
    .filter((event): event is ActionLogEvent => event.type === "actionLog")
    .filter((event) =>
      [
        "move.resolveAdjustGig",
        "move.manualSetGigValue",
        "trigger.copyGigValue",
        "trigger.targetResolved.rerollGig",
      ].includes(event.messageKey),
    );
  for (const event of events) {
    if (event.type !== "gigValueChanged" || event.previousValue === event.newValue) continue;
    const coveredIndex = detailedChanges.findIndex((action) => {
      const params = action.params;
      return (
        params.dieId === event.dieId &&
        params.previousValue === event.previousValue &&
        (params.newValue ?? params.value) === event.newValue
      );
    });
    if (coveredIndex >= 0) {
      detailedChanges.splice(coveredIndex, 1);
      continue;
    }
    const die = state.G.gigDice[event.dieId as string];
    if (!die) throw new Error(`Changed Gig missing from index: ${event.dieId}`);
    out.push({
      type: "gigValueChanged",
      playerId: event.adjustedByPlayerId ?? event.sourcePlayerId ?? event.playerId,
      turnNumber,
      timestamp: now,
      dieId: event.dieId,
      dieType: die.dieType,
      previousValue: event.previousValue,
      newValue: event.newValue,
    });
  }
  for (const event of events) {
    if (event.type !== "gigsSwapped") continue;
    out.push({
      type: "gigsSwapped",
      playerId: event.playerId,
      turnNumber,
      timestamp: now,
      friendlyDieType: event.dieTypes[0],
      friendlyValue: event.dieValues[0],
      rivalDieType: event.dieTypes[1],
      rivalValue: event.dieValues[1],
    });
  }

  // 3) Always synthesize system logs from their matching events.
  for (const event of events) {
    if (event.type === "phaseChanged") {
      const e = event as Extract<GameEvent, { type: "phaseChanged" }>;
      const log: PhaseChangedLog = {
        type: "phaseChanged",
        playerId: e.playerId,
        turnNumber,
        timestamp: now,
        fromPhase: e.from,
        toPhase: e.to,
      };
      out.push(log);
    } else if (event.type === "turnEnded") {
      const e = event as Extract<GameEvent, { type: "turnEnded" }>;
      const log: TurnEndedLog = {
        type: "turnEnded",
        playerId: e.playerId,
        turnNumber: e.turnNumber,
        timestamp: now,
      };
      if (!hasLog(out, "turnEnded", e.turnNumber)) out.push(log);
    } else if (event.type === "turnStarted") {
      const e = event as Extract<GameEvent, { type: "turnStarted" }>;
      const log: TurnStartedLog = {
        type: "turnStarted",
        playerId: e.playerId,
        turnNumber: e.turnNumber,
        timestamp: now,
      };
      if (!hasLog(out, "turnStarted", e.turnNumber)) out.push(log);
    } else if (event.type === "gameEnded") {
      const e = event as Extract<GameEvent, { type: "gameEnded" }>;
      // Attribute the system log to the winner when there is one — start-of-turn
      // win checks (e.g. 6 Gigs at turn start) fire from the *previous* player's
      // pass command, so using `playerId` (the issuer) misattributes game-end
      // events to the loser. Fall back to the issuer for draws / forfeits with
      // no winner so consumers grouping by playerId still get a stable side.
      const log: GameEndedLog = {
        type: "gameEnded",
        playerId: (e.winnerId as PlayerId | null) ?? playerId,
        turnNumber,
        timestamp: now,
        winnerId: e.winnerId as PlayerId | null,
        reason: e.reason,
      };
      if (!hasLog(out, "gameEnded", turnNumber)) out.push(log);
    }
  }

  return out;
}

function hasLog(arr: MoveLog[], type: MoveLog["type"], turnNumber: number): boolean {
  return arr.some(
    (l) => l.type === type && (l as { turnNumber?: number }).turnNumber === turnNumber,
  );
}
