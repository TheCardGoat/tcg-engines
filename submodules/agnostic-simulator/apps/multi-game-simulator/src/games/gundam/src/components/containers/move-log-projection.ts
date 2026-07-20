import type { SimulatorEventLogEntry } from "@tcg/simulator-contract";
import type { GundamMoveLog, MoveHistoryEntry } from "@tcg/gundam-engine";

import type { EngineAdapter, TurnTaggedLogEntry, TurnTaggedMoveLog } from "../../game/adapter.ts";

type CardResolver = EngineAdapter["cardDefinitionOf"];

const DEFAULT_CARD_RESOLVER: CardResolver = () => null;

interface ProjectionOptions {
  readonly revealPrivateFields?: boolean;
  readonly moveHistory?: readonly MoveHistoryEntry[];
}

type LogSection = NonNullable<SimulatorEventLogEntry["section"]>;

interface HistoricalPhaseIndex {
  readonly byCommandId: ReadonlyMap<string, MoveHistoryEntry>;
  readonly byStateId: ReadonlyMap<number, MoveHistoryEntry>;
}

export function projectGundamMoveLogEntries(
  logs: readonly TurnTaggedMoveLog[],
  viewerId: string,
  phase: string,
  resolveCard: CardResolver = DEFAULT_CARD_RESOLVER,
  options: ProjectionOptions = {},
): SimulatorEventLogEntry[] {
  const phaseIndex = buildHistoricalPhaseIndex(options.moveHistory ?? []);
  const effectSections = new Map<string, LogSection>();
  let activeCombat: LogSection | null = null;
  let combatOrdinal = 0;

  const projected = logs.flatMap((entry, index) => {
    const log = entry.log;
    const baseId = `gundam-move-log-${log.commandID ?? log.stateID ?? `${entry.turnNumber}-${index}`}`;
    const historicalPhase = phaseForMove(log, phase, phaseIndex);
    if (log.type === "attack") {
      combatOrdinal += 1;
      activeCombat = combatSection(log, entry.turnNumber, combatOrdinal, resolveCard);
    } else if (activeCombat && endsActiveCombat(log)) {
      activeCombat = null;
    }
    const effectSection = sectionForEffect(log, resolveCard, effectSections);
    const section = activeCombat && belongsToActiveCombat(log) ? activeCombat : effectSection;
    const eventTurn = turnForMoveLog(entry);
    const baseEntry = entryFor({
      id: baseId,
      log,
      turn: eventTurn,
      phase: historicalPhase,
      viewerId,
      message: primaryMessage(log, viewerId, resolveCard),
      tags: primaryTags(log),
      entityIds: primaryEntityIds(log),
      section,
    });
    const outcomeEntries = outcomeMessages(log, viewerId, resolveCard, options).map(
      (outcome, outcomeIndex) =>
        entryFor({
          id: `${baseId}-outcome-${outcomeIndex}`,
          log,
          turn: eventTurn,
          phase: historicalPhase,
          viewerId,
          message: outcome.message,
          tags: outcome.tags,
          entityIds: outcome.entityIds,
          section,
        }),
    );

    const combatCompleted = activeCombat !== null && hasCombatOutcome(log);
    const completionEntry = combatCompleted
      ? entryFor({
          id: `${baseId}-combat-complete`,
          log,
          turn: eventTurn,
          phase: historicalPhase,
          viewerId,
          message: "Combat resolved.",
          tags: ["combat"],
          entityIds: primaryEntityIds(log),
          section: activeCombat,
        })
      : null;
    if (combatCompleted) activeCombat = null;

    return completionEntry
      ? [baseEntry, ...outcomeEntries, completionEntry]
      : [baseEntry, ...outcomeEntries];
  });
  return collapsePairedActionWindowPasses(projected);
}

function turnForMoveLog(entry: TurnTaggedMoveLog): number {
  return entry.log.type === "pass" && entry.log.context === "turn"
    ? Math.max(0, entry.turnNumber - 1)
    : entry.turnNumber;
}

export function projectGundamLegacyEventLogEntries(
  entries: readonly TurnTaggedLogEntry[],
  viewerId: string,
  phase: string,
  resolveCard: CardResolver = DEFAULT_CARD_RESOLVER,
): SimulatorEventLogEntry[] {
  let currentPhase = humanizePhase(phase);
  return entries.flatMap((tagged) => {
    const entry = tagged.entry;
    const values = valuesOf(entry);
    if (entry.type === "gundam.phase.entered") {
      currentPhase = humanizePhase(stringValue(values.phase) ?? currentPhase);
    }
    const playerId = authorOf(entry, values);
    const entryPhase = entry.type.startsWith("gundam.setup.")
      ? "setup"
      : entry.type === "gundam.turn.started"
        ? "start"
        : entry.type === "gundam.turn.ended"
          ? "end"
          : currentPhase;
    const base = {
      id: `gundam-legacy-log-${entry.id}`,
      turn:
        entry.type === "gundam.turn.ended" ? Math.max(0, tagged.turnNumber - 1) : tagged.turnNumber,
      phase: entryPhase,
      timestamp: timestampFromNumber(entry.timestamp),
      ...(playerId ? { seatId: playerId === viewerId ? "player" : "opponent" } : {}),
    };

    switch (entry.type) {
      case "gundam.turn.started":
        return [
          {
            ...base,
            message: `${playerName(stringValue(values.playerId) ?? "", viewerId)} started the turn.`,
            tags: ["system"] as SimulatorEventLogEntry["tags"],
          },
        ];
      case "gundam.turn.ended":
        return [
          {
            ...base,
            message: `${playerName(stringValue(values.playerId) ?? "", viewerId)} ended the turn.`,
            tags: ["system"] as SimulatorEventLogEntry["tags"],
          },
        ];
      case "gundam.phase.entered": {
        const step = stringValue(values.step);
        if (step) return [];
        return [
          {
            ...base,
            message: `Entered ${currentPhase}.`,
            tags: ["system"] as SimulatorEventLogEntry["tags"],
          },
        ];
      }
      case "gundam.effect.deckRevealed": {
        if (!playerId) return [];
        const cardIds = stringArray(values.cardIds ?? entry.cardIds);
        const cardList = cardIds.map((id) => cardName(id, resolveCard)).join(", ");
        return [
          {
            ...base,
            tags: ["ability"] as SimulatorEventLogEntry["tags"],
            message:
              cardIds.length > 0
                ? `${playerName(playerId, viewerId)} revealed ${cardIds.length}: ${cardList} from deck.`
                : `${playerName(playerId, viewerId)} revealed cards from deck.`,
            entityIds: unique(cardIds),
          },
        ];
      }
      case "gundam.effect.cardTutored": {
        if (!playerId) return [];
        const cardId = stringValue(values.cardId) ?? entry.cardIds?.[0];
        return [
          {
            ...base,
            tags: ["ability"] as SimulatorEventLogEntry["tags"],
            message: cardId
              ? `${playerName(playerId, viewerId)} searched for ${cardName(cardId, resolveCard)}.`
              : `${playerName(playerId, viewerId)} searched their deck.`,
            entityIds: cardId ? [cardId] : undefined,
          },
        ];
      }
      default:
        if (entry.type.startsWith("gundam.setup.") && entry.message) {
          return [
            {
              ...base,
              message: prettifyLegacyMessage(entry.message, values, viewerId, resolveCard),
              tags: ["system"] as SimulatorEventLogEntry["tags"],
              entityIds: unique(collectLegacyEntityIds(entry, values)),
            },
          ];
        }
        return [];
    }
  });
}

function entryFor(args: {
  readonly id: string;
  readonly log: GundamMoveLog;
  readonly turn: number;
  readonly phase: string;
  readonly viewerId: string;
  readonly message: string;
  readonly tags: SimulatorEventLogEntry["tags"];
  readonly entityIds?: readonly string[];
  readonly section?: LogSection | null;
}): SimulatorEventLogEntry {
  return {
    id: args.id,
    turn: args.turn,
    phase: args.phase,
    seatId: String(args.log.playerId) === args.viewerId ? "player" : "opponent",
    timestamp: timestampFor(args.log),
    message: args.message,
    tags: args.tags,
    entityIds: unique(args.entityIds),
    ...(args.section ? { section: args.section } : {}),
  };
}

function timestampFor(log: GundamMoveLog): string {
  const timestamp = Number.isFinite(log.timestamp) ? log.timestamp : 0;
  return timestampFromNumber(timestamp);
}

function timestampFromNumber(value: number): string {
  const timestamp = Number.isFinite(value) ? value : 0;
  return new Date(timestamp).toISOString();
}

function cardName(cardId: string, resolveCard: CardResolver): string {
  if (cardId === "direct") return "direct";
  return resolveCard(cardId)?.name ?? cardId;
}

function playerName(playerId: string, viewerId: string): string {
  return playerId === viewerId ? "You" : "Opponent";
}

function primaryMessage(log: GundamMoveLog, viewerId: string, resolveCard: CardResolver): string {
  switch (log.type) {
    case "deployUnit":
      return `Deployed ${cardName(log.cardId, resolveCard)}.`;
    case "deployBase":
      return `Deployed base ${cardName(log.cardId, resolveCard)}.`;
    case "playCommand":
      return `Played ${cardName(log.cardId, resolveCard)}.`;
    case "assignPilot":
      return `Paired ${cardName(log.pilotId, resolveCard)} with ${cardName(
        log.unitId,
        resolveCard,
      )}.`;
    case "attack":
      return `Attacked ${cardName(log.targetId, resolveCard)} with ${cardName(
        log.attackerId,
        resolveCard,
      )}.`;
    case "block":
      return `Blocked ${cardName(log.attackerId, resolveCard)} with ${cardName(
        log.blockerId,
        resolveCard,
      )}.`;
    case "resolveEffect":
      return `Finished resolving ${cardName(log.sourceCardId, resolveCard)}.`;
    case "pass": {
      const actor = playerName(String(log.playerId), viewerId);
      switch (log.context) {
        case "block":
          return `${actor} did not block.`;
        case "battle":
          return `${actor} passed the action window.`;
        case "action-step":
          return `${actor} passed priority.`;
        case "turn":
          return `${actor} ended the turn.`;
      }
    }
    case "turnStart":
      return `${playerName(String(log.activePlayerId), viewerId)} started the turn.`;
    case "gameEnd":
      return `Game ended: ${log.reason}.`;
    default: {
      const exhaustive: never = log;
      throw new Error(`Unhandled Gundam move log type: ${(exhaustive as { type?: string }).type}`);
    }
  }
}

function primaryTags(log: GundamMoveLog): SimulatorEventLogEntry["tags"] {
  switch (log.type) {
    case "attack":
    case "block":
      return ["combat"];
    case "pass":
      return log.context === "block" || log.context === "battle" ? ["combat"] : ["move"];
    case "resolveEffect":
      return ["ability"];
    case "turnStart":
    case "gameEnd":
      return ["system"];
    default:
      return ["move"];
  }
}

function collapsePairedActionWindowPasses(
  entries: readonly SimulatorEventLogEntry[],
): SimulatorEventLogEntry[] {
  const collapsed: SimulatorEventLogEntry[] = [];
  for (const entry of entries) {
    const previous = collapsed[collapsed.length - 1];
    if (
      previous &&
      previous.message.endsWith(" passed the action window.") &&
      entry.message.endsWith(" passed the action window.") &&
      previous.seatId !== entry.seatId &&
      previous.section?.id === entry.section?.id &&
      previous.phase === entry.phase
    ) {
      collapsed[collapsed.length - 1] = {
        id: `${previous.id}:${entry.id}:paired`,
        turn: entry.turn,
        phase: entry.phase,
        timestamp: entry.timestamp,
        message: "Both players passed the action window.",
        tags: ["combat"],
        entityIds: unique([...(previous.entityIds ?? []), ...(entry.entityIds ?? [])]),
        ...(entry.section ? { section: entry.section } : {}),
      };
      continue;
    }
    collapsed.push(entry);
  }
  return collapsed;
}

function primaryEntityIds(log: GundamMoveLog): readonly string[] | undefined {
  switch (log.type) {
    case "deployUnit":
    case "deployBase":
    case "playCommand":
      return [String(log.cardId)];
    case "assignPilot":
      return [String(log.pilotId), String(log.unitId)];
    case "attack":
      return [String(log.attackerId), ...entityIdForTarget(log.targetId)];
    case "block":
      return [String(log.blockerId), String(log.attackerId)];
    case "resolveEffect":
      return [String(log.sourceCardId)];
    default:
      return undefined;
  }
}

function entityIdForTarget(targetId: string): readonly string[] {
  return targetId === "direct" ? [] : [targetId];
}

function buildHistoricalPhaseIndex(history: readonly MoveHistoryEntry[]): HistoricalPhaseIndex {
  const byCommandId = new Map<string, MoveHistoryEntry>();
  const byStateId = new Map<number, MoveHistoryEntry>();
  for (const entry of history) {
    byCommandId.set(entry.commandID, entry);
    byStateId.set(entry.stateID, entry);
  }
  return { byCommandId, byStateId };
}

function phaseForMove(log: GundamMoveLog, fallback: string, history: HistoricalPhaseIndex): string {
  if (log.type === "turnStart") return "start";
  if (log.type === "attack" || log.type === "block") return "battle";
  if (log.type === "pass") {
    if (log.context === "block" || log.context === "battle") return "battle";
    if (log.context === "turn") return "end";
  }
  const historical =
    (log.commandID ? history.byCommandId.get(log.commandID) : undefined) ??
    (log.stateID === undefined ? undefined : history.byStateId.get(log.stateID));
  return humanizePhase(historical?.phase ?? fallback);
}

function humanizePhase(value: string): string {
  return (
    value
      .trim()
      .replace(/-(?:phase|step)$/u, "")
      .replace(/[-_]+/gu, " ") || "setup"
  );
}

function combatSection(
  log: Extract<GundamMoveLog, { readonly type: "attack" }>,
  turn: number,
  ordinal: number,
  resolveCard: CardResolver,
): LogSection {
  const attacker = cardName(log.attackerId, resolveCard);
  const target = log.targetId === "direct" ? "Rival" : cardName(log.targetId, resolveCard);
  return {
    id: `gundam-combat-${turn}-${ordinal}`,
    label: `${attacker} → ${target}`,
    tone: "fight",
  };
}

function belongsToActiveCombat(log: GundamMoveLog): boolean {
  return (
    log.type === "attack" ||
    log.type === "block" ||
    (log.type === "pass" && (log.context === "block" || log.context === "battle")) ||
    hasCombatOutcome(log)
  );
}

function endsActiveCombat(log: GundamMoveLog): boolean {
  return (
    log.type === "deployUnit" ||
    log.type === "deployBase" ||
    log.type === "playCommand" ||
    log.type === "assignPilot" ||
    log.type === "turnStart" ||
    log.type === "gameEnd" ||
    (log.type === "pass" && log.context === "turn")
  );
}

function hasCombatOutcome(log: GundamMoveLog): boolean {
  const outcomes = log.outcomes;
  return Boolean(
    outcomes &&
    ((outcomes.damageDealt?.length ?? 0) > 0 ||
      (outcomes.shieldsRemoved?.length ?? 0) > 0 ||
      (outcomes.unitsDefeated?.length ?? 0) > 0),
  );
}

function sectionForEffect(
  log: GundamMoveLog,
  resolveCard: CardResolver,
  sections: Map<string, LogSection>,
): LogSection | null {
  if (log.type === "resolveEffect") {
    const effectKey = log.effectId ? `effect:${log.effectId}` : null;
    const sourceKey = `source:${String(log.sourceCardId)}`;
    const existing = (effectKey ? sections.get(effectKey) : undefined) ?? sections.get(sourceKey);
    if (existing) return existing;
    const created: LogSection = {
      id: `gundam-effect-${log.effectId ?? log.commandID ?? log.stateID ?? log.sourceCardId}`,
      label: cardName(log.sourceCardId, resolveCard),
      tone: "effect",
    };
    if (effectKey) sections.set(effectKey, created);
    sections.set(sourceKey, created);
    return created;
  }

  const queued = (log.outcomes?.effectsQueued ?? []).filter(
    (effect) => !isInternalEffectSource(effect.sourceCardId),
  );
  const resolved = (log.outcomes?.effectsResolved ?? []).filter(
    (effect) => !isInternalEffectSource(effect.sourceCardId),
  );
  const first = queued[0] ?? resolved[0];
  if (!first) return null;
  const sourceKey = `source:${String(first.sourceCardId)}`;
  const existing = sections.get(`effect:${first.effectId}`) ?? sections.get(sourceKey);
  const section: LogSection =
    existing ??
    ({
      id: `gundam-effect-${log.commandID ?? log.stateID ?? first.effectId}`,
      label: cardName(first.sourceCardId, resolveCard),
      tone: "effect",
    } satisfies LogSection);
  for (const effect of [...queued, ...resolved]) {
    sections.set(`effect:${effect.effectId}`, section);
    sections.set(`source:${String(effect.sourceCardId)}`, section);
  }
  return section;
}

function outcomeMessages(
  log: GundamMoveLog,
  viewerId: string,
  resolveCard: CardResolver,
  options: ProjectionOptions,
): Array<{
  readonly message: string;
  readonly tags: SimulatorEventLogEntry["tags"];
  readonly entityIds?: readonly string[];
}> {
  const outcomes = log.outcomes;
  if (!outcomes) return [];
  const messages: Array<{
    readonly message: string;
    readonly tags: SimulatorEventLogEntry["tags"];
    readonly entityIds?: readonly string[];
  }> = [];

  for (const damage of outcomes.damageDealt ?? []) {
    messages.push({
      message: `${cardName(damage.targetId, resolveCard)} took ${damage.amount} damage.`,
      tags: ["combat"],
      entityIds: unique([damage.sourceCardId, damage.targetId]),
    });
  }

  for (const shield of outcomes.shieldsRemoved ?? []) {
    messages.push({
      message: `${cardName(shield.cardId, resolveCard)} lost a shield.`,
      tags: ["combat"],
      entityIds: unique([shield.sourceCardId, shield.cardId]),
    });
  }

  for (const defeated of outcomes.unitsDefeated ?? []) {
    messages.push({
      message: `${cardName(defeated.cardId, resolveCard)} was defeated.`,
      tags: ["combat"],
      entityIds: unique([defeated.defeatedBy, defeated.cardId]),
    });
  }

  if (outcomes.cardsDrawn) {
    const visibleIds = visibleCardIds(
      outcomes.cardsDrawn.cardIds,
      viewerId,
      options.revealPrivateFields === true,
    );
    messages.push({
      message:
        visibleIds.length > 0
          ? `Drew ${outcomes.cardsDrawn.count}: ${visibleIds
              .map((id) => cardName(id, resolveCard))
              .join(", ")}.`
          : `Drew ${outcomes.cardsDrawn.count} card(s).`,
      tags: ["move"],
      entityIds: visibleIds,
    });
  }

  if (outcomes.resourcesSpent) {
    messages.push({
      message: resourcePaymentMessage(
        outcomes.resourcesSpent.regularCount,
        outcomes.resourcesSpent.exRemovedCount,
      ),
      tags: ["move"],
    });
  }

  for (const id of outcomes.cardsDiscarded ?? []) {
    messages.push({
      message: `Discarded ${cardName(id, resolveCard)}.`,
      tags: ["move"],
      entityIds: [String(id)],
    });
  }

  for (const id of outcomes.unitsRested ?? []) {
    messages.push({
      message: `${cardName(id, resolveCard)} was rested for cost.`,
      tags: ["move"],
      entityIds: [String(id)],
    });
  }

  for (const moved of outcomes.cardsMoved ?? []) {
    if (isDeckToHandMove(moved.from, moved.to)) {
      continue;
    }
    messages.push({
      message: `${cardName(moved.cardId, resolveCard)} moved${
        moved.from ? ` from ${moved.from}` : ""
      } to ${moved.to}.`,
      tags: ["move"],
      entityIds: [String(moved.cardId)],
    });
  }

  for (const id of outcomes.cardsReturnedToHand ?? []) {
    messages.push({
      message: `${cardName(id, resolveCard)} returned to hand.`,
      tags: ["move"],
      entityIds: [String(id)],
    });
  }

  for (const id of outcomes.cardsExhausted ?? []) {
    messages.push({
      message: `${cardName(id, resolveCard)} was exhausted.`,
      tags: ["move"],
      entityIds: [String(id)],
    });
  }

  for (const id of outcomes.cardsReadied ?? []) {
    messages.push({
      message: `${cardName(id, resolveCard)} was readied.`,
      tags: ["move"],
      entityIds: [String(id)],
    });
  }

  for (const placed of outcomes.resourcesPlaced ?? []) {
    messages.push({
      message: `${cardName(placed.cardId, resolveCard)} was placed as a ${placed.state} resource.`,
      tags: ["move"],
      entityIds: [String(placed.cardId)],
    });
  }

  for (const effect of outcomes.effectsQueued ?? []) {
    if (isInternalEffectSource(effect.sourceCardId)) continue;
    messages.push({
      message: `Started resolving ${cardName(effect.sourceCardId, resolveCard)}.`,
      tags: ["ability"],
      entityIds: [String(effect.sourceCardId)],
    });
  }

  for (const effect of outcomes.effectsResolved ?? []) {
    if (log.type === "resolveEffect" || isInternalEffectSource(effect.sourceCardId)) continue;
    messages.push({
      message: `Finished resolving ${cardName(effect.sourceCardId, resolveCard)}.`,
      tags: ["ability"],
      entityIds: [String(effect.sourceCardId)],
    });
  }

  return dedupeOutcomeMessages(messages);
}

function resourcePaymentMessage(regularCount: number, exRemovedCount: number): string {
  const regular = `${regularCount} ${regularCount === 1 ? "resource" : "resources"}`;
  if (exRemovedCount === 0) return `Paid ${regular}.`;
  const ex = `${exRemovedCount} EX ${exRemovedCount === 1 ? "token" : "tokens"}`;
  return `Paid ${regular} and ${ex}.`;
}

function isInternalEffectSource(sourceCardId: unknown): boolean {
  return String(sourceCardId).startsWith("__");
}

function dedupeOutcomeMessages<T extends { readonly message: string }>(
  messages: readonly T[],
): T[] {
  const seen = new Set<string>();
  return messages.filter((message) => {
    if (seen.has(message.message)) return false;
    seen.add(message.message);
    return true;
  });
}

function isDeckToHandMove(fromZoneId: string | undefined, toZoneId: string): boolean {
  return baseZoneId(fromZoneId) === "deck" && baseZoneId(toZoneId) === "hand";
}

function baseZoneId(zoneId: string | undefined): string | undefined {
  return zoneId?.split(":")[0];
}

function visibleCardIds(value: unknown, viewerId: string, revealPrivateFields: boolean): string[] {
  if (Array.isArray(value)) return value.filter((id): id is string => typeof id === "string");
  if (
    typeof value === "object" &&
    value !== null &&
    "__private" in value &&
    (value as { __private?: unknown }).__private === true &&
    "value" in value &&
    "visibleTo" in value &&
    Array.isArray((value as { value?: unknown }).value)
  ) {
    const visibleTo = (value as { visibleTo?: unknown }).visibleTo;
    const canReveal =
      revealPrivateFields ||
      (Array.isArray(visibleTo) &&
        visibleTo.some((id) => typeof id === "string" && id === viewerId));
    if (!canReveal) return [];
    return (value as { value: unknown[] }).value.filter(
      (id): id is string => typeof id === "string",
    );
  }
  return [];
}

function unique(values: readonly (string | undefined)[] | undefined): string[] | undefined {
  const ids = [...new Set((values ?? []).filter((value): value is string => Boolean(value)))];
  return ids.length > 0 ? ids : undefined;
}

function valuesOf(entry: TurnTaggedLogEntry["entry"]): Record<string, unknown> {
  const values = (entry.data as { values?: unknown } | undefined)?.values;
  return typeof values === "object" && values !== null ? (values as Record<string, unknown>) : {};
}

function authorOf(
  entry: TurnTaggedLogEntry["entry"],
  values: Record<string, unknown>,
): string | undefined {
  return stringValue(entry.playerId) ?? stringValue(values.playerId) ?? stringValue(values.chooser);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function prettifyLegacyMessage(
  message: string,
  values: Record<string, unknown>,
  viewerId: string,
  resolveCard: CardResolver,
): string {
  let out = message;
  for (const [key, value] of Object.entries(values)) {
    if (typeof value !== "string") continue;
    const replacement = isPlayerValueKey(key)
      ? playerName(value, viewerId)
      : cardName(value, resolveCard);
    out = out.replaceAll(value, replacement);
  }
  return out;
}

function isPlayerValueKey(key: string): boolean {
  return key === "playerId" || key === "chooser" || key === "chosen" || key.endsWith("PlayerId");
}

function collectLegacyEntityIds(
  entry: TurnTaggedLogEntry["entry"],
  values: Record<string, unknown>,
): string[] {
  const ids = new Set<string>(entry.cardIds ?? []);
  for (const key of ["cardId", "sourceCardId", "targetId"]) {
    const value = values[key];
    if (typeof value === "string") ids.add(value);
  }
  for (const value of stringArray(values.cardIds)) {
    ids.add(value);
  }
  return [...ids];
}
