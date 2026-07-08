import { enMessages, formatActionLog, type MatchState, type MoveLog } from "@tcg/cyberpunk-engine";
import type { SimulatorEventLogEntry } from "@tcg/simulator-contract";

import type { MoveLogEntry } from "./EngineProvider";
import { PLAYER_SIDE_TO_ID, type Side } from "./sides";

type CombatLogSection = NonNullable<SimulatorEventLogEntry["section"]>;
type CombatSectionId = CombatLogSection["id"];

const COMBAT_LOG_SECTIONS: Record<CombatSectionId, CombatLogSection> = {
  attack: { id: "attack", label: "Attack", tone: "attack" },
  react: { id: "react", label: "React", tone: "react" },
  fight: { id: "fight", label: "Fight", tone: "fight" },
  steal: { id: "steal", label: "Steal", tone: "steal" },
};

interface CombatLogContext {
  open: boolean;
  current: CombatSectionId | null;
}

export function projectMoveLogEntries(
  matchState: MatchState,
  moveLogs: readonly MoveLogEntry[],
  _humanSide: Side,
): SimulatorEventLogEntry[] {
  const phase = matchState.G.gamePhase;
  const baseTimestamp = new Date(matchState.ctx.stateID ?? 0).toISOString();
  const combatContext: CombatLogContext = { open: false, current: null };

  return moveLogs.map((entry) => {
    const log = entry.log;
    const section = combatSectionForLog(log, combatContext);
    const projected: SimulatorEventLogEntry = {
      id: `move-log-${entry.id}`,
      turn: logTurn(log) ?? matchState.G.turnMetadata.turnNumber,
      phase,
      seatId: entry.side === "system" ? undefined : String(PLAYER_SIDE_TO_ID[entry.side]),
      timestamp: baseTimestamp,
      message: sentenceFor(log),
      tags: moveLogTags(log.type, section),
      entityIds: moveLogEntityIds(log),
      cardRefs: moveLogCardRefs(log),
    };
    if (section) {
      projected.section = section;
    }
    return projected;
  });
}

function logTurn(log: MoveLog): number | undefined {
  if (log.type === "turnStarted" || log.type === "turnEnded" || log.type === "undo") {
    return log.turnNumber;
  }
  return undefined;
}

function moveLogTags(
  logType: MoveLog["type"],
  section?: CombatLogSection,
): SimulatorEventLogEntry["tags"] {
  const tags: SimulatorEventLogEntry["tags"] = [];
  switch (logType) {
    case "attackUnit":
    case "attackRival":
    case "useBlocker":
    case "reactPass":
    case "resolveStealGigs":
      tags.push("combat");
      break;
    case "activateAbility":
      tags.push("ability");
      break;
    case "turnStarted":
    case "turnEnded":
    case "gameEnded":
    case "phaseChanged":
    case "undo":
      tags.push("system");
      break;
    default:
      tags.push("move");
      break;
  }
  if (section && !tags.includes("combat")) {
    tags.push("combat");
  }
  return tags;
}

function combatSectionForLog(
  log: MoveLog,
  context: CombatLogContext,
): CombatLogSection | undefined {
  switch (log.type) {
    case "attackUnit":
    case "attackRival":
      context.open = true;
      context.current = "attack";
      return COMBAT_LOG_SECTIONS.attack;
    case "useBlocker":
    case "reactPass":
      context.open = true;
      context.current = "react";
      return COMBAT_LOG_SECTIONS.react;
    case "callLegend":
      if (!context.open) return undefined;
      context.current = "react";
      return COMBAT_LOG_SECTIONS.react;
    case "playCard":
    case "resolveCardToPlay":
    case "activateAbility":
      if (!context.open) return undefined;
      context.current = "react";
      return COMBAT_LOG_SECTIONS.react;
    case "resolveStealGigs":
      context.current = "steal";
      context.open = false;
      return COMBAT_LOG_SECTIONS.steal;
    case "action":
      return actionLogCombatSection(log, context);
    case "turnStarted":
    case "turnEnded":
    case "phaseChanged":
    case "passPhase":
    case "undo":
      context.open = false;
      context.current = null;
      return undefined;
    default:
      return undefined;
  }
}

function actionLogCombatSection(
  log: Extract<MoveLog, { type: "action" }>,
  context: CombatLogContext,
): CombatLogSection | undefined {
  const key = log.messageKey;
  if (key === "move.attackUnit" || key === "move.attackRival") {
    context.open = true;
    context.current = "attack";
    return COMBAT_LOG_SECTIONS.attack;
  }
  if (key === "move.useBlocker") {
    context.open = true;
    context.current = "react";
    return COMBAT_LOG_SECTIONS.react;
  }
  if (key === "move.callLegend" && context.open) {
    context.current = "react";
    return COMBAT_LOG_SECTIONS.react;
  }
  if (
    key.startsWith("move.resolveAttack.fight.") ||
    (key === "trigger.defeatedTarget" && context.open && context.current === "fight")
  ) {
    context.current = "fight";
    context.open = false;
    return COMBAT_LOG_SECTIONS.fight;
  }
  if (key === "move.resolveAttack.direct" || key === "trigger.stealGig") {
    context.current = "steal";
    context.open = false;
    return COMBAT_LOG_SECTIONS.steal;
  }
  if (!context.open || !isCombatContextActionKey(key)) {
    return undefined;
  }
  const current = context.current ?? "attack";
  return COMBAT_LOG_SECTIONS[current];
}

function isCombatContextActionKey(messageKey: string): boolean {
  return (
    messageKey === "move.resolveAdjustGig" ||
    messageKey === "effect.callLegend.free" ||
    messageKey === "effect.draw.resolved" ||
    messageKey === "effect.draw.skipped" ||
    messageKey.startsWith("trigger.")
  );
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
    case "reactPass":
      return [String(log.attackerId)];
    default:
      return undefined;
  }
}

function moveLogCardRefs(log: MoveLog): { id?: string; name: string }[] | undefined {
  switch (log.type) {
    case "playCard":
    case "sellCard":
    case "resolveCardToPlay":
    case "activateAbility":
      return log.cardName
        ? [{ id: log.cardId ? String(log.cardId) : undefined, name: log.cardName }]
        : undefined;
    case "callLegend":
      return log.legendName
        ? [{ id: log.cardId ? String(log.cardId) : undefined, name: log.legendName }]
        : undefined;
    case "attackUnit":
      return [
        { id: String(log.attackerId), name: log.attackerName },
        { id: String(log.defenderId), name: log.defenderName },
      ];
    case "attackRival":
      return [{ id: String(log.attackerId), name: log.attackerName }];
    case "useBlocker":
      return [
        { id: String(log.blockerId), name: log.blockerName },
        { id: String(log.attackerId), name: log.attackerName },
      ];
    case "reactPass":
      return [{ id: String(log.attackerId), name: log.attackerName }];
    case "resolveCardToMove":
      return log.cardName ? [{ name: log.cardName }] : undefined;
    case "resolveStealGigs":
      return log.attackerName ? [{ name: log.attackerName }] : undefined;
    case "action": {
      const refs: { name: string }[] = [];
      const params = log.params as Record<string, unknown>;
      for (const key of [
        "attackerName",
        "blockerName",
        "cardName",
        "defenderName",
        "legendName",
        "sourceCardName",
        "targetName",
        "targetNames",
        "attachedToName",
      ]) {
        refs.push(...cardRefsFromActionParam(params[key]));
      }
      return refs.length > 0 ? uniqueCardRefs(refs) : undefined;
    }
    default:
      return undefined;
  }
}

function cardRefsFromActionParam(value: unknown): { name: string }[] {
  const unwrapped = unwrapPrivateFieldValue(value);
  if (typeof unwrapped === "string") {
    return namesFromDelimitedString(unwrapped);
  }
  if (Array.isArray(unwrapped)) {
    return unwrapped.flatMap((item) =>
      typeof item === "string" ? namesFromDelimitedString(item) : [],
    );
  }
  return [];
}

function unwrapPrivateFieldValue(value: unknown): unknown {
  if (
    value !== null &&
    typeof value === "object" &&
    (value as { __private?: unknown }).__private === true &&
    "value" in value
  ) {
    return (value as { value: unknown }).value;
  }
  return value;
}

function namesFromDelimitedString(value: string): { name: string }[] {
  return value
    .split(",")
    .map((name) => ({ name: name.trim() }))
    .filter((ref) => ref.name.length > 0);
}

function uniqueCardRefs(
  refs: readonly { id?: string; name: string }[],
): { id?: string; name: string }[] {
  const seen = new Set<string>();
  return refs.filter((ref) => {
    const key = `${ref.id ?? ""}:${ref.name}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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
      return `Attack: ${log.attackerName} spent to attack ${log.defenderName}.`;
    case "attackRival":
      return `Attack: ${log.attackerName} spent to attack the rival Gig area.`;
    case "useBlocker":
      return `React: ${log.blockerName} used BLOCKER to redirect ${log.attackerName}.`;
    case "reactPass":
      return `React: rival passed on ${log.attackerName}'s attack.`;
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
        ? `Steal: ${log.attackerName} stole ${log.stolenCount} Gig${
            log.stolenCount === 1 ? "" : "s"
          }${log.attackerPower === undefined ? "" : ` at ${log.attackerPower} power`}.`
        : `Steal: stole ${log.stolenCount} Gig${log.stolenCount === 1 ? "" : "s"}${
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
