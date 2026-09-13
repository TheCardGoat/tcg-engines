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

interface EffectProjectionMeta {
  readonly effectId: string;
  readonly sourceCardId: string;
  readonly controllerId?: string;
  readonly kind?: string;
  readonly timing?: string;
}

interface ProjectedOutcome {
  readonly message: string;
  readonly tags: SimulatorEventLogEntry["tags"];
  readonly entityIds?: readonly string[];
  readonly cardRefs?: SimulatorEventLogEntry["cardRefs"];
  readonly playerId?: string;
  readonly effectId?: string;
  readonly dedupeKey?: string;
  readonly orderKey?: string;
}

export function projectGundamMoveLogEntries(
  logs: readonly TurnTaggedMoveLog[],
  viewerId: string,
  phase: string,
  resolveCard: CardResolver = DEFAULT_CARD_RESOLVER,
  options: ProjectionOptions = {},
): SimulatorEventLogEntry[] {
  const phaseIndex = buildHistoricalPhaseIndex(options.moveHistory ?? []);
  const effectMeta = collectEffectProjectionMeta(logs);
  const effectIdsBySource = collectEffectIdsBySource(effectMeta);
  const effectSections = new Map<string, LogSection>();
  let activeCombat: LogSection | null = null;
  let combatOrdinal = 0;

  const projected = logs.flatMap((entry, index) => {
    const log = entry.log;
    const baseId = `gundam-move-log-${log.commandID ?? log.stateID ?? `${entry.turnNumber}-${index}`}`;
    const historicalPhase = phaseForMove(log, phase, phaseIndex);
    const eventTurn = turnForMoveLog(entry);
    if (log.type === "attack") {
      combatOrdinal += 1;
      activeCombat = combatSection(log, eventTurn, combatOrdinal, resolveCard);
    } else if (activeCombat && endsActiveCombat(log)) {
      activeCombat = null;
    }
    const effectSection = sectionForEffect(
      log,
      resolveCard,
      effectSections,
      effectMeta,
      effectIdsBySource,
    );
    const section = activeCombat && belongsToActiveCombat(log) ? activeCombat : effectSection;
    const resolvedEffectName =
      log.type === "resolveEffect"
        ? effectDisplayName(
            effectMeta.get(log.effectId ?? ""),
            log.sourceCardId,
            resolveCard,
            effectIdsBySource,
          )
        : undefined;
    const baseEntry = entryFor({
      id: baseId,
      log,
      turn: eventTurn,
      phase: historicalPhase,
      viewerId,
      message: primaryMessage(log, viewerId, resolveCard, resolvedEffectName),
      tags: primaryTags(log),
      entityIds: primaryEntityIds(log),
      section,
    });
    const outcomeEntries = outcomeMessages(
      log,
      viewerId,
      resolveCard,
      options,
      effectMeta,
      effectIdsBySource,
    ).map((outcome, outcomeIndex) => {
      const outcomeSection = outcome.effectId
        ? sectionForEffectId(
            outcome.effectId,
            resolveCard,
            effectSections,
            effectMeta,
            effectIdsBySource,
          )
        : section;
      return entryFor({
        id: `${baseId}-outcome-${outcomeIndex}`,
        log,
        turn: outcomeTurn(log, outcome, eventTurn),
        phase: outcomePhase(log, outcome, historicalPhase),
        viewerId,
        message: outcome.message,
        tags: outcome.tags,
        entityIds: outcome.entityIds,
        cardRefs: outcome.cardRefs,
        section: outcomeSection,
        playerId: outcome.playerId,
      });
    });

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

    const entries =
      log.type === "resolveEffect"
        ? [...outcomeEntries, baseEntry]
        : [baseEntry, ...outcomeEntries];
    return completionEntry ? [...entries, completionEntry] : entries;
  });
  return collapsePairedActionWindowPasses(placeTransitionDrawsAfterTurnStart(projected));
}

export function orderGundamEventLogEntries(
  entries: readonly SimulatorEventLogEntry[],
): SimulatorEventLogEntry[] {
  const ordered = [...entries].sort(
    (left, right) => Date.parse(left.timestamp) - Date.parse(right.timestamp),
  );
  const transitionIndexesByTurn = new Map<number, number[]>();

  ordered.forEach((entry, index) => {
    if (turnTransitionRank(entry.message) === undefined) return;
    const indexes = transitionIndexesByTurn.get(entry.turn) ?? [];
    indexes.push(index);
    transitionIndexesByTurn.set(entry.turn, indexes);
  });

  for (const indexes of transitionIndexesByTurn.values()) {
    const transitions = indexes
      .map((index) => ordered[index]!)
      .sort(
        (left, right) => turnTransitionRank(left.message)! - turnTransitionRank(right.message)!,
      );
    indexes.forEach((index, transitionIndex) => {
      ordered[index] = transitions[transitionIndex]!;
    });
  }

  return ordered;
}

function turnForMoveLog(entry: TurnTaggedMoveLog): number {
  // Gundam's engine counts gameplay turns from zero, while the shared event
  // log reserves turn zero for setup Messages.
  return entry.turnNumber + 1;
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
      turn: turnForLegacyLog(tagged),
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

function turnForLegacyLog(tagged: TurnTaggedLogEntry): number {
  if (tagged.entry.type.startsWith("gundam.setup.")) return 0;
  // Legacy entries are tagged after a command finishes. A turn-ending command
  // has already advanced the engine counter, so that value is the one-based
  // display number of the turn that just ended.
  if (tagged.entry.type === "gundam.turn.ended") {
    return Math.max(1, tagged.turnNumber);
  }
  return tagged.turnNumber + 1;
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
  readonly cardRefs?: SimulatorEventLogEntry["cardRefs"];
  readonly section?: LogSection | null;
  readonly playerId?: string;
}): SimulatorEventLogEntry {
  const playerId = args.playerId ?? String(args.log.playerId);
  return {
    id: args.id,
    turn: args.turn,
    phase: args.phase,
    seatId: playerId === args.viewerId ? "player" : "opponent",
    timestamp: timestampFor(args.log),
    message: args.message,
    tags: args.tags,
    entityIds: unique(args.entityIds),
    ...(args.cardRefs && args.cardRefs.length > 0 ? { cardRefs: args.cardRefs } : {}),
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

function primaryMessage(
  log: GundamMoveLog,
  viewerId: string,
  resolveCard: CardResolver,
  resolvedEffectName?: string,
): string {
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
      return `Finished resolving ${resolvedEffectName ?? cardName(log.sourceCardId, resolveCard)}.`;
    case "pass": {
      const actor = playerName(String(log.playerId), viewerId);
      switch (log.context) {
        case "block":
          return log.automatic
            ? `${actor} did not block automatically (no legal Blocker available).`
            : `${actor} did not block.`;
        case "battle":
          return log.automatic
            ? `${actor} passed the action window automatically (no actions available).`
            : `${actor} passed the action window.`;
        case "action-step":
          return log.automatic
            ? `${actor} passed priority automatically (no actions available).`
            : `${actor} passed priority.`;
        case "turn":
          return `${actor} entered the End Phase.`;
      }
    }
    case "turnStart":
      return `${playerName(String(log.activePlayerId), viewerId)} started the turn.`;
    case "mulligan":
      return log.count > 0
        ? `Finished mulligan (redraw count: ${log.count}).`
        : "Kept the opening hand.";
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
    // `action-step` is the end-phase priority window; `turn` ends the
    // turn. Both belong in the end bucket regardless of the phase the
    // post-command move history records (a turn-ending pass is stamped
    // with the next turn's main phase).
    if (log.context === "action-step" || log.context === "turn") return "end";
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
  effectMeta: ReadonlyMap<string, EffectProjectionMeta>,
  effectIdsBySource: ReadonlyMap<string, ReadonlySet<string>>,
): LogSection | null {
  if (log.type === "resolveEffect") {
    if (log.effectId) {
      return sectionForEffectId(log.effectId, resolveCard, sections, effectMeta, effectIdsBySource);
    }
    return {
      id: `gundam-effect-${log.commandID ?? log.stateID ?? log.sourceCardId}`,
      label: cardName(log.sourceCardId, resolveCard),
      tone: "effect",
    };
  }

  const queued = (log.outcomes?.effectsQueued ?? []).filter(
    (effect) => !isInternalEffectSource(effect.sourceCardId),
  );
  const resolved = (log.outcomes?.effectsResolved ?? []).filter(
    (effect) => !isInternalEffectSource(effect.sourceCardId),
  );
  const first = queued[0] ?? resolved[0];
  if (!first) return null;
  return sectionForEffectId(first.effectId, resolveCard, sections, effectMeta, effectIdsBySource);
}

function sectionForEffectId(
  effectId: string,
  resolveCard: CardResolver,
  sections: Map<string, LogSection>,
  effectMeta: ReadonlyMap<string, EffectProjectionMeta>,
  effectIdsBySource: ReadonlyMap<string, ReadonlySet<string>>,
): LogSection {
  const meta = effectMeta.get(effectId);
  const sourceCardId = meta?.sourceCardId ?? effectId;
  const existing = sections.get(sourceCardId);
  if (existing) return existing;
  const sourceEffectCount = effectIdsBySource.get(sourceCardId)?.size ?? 0;
  const sourceName = cardName(sourceCardId, resolveCard);
  const created: LogSection = {
    id: `gundam-effect-${sourceCardId}`,
    label: sourceEffectCount > 1 ? `${sourceName} effects` : sourceName,
    tone: "effect",
  };
  sections.set(sourceCardId, created);
  return created;
}

function collectEffectProjectionMeta(
  logs: readonly TurnTaggedMoveLog[],
): ReadonlyMap<string, EffectProjectionMeta> {
  const meta = new Map<string, EffectProjectionMeta>();
  for (const { log } of logs) {
    for (const effect of log.outcomes?.effectsQueued ?? []) {
      if (isInternalEffectSource(effect.sourceCardId)) continue;
      meta.set(effect.effectId, {
        effectId: effect.effectId,
        sourceCardId: String(effect.sourceCardId),
        controllerId: String(effect.controllerId),
        kind: effect.kind,
        timing: effect.timing,
      });
    }
    for (const effect of log.outcomes?.effectsResolved ?? []) {
      if (isInternalEffectSource(effect.sourceCardId) || meta.has(effect.effectId)) continue;
      meta.set(effect.effectId, {
        effectId: effect.effectId,
        sourceCardId: String(effect.sourceCardId),
      });
    }
  }
  return meta;
}

function collectEffectIdsBySource(
  meta: ReadonlyMap<string, EffectProjectionMeta>,
): ReadonlyMap<string, ReadonlySet<string>> {
  const idsBySource = new Map<string, Set<string>>();
  for (const effect of meta.values()) {
    const ids = idsBySource.get(effect.sourceCardId) ?? new Set<string>();
    ids.add(effect.effectId);
    idsBySource.set(effect.sourceCardId, ids);
  }
  return idsBySource;
}

function effectDisplayName(
  meta: EffectProjectionMeta | undefined,
  sourceCardId: string,
  resolveCard: CardResolver,
  effectIdsBySource: ReadonlyMap<string, ReadonlySet<string>>,
): string {
  const card = cardName(sourceCardId, resolveCard);
  if ((effectIdsBySource.get(sourceCardId)?.size ?? 0) <= 1) return card;
  return `${card} · ${effectKindLabel(meta?.kind, meta?.timing)}`;
}

function effectKindLabel(kind: string | undefined, timing: string | undefined): string {
  if (timing) return formatEffectTiming(timing);
  switch (kind) {
    case "burst":
      return "Burst";
    case "command":
      return "Command";
    case "activated":
      return "Activated effect";
    case "triggered":
      return "Triggered effect";
    case "ruleManagement":
      return "Rule effect";
    default:
      return "Effect";
  }
}

function formatEffectTiming(timing: string): string {
  return timing
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function outcomeMessages(
  log: GundamMoveLog,
  viewerId: string,
  resolveCard: CardResolver,
  options: ProjectionOptions,
  effectMeta: ReadonlyMap<string, EffectProjectionMeta>,
  effectIdsBySource: ReadonlyMap<string, ReadonlySet<string>>,
): ProjectedOutcome[] {
  const outcomes = log.outcomes;
  if (!outcomes) return [];
  const messages: ProjectedOutcome[] = [];

  for (const [index, damage] of (outcomes.damageDealt ?? []).entries()) {
    messages.push({
      message: `${cardName(damage.targetId, resolveCard)} took ${damage.amount} damage.`,
      tags: ["combat"],
      entityIds: unique([damage.sourceCardId, damage.targetId]),
      orderKey: `damageDealt:${index}`,
    });
  }

  for (const [index, recovery] of (outcomes.hpRecovered ?? []).entries()) {
    messages.push({
      message: `${cardName(recovery.cardId, resolveCard)} recovered ${recovery.amount} HP.`,
      tags: ["ability"],
      entityIds: [String(recovery.cardId)],
      orderKey: `hpRecovered:${index}`,
    });
  }

  for (const [index, shield] of (outcomes.shieldsRemoved ?? []).entries()) {
    messages.push({
      message: `Revealed ${cardName(shield.cardId, resolveCard)} from Shields.`,
      tags: ["combat"],
      entityIds: unique([shield.sourceCardId, shield.cardId]),
      playerId: String(shield.playerId),
      orderKey: `shieldsRemoved:${index}`,
    });
  }

  for (const [index, defeated] of (outcomes.unitsDefeated ?? []).entries()) {
    messages.push({
      message: `${cardName(defeated.cardId, resolveCard)} was defeated.`,
      tags: ["combat"],
      entityIds: unique([defeated.defeatedBy, defeated.cardId]),
      playerId: String(defeated.ownerId),
      orderKey: `unitsDefeated:${index}`,
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
      cardRefs: visibleIds.map((id) => ({ id, name: cardName(id, resolveCard) })),
      ...(outcomes.cardsDrawn.playerId ? { playerId: String(outcomes.cardsDrawn.playerId) } : {}),
      orderKey: "cardsDrawn",
    });
  }

  if (outcomes.shieldsAddedToHand) {
    const { count, playerId } = outcomes.shieldsAddedToHand;
    messages.push({
      message: `Added ${count} ${count === 1 ? "Shield" : "Shields"} to hand.`,
      tags: ["move"],
      playerId: String(playerId),
      orderKey: "shieldsAddedToHand",
    });
  }

  if (outcomes.resourcesSpent) {
    messages.push({
      message: resourcePaymentMessage(
        outcomes.resourcesSpent.regularCount,
        outcomes.resourcesSpent.exRemovedCount,
      ),
      tags: ["move"],
      orderKey: "resourcesSpent",
    });
  }

  for (const [index, id] of (outcomes.cardsDiscarded ?? []).entries()) {
    messages.push({
      message: `Discarded ${cardName(id, resolveCard)}.`,
      tags: ["move"],
      entityIds: [String(id)],
      orderKey: `cardsDiscarded:${index}`,
    });
  }

  for (const [index, id] of (outcomes.unitsRested ?? []).entries()) {
    messages.push({
      message: `${cardName(id, resolveCard)} was rested for cost.`,
      tags: ["move"],
      entityIds: [String(id)],
      orderKey: `unitsRested:${index}`,
    });
  }

  for (const [index, moved] of (outcomes.cardsMoved ?? []).entries()) {
    if (isDeckToHandMove(moved.from, moved.to)) {
      continue;
    }
    messages.push({
      message: `${cardName(moved.cardId, resolveCard)} moved${
        moved.from ? ` from ${formatEngineLabel(moved.from)}` : ""
      } to ${formatEngineLabel(moved.to)}.`,
      tags: ["move"],
      entityIds: [String(moved.cardId)],
      orderKey: `cardsMoved:${index}`,
    });
  }

  for (const [index, id] of (outcomes.cardsReturnedToHand ?? []).entries()) {
    messages.push({
      message: `${cardName(id, resolveCard)} returned to hand.`,
      tags: ["move"],
      entityIds: [String(id)],
      orderKey: `cardsReturnedToHand:${index}`,
    });
  }

  for (const [index, id] of (outcomes.cardsExhausted ?? []).entries()) {
    messages.push({
      message: `${cardName(id, resolveCard)} was rested.`,
      tags: ["move"],
      entityIds: [String(id)],
      orderKey: `cardsExhausted:${index}`,
    });
  }

  for (const [index, modifier] of (outcomes.statModifiers ?? []).entries()) {
    const amount = modifier.amount >= 0 ? `+${modifier.amount}` : String(modifier.amount);
    messages.push({
      message: `${cardName(modifier.cardId, resolveCard)} gets ${modifier.stat.toUpperCase()} ${amount} during ${formatEffectDuration(modifier.duration)}.`,
      tags: ["ability"],
      entityIds: [String(modifier.cardId)],
      orderKey: `statModifiers:${index}`,
    });
  }

  for (const [index, id] of (outcomes.cardsReadied ?? []).entries()) {
    messages.push({
      message: `${cardName(id, resolveCard)} was readied.`,
      tags: ["move"],
      entityIds: [String(id)],
      orderKey: `cardsReadied:${index}`,
    });
  }

  for (const [index, placed] of (outcomes.resourcesPlaced ?? []).entries()) {
    messages.push({
      message: `${cardName(placed.cardId, resolveCard)} was placed as a ${placed.state} resource.`,
      tags: ["move"],
      entityIds: [String(placed.cardId)],
      playerId: String(placed.playerId),
      orderKey: `resourcesPlaced:${index}`,
    });
  }

  for (const [index, effect] of (outcomes.effectsQueued ?? []).entries()) {
    if (isInternalEffectSource(effect.sourceCardId)) continue;
    const meta = effectMeta.get(effect.effectId);
    messages.push({
      message: `Started resolving ${effectDisplayName(
        meta,
        String(effect.sourceCardId),
        resolveCard,
        effectIdsBySource,
      )}.`,
      tags: ["ability"],
      entityIds: [String(effect.sourceCardId)],
      playerId: String(effect.controllerId),
      effectId: effect.effectId,
      dedupeKey: `effect-started:${effect.effectId}`,
      orderKey: `effectsQueued:${index}`,
    });
  }

  for (const [index, effect] of (outcomes.effectsResolved ?? []).entries()) {
    if (
      (log.type === "resolveEffect" && effect.effectId === log.effectId) ||
      isInternalEffectSource(effect.sourceCardId)
    ) {
      continue;
    }
    const meta = effectMeta.get(effect.effectId);
    messages.push({
      message: `Finished resolving ${effectDisplayName(
        meta,
        String(effect.sourceCardId),
        resolveCard,
        effectIdsBySource,
      )}.`,
      tags: ["ability"],
      entityIds: [String(effect.sourceCardId)],
      ...(meta?.controllerId ? { playerId: meta.controllerId } : {}),
      effectId: effect.effectId,
      dedupeKey: `effect-finished:${effect.effectId}`,
      orderKey: `effectsResolved:${index}`,
    });
  }

  const deduped = dedupeOutcomeMessages(messages);
  if (outcomes.order?.length) {
    const rank = new Map(
      outcomes.order.map((entry, index) => [
        entry.index === undefined ? entry.kind : `${entry.kind}:${entry.index}`,
        index,
      ]),
    );
    return deduped
      .map((message, index) => ({ message, index }))
      .sort(
        (left, right) =>
          (rank.get(left.message.orderKey ?? "") ?? Number.MAX_SAFE_INTEGER) -
            (rank.get(right.message.orderKey ?? "") ?? Number.MAX_SAFE_INTEGER) ||
          left.index - right.index,
      )
      .map(({ message }) => message);
  }
  if (log.type !== "resolveEffect") return deduped;

  // A resolved effect can synchronously queue and finish a nested triggered
  // effect. Present its lifecycle around the nested outcomes rather than
  // listing card movement/recovery before saying the triggered effect began.
  const nestedStarts = deduped.filter((message) =>
    message.dedupeKey?.startsWith("effect-started:"),
  );
  const remaining = deduped.filter((message) => !message.dedupeKey?.startsWith("effect-started:"));
  return [...nestedStarts, ...remaining];
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

function dedupeOutcomeMessages<T extends { readonly message: string; readonly dedupeKey?: string }>(
  messages: readonly T[],
): T[] {
  const seen = new Set<string>();
  return messages.filter((message) => {
    const key = message.dedupeKey ?? message.message;
    if (seen.has(key)) return false;
    seen.add(key);
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

function formatEffectDuration(duration: string): string {
  return formatEngineLabel(duration).replace(/^during\s+/, "");
}

function outcomeTurn(log: GundamMoveLog, outcome: ProjectedOutcome, eventTurn: number): number {
  // The final End Phase priority pass is attributed to the turn in which it
  // was submitted, but the draw produced by that transition belongs to the
  // next turn's Draw Phase.
  return log.type === "pass" && outcome.orderKey === "cardsDrawn" ? eventTurn + 1 : eventTurn;
}

function outcomePhase(
  log: GundamMoveLog,
  outcome: ProjectedOutcome,
  historicalPhase: string,
): string {
  return log.type === "pass" && outcome.orderKey === "cardsDrawn" ? "draw" : historicalPhase;
}

function placeTransitionDrawsAfterTurnStart(
  entries: readonly SimulatorEventLogEntry[],
): SimulatorEventLogEntry[] {
  const deferredDraws = new Map<number, SimulatorEventLogEntry[]>();
  const ordered: SimulatorEventLogEntry[] = [];

  for (const entry of entries) {
    if (entry.phase === "draw" && entry.message.startsWith("Drew ")) {
      const turnDraws = deferredDraws.get(entry.turn) ?? [];
      turnDraws.push(entry);
      deferredDraws.set(entry.turn, turnDraws);
      continue;
    }

    ordered.push(entry);
    if (entry.phase === "start" && entry.message.endsWith("started the turn.")) {
      ordered.push(
        ...(deferredDraws.get(entry.turn) ?? []).map((draw) => ({
          ...draw,
          timestamp: entry.timestamp,
        })),
      );
      deferredDraws.delete(entry.turn);
    }
  }

  for (const draws of deferredDraws.values()) ordered.push(...draws);
  return ordered;
}

function turnTransitionRank(message: string): number | undefined {
  if (message.endsWith("started the turn.")) return 0;
  if (message === "Entered draw.") return 1;
  if (message.startsWith("Drew ")) return 2;
  return undefined;
}

function formatEngineLabel(value: string): string {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
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
  return collapseSelfChoice(out);
}

/**
 * Raw engine ids never repeat in a sentence, but pretty names do:
 * "player_one chose player_one to go first." becomes "You chose You…".
 * Collapse the self-referential form after the id rewrite.
 */
function collapseSelfChoice(message: string): string {
  return message
    .replace(/^(\w+) chose \1 to go first\.$/, "$1 chose to go first.")
    .replace(/^(\w+) redrew 0 cards\.$/, "$1 kept the opening hand.");
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
