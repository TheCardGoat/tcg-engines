import { enMessages, formatActionLog, type MatchState, type MoveLog } from "@tcg/cyberpunk-engine";
import type { SimulatorEventLogEntry } from "@tcg/simulator-contract";

import type { MoveLogEntry } from "./EngineProvider";
import { PLAYER_SIDE_TO_ID, type Side } from "./sides";

export function projectMoveLogEntries(
  matchState: MatchState,
  moveLogs: readonly MoveLogEntry[],
  _humanSide: Side,
): SimulatorEventLogEntry[] {
  const phase = matchState.G.gamePhase;
  const baseTimestamp = new Date(matchState.ctx.stateID ?? 0).toISOString();

  return moveLogs.map((entry) => {
    const log = entry.log;
    return {
      id: `move-log-${entry.id}`,
      turn: logTurn(log) ?? matchState.G.turnMetadata.turnNumber,
      phase,
      seatId: entry.side === "system" ? undefined : String(PLAYER_SIDE_TO_ID[entry.side]),
      timestamp: baseTimestamp,
      message: sentenceFor(log),
      tags: moveLogTags(log.type),
      entityIds: moveLogEntityIds(log),
    };
  });
}

function logTurn(log: MoveLog): number | undefined {
  if (log.type === "turnStarted" || log.type === "turnEnded" || log.type === "undo") {
    return log.turnNumber;
  }
  return undefined;
}

function moveLogTags(logType: MoveLog["type"]): SimulatorEventLogEntry["tags"] {
  switch (logType) {
    case "attackUnit":
    case "attackRival":
    case "useBlocker":
    case "resolveStealGigs":
      return ["combat"];
    case "activateAbility":
      return ["ability"];
    case "turnStarted":
    case "turnEnded":
    case "gameEnded":
    case "phaseChanged":
    case "undo":
      return ["system"];
    default:
      return ["move"];
  }
}

function moveLogEntityIds(log: MoveLog): string[] | undefined {
  switch (log.type) {
    case "playCard":
    case "sellCard":
    case "resolveCardToPlay":
    case "activateAbility":
      return log.cardId ? [String(log.cardId)] : undefined;
    case "callLegend":
      return log.cardId ? [String(log.cardId)] : undefined;
    case "attackUnit":
      return [String(log.attackerId), String(log.defenderId)];
    case "attackRival":
      return [String(log.attackerId)];
    case "useBlocker":
      return [String(log.blockerId), String(log.attackerId)];
    default:
      return undefined;
  }
}

function sentenceFor(log: MoveLog): string {
  // Server-generated drop logs aren't part of the engine's MoveLog union,
  // but they can arrive from the gateway during live matches.
  const rawType = (log as unknown as { type: string }).type;
  if (rawType === "playerDropped") {
    return "Opponent disconnected and was dropped.";
  }
  if (rawType === "forfeitGame") {
    return "Opponent forfeited the game.";
  }

  switch (log.type) {
    case "playCard":
      return `Played ${log.cardName} for ${log.cost} eddie${log.cost === 1 ? "" : "s"}.`;
    case "sellCard":
      return `Sold ${log.cardName}.`;
    case "callLegend":
      return `Called ${log.legendName}.`;
    case "attackUnit":
      return `FIGHT declared: ${log.attackerName} vs ${log.defenderName}.`;
    case "attackRival":
      return `STEAL declared: ${log.attackerName} attacks directly.`;
    case "useBlocker":
      return `BLOCK: ${log.blockerName} redirected ${log.attackerName}'s attack into a fight.`;
    case "passPhase":
      return `Passed ${log.fromPhase} → ${log.toPhase}.`;
    case "phaseChanged":
      return `Phase changed ${log.fromPhase} → ${log.toPhase}.`;
    case "gainGig":
      return `Gained ${log.dieType.toUpperCase()} gig (${log.faceValue}).`;
    case "mulligan": {
      // log.drawn is typed as PrivateField<CardInstanceId[]>, but the projection
      // only ever sees viewer-stripped entries — at runtime it's either the
      // unwrapped array (self) or undefined (rival/spectator).
      const ids = log.drawn as unknown as readonly string[] | undefined;
      if (ids && ids.length > 0) {
        return `Mulliganed and drew ${log.drawnCount} cards: ${ids.join(", ")}.`;
      }
      return `Mulliganed and drew ${log.drawnCount} cards.`;
    }
    case "keepHand":
      return "Kept their hand.";
    case "resolveCardToPlay":
      return `Played ${log.cardName} (resolved choice).`;
    case "resolveCardToMove":
      if (log.passed) {
        return "Skipped the optional move.";
      }
      return log.cardName ? `Moved ${log.cardName}.` : "Resolved card-to-move.";
    case "resolveDiscardFromHand":
      if (log.passed) {
        return "Skipped the optional discard.";
      }
      return `Discarded ${log.discardedCount} card${log.discardedCount === 1 ? "" : "s"}.`;
    case "resolveStealGigs":
      return log.attackerName
        ? `STEAL resolved: ${log.attackerName} stole ${log.stolenCount} Gig${
            log.stolenCount === 1 ? "" : "s"
          }${log.attackerPower === undefined ? "" : ` at ${log.attackerPower} power`}.`
        : `STEAL resolved: Stole ${log.stolenCount} Gig${log.stolenCount === 1 ? "" : "s"}${
            log.attackerPower === undefined ? "" : ` at ${log.attackerPower} power`
          }.`;
    case "concede":
      return "Conceded the game.";
    case "undo":
      return log.scope === "turnStart"
        ? `Rewound to the start of turn ${log.turnNumber}.`
        : "Undid the last move.";
    case "activateAbility":
      return `${log.cardName} activated its ability.`;
    case "searchDeck":
      return `Revealed the top ${log.revealedCount} cards of the deck.`;
    case "resolveSearchDeck":
      return `Searched the top ${log.lookedAt} cards and found ${log.found}.`;
    case "turnStarted":
      return `Turn ${log.turnNumber} started.`;
    case "turnEnded":
      return `Turn ${log.turnNumber} ended.`;
    case "gameEnded":
      return log.winnerId ? `Game over (${log.reason}).` : `Game ended in a draw (${log.reason}).`;
    case "action":
      return formatActionLog(
        {
          type: "actionLog",
          messageKey: log.messageKey,
          params: log.params,
          playerId: log.playerId,
        },
        enMessages,
      );
    default: {
      return "Unknown move.";
    }
  }
}
