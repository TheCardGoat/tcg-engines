import { grandArchiveCardPresentation } from "./card-presentation.ts";
import { getGrandArchiveCard } from "@tcg/grand-archive-cards";
import type { EngineInteractionView, InteractionAction } from "@tcg/protocol";
import { GRAND_ARCHIVE_ZONES, type GrandArchivePlayerId } from "@tcg/grand-archive-engine/runtime";
import {
  GrandArchiveMatchRuntime,
  projectGrandArchiveViewerLog,
  projectGrandArchiveViewerState,
  readGrandArchiveWaitState,
  type GrandArchiveMatchProgram,
  type GrandArchiveMatchState,
  type GrandArchiveViewerState,
  type GrandArchiveViewerObject,
  type GrandArchiveWaitState,
} from "@tcg/grand-archive-engine/simulator";
import type {
  SimulatorEntity,
  SimulatorEventLogEntry,
  SimulatorInteraction,
  SimulatorTable,
  SimulatorZone,
  ZoneRole,
} from "@tcg/simulator-contract";
import { projectGrandArchiveInteraction } from "./interaction.ts";
import {
  grandArchiveCounterDecorations,
  grandArchiveCounterStats,
} from "./counter-presentation.ts";

export interface GrandArchiveSimulatorProjection {
  readonly combatView: GrandArchiveViewerState["combatView"];
  readonly interactionView?: EngineInteractionView;
  readonly cardImageUrls?: Readonly<Record<string, string>>;
  readonly cardBoardImageUrls?: Readonly<Record<string, string>>;
  readonly cardBoardImageAspectRatios?: Readonly<Record<string, number>>;
  readonly cardImageAspectRatios?: Readonly<Record<string, number>>;
  /** The player whose turn it is, independent from the player currently required to act. */
  readonly turnPlayerId: GrandArchivePlayerId;
  readonly table: SimulatorTable;
  readonly entities: readonly SimulatorEntity[];
  readonly interactions: readonly SimulatorInteraction[];
  readonly eventLog: readonly SimulatorEventLogEntry[];
  readonly waitState: GrandArchiveSimulatorWaitState;
}

/** Viewer-safe, typed activity state used by the game-owned simulator UI. */
export type GrandArchiveSimulatorWaitState =
  | { readonly kind: "game-over"; readonly winnerIds: readonly GrandArchivePlayerId[] }
  | {
      readonly kind: "decision";
      readonly playerId: GrandArchivePlayerId;
      readonly decisionKind: string;
    }
  | { readonly kind: "pregame-action"; readonly playerId: GrandArchivePlayerId }
  | { readonly kind: "materialization-choice"; readonly playerId: GrandArchivePlayerId }
  | { readonly kind: "opportunity"; readonly playerId: GrandArchivePlayerId }
  | { readonly kind: "resolving" };

export type GrandArchiveViewerSimulatorProjection = GrandArchiveSimulatorProjection;

export interface GrandArchiveViewerSimulatorProjectionOptions {
  readonly interactionView?: EngineInteractionView;
  readonly cardImageUrls?: Readonly<Record<string, string>>;
  readonly cardBoardImageUrls?: Readonly<Record<string, string>>;
  readonly cardBoardImageAspectRatios?: Readonly<Record<string, number>>;
  readonly cardImageAspectRatios?: Readonly<Record<string, number>>;
  readonly interactionCommandNamesByActionId?: Readonly<Record<string, string>>;
  readonly authorizedCardDefinitionIds?: Readonly<Record<string, string>>;
  readonly authorizedCardOwnerIds?: Readonly<Record<string, string>>;
  readonly authorizedCardNames?: Readonly<Record<string, string>>;
  readonly eventLog?: readonly SimulatorEventLogEntry[];
}

type GrandArchiveStateObject =
  GrandArchiveMatchState["objects"][keyof GrandArchiveMatchState["objects"]];

const ZONE_ROLES: Readonly<Record<GrandArchiveViewerObject["zone"], ZoneRole>> = {
  "main-deck": "deck",
  "material-deck": "resource",
  hand: "hand",
  memory: "resource",
  graveyard: "discard",
  banishment: "discard",
  field: "battlefield",
  "effects-stack": "support",
  intent: "support",
  pantheon: "support",
  "inner-lineage": "support",
  loaded: "support",
};

function simulatorInputForAction(action: InteractionAction): SimulatorInteraction["input"] {
  const input = action.inputs[0];
  if (!input) {
    return { kind: "action", candidateEntityIds: [], targetZoneIds: [], options: [] };
  }
  switch (input.kind) {
    case "entity-selection":
      return {
        kind: input.min === 1 && input.max === 1 ? "single-target" : "multi-target",
        min: input.min,
        max: input.max,
        candidateEntityIds: input.candidates.map((candidate) => candidate.entity.instanceId),
        targetZoneIds: [],
        options: [],
      };
    case "ordering":
      return {
        kind: "ordering",
        min: input.min,
        max: input.max,
        candidateEntityIds: input.candidates.map((candidate) => candidate.entity.instanceId),
        targetZoneIds: [],
        options: [],
      };
    case "option-selection":
      return {
        kind: "option",
        min: input.min,
        max: input.max,
        candidateEntityIds: [],
        targetZoneIds: [],
        options: input.options.map((option) => ({ id: option.id, label: option.text.key })),
      };
    case "boolean":
    case "number":
    case "entity-partition":
    case "entity-allocation":
      return { kind: "action", candidateEntityIds: [], targetZoneIds: [], options: [] };
  }
}

type ProjectableGrandArchiveObject = Pick<
  GrandArchiveStateObject,
  | "id"
  | "definitionId"
  | "activeDefinitionId"
  | "isToken"
  | "ownerId"
  | "controllerId"
  | "zone"
  | "facing"
  | "hostId"
  | "damage"
  | "counters"
  | "incarnation"
>;

function entityForCard(input: {
  readonly object: ProjectableGrandArchiveObject;
  readonly title: string;
  readonly rested: boolean;
  readonly stateVersion: number;
  readonly concealIdentity?: boolean;
  readonly extraDataAttributes?: Readonly<Record<string, string | number | boolean>>;
}): SimulatorEntity {
  const { object, stateVersion } = input;
  const card = input.concealIdentity
    ? undefined
    : getGrandArchiveCard(object.activeDefinitionId ?? object.definitionId);
  const imageUrl = card?.printings[0]?.imageUrl;
  const hidden = input.concealIdentity === true;
  const counters = hidden
    ? []
    : grandArchiveCounterDecorations({
        damage: object.damage,
        counters: object.counters,
        damageLifetime: card?.types.includes("CHAMPION")
          ? "champion"
          : card?.types.includes("ALLY")
            ? "ally"
            : undefined,
      });
  return grandArchiveCardPresentation({
    id: object.id,
    title: input.concealIdentity ? "Face-down card" : input.title,
    subtitle: hidden ? "Private information" : (card?.types.join(" · ") ?? object.zone),
    kind: card?.types.includes("CHAMPION") ? "leader" : object.isToken ? "token" : "card",
    ownerId: object.ownerId,
    face: hidden ? "hidden" : "public",
    states: hidden ? ["hidden"] : input.rested ? ["rested"] : ["ready"],
    stats: grandArchiveCounterStats(counters),
    decorations: counters,
    traits: card ? [...card.elements, ...card.classes, ...card.subtypes] : [],
    ...(imageUrl ? { imageUrl } : {}),
    dataAttributes: {
      ...(!hidden && object.hostId ? { "data-host-id": object.hostId } : {}),
      "data-zone-id": `${object.controllerId}:${object.zone}`,
      "data-facing": object.facing,
      ...(!hidden && card?.types.includes("ALLY") ? { "data-damage-lifetime": "end-phase" } : {}),
      ...(!hidden
        ? {
            "data-definition-id": object.activeDefinitionId ?? object.definitionId,
            "data-base-definition-id": object.definitionId,
          }
        : {}),
      "data-incarnation": object.incarnation,
      "data-state-version": stateVersion,
      ...input.extraDataAttributes,
    },
  });
}

function entityForObject(object: GrandArchiveViewerObject, stateVersion: number): SimulatorEntity {
  return entityForCard({
    object,
    extraDataAttributes:
      object.lineagePosition !== undefined
        ? { "data-lineage-position": object.lineagePosition }
        : undefined,
    title: object.name,
    rested: object.states.includes("rested"),
    stateVersion,
  });
}

type ViewerStackItem = GrandArchiveViewerState["stack"][number];

function stackItemSourceId(item: ViewerStackItem): string | undefined {
  return "cardId" in item ? item.cardId : item.sourceId;
}

function stackItemTitle(item: ViewerStackItem, source: SimulatorEntity | undefined): string {
  if (source) return source.title;
  if (item.masterySource) return item.masterySource.name;
  if (item.gameSource) return item.gameSource.name;
  if ("ability" in item && item.ability?.text) return item.ability.text;
  switch (item.kind) {
    case "card-activation":
      return "Card activation";
    case "materialization":
      return "Materialization";
    case "bestowment":
      return "Bestowment";
    case "activated-ability":
      return "Activated ability";
    case "triggered-ability":
      return "Triggered ability";
    case "replacement-follow-up":
      return "Replacement effect";
  }
}

function appendEffectsStack(
  viewer: GrandArchiveViewerState,
  entities: SimulatorEntity[],
  zones: SimulatorZone[],
): void {
  const sourceById = new Map(entities.map((entity) => [entity.id, entity]));
  const stackEntities = viewer.stack.map((item, index): SimulatorEntity => {
    const sourceId = stackItemSourceId(item);
    const source = sourceId ? sourceById.get(sourceId) : undefined;
    const title = item.presentation?.name ?? stackItemTitle(item, source);
    const card = item.presentation?.definitionId
      ? getGrandArchiveCard(item.presentation.definitionId)
      : undefined;
    return {
      id: item.id,
      title,
      subtitle: item.kind.replaceAll("-", " "),
      kind: "token",
      ownerId: item.controllerId,
      face: "public",
      states: item.negated ? [] : ["ready"],
      stats: [
        { label: "Layer", value: String(index + 1) },
        ...(item.selectedModeIds.length > 0
          ? [{ label: "Modes", value: String(item.selectedModeIds.length) }]
          : []),
      ],
      traits: [item.kind, ...(item.isCopy ? ["copy"] : [])],
      ...(source?.imageUrl || card?.printings[0]?.imageUrl
        ? { imageUrl: source?.imageUrl ?? card?.printings[0]?.imageUrl }
        : {}),
      ...(source?.imageAspectRatio ? { imageAspectRatio: source.imageAspectRatio } : {}),
      ...(item.presentation?.printedText
        ? {
            details: {
              rules: [
                {
                  id: "printed-text",
                  kind: "text" as const,
                  text: item.presentation.printedText,
                },
              ],
            },
          }
        : source?.details
          ? { details: source.details }
          : {}),
      accessibilityDescription: `${title}, Effects Stack layer ${index + 1}${
        index === viewer.stack.length - 1 ? ", top item" : ""
      }`,
      dataAttributes: {
        "data-stack-item-kind": item.kind,
        "data-stack-layer": index + 1,
        "data-stack-top": index === viewer.stack.length - 1,
        ...(sourceId ? { "data-source-entity-id": sourceId } : {}),
        ...(item.presentation?.definitionId
          ? { "data-definition-id": item.presentation.definitionId }
          : {}),
      },
    };
  });
  entities.push(...stackEntities);
  zones.push({
    id: "effects-stack",
    label: "Effects Stack",
    role: "support",
    visibility: "public",
    entityIds: stackEntities.map((entity) => entity.id),
    count: stackEntities.length,
    hint: "Resolve from the top of the Effects Stack",
    layoutHint: "stack",
  });
}

function applyCombatRoles(
  viewer: GrandArchiveViewerState,
  entities: readonly SimulatorEntity[],
): SimulatorEntity[] {
  if (!viewer.combat) return [...entities];
  const rolesById = new Map<string, string[]>();
  const add = (id: string, role: string) => rolesById.set(id, [...(rolesById.get(id) ?? []), role]);
  add(viewer.combat.attackerId, "attacker");
  viewer.combat.targetIds.forEach((id) => add(id, "target"));
  viewer.combat.retaliatorIds.forEach((id) => add(id, "retaliator"));
  viewer.combat.weaponIds.forEach((id) => add(id, "weapon"));
  viewer.combat.intentIds.forEach((id) => add(id, "intent"));
  return entities.map((entity) => {
    const roles = rolesById.get(entity.id);
    return roles
      ? {
          ...entity,
          decorations: [
            ...(entity.decorations ?? []),
            ...roles.slice(0, 4).map((role, index) => ({
              id: `combat:${role}`,
              slot: (["top-start", "top-end", "bottom-start", "bottom-end"] as const)[index]!,
              ariaLabel: `Combat role: ${role}`,
              content: { kind: "text" as const, text: role.toUpperCase() },
              tone:
                role === "target"
                  ? ("negative" as const)
                  : role === "attacker"
                    ? ("warning" as const)
                    : role === "retaliator"
                      ? ("positive" as const)
                      : ("neutral" as const),
            })),
          ],
          dataAttributes: {
            ...entity.dataAttributes,
            "data-combat-role": roles.join(" "),
            "data-combat-step": viewer.combat?.step ?? "declaration",
          },
        }
      : entity;
  });
}

function entityForAuthorizedCandidate(
  object: GrandArchiveStateObject,
  stateVersion: number,
): SimulatorEntity {
  const concealIdentity = object.facing === "face-down" && object.zone === "banishment";
  const card = concealIdentity
    ? undefined
    : getGrandArchiveCard(object.activeDefinitionId ?? object.definitionId);
  return entityForCard({
    object,
    title: object.nameOverride ?? card?.name ?? object.definitionId,
    rested: object.states.has("rested"),
    stateVersion,
    concealIdentity,
    extraDataAttributes: { "data-authorized-candidate": true },
  });
}

function phaseLabel(wait: GrandArchiveWaitState, phase: string): string {
  switch (wait.kind) {
    case "pregame-action":
      return "Pregame actions";
    case "materialization-choice":
      return "Materialization choice";
    case "opportunity":
      return `Opportunity · ${wait.reason}`;
    case "decision":
      return `Decision · ${wait.decisionKind}`;
    case "resolving":
      return `Resolving · ${wait.combatStep ?? wait.phase}`;
    case "game-over":
      return "Game over";
    default:
      return phase;
  }
}

function viewerPhaseLabel(viewer: GrandArchiveViewerState): string {
  if (viewer.status === "finished") return "Game over";
  if (viewer.decision) return `Decision · ${viewer.decision.kind}`;
  if (viewer.opportunityHolderId) return "Opportunity";
  if (viewer.stack.length > 0) return `Resolving · ${viewer.turn.phase}`;
  return viewer.turn.phase.replaceAll("-", " ");
}

function viewerWaitState(viewer: GrandArchiveViewerState): GrandArchiveSimulatorWaitState {
  if (viewer.status === "finished") {
    return { kind: "game-over", winnerIds: viewer.winnerIds };
  }
  if (viewer.decision) {
    return {
      kind: "decision",
      playerId: viewer.decision.playerId,
      decisionKind: viewer.decision.kind,
    };
  }
  if (viewer.status === "pregame") {
    return viewer.pregamePlayerId
      ? { kind: "pregame-action", playerId: viewer.pregamePlayerId }
      : { kind: "resolving" };
  }
  if (viewer.opportunityHolderId) {
    return {
      kind: "opportunity",
      playerId: viewer.opportunityHolderId,
    };
  }
  if (viewer.turn.phase === "materialize" && viewer.turn.materializeChoicePending) {
    return {
      kind: "materialization-choice",
      playerId: viewer.turn.playerId,
    };
  }
  return { kind: "resolving" };
}

function isCardNameCharacter(value: string | undefined): boolean {
  return value !== undefined && /[\p{L}\p{N}]/u.test(value);
}

export function referencedEntitiesForMessage(
  entities: readonly SimulatorEntity[],
  message: string,
): readonly SimulatorEntity[] {
  const publicEntityByTitle = new Map<string, SimulatorEntity>();
  for (const entity of entities) {
    if (entity.face === "public" && !publicEntityByTitle.has(entity.title)) {
      publicEntityByTitle.set(entity.title, entity);
    }
  }
  const occupiedRanges: Array<{ readonly start: number; readonly end: number }> = [];
  const referenced: SimulatorEntity[] = [];
  for (const entity of [...publicEntityByTitle.values()].sort(
    (left, right) => right.title.length - left.title.length,
  )) {
    let start = message.indexOf(entity.title);
    while (start >= 0) {
      const end = start + entity.title.length;
      const startsOnBoundary =
        !isCardNameCharacter(entity.title[0]) || !isCardNameCharacter(message[start - 1]);
      const endsOnBoundary =
        !isCardNameCharacter(entity.title.at(-1)) || !isCardNameCharacter(message[end]);
      const overlapsLongerMatch = occupiedRanges.some(
        (range) => start < range.end && end > range.start,
      );
      if (startsOnBoundary && endsOnBoundary && !overlapsLongerMatch) {
        occupiedRanges.push({ start, end });
        referenced.push(entity);
        break;
      }
      start = message.indexOf(entity.title, start + 1);
    }
  }
  return referenced;
}

/**
 * Convert the opaque, server-selected Grand Archive player view into the
 * simulator contract without requiring the browser to hold authoritative
 * engine state. Optional authorized instance mappings expose only cards the
 * current interaction explicitly permits the viewer to inspect.
 */
export function applyGrandArchiveImageResources(
  entity: SimulatorEntity,
  options: Pick<
    GrandArchiveViewerSimulatorProjectionOptions,
    "cardImageUrls" | "cardBoardImageUrls" | "cardBoardImageAspectRatios" | "cardImageAspectRatios"
  >,
): SimulatorEntity {
  if (!options.cardImageUrls || entity.face === "hidden") return entity;
  const { imageUrl: _currentImage, ...rest } = entity;
  const imageUrl = options.cardImageUrls[entity.id];
  const board = options.cardBoardImageUrls?.[entity.id];
  const onField =
    typeof entity.dataAttributes?.["data-zone-id"] === "string" &&
    entity.dataAttributes["data-zone-id"].endsWith(":field");
  const usesArt = onField && imageUrl && board && board !== imageUrl;
  return {
    ...rest,
    ...(imageUrl ? { imageUrl: usesArt ? board : imageUrl } : {}),
    ...(imageUrl ? { imageAspectRatio: options.cardImageAspectRatios?.[entity.id] ?? 5 / 7 } : {}),
    ...(usesArt
      ? {
          imageAspectRatio: options.cardBoardImageAspectRatios?.[entity.id] ?? 1,
          dataAttributes: {
            ...entity.dataAttributes,
            "data-ga-art-only": true,
            "data-ga-printed-image-url": imageUrl,
            "data-ga-printed-image-aspect-ratio":
              options.cardImageAspectRatios?.[entity.id] ?? 5 / 7,
          },
        }
      : {}),
  };
}

export function projectGrandArchiveViewerSimulator(
  viewer: GrandArchiveViewerState,
  options: GrandArchiveViewerSimulatorProjectionOptions = {},
): GrandArchiveViewerSimulatorProjection {
  const entities: SimulatorEntity[] = [];
  const zones: SimulatorZone[] = [];
  for (const player of viewer.players) {
    for (const zoneName of GRAND_ARCHIVE_ZONES) {
      const zone = player.zones[zoneName];
      const visible = zone.visibility === "visible" ? zone.objects : zone.revealedObjects;
      entities.push(...visible.map((object) => entityForObject(object, viewer.stateVersion)));
      zones.push({
        id: `${player.id}:${zoneName}`,
        label: zoneName.replaceAll("-", " "),
        role: ZONE_ROLES[zoneName],
        ownerId: player.id,
        visibility: zone.visibility === "hidden" ? "private" : "public",
        entityIds: visible.map((object) => object.id),
        count: zone.visibility === "hidden" ? zone.count : visible.length + zone.hiddenCount,
        hint:
          zone.visibility === "hidden"
            ? "Private identities are omitted"
            : "Viewer-visible objects",
        layoutHint: zoneName === "hand" ? "fan" : zoneName.includes("deck") ? "stack" : "row",
      });
    }
  }
  appendEffectsStack(viewer, entities, zones);

  const visibleEntityIds = new Set(entities.map((entity) => entity.id));
  const interactionView = options.interactionView;
  if (interactionView) {
    for (const action of interactionView.actions) {
      for (const input of action.inputs) {
        if (input.kind !== "entity-selection" && input.kind !== "ordering") continue;
        for (const candidate of input.candidates) {
          const instanceId = candidate.entity.instanceId;
          if (visibleEntityIds.has(instanceId)) continue;
          const definitionId = options.authorizedCardDefinitionIds?.[instanceId];
          const card = definitionId ? getGrandArchiveCard(definitionId) : undefined;
          entities.push({
            id: instanceId,
            title:
              options.authorizedCardNames?.[instanceId] ??
              card?.name ??
              candidate.text?.key ??
              "Authorized card",
            subtitle: card?.types.join(" · ") ?? "Authorized interaction candidate",
            kind: card?.types.includes("CHAMPION") ? "leader" : "card",
            ownerId: options.authorizedCardOwnerIds?.[instanceId] ?? viewer.selfId,
            face: "public",
            states: [],
            stats: [],
            traits: card ? [...card.elements, ...card.classes, ...card.subtypes] : [],
            ...(card?.printings[0]?.imageUrl ? { imageUrl: card.printings[0].imageUrl } : {}),
            imageAspectRatio: 5 / 7,
            dataAttributes: {
              "data-authorized-candidate": true,
              "data-state-version": viewer.stateVersion,
            },
          });
          visibleEntityIds.add(instanceId);
        }
      }
    }
  }

  const interactions: SimulatorInteraction[] = (interactionView?.actions ?? []).map((action) => ({
    id: action.id,
    label: action.text.key,
    prompt: action.text.key,
    ...(action.source?.kind === "card" ? { sourceEntityId: action.source.instanceId } : {}),
    input: simulatorInputForAction(action),
    movePreview: {
      engine: "grand-archive",
      command: options.interactionCommandNamesByActionId?.[action.id] ?? action.intent,
      payload: JSON.stringify({
        stateVersion: viewer.stateVersion,
        requestId: action.requestId,
      }),
    },
  }));
  const activeSeatId =
    viewer.decision?.playerId ?? viewer.opportunityHolderId ?? viewer.turn.playerId;
  return {
    combatView: viewer.combatView,
    turnPlayerId: viewer.turn.playerId,
    table: {
      status: {
        activeSeatId,
        phase: viewerPhaseLabel(viewer),
        turn: viewer.turn.number,
        stateVersion: viewer.stateVersion,
      },
      seats: viewer.players.map((player) => ({
        id: player.id,
        label: player.name,
        role: "human",
        perspective: player.id === viewer.selfId ? "bottom" : "top",
        counters: [
          {
            label: "Hand",
            value: String(
              player.zones.hand.visibility === "hidden"
                ? player.zones.hand.count
                : player.zones.hand.objects.length + player.zones.hand.hiddenCount,
            ),
          },
          {
            label: "Memory",
            value: String(
              player.zones.memory.visibility === "hidden"
                ? player.zones.memory.count
                : player.zones.memory.objects.length + player.zones.memory.hiddenCount,
            ),
          },
        ],
      })),
      zones,
    },
    entities: applyCombatRoles(viewer, entities).map((entity) =>
      applyGrandArchiveImageResources(entity, options),
    ),
    interactions,
    eventLog: [...(options.eventLog ?? [])],
    waitState: viewerWaitState(viewer),
    interactionView,
  };
}

export function projectGrandArchiveSimulator(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  viewerId: GrandArchivePlayerId,
  images: Pick<
    GrandArchiveViewerSimulatorProjectionOptions,
    "cardImageUrls" | "cardBoardImageUrls" | "cardBoardImageAspectRatios" | "cardImageAspectRatios"
  > = {},
): GrandArchiveSimulatorProjection {
  const viewer = projectGrandArchiveViewerState(program, state, viewerId);
  const waitState = readGrandArchiveWaitState(state);
  const entities: SimulatorEntity[] = [];
  const zones: SimulatorZone[] = [];
  for (const player of viewer.players) {
    for (const zoneName of GRAND_ARCHIVE_ZONES) {
      const zone = player.zones[zoneName];
      const zoneId = `${player.id}:${zoneName}`;
      const visible = zone.visibility === "visible" ? zone.objects : zone.revealedObjects;
      entities.push(...visible.map((object) => entityForObject(object, state.stateVersion)));
      zones.push({
        id: zoneId,
        label: zoneName.replaceAll("-", " "),
        role: ZONE_ROLES[zoneName],
        ownerId: player.id,
        visibility: zone.visibility === "hidden" ? "private" : "public",
        entityIds: visible.map((object) => object.id),
        count: zone.visibility === "hidden" ? zone.count : visible.length + zone.hiddenCount,
        hint:
          zone.visibility === "hidden"
            ? "Private identities are omitted"
            : "Viewer-visible objects",
        layoutHint: zoneName === "hand" ? "fan" : zoneName.includes("deck") ? "stack" : "row",
      });
    }
  }
  appendEffectsStack(viewer, entities, zones);
  const runtime = new GrandArchiveMatchRuntime(program, state);
  const interaction = projectGrandArchiveInteraction(runtime, viewerId);
  const visibleEntityIds = new Set(entities.map((entity) => entity.id));
  const objectsById = new Map<string, GrandArchiveStateObject>(
    Object.values(state.objects).map((object) => [object.id, object]),
  );
  for (const action of interaction.view.actions) {
    for (const input of action.inputs) {
      if (input.kind !== "entity-selection" && input.kind !== "ordering") continue;
      for (const candidate of input.candidates) {
        const candidateId = candidate.entity.instanceId;
        if (visibleEntityIds.has(candidateId)) continue;
        const object = objectsById.get(candidateId);
        const entity = object
          ? entityForAuthorizedCandidate(object, state.stateVersion)
          : candidate.entity.kind === "effect"
            ? {
                id: candidateId,
                title: candidate.text?.key ?? candidateId,
                subtitle: "Triggered ability",
                kind: "token" as const,
                ownerId: viewerId,
                face: "public" as const,
                states: [],
                stats: [],
                traits: [],
                dataAttributes: { "data-authorized-candidate": true },
              }
            : null;
        if (!entity) continue;
        entities.push(entity);
        visibleEntityIds.add(candidateId);
      }
    }
  }
  const interactions: SimulatorInteraction[] = interaction.view.actions.map((action) => ({
    id: action.id,
    label: action.text.key,
    prompt: action.text.key,
    ...(action.source?.kind === "card" ? { sourceEntityId: action.source.instanceId } : {}),
    input: simulatorInputForAction(action),
    movePreview: {
      engine: "grand-archive",
      command: interaction.commandsByActionId.get(action.id)?.[0]?.command.move ?? action.intent,
      payload: JSON.stringify({ stateVersion: state.stateVersion, requestId: action.requestId }),
    },
  }));
  const viewerLog = projectGrandArchiveViewerLog(program, state, viewerId);
  let eventTurn = viewerLog.some((entry) => entry.key === "grand-archive.turn.started")
    ? 0
    : state.turn.number;
  let eventTurnOwnerId: string | undefined =
    eventTurn === state.turn.number ? state.turn.playerId : undefined;
  const eventLog: SimulatorEventLogEntry[] = viewerLog.map((entry, index) => {
    if (entry.key === "grand-archive.turn.started") {
      eventTurn = entry.values.turnNumber;
      eventTurnOwnerId = entry.values.playerId;
    }
    const actorSeatId = "playerId" in entry.values ? entry.values.playerId : undefined;
    const referencedEntities = referencedEntitiesForMessage(entities, entry.defaultMessage);
    return {
      id: entry.eventId,
      turn: eventTurn,
      phase: state.turn.phase,
      ...(actorSeatId ? { seatId: actorSeatId } : {}),
      timestamp: `T${String(index + 1).padStart(4, "0")}`,
      message: entry.defaultMessage,
      sourceKey: entry.key,
      section: {
        id: `turn:${eventTurn}`,
        label: eventTurn === 0 ? "Pregame" : `Turn ${eventTurn}`,
        ...(eventTurnOwnerId ? { actorSeatId: eventTurnOwnerId } : {}),
      },
      tags:
        entry.category === "combat"
          ? ["combat"]
          : entry.category === "system"
            ? ["system"]
            : ["move"],
      ...(referencedEntities.length > 0
        ? {
            entityIds: referencedEntities.map((entity) => entity.id),
            cardRefs: referencedEntities.map((entity) => ({
              name: entity.title,
              entityId: entity.id,
              ...(typeof entity.dataAttributes?.["data-definition-id"] === "string"
                ? { definitionId: entity.dataAttributes["data-definition-id"] }
                : {}),
            })),
          }
        : {}),
    };
  });
  const activeSeatId = "playerId" in waitState ? waitState.playerId : state.turn.playerId;
  return {
    combatView: viewer.combatView,
    turnPlayerId: state.turn.playerId,
    table: {
      status: {
        activeSeatId,
        phase: phaseLabel(waitState, state.turn.phase),
        turn: state.turn.number,
        stateVersion: state.stateVersion,
      },
      seats: viewer.players.map((player) => ({
        id: player.id,
        label: player.name,
        role: "human",
        perspective: player.id === viewerId ? "bottom" : "top",
        counters: [
          {
            label: "Hand",
            value: String(
              player.zones.hand.visibility === "hidden"
                ? player.zones.hand.count
                : player.zones.hand.objects.length,
            ),
          },
          {
            label: "Memory",
            value: String(
              player.zones.memory.visibility === "hidden"
                ? player.zones.memory.count
                : player.zones.memory.objects.length,
            ),
          },
        ],
      })),
      zones,
    },
    entities: applyCombatRoles(viewer, entities).map((entity) =>
      applyGrandArchiveImageResources(entity, images),
    ),
    interactions,
    eventLog,
    waitState,
    interactionView: interaction.view,
  };
}
