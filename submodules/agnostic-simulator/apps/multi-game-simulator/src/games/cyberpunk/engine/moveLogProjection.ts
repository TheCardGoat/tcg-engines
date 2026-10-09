import {
  defOf,
  enMessages,
  formatActionLog,
  formatStolenGigSummary,
  stripPrivateFields,
  type MatchState,
  type MoveLog,
} from "@tcg/cyberpunk-engine";
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

interface ProjectionContext {
  searchRevealNamesByPlayerTurn: Map<string, string[]>;
}

export function projectMoveLogEntries(
  matchState: MatchState,
  moveLogs: readonly MoveLogEntry[],
  humanSide: Side,
  pendingActionId?: string | null,
): SimulatorEventLogEntry[] {
  const fallbackTimestamp = new Date(matchState.ctx.stateID ?? 0).toISOString();
  const combatContext: CombatLogContext = { open: false, current: null };
  const projectionContext: ProjectionContext = {
    searchRevealNamesByPlayerTurn: new Map(),
  };
  let currentPhase = initialProjectedPhase(matchState, moveLogs);

  const viewerLogs = moveLogs.map((entry) => ({
    ...entry,
    log: stripPrivateFields(entry.log, PLAYER_SIDE_TO_ID[humanSide]),
  }));
  const entries = viewerLogs
    .filter(
      (entry, index) =>
        !isRedundantSearchRevealAction(entry, index, viewerLogs) &&
        !isRedundantSearchResolutionAction(entry, index, viewerLogs),
    )
    .map((entry) => {
      const log = entry.log;
      if (log.type === "searchDeck") {
        projectionContext.searchRevealNamesByPlayerTurn.set(
          searchRevealContextKey(log.playerId, log.turnNumber),
          searchRevealNames(matchState, log) ?? [],
        );
      }
      const phase = phaseForLog(log, currentPhase);
      currentPhase = nextPhaseAfterLog(log, phase);
      const section = combatSectionForLog(log, combatContext);
      const projected: SimulatorEventLogEntry = {
        id: `move-log-${entry.id}`,
        turn: logTurn(log),
        phase,
        seatId: entry.side === "system" ? undefined : String(PLAYER_SIDE_TO_ID[entry.side]),
        timestamp: logTimestamp(log) ?? fallbackTimestamp,
        message: sentenceFor(matchState, log, projectionContext, humanSide),
        tags: moveLogTags(log.type, section),
        entityIds: moveLogEntityIds(log),
        cardRefs: moveLogCardRefs(matchState, log),
      };
      if (section) {
        projected.section = section;
      }
      return projected;
    });

  if (pendingActionId === "concede" && !matchState.G.gameEnded) {
    entries.push({
      id: "pending-concede",
      turn: matchState.G.turnMetadata.turnNumber,
      phase: currentPhase,
      seatId: String(PLAYER_SIDE_TO_ID[humanSide]),
      timestamp: new Date().toISOString(),
      message: "Conceding the game…",
      sourceKey: "cyberpunk.concede.pending",
      tags: ["move"],
    });
  }

  return entries;
}

function initialProjectedPhase(matchState: MatchState, moveLogs: readonly MoveLogEntry[]): string {
  const firstPhaseChange = moveLogs.find(
    (entry): entry is MoveLogEntry & { log: Extract<MoveLog, { type: "phaseChanged" }> } =>
      entry.log.type === "phaseChanged",
  );
  return firstPhaseChange?.log.fromPhase ?? matchState.G.gamePhase;
}

function searchRevealNames(
  matchState: MatchState,
  log: Extract<MoveLog, { type: "searchDeck" }>,
): string[] | undefined {
  const names = unwrapPrivateFieldValue(log.revealedCardNames);
  if (Array.isArray(names) && names.every((name): name is string => typeof name === "string")) {
    return names;
  }
  return cardRefsFromIds(matchState, cardIdsFromPrivateField(log.revealed))?.map(
    (card) => card.name,
  );
}

function searchRevealContextKey(playerId: unknown, turnNumber: unknown): string {
  return `${String(playerId)}:${String(turnNumber)}`;
}

function isRedundantSearchRevealAction(
  entry: MoveLogEntry,
  index: number,
  moveLogs: readonly MoveLogEntry[],
): boolean {
  const log = entry.log;
  if (
    log.type !== "action" ||
    (log.messageKey !== "move.searchDeck.reveal" &&
      log.messageKey !== "move.searchDeck.revealNamed")
  ) {
    return false;
  }
  for (let previous = index - 1; previous >= 0; previous--) {
    const candidate = moveLogs[previous]?.log;
    if (candidate?.playerId !== log.playerId || candidate.turnNumber !== log.turnNumber) continue;
    if (
      candidate.type === "action" &&
      (candidate.messageKey === "move.searchDeck.reveal" ||
        candidate.messageKey === "move.searchDeck.revealNamed")
    ) {
      return false;
    }
    if (
      candidate.type === "action" &&
      (candidate.messageKey === "move.resolveSearchDeck" ||
        candidate.messageKey === "move.resolveSearchDeckNamed")
    ) {
      return false;
    }
    if (candidate.type === "searchDeck") return true;
  }
  return false;
}

function isRedundantSearchResolutionAction(
  entry: MoveLogEntry,
  index: number,
  moveLogs: readonly MoveLogEntry[],
): boolean {
  const log = entry.log;
  if (log.type !== "action" || log.messageKey !== "move.resolveSearchDeck") {
    return false;
  }
  for (let next = index + 1; next < moveLogs.length; next++) {
    const candidate = moveLogs[next]?.log;
    if (candidate?.playerId !== log.playerId || candidate.turnNumber !== log.turnNumber) continue;
    if (candidate.type === "searchDeck") return false;
    if (candidate.type !== "action") continue;
    if (candidate.messageKey === "move.resolveSearchDeck") return false;
    if (candidate.messageKey === "move.resolveSearchDeckNamed") return true;
  }
  return false;
}

function logTurn(log: MoveLog): number {
  return log.turnNumber;
}

function logTimestamp(log: MoveLog): string | undefined {
  if (!("timestamp" in log) || typeof log.timestamp !== "number") {
    return undefined;
  }
  return new Date(log.timestamp).toISOString();
}

function phaseForLog(log: MoveLog, currentPhase: string): string {
  switch (log.type) {
    case "phaseChanged":
      return log.toPhase;
    case "passPhase":
      return log.fromPhase;
    default:
      return currentPhase;
  }
}

function nextPhaseAfterLog(log: MoveLog, projectedPhase: string): string {
  switch (log.type) {
    case "phaseChanged":
    case "passPhase":
      return log.toPhase;
    default:
      return projectedPhase;
  }
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
    case "playCard":
    case "resolveCardToPlay":
    case "activateAbility":
      // CR 9.25: once damage (fight) or the steal resolved, the attack is
      // over — later plays are main-phase moves, not combat reactions.
      if (context.current === "fight" || context.current === "steal") {
        context.open = false;
        context.current = null;
      }
      if (!context.open) return undefined;
      context.current = "react";
      return COMBAT_LOG_SECTIONS.react;
    case "resolveStealGigs":
      // CR 9.24 resolves triggers caused by stealing before the attack ends
      // (CR 9.25). Keep this context open so those result logs stay in Steal;
      // the next player play (playCard/resolveCardToPlay/activateAbility/
      // callLegend) ends the combat for grouping purposes.
      context.open = true;
      context.current = "steal";
      return COMBAT_LOG_SECTIONS.steal;
    case "resolveDiscardFromHand":
    case "lookAtCards":
      if (!context.open) return undefined;
      return COMBAT_LOG_SECTIONS[context.current ?? "attack"];
    case "cardDefeated":
      if (!context.open || context.current !== "fight") return undefined;
      return COMBAT_LOG_SECTIONS.fight;
    case "gigValueChanged":
    case "gigsSwapped":
      if (!context.open) return undefined;
      return COMBAT_LOG_SECTIONS[context.current ?? "attack"];
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
  // CR 9.25: once damage (fight) or the steal resolved, the attack is over —
  // later plays are main-phase moves, not combat reactions.
  if (
    (context.current === "fight" || context.current === "steal") &&
    (key === "move.playCard" ||
      key === "move.playCard.gear" ||
      key === "move.callLegend" ||
      key === "move.activateAbility" ||
      key === "move.activateAbility.attached")
  ) {
    context.open = false;
    context.current = null;
  }
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
  if ((key === "move.playCard" || key === "move.playCard.gear") && context.open) {
    context.current = "react";
    return COMBAT_LOG_SECTIONS.react;
  }
  if ((key === "move.activateAbility" || key === "move.activateAbility.attached") && context.open) {
    context.current = "react";
    return COMBAT_LOG_SECTIONS.react;
  }
  if (
    key.startsWith("move.resolveAttack.fight.") ||
    (key === "trigger.defeatedTarget" && context.open && context.current === "fight")
  ) {
    context.current = "fight";
    context.open = true;
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
    messageKey === "move.activateAbility.attached" ||
    messageKey === "move.resolveAdjustGig" ||
    messageKey.startsWith("effect.") ||
    messageKey.startsWith("trigger.")
  );
}

function moveLogEntityIds(log: MoveLog): string[] | undefined {
  switch (log.type) {
    case "playCard":
    case "cardDefeated":
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
    case "searchDeck":
      return cardIdsFromPrivateField(log.revealed);
    case "lookAtCards":
      return cardIdsFromPrivateField(log.cardIds);
    case "resolveDiscardFromHand":
      return log.discardedCards?.map((card) => String(card.cardId));
    default:
      return undefined;
  }
}

function moveLogCardRefs(
  matchState: MatchState,
  log: MoveLog,
): { id?: string; name: string }[] | undefined {
  switch (log.type) {
    case "playCard":
    case "cardDefeated":
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
    case "searchDeck":
      return searchRevealNames(matchState, log)?.map((name, index) => {
        const id = cardIdsFromPrivateField(log.revealed)?.[index];
        return id ? { id, name } : { name };
      });
    case "lookAtCards":
      return cardRefsFromIds(matchState, cardIdsFromPrivateField(log.cardIds));
    case "resolveDiscardFromHand":
      return log.discardedCards?.map((card) => ({ id: String(card.cardId), name: card.cardName }));
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
        "revealedCardName",
        "revealedCardNames",
        "drawnCardNames",
        "discardedCardName",
        "soldCardNames",
        "trashedCardNames",
        "selectedCardNames",
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

function cardIdsFromPrivateField(value: unknown): string[] | undefined {
  const unwrapped = unwrapPrivateFieldValue(value);
  if (!Array.isArray(unwrapped)) return undefined;
  const ids = unwrapped.filter((item): item is string => typeof item === "string");
  return ids.length > 0 ? ids : undefined;
}

function cardRefsFromIds(
  matchState: MatchState,
  cardIds: readonly string[] | undefined,
): { id: string; name: string }[] | undefined {
  if (!cardIds || cardIds.length === 0) return undefined;
  const refs = cardIds.flatMap((id) => {
    const card = matchState.G.cardIndex[id];
    return card ? [{ id, name: defOf(card).displayName }] : [];
  });
  return refs.length > 0 ? refs : undefined;
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

function sentenceFor(
  matchState: MatchState,
  log: MoveLog,
  context: ProjectionContext,
  humanSide: Side,
): string {
  // Server-generated drop logs aren't part of the engine's MoveLog union,
  // but they can arrive from the gateway during live matches.
  const raw = log as unknown as { type?: string; reason?: unknown };
  const rawType = raw.type;
  if (rawType === "playerDropped") {
    const reason = typeof raw.reason === "string" ? raw.reason.toLowerCase() : "";
    if (reason.includes("timeout") || reason.includes("timed out")) {
      return "Opponent timed out and was dropped.";
    }
    if (reason.includes("disconnect")) {
      return "Opponent disconnected and was dropped.";
    }
    return "Opponent was dropped by the server.";
  }
  if (rawType === "forfeitGame") {
    const reason = typeof raw.reason === "string" ? raw.reason.toLowerCase() : "";
    return reason.includes("timeout") || reason.includes("timed out")
      ? "Opponent timed out."
      : "Opponent forfeited the game.";
  }

  switch (log.type) {
    case "playCard":
      return `Played ${log.cardName} for ${log.cost} eddie${log.cost === 1 ? "" : "s"}.`;
    case "cardDefeated":
      return `${log.cardName} was defeated.`;
    case "gigValueChanged":
      return `Adjusted ${log.dieType.toUpperCase()} gig die from ${log.previousValue} to ${log.newValue}.`;
    case "gigsSwapped":
      return `Swapped friendly ${log.friendlyDieType.toUpperCase()} Gig (${log.friendlyValue}) with rival ${log.rivalDieType.toUpperCase()} Gig (${log.rivalValue}); friendly Gig value ${log.friendlyValue} to ${log.rivalValue}, rival ${log.rivalValue} to ${log.friendlyValue}.`;
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
      return log.fromPhase === log.toPhase
        ? `Passed ${phaseName(log.fromPhase)} phase.`
        : `Passed ${phaseName(log.fromPhase)} phase; advanced to ${phaseName(log.toPhase)}.`;
    case "phaseChanged":
      if (log.fromPhase === log.toPhase) {
        return `${phaseName(log.toPhase)} phase continued.`;
      }
      if (log.fromPhase === "setup" && log.toPhase === "start") {
        return "Setup complete; start phase begins.";
      }
      return `Advanced from ${phaseName(log.fromPhase)} to ${phaseName(log.toPhase)}.`;
    case "gainGig":
      return `Gained ${log.dieType.toUpperCase()} gig (${log.faceValue}).`;
    case "mulligan": {
      return `Took a mulligan and drew ${cardCount(log.drawnCount)}.`;
    }
    case "keepHand":
      return "Kept opening hand.";
    case "resolveCardToPlay":
      return `Played ${log.cardName} (resolved choice).`;
    case "resolveCardToMove":
      if (log.passed) {
        return "Skipped the optional move.";
      }
      return log.cardName ? `Moved ${log.cardName}.` : "Resolved card-to-move.";
    case "resolveDiscardFromHand": {
      if (log.passed) {
        return "Skipped the optional discard.";
      }
      const discardedNames = log.discardedCards?.map((card) => card.cardName);
      if (log.reason === "costMatchedFriendlyGig") {
        return discardedNames && discardedNames.length > 0
          ? `Discarded ${discardedNames.join(", ")} because the discarded card's cost matched a friendly Gig.`
          : `Discarded ${log.discardedCount} additional card${
              log.discardedCount === 1 ? "" : "s"
            } because the discarded card's cost matched a friendly Gig.`;
      }
      return discardedNames && discardedNames.length > 0
        ? `Discarded ${log.discardedCount} card${log.discardedCount === 1 ? "" : "s"}: ${discardedNames.join(", ")}.`
        : `Discarded ${log.discardedCount} card${log.discardedCount === 1 ? "" : "s"}.`;
    }
    case "resolveStealGigs": {
      const stolenGigSummary = log.stolenGigs
        ? formatStolenGigSummary(log.stolenGigs)
        : `${log.stolenCount} Gig${log.stolenCount === 1 ? "" : "s"}`;
      return log.attackerName
        ? `Steal: ${log.attackerName} stole ${stolenGigSummary}${
            log.attackerPower === undefined ? "" : ` at ${log.attackerPower} power`
          }.`
        : `Steal: stole ${stolenGigSummary}${
            log.attackerPower === undefined ? "" : ` at ${log.attackerPower} power`
          }.`;
    }
    case "concede":
      return "Conceded the game.";
    case "undo":
      return log.scope === "turnStart"
        ? `Rewound to the start of turn ${log.turnNumber}.`
        : "Undid the last move.";
    case "activateAbility":
      return `${log.cardName} activated its ability.`;
    case "searchDeck": {
      const revealedNames = searchRevealNames(matchState, log);
      if (revealedNames && revealedNames.length > 0) {
        return `Revealed the top ${log.revealedCount} cards of the deck: ${revealedNames.join(
          ", ",
        )}.`;
      }
      return `Revealed the top ${log.revealedCount} cards of the deck.`;
    }
    case "lookAtCards": {
      const cardIds = cardIdsFromPrivateField(log.cardIds);
      const count = cardIds?.length;
      return count === undefined
        ? `Looked at cards in ${phaseName(log.zone)}.`
        : `Looked at ${count} card${count === 1 ? "" : "s"} in ${phaseName(log.zone)}.`;
    }
    case "resolveSearchDeck":
      return `Searched the top ${log.lookedAt} cards and found ${log.found}.`;
    case "resolveRevealDestination":
      return `Moved ${log.count} revealed card${log.count === 1 ? "" : "s"} to ${log.destination}.`;
    case "turnStarted":
      return `Turn ${log.turnNumber} started.`;
    case "turnEnded":
      return `Turn ${log.turnNumber} ended.`;
    case "gameEnded":
      return log.winnerId
        ? `Game over (${winReasonPhrase(log.reason)}).`
        : `Game ended in a draw (${winReasonPhrase(log.reason)}).`;
    case "action":
      if (log.messageKey === "setup.firstPlayerChoice") {
        const order = log.params.order;
        if (order === "first" || order === "second") {
          return `${log.playerId === PLAYER_SIDE_TO_ID[humanSide] ? "You" : "Rival"} chose to go ${order}.`;
        }
      }
      if (log.messageKey === "move.concede") {
        return `${log.playerId === PLAYER_SIDE_TO_ID[humanSide] ? "You" : "Rival"} conceded the game.`;
      }
      if (log.messageKey === "effect.draw.resolved") {
        const params = log.params as Record<string, unknown>;
        const sourceCardName =
          typeof params.sourceCardName === "string" ? params.sourceCardName : "That effect";
        const drawnCount = typeof params.drawnCount === "number" ? params.drawnCount : 0;
        const drawnCardNames =
          typeof params.drawnCardNames === "string" ? params.drawnCardNames : undefined;
        return drawnCardNames
          ? `${sourceCardName} drew ${drawnCount} card(s): ${drawnCardNames}.`
          : `${sourceCardName} drew ${drawnCount} card(s).`;
      }
      if (log.messageKey === "effect.sellFromDeck.resolved") {
        const params = log.params as Record<string, unknown>;
        const sourceCardName =
          typeof params.sourceCardName === "string" ? params.sourceCardName : "That effect";
        const soldCardNames =
          typeof params.soldCardNames === "string" ? params.soldCardNames : undefined;
        return soldCardNames
          ? `${sourceCardName} sold ${soldCardNames} from the top of the deck.`
          : `${sourceCardName} sold the top card of the deck.`;
      }
      if (log.messageKey === "effect.trashFromDeck.resolved") {
        const params = log.params as Record<string, unknown>;
        const sourceCardName =
          typeof params.sourceCardName === "string" ? params.sourceCardName : "That effect";
        const trashedCount = typeof params.trashedCount === "number" ? params.trashedCount : 0;
        const trashedCardNames = unwrapPrivateFieldValue(params.trashedCardNames);
        return typeof trashedCardNames === "string" && trashedCardNames.length > 0
          ? `${sourceCardName} trashed ${trashedCount} card(s) from the top of the deck: ${trashedCardNames}.`
          : `${sourceCardName} trashed ${trashedCount} card(s) from the top of the deck.`;
      }
      if (log.messageKey === "move.resolveSearchDeck") {
        const params = log.params as Record<string, unknown>;
        const count = typeof params.count === "number" ? params.count : 0;
        const looked = typeof params.looked === "number" ? params.looked : 0;
        const revealedNames = context.searchRevealNamesByPlayerTurn.get(
          searchRevealContextKey(log.playerId, log.turnNumber),
        );
        return revealedNames && revealedNames.length > 0
          ? `Searched the top ${looked} cards (${revealedNames.join(", ")}) and found ${count}.`
          : `Searched the top ${looked} cards and found ${count}.`;
      }
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

/**
 * Rules-accurate phrases for engine win reasons. Overtime ends when a player
 * holds seven or more Gig dice (a majority of the 12-dice pool); Street Cred
 * is the sum of Gig die values and never decides the game (CR 1.11, 11.2.1).
 */
function winReasonPhrase(reason: string): string {
  switch (reason) {
    case "gig_victory":
      return "Gig victory: 7 Gigs";
    case "overtime_majority":
      return "Overtime: first to 7 Gig dice";
    case "deck_out_victory":
      return "Deck out";
    case "concede":
      return "Concession";
    default:
      return reason;
  }
}

function phaseName(phase: string): string {
  return phase.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
}

function cardCount(count: number): string {
  return `${count} card${count === 1 ? "" : "s"}`;
}
