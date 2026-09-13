import type { SimulatorEventLogEntry } from "@tcg/simulator-contract";
import {
  FAB_LOG_ACTOR_VALUE_KEYS,
  FAB_LOG_KEYS,
  FAB_LOG_KEY_CATEGORIES,
  fabLogActorSlotUsage,
  renderFabLogTemplate,
  type FabLogActorLabelUsage,
  type FabLogCategory,
  type FabLogKey,
  type FabLogTemplateValue,
} from "@tcg/flesh-and-blood-engine/log";
import type { FabMoveLog, FabMoveLogMessage } from "@tcg/flesh-and-blood-engine/simulator";

/**
 * Projection from canonical FAB move logs to the shared simulator event log —
 * a scoped-down port of Gundam's `move-log-projection.ts`. FAB messages are
 * already derived facts carrying typed values, so this layer only:
 *
 * - maps `FabLogCategory` to panel tags,
 * - re-renders message text through the engine template registry with
 *   actor-label interpolation applied to the values (never by string-replacing
 *   rendered text),
 * - tracks the running turn phase from `phase.start` facts,
 * - groups combat-chain facts into a labeled section between `attack` and
 *   `combat.chain-close`, and wraps a played object's cross-command resolution
 *   lifecycle into one effect section,
 * - stamps one-line outcome summaries onto closed sections (combat chains on
 *   `chain-close`, effect sections after their complete projected lifecycle),
 * - drops pure-redundancy rows (turn-start announcements that duplicate the
 *   panel's own turn headers, and begin-play intent markers superseded by
 *   the same turn's completed play line), and
 * - merges the viewer's private appendix inline in canonical composition
 *   order (public lines first, appendix after).
 */

type LogSection = NonNullable<SimulatorEventLogEntry["section"]>;

const FAB_LOG_KEY_SET: ReadonlySet<string> = new Set<string>(FAB_LOG_KEYS);

function isFabLogKey(key: string): key is FabLogKey {
  return FAB_LOG_KEY_SET.has(key);
}

/**
 * Resolves an actor id to a display label for the slot's grammatical usage
 * (subject "You" vs possessive "Your"/"your"); `undefined` keeps the raw
 * value. The usage comes from the engine's slot-usage table, so callers cannot
 * mislabel a possessive slot as a subject.
 */
export type FabLogActorLabel = (
  actorId: string,
  usage: FabLogActorLabelUsage,
) => string | undefined;

/** Registry category for a wire key; `undefined` for keys outside the registry. */
export function fabLogCategoryFor(key: string): FabLogCategory | undefined {
  return isFabLogKey(key) ? FAB_LOG_KEY_CATEGORIES[key] : undefined;
}

export interface FabLogProjectionOptions {
  /** Seat whose perspective drives seat mapping and the private appendix. */
  readonly viewerId: string;
  /**
   * Engine seat ids for the match, unioned with the corpus-derived set
   * (viewer + movers + private-appendix recipients) before the default
   * labeler applies. Callers that own the match pass both seats so a player
   * referenced only through values — a protected hero, a clash winner — is
   * labeled "Opponent" instead of rendering a raw seat id.
   */
  readonly seatIds?: readonly string[];
  /**
   * Actor-id → label interpolation applied to values before rendering. Each
   * call also receives the slot's grammatical usage from the engine's
   * slot-usage table, so possessive slots ("Your Snatch entered the arena.")
   * can return ownership forms. The default labels the viewer "You" and
   * every other known seat "Opponent" (product scope is 1v1) — known seats
   * being the caller-provided `seatIds` unioned with ids observed in the
   * corpus — and only those seat ids, so values that are not seat references
   * (card names, phases, damage types) pass through untouched — which keeps
   * raw seat ids off every projection surface; callers that know every actor
   * id (local practice) can label all seats precisely.
   */
  readonly actorLabel?: FabLogActorLabel;
  /** Merge the viewer's private appendix inline (default `true`). */
  readonly includePrivate?: boolean;
  /**
   * Drop the public rows of logs authored by other seats, keeping only the
   * viewer's private appendix from them (default `false`). Player-history
   * scopes use this: an opponent-authored log can still carry a decision the
   * opponent's move opened for the viewer, which must not disappear.
   */
  readonly suppressNonViewerPublic?: boolean;
  /** Phase label for entries projected before the first `phase.start` fact. */
  readonly initialPhase?: string;
}

/**
 * Render one wire message through the engine template registry. Actor ids
 * interpolate through the values. Keys outside the registry (foreign or
 * pre-registry records) fall back to the self-describing `defaultMessage`.
 */
export function renderFabMoveLogMessage(
  message: FabMoveLogMessage,
  actorLabel?: FabLogActorLabel,
): string {
  if (!isFabLogKey(message.key)) return message.defaultMessage;
  const values: Record<string, FabLogTemplateValue> = {};
  for (const [name, value] of Object.entries(message.values ?? {})) {
    if (value === null) values[name] = undefined;
    else if (typeof value === "string" && actorLabel && FAB_LOG_ACTOR_VALUE_KEYS.has(name)) {
      values[name] = actorLabel(value, fabLogActorSlotUsage(message.key, name)) ?? value;
    } else values[name] = value;
  }
  return renderFabLogTemplate(message.key, values);
}

function tagsForCategory(category: FabLogCategory): SimulatorEventLogEntry["tags"] {
  switch (category) {
    case "action":
      return ["move"];
    case "combat":
      return ["combat"];
    case "ability":
      return ["ability"];
    // Rules bookkeeping (resources, life totals, counters) folds into the
    // panel's system filter alongside turn and phase machinery.
    case "rules":
    case "system":
      return ["system"];
  }
}

/**
 * Value keys that carry a single card display name. The canonical wire record
 * carries display names — not instance ids — so card refs stay name-only;
 * hover/inspect wiring can resolve names through the cards catalog later.
 */
const CARD_NAME_VALUE_KEYS: ReadonlySet<string> = new Set([
  "cardName",
  "chargedName",
  "banishedName",
  "firstCardName",
  "gainedName",
  "intoName",
  "previousName",
  "secondCardName",
  "sourceName",
]);

function cardRefsFor(message: FabMoveLogMessage): SimulatorEventLogEntry["cardRefs"] {
  const values = message.values;
  if (!values) return undefined;
  const references: NonNullable<SimulatorEventLogEntry["cardRefs"]> = [];
  for (const [name, value] of Object.entries(values)) {
    if (CARD_NAME_VALUE_KEYS.has(name) && typeof value === "string" && value.length > 0) {
      const objectRef = message.objectRefs?.[name];
      references.push({
        name: value,
        ...(objectRef ? { entityId: objectRef.instanceId } : {}),
        ...(objectRef?.canonicalId ? { definitionId: objectRef.canonicalId } : {}),
      });
    }
  }
  return references.length > 0 ? references : undefined;
}

type RoutineKind = "automatic-priority-pass" | "routine";

function routineKindFor(key: FabLogKey | null): RoutineKind | null {
  switch (key) {
    case "flesh-and-blood.priority-automation.auto-pass":
    case "flesh-and-blood.trigger-automation.auto-pass":
      return "automatic-priority-pass";
    case "flesh-and-blood.decision-automation.auto-order":
    case "flesh-and-blood.phase.start":
      return "routine";
    default:
      return null;
  }
}

function groupRoutineEntries(
  entries: readonly SimulatorEventLogEntry[],
  routineKinds: ReadonlyMap<string, RoutineKind>,
): SimulatorEventLogEntry[] {
  const grouped = [...entries];
  let start = 0;
  while (start < grouped.length) {
    const first = grouped[start];
    if (!first || first.section || first.importance !== "routine") {
      start += 1;
      continue;
    }
    let end = start + 1;
    while (end < grouped.length) {
      const candidate = grouped[end];
      if (
        !candidate ||
        candidate.section ||
        candidate.importance !== "routine" ||
        candidate.turn !== first.turn ||
        candidate.phase !== first.phase
      ) {
        break;
      }
      end += 1;
    }
    const count = end - start;
    if (count >= 2) {
      const run = grouped.slice(start, end);
      const allAutomaticPasses = run.every(
        (entry) => routineKinds.get(entry.id) === "automatic-priority-pass",
      );
      const section: LogSection = {
        id: `fab-routine-${first.turn}-${first.id}`,
        label: "Routine",
        tone: "routine",
        collapsedByDefault: true,
        summary: allAutomaticPasses
          ? `${count} automatic priority passes`
          : `${count} routine events`,
      };
      for (let index = start; index < end; index += 1) {
        grouped[index] = { ...grouped[index]!, section };
      }
    }
    start = end;
  }
  return grouped;
}

interface ZoneMoveProjection {
  readonly kind: "zone-move";
  readonly playerId: string;
  readonly cardName: string;
  readonly from: string;
  readonly to: string;
}

interface GraveyardProjection {
  readonly kind: "put-into-graveyard";
  readonly playerId: string;
  readonly cardName: string;
}

type CollapsibleProjection = ZoneMoveProjection | GraveyardProjection;

function formatCardNames(cardNames: readonly string[]): string {
  if (cardNames.length <= 1) return cardNames[0] ?? "a card";
  if (cardNames.length === 2) return `${cardNames[0]} and ${cardNames[1]}`;
  return `${cardNames.slice(0, -1).join(", ")}, and ${cardNames.at(-1)}`;
}

function readableZone(zone: string): string {
  const label = zone.replaceAll("-", " ");
  return zone === "graveyard" || zone === "deck" ? `the ${label}` : label;
}

/**
 * Remove the redundant graveyard bookkeeping line emitted immediately after
 * a visible zone move, then fold adjacent cards moved by the same player in
 * the same command into one player-readable sentence.
 */
function collapseZoneMoveEntries(
  entries: readonly SimulatorEventLogEntry[],
  projections: ReadonlyMap<string, CollapsibleProjection>,
  actorLabel: FabLogActorLabel,
): SimulatorEventLogEntry[] {
  const withoutDuplicateGraveyardRows: SimulatorEventLogEntry[] = [];
  for (const entry of entries) {
    const projection = projections.get(entry.id);
    const previous = withoutDuplicateGraveyardRows.at(-1);
    const previousProjection = previous ? projections.get(previous.id) : undefined;
    if (
      projection?.kind === "put-into-graveyard" &&
      previousProjection?.kind === "zone-move" &&
      previousProjection.to === "graveyard" &&
      previousProjection.playerId === projection.playerId &&
      previousProjection.cardName === projection.cardName &&
      previous?.timestamp === entry.timestamp
    ) {
      continue;
    }
    withoutDuplicateGraveyardRows.push(entry);
  }

  const collapsed: SimulatorEventLogEntry[] = [];
  for (const entry of withoutDuplicateGraveyardRows) {
    const projection = projections.get(entry.id);
    const previous = collapsed.at(-1);
    const previousProjection = previous ? projections.get(previous.id) : undefined;
    const sameSection = previous?.section?.id === entry.section?.id;
    if (
      projection?.kind === "zone-move" &&
      previousProjection?.kind === "zone-move" &&
      previousProjection.playerId === projection.playerId &&
      previousProjection.from === projection.from &&
      previousProjection.to === projection.to &&
      previous?.turn === entry.turn &&
      previous.phase === entry.phase &&
      previous.timestamp === entry.timestamp &&
      sameSection
    ) {
      const cardNames = [
        ...(previous.cardRefs ?? []).map((card) => card.name),
        projection.cardName,
      ];
      const uniqueCardNames = [...new Set(cardNames)];
      collapsed[collapsed.length - 1] = {
        ...previous,
        message: `${actorLabel(projection.playerId, "subject") ?? projection.playerId} moved ${formatCardNames(
          uniqueCardNames,
        )} from ${readableZone(projection.from)} to ${readableZone(projection.to)}.`,
        cardRefs: uniqueCardNames.map((name) => ({ name })),
      };
      continue;
    }
    collapsed.push(entry);
  }
  return collapsed;
}

/**
 * Effect section label: the source card when the resolution names one,
 * otherwise the acting seat's label (falling back to "Effect" when the
 * resolver knows neither).
 */
function effectSectionLabel(
  messages: readonly FabMoveLogMessage[],
  moverId: string,
  actorLabel: FabLogActorLabel,
): string {
  for (const message of messages) {
    const cardName = message.values?.cardName;
    if (typeof cardName === "string" && cardName.length > 0) return cardName;
  }
  return actorLabel(moverId, "subject") ?? "Effect";
}

/**
 * Collapsed-chain outcome line, with the damage result first and each card's
 * game-native combat role beside it. Roles arrive on the log receipt from the
 * engine; the projection never guesses them from a card name or its zone.
 */
function chainSummary(
  damage: number,
  misses: readonly string[],
  cardsByRole: ReadonlyMap<string, ReadonlySet<string>>,
): string {
  const parts: string[] = [];
  if (damage > 0) parts.push(`${damage} damage`);
  for (const result of [...new Set(misses)]) {
    const count = misses.filter((miss) => miss === result).length;
    parts.push(count === 1 ? result : `${count} ${result}`);
  }
  if (parts.length === 0) parts.push("No damage");

  const roleLabels: Readonly<Record<string, string>> = {
    attack: "Attack",
    block: "Block",
    "attack-reaction": "Attack reaction",
    "defense-reaction": "Defense reaction",
  };
  for (const role of ["attack", "block", "attack-reaction", "defense-reaction"] as const) {
    const cardNames = [...(cardsByRole.get(role) ?? [])];
    if (cardNames.length > 0) parts.push(`${roleLabels[role]}: ${formatCardNames(cardNames)}`);
  }
  return parts.join(" · ");
}

export function projectFabLogEntries(
  moveLogs: readonly FabMoveLog[],
  options: FabLogProjectionOptions,
): SimulatorEventLogEntry[] {
  const includePrivate = options.includePrivate ?? true;
  const suppressNonViewerPublic = options.suppressNonViewerPublic ?? false;
  // Seat ids known for the match: caller-provided seats plus every id
  // observed anywhere in the corpus (every mover and every private appendix
  // recipient). Restricting the default labeler to these ids keeps non-seat
  // strings intact while no seat reference can render raw.
  const seatIds = new Set<string>([options.viewerId, ...(options.seatIds ?? [])]);
  for (const log of moveLogs) {
    seatIds.add(log.playerId);
    for (const seat of Object.keys(log.privateByPlayerId ?? {})) seatIds.add(seat);
  }
  const actorLabel: FabLogActorLabel =
    options.actorLabel ??
    ((actorId, usage) => {
      if (actorId === options.viewerId) {
        return usage === "possessive" ? "Your" : usage === "possessive-lower" ? "your" : "You";
      }
      if (seatIds.has(actorId)) {
        return usage === "possessive"
          ? "Opponent's"
          : usage === "possessive-lower"
            ? "their"
            : "Opponent";
      }
      return undefined;
    });
  const seatIdFor = (playerId: string): "player" | "opponent" =>
    playerId === options.viewerId ? "player" : "opponent";
  const entries: SimulatorEventLogEntry[] = [];
  const collapsibleProjections = new Map<string, CollapsibleProjection>();
  const routineKinds = new Map<string, RoutineKind>();
  let phase = options.initialPhase ?? "";
  let combat: LogSection | null = null;
  let combatOrdinal = 0;
  // Outcome accumulators for the open combat chain, stamped onto the shared
  // section object at `chain-close` so every member row carries the summary a
  // collapsed group renders.
  let combatDamage = 0;
  const combatMisses: string[] = [];
  const combatCardsByRole = new Map<string, Set<string>>();
  // Entry ids derive from intrinsic log coordinates (turn, move-log sequence,
  // message index) rather than corpus position, so trimming the front of the
  // corpus never remounts rows. `sequence` is only unique per command, so ids
  // that still collide get a deterministic suffix; section ids get the same
  // treatment because the panel keys rendered groups by them.
  const usedEntryIds = new Set<string>();
  const usedSectionIds = new Set<string>();
  const entryId = (turn: number, sequence: number, messageIndex: number): string => {
    const base = `fab-log-${turn}-${sequence}-${messageIndex}`;
    let id = base;
    let suffix = 2;
    while (usedEntryIds.has(id)) id = `${base}-${suffix++}`;
    usedEntryIds.add(id);
    return id;
  };

  // Redundancy markers: the panel's turn headers already announce every turn,
  // so `turn.started` rows add nothing. `command.begin-play` is an intent
  // marker whose completed `play` line always follows in accepted flows — the
  // marker is dropped once that completion lands in a later move log of the
  // same turn from the same mover, and kept while it stays orphaned (an undo
  // that removes the completion re-surfaces it).
  const supersededBeginPlayLogs = new Set<number>();
  for (const [logIndex, log] of moveLogs.entries()) {
    if (!log.public.some((message) => message.key === "flesh-and-blood.command.begin-play")) {
      continue;
    }
    for (let later = logIndex + 1; later < moveLogs.length; later += 1) {
      const candidate = moveLogs[later]!;
      if (
        candidate.turnNumber === log.turnNumber &&
        candidate.playerId === log.playerId &&
        candidate.public.some((message) => message.key === "flesh-and-blood.play")
      ) {
        supersededBeginPlayLogs.add(logIndex);
        break;
      }
    }
  }

  const messagesForLog = (log: FabMoveLog, logIndex: number): readonly FabMoveLogMessage[] => {
    const privateMessages = includePrivate ? (log.privateByPlayerId?.[options.viewerId] ?? []) : [];
    // A non-viewer's log still contributes the viewer's private appendix
    // (decisions the opponent's move opened for this seat); only its public
    // rows are suppressed in player-history scopes.
    const publicMessages =
      suppressNonViewerPublic && log.playerId !== options.viewerId ? [] : log.public;
    return [...publicMessages, ...privateMessages].filter((message) => {
      if (message.key === "flesh-and-blood.turn.started") return false;
      return !(
        supersededBeginPlayLogs.has(logIndex) &&
        message.key === "flesh-and-blood.command.begin-play"
      );
    });
  };

  // Commands remain receipt boundaries, but stack-layer provenance owns the
  // player-facing activity hierarchy. One pass receipt may resolve several
  // layers, so assigning the whole receipt to one card is never sound.
  const messagesByCommandId = new Map<string, FabMoveLogMessage[]>();
  const firstLogByCommandId = new Map<string, FabMoveLog>();
  for (const [logIndex, log] of moveLogs.entries()) {
    const messages = messagesForLog(log, logIndex);
    if (messages.length === 0) continue;
    firstLogByCommandId.set(log.commandId, firstLogByCommandId.get(log.commandId) ?? log);
    const commandMessages = messagesByCommandId.get(log.commandId) ?? [];
    commandMessages.push(...messages);
    messagesByCommandId.set(log.commandId, commandMessages);
  }
  const effectsByCommandId = new Map<string, LogSection>();
  const effectCandidatesByCommandId = new Map<string, Set<LogSection>>();
  const effectEntryCounts = new Map<string, number>();
  const allEffectSections = new Set<LogSection>();

  interface StackLayerActivity {
    readonly layerId: string;
    readonly stackWindowId: string;
    readonly stackOrdinal: number;
    readonly section: LogSection;
    resolved: boolean;
  }

  interface StackWindowActivity {
    readonly stackWindowId: string;
    readonly layers: StackLayerActivity[];
    readonly section: LogSection;
    readonly prioritySection: LogSection;
    priorityCount: number;
  }

  const addCommandEffectCandidate = (commandId: string, section: LogSection): void => {
    const candidates = effectCandidatesByCommandId.get(commandId) ?? new Set<LogSection>();
    candidates.add(section);
    effectCandidatesByCommandId.set(commandId, candidates);
  };

  // Opening and resolving a layer usually happen in different accepted
  // commands. Persisted layer identity is authoritative for card, activated,
  // and triggered layers. Physical object identity is only a compatibility
  // path for older records that predate stack provenance: one object can open
  // several distinct layers during a match and must never merge those layers.
  const legacyActivityByInstanceId = new Map<string, LogSection>();
  const activitySectionsByLayerId = new Map<string, LogSection>();
  const stackLayerActivitiesById = new Map<string, StackLayerActivity>();
  const stackLayersByWindowId = new Map<string, StackLayerActivity[]>();

  const createActivitySection = (
    log: FabMoveLog,
    cardName: string,
    objectRef: NonNullable<NonNullable<FabMoveLogMessage["objectRefs"]>[string]>,
    identity: string,
  ): LogSection => {
    const base = `fab-effect-${log.turnNumber}-${identity}`;
    let id = base;
    let suffix = 2;
    while (usedSectionIds.has(id)) id = `${base}-${suffix++}`;
    usedSectionIds.add(id);
    const section: LogSection = {
      id,
      actorSeatId: seatIdFor(log.playerId),
      label: cardName,
      tone: "effect",
      cardRefs: [
        {
          name: cardName,
          entityId: objectRef.instanceId,
          ...(objectRef.canonicalId ? { definitionId: objectRef.canonicalId } : {}),
        },
      ],
    };
    allEffectSections.add(section);
    return section;
  };

  for (const [logIndex, log] of moveLogs.entries()) {
    for (const message of messagesForLog(log, logIndex)) {
      if (
        message.key !== "flesh-and-blood.play" &&
        message.key !== "flesh-and-blood.activate" &&
        message.key !== "flesh-and-blood.ability.layer"
      ) {
        continue;
      }
      const objectRef = message.objectRefs?.cardName;
      const cardName = message.values?.cardName;
      if (!objectRef || typeof cardName !== "string") continue;
      const activityRef = message.activityRef;
      if (activityRef?.kind === "stack-layer-opened") {
        const activity =
          activitySectionsByLayerId.get(activityRef.layerId) ??
          createActivitySection(log, cardName, objectRef, activityRef.layerId);
        activitySectionsByLayerId.set(activityRef.layerId, activity);
        const layerActivity: StackLayerActivity = {
          layerId: activityRef.layerId,
          stackWindowId: activityRef.stackWindowId,
          stackOrdinal: activityRef.stackOrdinal,
          section: activity,
          resolved: false,
        };
        stackLayerActivitiesById.set(activityRef.layerId, layerActivity);
        const windowLayers = stackLayersByWindowId.get(activityRef.stackWindowId) ?? [];
        windowLayers.push(layerActivity);
        stackLayersByWindowId.set(activityRef.stackWindowId, windowLayers);
        addCommandEffectCandidate(log.commandId, activity);
        continue;
      }

      let activity = legacyActivityByInstanceId.get(objectRef.instanceId);
      if (!activity) {
        activity = createActivitySection(log, cardName, objectRef, objectRef.instanceId);
        legacyActivityByInstanceId.set(objectRef.instanceId, activity);
      }
      addCommandEffectCandidate(log.commandId, activity);
    }
  }
  for (const [logIndex, log] of moveLogs.entries()) {
    for (const message of messagesForLog(log, logIndex)) {
      if (message.key !== "flesh-and-blood.move-zone" || message.values?.from !== "stack") {
        continue;
      }
      const objectRef = message.objectRefs?.cardName;
      const layerId =
        message.activityRef?.kind === "stack-layer-event" ? message.activityRef.layerId : null;
      const activity =
        (layerId ? activitySectionsByLayerId.get(layerId) : undefined) ??
        (objectRef ? legacyActivityByInstanceId.get(objectRef.instanceId) : undefined);
      if (!activity) continue;
      addCommandEffectCandidate(log.commandId, activity);
      const layerActivity = layerId ? stackLayerActivitiesById.get(layerId) : undefined;
      if (layerActivity) layerActivity.resolved = true;
    }
  }

  for (const [commandId, candidates] of effectCandidatesByCommandId) {
    if (candidates.size === 1) effectsByCommandId.set(commandId, [...candidates][0]!);
  }

  const stackWindowsById = new Map<string, StackWindowActivity>();
  for (const [stackWindowId, unsortedLayers] of stackLayersByWindowId) {
    if (unsortedLayers.length <= 1) continue;
    const layers = [...unsortedLayers].sort((a, b) => a.stackOrdinal - b.stackOrdinal);
    const base = `fab-stack-${stackWindowId}`;
    let id = base;
    let suffix = 2;
    while (usedSectionIds.has(id)) id = `${base}-${suffix++}`;
    usedSectionIds.add(id);
    const section: LogSection = {
      id,
      label: `Stack · ${layers.length} layers`,
      tone: "stack",
      meta: layers.every((layer) => layer.resolved) ? "Resolved" : "On stack",
      summary: layers.every((layer) => layer.resolved)
        ? `${layers.length} layers resolved`
        : `${layers.length} layers on stack`,
    };
    const prioritySection: LogSection = {
      id: `${id}-priority`,
      parent: section,
      label: "Priority",
      tone: "routine",
      collapsedByDefault: true,
    };
    for (const [index, layer] of layers.entries()) {
      layer.section.parent = section;
      layer.section.label = `Layer ${layer.stackOrdinal} · ${layer.section.label}`;
      layer.section.tone = "stack-layer";
      layer.section.collapsedByDefault = true;
      layer.section.meta =
        index === 0
          ? "Resolves last"
          : index === layers.length - 1
            ? "Response · resolves first"
            : "Response";
    }
    stackWindowsById.set(stackWindowId, {
      stackWindowId,
      layers,
      section,
      prioritySection,
      priorityCount: 0,
    });
  }

  for (const [commandId, messages] of messagesByCommandId) {
    if (effectsByCommandId.has(commandId)) continue;
    const eligibleCount = messages.filter((message) => {
      const category = isFabLogKey(message.key)
        ? FAB_LOG_KEY_CATEGORIES[message.key]
        : ("system" as const);
      return category === "action" || category === "ability";
    }).length;
    if (eligibleCount <= 1) continue;
    const firstLog = firstLogByCommandId.get(commandId);
    if (!firstLog) continue;
    const base = `fab-effect-${firstLog.turnNumber}-${firstLog.sequence}`;
    let id = base;
    let suffix = 2;
    while (usedSectionIds.has(id)) id = `${base}-${suffix++}`;
    usedSectionIds.add(id);
    effectsByCommandId.set(commandId, {
      id,
      label: effectSectionLabel(messages, firstLog.playerId, actorLabel),
      tone: "effect",
    });
    allEffectSections.add(effectsByCommandId.get(commandId)!);
  }

  for (const [logIndex, log] of moveLogs.entries()) {
    const messages = messagesForLog(log, logIndex);
    if (messages.length === 0) continue;
    const categories = messages.map((message) =>
      isFabLogKey(message.key) ? FAB_LOG_KEY_CATEGORIES[message.key] : ("system" as const),
    );
    const commandEffect = effectsByCommandId.get(log.commandId) ?? null;
    let clash: {
      readonly section: LogSection;
      readonly firstPlayerId: string;
      readonly firstCardName: string;
      readonly firstPowerLabel: string;
      readonly secondPlayerId: string;
      readonly secondCardName: string;
      readonly secondPowerLabel: string;
    } | null = null;
    let clashOrdinal = 0;

    for (const [messageIndex, message] of messages.entries()) {
      const key = isFabLogKey(message.key) ? message.key : null;
      const activityRef = message.activityRef;
      let referencedEffect: LogSection | null = commandEffect;
      if (activityRef?.kind === "stack-layer-opened" || activityRef?.kind === "stack-layer-event") {
        referencedEffect = stackLayerActivitiesById.get(activityRef.layerId)?.section ?? null;
      } else if (activityRef?.kind === "stack-window-event") {
        const stackWindow = stackWindowsById.get(activityRef.stackWindowId);
        if (stackWindow) {
          stackWindow.priorityCount += 1;
          referencedEffect = stackWindow.prioritySection;
        }
      } else if (key === "flesh-and-blood.move-zone" && message.values?.from === "stack") {
        const source = message.objectRefs?.cardName;
        referencedEffect = source
          ? (legacyActivityByInstanceId.get(source.instanceId) ?? commandEffect)
          : commandEffect;
      }
      const effect: LogSection | null =
        referencedEffect !== null && (combat === null || combat.parent?.id === referencedEffect.id)
          ? referencedEffect
          : null;

      if (key === "flesh-and-blood.phase.start") {
        const nextPhase = message.values?.phase;
        if (typeof nextPhase === "string") phase = nextPhase;
      }
      // A second attack while the chain is open joins the same section: FAB
      // combat chains accumulate links until `combat.chain-close`.
      if (key === "flesh-and-blood.attack" && combat === null) {
        combatOrdinal += 1;
        const values = message.values ?? {};
        const attacker = typeof values.cardName === "string" ? values.cardName : "Attack";
        const rawTarget = typeof values.targetName === "string" ? values.targetName : "Hero";
        // The section header shares the message lines' seat labeling (hero
        // targets arrive as raw seat ids) so no projection surface renders one.
        const target = actorLabel(rawTarget, "subject") ?? rawTarget;
        combat = {
          id: `fab-combat-${log.turnNumber}-${combatOrdinal}`,
          ...(effect ? { parent: effect } : {}),
          label: `${attacker} → ${target}`,
          tone: "fight",
        };
        combatDamage = 0;
        combatMisses.length = 0;
        combatCardsByRole.clear();
      }

      const category: FabLogCategory = categories[messageIndex] ?? "system";
      const values = message.values ?? {};
      if (key === "flesh-and-blood.clash.outcome") {
        clashOrdinal += 1;
        const firstPlayerId = String(values.firstPlayerId ?? "");
        const secondPlayerId = String(values.secondPlayerId ?? "");
        clash = {
          section: {
            id: `fab-clash-${log.turnNumber}-${log.sequence}-${clashOrdinal}`,
            ...(effect ? { parent: effect } : {}),
            label: "Clash",
            tone: "comparison",
            collapsedByDefault: true,
          },
          firstPlayerId,
          firstCardName: String(values.firstCardName ?? "no card"),
          firstPowerLabel: String(values.firstPowerLabel ?? "no power"),
          secondPlayerId,
          secondCardName: String(values.secondCardName ?? "no card"),
          secondPowerLabel: String(values.secondPowerLabel ?? "no power"),
        };
      }
      if (combat !== null && key !== null) {
        if (key === "flesh-and-blood.combat.hit") {
          if (typeof values.damage === "number") combatDamage += values.damage;
        } else if (key === "flesh-and-blood.combat.miss") {
          combatMisses.push(
            typeof values.result === "string" && values.result.length > 0
              ? values.result
              : "missed",
          );
        }
      }
      if (combat !== null && message.combatRole) {
        const cardName = values.cardName;
        if (typeof cardName === "string" && cardName.length > 0) {
          const cards = combatCardsByRole.get(message.combatRole) ?? new Set<string>();
          cards.add(cardName);
          combatCardsByRole.set(message.combatRole, cards);
        }
      }
      let section: LogSection | undefined;
      if (clash !== null) {
        section = clash.section;
      } else if (combat !== null && (category === "combat" || message.combatRole !== undefined)) {
        section = combat;
      } else if (effect !== null && category !== "combat") {
        section = effect;
        effectEntryCounts.set(effect.id, (effectEntryCounts.get(effect.id) ?? 0) + 1);
      }
      const cardRefs = cardRefsFor(message);
      if (clash !== null && cardRefs) {
        const existingNames = new Set(clash.section.cardRefs?.map((reference) => reference.name));
        clash.section.cardRefs = [
          ...(clash.section.cardRefs ?? []),
          ...cardRefs.filter((reference) => !existingNames.has(reference.name)),
        ];
      }
      const entityIds = [
        ...new Set(cardRefs?.flatMap((reference) => reference.entityId ?? []) ?? []),
      ];
      const routineKind = routineKindFor(key);

      if (clash !== null && key === "flesh-and-blood.clash.win") {
        const winnerId = String(values.winnerId ?? "");
        const firstWon = winnerId === clash.firstPlayerId;
        const winner = actorLabel(winnerId, "subject") ?? winnerId;
        const winnerCard = firstWon ? clash.firstCardName : clash.secondCardName;
        const loserCard = firstWon ? clash.secondCardName : clash.firstCardName;
        const winnerPower = firstWon ? clash.firstPowerLabel : clash.secondPowerLabel;
        const loserPower = firstWon ? clash.secondPowerLabel : clash.firstPowerLabel;
        clash.section.summary = `${winner} won · ${winnerCard} ${winnerPower} vs ${loserCard} ${loserPower}`;
      } else if (clash !== null && key === "flesh-and-blood.clash.tie") {
        clash.section.summary = `No winner · ${clash.firstCardName} ${clash.firstPowerLabel} vs ${clash.secondCardName} ${clash.secondPowerLabel}`;
      }
      if (key === "flesh-and-blood.combat.chain-close") {
        if (combat !== null) {
          combat.summary = chainSummary(combatDamage, combatMisses, combatCardsByRole);
        }
        combat = null;
      }

      const id = entryId(log.turnNumber, log.sequence, messageIndex);
      entries.push({
        id,
        turn: log.turnNumber,
        phase,
        seatId: seatIdFor(log.playerId),
        timestamp: new Date(log.timestamp || 0).toISOString(),
        message: renderFabMoveLogMessage(message, actorLabel),
        tags: tagsForCategory(category),
        ...(routineKind ? { importance: "routine" as const } : {}),
        ...(section ? { section } : {}),
        ...(entityIds.length > 0 ? { entityIds } : {}),
        ...(cardRefs ? { cardRefs } : {}),
      });
      if (routineKind) routineKinds.set(id, routineKind);
      if (key === "flesh-and-blood.clash.win" || key === "flesh-and-blood.clash.tie") {
        clash = null;
      }
      if (key === "flesh-and-blood.move-zone") {
        const playerId = values.playerId;
        const cardName = values.cardName;
        const from = values.from;
        const to = values.to;
        if (
          typeof playerId === "string" &&
          typeof cardName === "string" &&
          typeof from === "string" &&
          typeof to === "string"
        ) {
          collapsibleProjections.set(id, { kind: "zone-move", playerId, cardName, from, to });
        }
      } else if (key === "flesh-and-blood.put-into-graveyard") {
        const cardName = values.cardName;
        if (typeof cardName === "string") {
          collapsibleProjections.set(id, {
            kind: "put-into-graveyard",
            playerId: log.playerId,
            cardName,
          });
        }
      }
    }
  }
  // Derive parent outcomes from the completed child sections themselves. A
  // child section object is shared by all of its rows, so this remains correct
  // when the outcome and the parent activity were produced by different
  // accepted commands (the normal play -> resolve lifecycle in the live
  // simulator).
  const effectOutcomeSummaries = new Map<string, string[]>();
  for (const entry of entries) {
    const section = entry.section;
    if (!section?.parent || !section.summary) continue;
    const outcomes = effectOutcomeSummaries.get(section.parent.id) ?? [];
    if (!outcomes.includes(section.summary)) outcomes.push(section.summary);
    effectOutcomeSummaries.set(section.parent.id, outcomes);
  }
  for (const effect of allEffectSections) {
    const count = effectEntryCounts.get(effect.id) ?? 0;
    const outcomes = effectOutcomeSummaries.get(effect.id) ?? [];
    if (outcomes.length > 0) effect.summary = outcomes.join(" · ");
    else if (count > 0) {
      effect.summary = `${effect.label} · ${count} event${count === 1 ? "" : "s"}`;
    }
  }
  for (const stackWindow of stackWindowsById.values()) {
    const resolved = stackWindow.layers.every((layer) => layer.resolved);
    stackWindow.section.meta = resolved ? "Resolved" : "On stack";
    stackWindow.section.summary = resolved
      ? `${stackWindow.layers.length} layers resolved`
      : `${stackWindow.layers.length} layers on stack`;
    if (stackWindow.priorityCount > 0) {
      stackWindow.prioritySection.summary = `${stackWindow.priorityCount} automatic priority ${
        stackWindow.priorityCount === 1 ? "pass" : "passes"
      }`;
    }
  }
  return groupRoutineEntries(
    collapseZoneMoveEntries(entries, collapsibleProjections, actorLabel),
    routineKinds,
  );
}
