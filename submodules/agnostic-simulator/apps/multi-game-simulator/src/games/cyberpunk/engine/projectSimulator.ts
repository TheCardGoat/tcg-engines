import {
  defOf,
  computeEffectiveCostDetails,
  getEffectivePower,
  getEffectiveRules,
  type CardInstance,
  type GigDie,
  type MatchState,
} from "@tcg/cyberpunk-engine";
import type { CardZone } from "@tcg/cyberpunk-types";
import type { EngineInteractionView, InteractionAction, InteractionInput } from "@tcg/protocol";
import type {
  BoardLayout,
  EntityKind,
  EntityState,
  HarnessFixture,
  InteractionInputKind,
  InteractionOption,
  SimulatorEntity,
  SimulatorEventLogEntry,
  SimulatorInteraction,
  SimulatorSeat,
  SimulatorTable,
  SimulatorTargetingIntent,
  SimulatorZone,
  ZoneRole,
} from "@tcg/simulator-contract";

import { PLAYER_SIDE_TO_ID, type Side } from "./sides";

export type { Side };

export type CyberpunkCardZone =
  | "deck"
  | "hand"
  | "field"
  | "trash"
  | "legendArea"
  | "eddieArea"
  | "gigArea";

export interface CyberpunkSimulatorProjection {
  table: SimulatorTable;
  entities: SimulatorEntity[];
  interactions: SimulatorInteraction[];
  eventLog: SimulatorEventLogEntry[];
  targetingIntents: SimulatorTargetingIntent[];
  boardLayout: BoardLayout;
}

export interface ProjectSimulatorInput {
  matchState: MatchState;
  viewerSide: Side;
  interactionViews: Readonly<Partial<Record<Side, EngineInteractionView>>>;
  humanSide: Side;
}

const CARD_BACK_URLS = {
  legend: "https://r2.tcg.online/public/cyberpunk/cards/back/legend-card-back.webp",
  default: "https://r2.tcg.online/public/cyberpunk/cards/back/card-back.webp",
} as const;

const cardIds = (arr: ReadonlyArray<string | { toString(): string }>) =>
  arr.map((id) => String(id));

/**
 * Project the Cyberpunk engine state into the shared simulator contract.
 * This is the single adapter every shared UI primitive consumes.
 */
export function projectSimulator({
  matchState,
  viewerSide,
  interactionViews,
  humanSide,
}: ProjectSimulatorInput): CyberpunkSimulatorProjection {
  const entities: SimulatorEntity[] = [];
  const zones: SimulatorZone[] = [];
  const seats: SimulatorSeat[] = [];

  for (const side of ["player", "opponent"] as const) {
    const playerId = String(PLAYER_SIDE_TO_ID[side]);
    const player = matchState.G.players[playerId];
    if (!player) continue;

    const seatId = playerId;
    const isViewer = side === viewerSide;
    const perspective = side === humanSide ? ("bottom" as const) : ("top" as const);
    const streetCred = player.gigArea
      .map((id) => matchState.G.gigDice[String(id)])
      .filter((d): d is GigDie => d !== undefined)
      .reduce((sum, d) => sum + d.faceValue, 0);

    seats.push({
      id: seatId,
      label: isViewer ? "You" : "Rival",
      role: side === humanSide ? "human" : "agent",
      perspective,
      counters: [
        { label: "Eddies", value: String(player.eddies) },
        { label: "Street Cred", value: String(streetCred) },
        { label: "Hand", value: String(player.zones.hand.length) },
      ],
      connectionStatus: isViewer ? "online" : undefined,
    });

    const sideZones = projectSideZones({
      side,
      playerId,
      player,
      matchState,
      viewerSide,
      entities,
    });
    zones.push(...sideZones);
  }

  const activeSide: Side | null =
    matchState.G.turnMetadata.activePlayerId === PLAYER_SIDE_TO_ID.player
      ? "player"
      : matchState.G.turnMetadata.activePlayerId === PLAYER_SIDE_TO_ID.opponent
        ? "opponent"
        : null;

  const table: SimulatorTable = {
    status: {
      activeSeatId: activeSide
        ? String(PLAYER_SIDE_TO_ID[activeSide])
        : String(PLAYER_SIDE_TO_ID[humanSide]),
      phase: phaseLabel(matchState.G.gamePhase),
      turn: matchState.G.turnMetadata.turnNumber,
      stateVersion: matchState.ctx.stateID,
    },
    seats,
    zones,
  };

  const interactions = projectInteractions({
    interactionView: interactionViews[viewerSide],
    matchState,
    viewerSide,
    entities,
  });

  const eventLog = projectEventLog(matchState, viewerSide);
  const targetingIntents = projectTargetingIntents(matchState, viewerSide);

  const boardLayout = buildCyberpunkBoardLayout(seats);

  return { table, entities, interactions, eventLog, targetingIntents, boardLayout };
}

export function projectToHarnessFixture(
  input: ProjectSimulatorInput,
  name = "Cyberpunk live match",
): HarnessFixture {
  const projection = projectSimulator(input);
  return {
    id: `cyberpunk-live-${input.matchState.ctx.stateID}`,
    gameSlug: "cyberpunk",
    name,
    summary: "Live Cyberpunk match projected into the shared simulator contract.",
    adapterGoal:
      "Keep Cyberpunk rules semantics in the adapter while the UI renders generic entities, zones, and interactions.",
    table: projection.table,
    boardLayout: projection.boardLayout,
    entities: projection.entities,
    interactions: projection.interactions,
    guideSteps: [],
    agentChecks: [],
    coreComponents: [],
    eventLog: projection.eventLog,
    targetingIntents: projection.targetingIntents,
  };
}

interface ProjectSideZonesInput {
  side: Side;
  playerId: string;
  player: MatchState["G"]["players"][string];
  matchState: MatchState;
  viewerSide: Side;
  entities: SimulatorEntity[];
}

function projectSideZones(input: ProjectSideZonesInput): SimulatorZone[] {
  const { side, playerId, player, matchState, viewerSide, entities } = input;
  const prefix = side === "player" ? "p" : "opp";
  const isViewer = side === viewerSide;
  const zones: SimulatorZone[] = [];

  const pushZone = (
    zone: CyberpunkCardZone,
    label: string,
    role: ZoneRole,
    visibility: SimulatorZone["visibility"],
    layoutHint: SimulatorZone["layoutHint"],
    entityIds: string[],
    count?: number,
  ) => {
    const id = `${prefix}-${zone}`;
    zones.push({
      id,
      label,
      role,
      ownerId: playerId,
      visibility,
      entityIds,
      count,
      hint: label,
      layoutHint,
    });
  };

  const lookupCard = (id: string | { toString(): string }) => matchState.G.cardIndex[String(id)];

  // Deck: hidden count-only stack.
  pushZone("deck", "Deck", "deck", "secret", "stack", [], player.zones.deck.length);

  // Hand: fan for viewer, face-down cards for opponent.
  const handIds = cardIds(player.zones.hand);
  const handEntities = handIds
    .map((id) => lookupCard(id))
    .filter((c): c is CardInstance => Boolean(c))
    .map((c) => projectCardEntity(c, matchState, viewerSide, entities));
  pushZone(
    "hand",
    "Hand",
    "hand",
    "private",
    "fan",
    handEntities.map((e) => e.id),
    handIds.length,
  );

  // Field: public grid, excluding attached gear.
  const fieldIds = cardIds(player.zones.field).filter((id) => {
    const card = lookupCard(id);
    return card && !card.meta.attachedToId;
  });
  const fieldEntities = fieldIds
    .map((id) => lookupCard(id))
    .filter((c): c is CardInstance => Boolean(c))
    .map((c) => projectCardEntity(c, matchState, viewerSide, entities));
  pushZone(
    "field",
    "Field",
    "battlefield",
    "public",
    "grid",
    fieldEntities.map((e) => e.id),
  );

  // Legends: owner-only, leader role; hidden backs for opponent.
  const legendIds = cardIds(player.zones.legendArea);
  const legendEntities = legendIds
    .map((id) => lookupCard(id))
    .filter((c): c is CardInstance => Boolean(c))
    .map((c) => projectCardEntity(c, matchState, viewerSide, entities));
  pushZone(
    "legendArea",
    "Legends",
    "leader",
    "private",
    "row",
    legendEntities.map((e) => e.id),
    legendIds.length,
  );

  // Trash: public stack with top card visible.
  const trashIds = cardIds(player.zones.trash);
  const trashEntities = trashIds
    .map((id) => lookupCard(id))
    .filter((c): c is CardInstance => Boolean(c))
    .map((c) => projectCardEntity(c, matchState, viewerSide, entities));
  pushZone(
    "trash",
    "Trash",
    "discard",
    "public",
    "stack",
    trashEntities.slice(-1).map((e) => e.id),
    trashIds.length,
  );

  // Eddies: resource stack; hidden backs for opponent.
  const eddieIds = cardIds(player.zones.eddieArea);
  const eddieEntities = eddieIds
    .map((id) => lookupCard(id))
    .filter((c): c is CardInstance => Boolean(c))
    .map((c) => projectCardEntity(c, matchState, viewerSide, entities));
  pushZone(
    "eddieArea",
    "Eddies",
    "resource",
    "private",
    "stack",
    eddieEntities.map((e) => e.id),
    player.eddies,
  );

  // Gigs: score zone with dice entities.
  const gigDiceIds = cardIds(player.gigArea);
  const gigEntities = gigDiceIds
    .map((id) => matchState.G.gigDice[String(id)])
    .filter((d): d is GigDie => Boolean(d))
    .map((d) => projectDieEntity(d, playerId, entities));
  pushZone(
    "gigArea",
    "Gigs",
    "score",
    "public",
    "row",
    gigEntities.map((e) => e.id),
    gigDiceIds.length,
  );

  // Fixer dice: per-player pool used to pay for actions.
  const fixerDiceIds = cardIds(player.fixerArea);
  const fixerEntities = fixerDiceIds
    .map((id) => matchState.G.gigDice[String(id)])
    .filter((d): d is GigDie => Boolean(d))
    .map((d) => projectDieEntity(d, playerId, entities));
  zones.push({
    id: `${prefix}-fixer`,
    label: "Fixer dice",
    role: "custom",
    ownerId: playerId,
    visibility: isViewer ? "owner" : "public",
    entityIds: fixerEntities.map((e) => e.id),
    count: fixerDiceIds.length,
    hint: "Unrolled fixer dice",
    layoutHint: "row",
  });

  return zones;
}

function projectCardEntity(
  instance: CardInstance,
  matchState: MatchState,
  viewerSide: Side,
  entities: SimulatorEntity[],
): SimulatorEntity {
  const cardId = String(instance.instanceId);
  const existing = entities.find((e) => e.id === cardId);
  if (existing) return existing;

  const definition = defOf(instance);
  const ownerId = String(instance.ownerId);
  const cardSide = sideForPlayerId(ownerId);
  const isViewer = cardSide === viewerSide;
  const faceDown = Boolean(instance.meta.faceDown);
  const zone = cardSide ? currentCardZoneForEntity(instance, matchState, cardSide) : null;
  const hiddenFromViewer = !isViewer && isPrivateCardZone(zone);
  const face: SimulatorEntity["face"] = faceDown || hiddenFromViewer ? "hidden" : "public";

  const printedPower = typeof definition.power === "number" ? definition.power : null;
  const printedCost = typeof definition.cost === "number" ? definition.cost : null;
  const effectiveCostDetails =
    printedCost !== null
      ? computeEffectiveCostDetails(matchState, instance.instanceId, instance.controllerId)
      : null;
  const effectivePower =
    printedPower !== null ? getEffectivePower(matchState, String(instance.instanceId)) : null;

  const stats: SimulatorEntity["stats"] = [];
  if (printedCost !== null) {
    stats.push({
      label: "Cost",
      value: effectiveCostDetails
        ? String(effectiveCostDetails.effectiveCost)
        : String(printedCost),
    });
  }
  if (printedPower !== null) {
    stats.push({
      label: "Power",
      value: effectivePower !== null ? String(effectivePower) : String(printedPower),
    });
  }

  const traits: string[] = [
    definition.type,
    ...(definition.classifications ?? []),
    ...(definition.keywords ?? []),
  ];

  const overlayBadges: SimulatorEntity["overlayBadges"] = [];
  if (definition.hasSellTag) {
    overlayBadges.push({ label: "€$", color: "#fbbf24", position: "br" });
  }
  const ruleBadges = getEffectiveRules(matchState, String(instance.instanceId))
    .filter((rule) => rule === "blocker" || rule === "goSolo" || rule === "cantAttack")
    .map((rule) => ({ label: rule, color: "#22d3ee", position: "tr" as const }));
  overlayBadges.push(...ruleBadges);

  const states: EntityState[] = [];
  if (instance.meta.spent) states.push("rested");
  if (instance.meta.faceDown) states.push("hidden");
  if (instance.meta.attachedToId) states.push("attached");
  if (!instance.meta.spent && !instance.meta.faceDown) states.push("ready");

  const dataAttributes: SimulatorEntity["dataAttributes"] = {
    "data-spent": instance.meta.spent ? "true" : "false",
  };
  if (!hiddenFromViewer) {
    if (printedPower !== null) {
      dataAttributes["data-power"] = String(printedPower);
    }
    if (effectivePower !== null) {
      dataAttributes["data-effective-power"] = String(effectivePower);
    }
    dataAttributes["data-gear-count"] = String(instance.meta.attachedGearIds.length);
  }

  const entity: SimulatorEntity = {
    id: cardId,
    title: hiddenFromViewer ? "Hidden card" : (definition.displayName ?? definition.name),
    subtitle: hiddenFromViewer ? "Card" : definition.type,
    kind: entityKindForCardType(definition.type),
    ownerId,
    face,
    states,
    stats: hiddenFromViewer ? [] : stats,
    traits: hiddenFromViewer ? [] : traits,
    imageUrl: hiddenFromViewer ? undefined : definition.imageUrl,
    backImageUrl: definition.type === "legend" ? CARD_BACK_URLS.legend : CARD_BACK_URLS.default,
    frameStyle: { color: colorForCardColor(definition.color as string | undefined) },
    overlayBadges,
    dataAttributes,
  };

  entities.push(entity);
  return entity;
}

function isPrivateCardZone(zone: CyberpunkCardZone | null): boolean {
  return zone === "deck" || zone === "hand" || zone === "eddieArea";
}

export function projectEntityForCard(
  cardId: string,
  matchState: MatchState,
  viewerSide: Side,
): SimulatorEntity | null {
  const instance = matchState.G.cardIndex[cardId];
  if (!instance) return null;
  return projectCardEntity(instance, matchState, viewerSide, []);
}

function projectDieEntity(
  die: GigDie,
  ownerId: string,
  entities: SimulatorEntity[],
): SimulatorEntity {
  const id = String(die.id);
  const existing = entities.find((e) => e.id === id);
  if (existing) return existing;

  const entity: SimulatorEntity = {
    id,
    title: die.dieType.toUpperCase(),
    subtitle: "Gig die",
    kind: "die",
    ownerId,
    face: "public",
    states: die.faceValue > 0 ? ["active"] : ["ready"],
    stats: [{ label: "Face", value: die.faceValue > 0 ? String(die.faceValue) : "-" }],
    traits: [die.dieType],
    dataAttributes: {
      "data-face": String(die.faceValue),
    },
  };

  entities.push(entity);
  return entity;
}

function entityKindForCardType(type: string): EntityKind {
  switch (type) {
    case "legend":
      return "leader";
    case "unit":
      return "unit";
    case "gear":
    case "program":
      return "card";
    default:
      return "card";
  }
}

function colorForCardColor(color: string | undefined): string {
  switch (color) {
    case "blue":
      return "#3b82f6";
    case "green":
      return "#22c55e";
    case "red":
      return "#ef4444";
    case "yellow":
      return "#eab308";
    default:
      return "#6b7280";
  }
}

function projectInteractions({
  interactionView,
  matchState,
  viewerSide,
  entities,
}: {
  interactionView: EngineInteractionView | undefined;
  matchState: MatchState;
  viewerSide: Side;
  entities: SimulatorEntity[];
}): SimulatorInteraction[] {
  if (
    !interactionView ||
    (interactionView.status !== "ready" && interactionView.status !== "choosing")
  ) {
    return [];
  }

  return interactionView.actions
    .filter((action) => action.enabled)
    .map((action, index) =>
      projectInteractionAction(action, index, matchState, viewerSide, entities),
    )
    .filter((interaction): interaction is SimulatorInteraction => interaction !== null);
}

function projectInteractionAction(
  action: InteractionAction,
  _index: number,
  matchState: MatchState,
  _viewerSide: Side,
  entities: SimulatorEntity[],
): SimulatorInteraction | null {
  if (action.id === "attackUnit") {
    return projectAttackUnitInteraction(action, matchState, entities);
  }

  const input = primaryInput(action);
  if (input === "unsupported") return null;
  if (!input) {
    // Action with no inputs (e.g. pass, undo, concede).
    return {
      id: action.id,
      label: localizeText(action.text),
      prompt: localizeText(action.text),
      input: {
        kind: "action",
        candidateEntityIds: [],
        targetZoneIds: [],
        options: [],
      },
      movePreview: movePreviewFor(action),
    };
  }

  const sourceEntityId = action.source?.instanceId ? String(action.source.instanceId) : undefined;

  switch (input.kind) {
    case "entity-selection": {
      const kind = inputKindForEntitySelection(input, action);
      return {
        id: action.id,
        label: localizeText(action.text),
        prompt: localizeText(action.text),
        sourceEntityId,
        input: {
          kind,
          min: input.min,
          max: input.max,
          candidateEntityIds: input.candidates
            .filter((c) => c.entity.kind === "card" || c.entity.kind === "die")
            .map((c) => String(c.entity.instanceId)),
          targetZoneIds: targetZonesForInput(input, matchState),
          options: [],
        },
        movePreview: movePreviewFor(action),
      };
    }
    case "option-selection": {
      return {
        id: action.id,
        label: localizeText(action.text),
        prompt: localizeText(action.text),
        sourceEntityId,
        input: {
          kind: "option",
          min: input.min,
          max: input.max,
          candidateEntityIds: [],
          targetZoneIds: [],
          options: input.options.map(
            (opt): InteractionOption => ({
              id: opt.id,
              label: localizeText(opt.text),
            }),
          ),
        },
        movePreview: movePreviewFor(action),
      };
    }
    case "ordering": {
      return {
        id: action.id,
        label: localizeText(action.text),
        prompt: localizeText(action.text),
        sourceEntityId,
        input: {
          kind: "ordering",
          min: input.min,
          max: input.max,
          candidateEntityIds: input.candidates.map((c) => String(c.entity.instanceId)),
          targetZoneIds: [],
          options: [],
        },
        movePreview: movePreviewFor(action),
      };
    }
    case "boolean": {
      return {
        id: action.id,
        label: localizeText(action.text),
        prompt: localizeText(action.text),
        sourceEntityId,
        input: {
          kind: "option",
          min: 1,
          max: 1,
          candidateEntityIds: [],
          targetZoneIds: [],
          options: [
            { id: "true", label: "Yes" },
            { id: "false", label: "No" },
          ],
        },
        movePreview: movePreviewFor(action),
      };
    }
    case "number": {
      const options = numberInputOptions(input);
      return {
        id: action.id,
        label: localizeText(action.text),
        prompt: localizeText(action.text),
        sourceEntityId,
        input: {
          kind: "option",
          min: 1,
          max: 1,
          candidateEntityIds: [],
          targetZoneIds: [],
          options,
        },
        movePreview: movePreviewFor(action),
      };
    }
    default:
      return null;
  }
}

function primaryInput(action: InteractionAction): InteractionInput | "unsupported" | undefined {
  const requiredInputs = action.inputs.filter((input) => !inputAllowsOmission(input));
  if (requiredInputs.length > 1) return "unsupported";
  return requiredInputs[0] ?? action.inputs[0];
}

function inputAllowsOmission(input: InteractionInput): boolean {
  if (input.required === false) return true;
  switch (input.kind) {
    case "entity-selection":
    case "option-selection":
    case "ordering":
      return input.min === 0;
    case "boolean":
    case "number":
      return false;
  }
}

/**
 * The shared InteractionPanel only supports single-target (or multi-target)
 * entity selection. `attackUnit` is a `selectPair` move with two required
 * entity inputs (attacker + defender), so the generic projection would drop it.
 * Flatten it into a single-target interaction whose candidates are synthetic
 * "pair" entities. Each pair id encodes "attackerId->defenderId"; the dispatch
 * adapter splits it back into the two original values.
 */
function projectAttackUnitInteraction(
  action: InteractionAction,
  matchState: MatchState,
  entities: SimulatorEntity[],
): SimulatorInteraction | null {
  const entityInputs = action.inputs.filter(
    (input): input is Extract<InteractionInput, { kind: "entity-selection" }> =>
      input.kind === "entity-selection",
  );
  const attackerInput = entityInputs.find((input) => input.id === "attackerId") ?? entityInputs[0];
  const defenderInput = entityInputs.find((input) => input.id === "defenderId") ?? entityInputs[1];
  if (!attackerInput || !defenderInput) return null;

  const attackerIds = attackerInput.candidates
    .filter((candidate) => candidate.enabled !== false)
    .map((candidate) => String(candidate.entity.instanceId));
  const defenderIds = defenderInput.candidates
    .filter((candidate) => candidate.enabled !== false)
    .map((candidate) => String(candidate.entity.instanceId));
  if (attackerIds.length === 0 || defenderIds.length === 0) return null;

  const pairEntityIds: string[] = [];
  for (const attackerId of attackerIds) {
    const attacker = matchState.G.cardIndex[attackerId];
    const attackerName = attacker ? cardTitle(attacker) : attackerId;
    for (const defenderId of defenderIds) {
      const defender = matchState.G.cardIndex[defenderId];
      const defenderName = defender ? cardTitle(defender) : defenderId;
      const pairId = `${attackerId}->${defenderId}`;
      pairEntityIds.push(pairId);
      entities.push({
        id: pairId,
        title: `${attackerName} → ${defenderName}`,
        subtitle: "Attack pair",
        kind: "token",
        ownerId: String(matchState.G.turnMetadata.activePlayerId),
        face: "public",
        states: [],
        stats: [],
        traits: [],
      });
    }
  }

  return {
    id: action.id,
    label: localizeText(action.text),
    prompt: localizeText(action.text),
    input: {
      kind: "single-target",
      min: 1,
      max: 1,
      candidateEntityIds: pairEntityIds,
      targetZoneIds: [],
      options: [],
    },
    movePreview: movePreviewFor(action),
  };
}

function cardTitle(card: CardInstance): string {
  const definition = defOf(card);
  return definition.displayName ?? definition.name ?? String(card.instanceId);
}

function inputKindForEntitySelection(
  input: Extract<InteractionInput, { kind: "entity-selection" }>,
  action: InteractionAction,
): InteractionInputKind {
  if (input.role === "cost" || action.intent === "resource-card") return "payment";
  if (input.max > 1) return "multi-target";
  return "single-target";
}

function targetZonesForInput(
  input: Extract<InteractionInput, { kind: "entity-selection" }>,
  matchState: MatchState,
): string[] {
  // Derive target zones from candidate zone hints when available.
  const zones = new Set<string>();
  for (const candidate of input.candidates) {
    if (candidate.entity.zoneId) {
      zones.add(candidate.entity.zoneId);
      continue;
    }
    const card = matchState.G.cardIndex[candidate.entity.instanceId];
    if (card) {
      const side = sideForPlayerId(String(card.ownerId));
      if (!side) continue;
      const zone = currentCardZoneForEntity(card, matchState, side);
      if (zone) zones.add(cyberpunkZoneAnchorId(zone, side));
    }
  }
  return Array.from(zones);
}

function currentCardZoneForEntity(
  card: CardInstance,
  matchState: MatchState,
  side: Side,
): CyberpunkCardZone | null {
  const playerId = String(PLAYER_SIDE_TO_ID[side]);
  const player = matchState.G.players[playerId];
  if (!player) return null;
  const id = String(card.instanceId);
  if (cardIds(player.zones.hand).includes(id)) return "hand";
  if (cardIds(player.zones.field).includes(id)) return "field";
  if (cardIds(player.zones.legendArea).includes(id)) return "legendArea";
  if (cardIds(player.zones.trash).includes(id)) return "trash";
  if (cardIds(player.zones.eddieArea).includes(id)) return "eddieArea";
  if (cardIds(player.gigArea).includes(id)) return "gigArea";
  if (cardIds(player.zones.deck).includes(id)) return "deck";
  return null;
}

function movePreviewFor(action: InteractionAction): SimulatorInteraction["movePreview"] {
  return {
    engine: "cyberpunk",
    command: action.id,
    payload: JSON.stringify({ intent: action.intent, requestId: action.requestId }),
  };
}

function numberInputOptions(
  input: Extract<InteractionInput, { kind: "number" }>,
): InteractionOption[] {
  if (input.min === undefined || input.max === undefined) return [];
  const step = input.step ?? 1;
  const options: InteractionOption[] = [];
  for (let value = input.min; value <= input.max; value += step) {
    options.push({ id: String(value), label: String(value) });
  }
  return options;
}

function localizeText(text: {
  key: string;
  params?: Record<string, string | number | boolean>;
}): string {
  // Minimal localization fallback: use the key and any label param.
  const label = text.params?.label;
  if (typeof label === "string") return label;
  return text.key;
}

function projectEventLog(_matchState: MatchState, _viewerSide: Side): SimulatorEventLogEntry[] {
  // The engine doesn't expose a long-lived event log on MatchState. Return an empty
  // array here; callers that have move logs can append them separately.
  return [];
}

function projectTargetingIntents(
  matchState: MatchState,
  _viewerSide: Side,
): SimulatorTargetingIntent[] {
  // Derive declared attacks from the engine attack state when present.
  const attackState = (
    matchState.G as { attackState?: { attackerId?: string; defenderId?: string } }
  ).attackState;
  if (!attackState?.attackerId) return [];

  const sourceEntityId = String(attackState.attackerId);
  const targetEntityIds = attackState.defenderId ? [String(attackState.defenderId)] : [];

  return [
    {
      id: `attack:${sourceEntityId}`,
      sourceEntityId,
      targetEntityIds,
      targetZoneIds: [],
    },
  ];
}

function buildCyberpunkBoardLayout(seats: SimulatorSeat[]): BoardLayout {
  const [opponentSeat, playerSeat] =
    seats[0]?.perspective === "top"
      ? [seats[0], seats[1] ?? seats[0]]
      : [seats[1] ?? seats[0], seats[0]];

  return {
    title: "Cyberpunk board",
    summary:
      "Legends, gigs, eddies, field cards, programs, and dice arranged as a dense run console.",
    appearance: {
      variant: "dashboard",
      density: "compact",
      labelPlacement: "top",
    },
    buildingBlocks: [],
    sections: [
      {
        id: "cp-opponent",
        label: "Opponent",
        role: "opponent",
        blocks: [
          { id: "opp-seat", kind: "seat", label: "Rival", size: "wide", seatId: opponentSeat.id },
          {
            id: "opp-legend",
            kind: "zone",
            label: "Legend",
            size: "normal",
            zoneId: "opp-legendArea",
          },
          {
            id: "opp-gigs",
            kind: "zone",
            label: "Scored gigs",
            size: "wide",
            zoneId: "opp-gigArea",
          },
          {
            id: "opp-field",
            kind: "zone",
            label: "Field and programs",
            size: "wide",
            zoneId: "opp-field",
          },
          {
            id: "opp-eddies",
            kind: "zone",
            label: "Eddies",
            size: "normal",
            zoneId: "opp-eddieArea",
          },
          {
            id: "opp-street-cred",
            kind: "counter",
            label: "Street Cred",
            size: "compact",
            value: "0",
          },
          {
            id: "opp-fixer",
            kind: "zone",
            label: "Fixer dice",
            size: "normal",
            zoneId: "opp-fixer",
          },
          { id: "opp-deck", kind: "stack", label: "Deck", size: "compact", zoneId: "opp-deck" },
          { id: "opp-trash", kind: "stack", label: "Trash", size: "compact", zoneId: "opp-trash" },
          { id: "opp-hand", kind: "zone", label: "Hand", size: "full", zoneId: "opp-hand" },
        ],
      },
      {
        id: "cp-shared",
        label: "Run lane",
        role: "shared",
        layout: { columns: 8, flow: "row", span: "full" },
        blocks: [
          {
            id: "run-spotlight",
            kind: "spotlight",
            label: "Run target",
            size: "wide",
            entityIds: [],
          },
        ],
      },
      {
        id: "cp-player",
        label: "Player",
        role: "player",
        blocks: [
          { id: "p-seat", kind: "seat", label: "You", size: "wide", seatId: playerSeat.id },
          {
            id: "p-legend",
            kind: "zone",
            label: "Legend",
            size: "normal",
            zoneId: "p-legendArea",
          },
          {
            id: "p-field",
            kind: "zone",
            label: "Field and programs",
            size: "wide",
            zoneId: "p-field",
          },
          { id: "p-eddies", kind: "zone", label: "Eddies", size: "normal", zoneId: "p-eddieArea" },
          {
            id: "p-gig-dice",
            kind: "zone",
            label: "Gig dice",
            size: "normal",
            zoneId: "p-gigArea",
          },
          {
            id: "p-fixer",
            kind: "zone",
            label: "Fixer dice",
            size: "normal",
            zoneId: "p-fixer",
          },
          { id: "p-deck", kind: "stack", label: "Deck", size: "compact", zoneId: "p-deck" },
          { id: "p-trash", kind: "stack", label: "Trash", size: "compact", zoneId: "p-trash" },
          { id: "p-hand", kind: "zone", label: "Hand", size: "full", zoneId: "p-hand" },
        ],
      },
    ],
  };
}

export function cyberpunkZoneAnchorId(zone: CardZone, side: Side): string {
  const prefix = side === "player" ? "p" : "opp";
  switch (zone) {
    case "deck":
      return `${prefix}-deck`;
    case "hand":
      return `${prefix}-hand`;
    case "field":
      return `${prefix}-field`;
    case "trash":
      return `${prefix}-trash`;
    case "legendArea":
      return `${prefix}-legendArea`;
    case "eddieArea":
      return `${prefix}-eddieArea`;
    case "gigArea":
      return `${prefix}-gigArea`;
  }
}

export function cyberpunkCardZoneToSimulatorZone(zone: CardZone, side: Side): SimulatorZone {
  const ownerId = String(PLAYER_SIDE_TO_ID[side]);
  const id = cyberpunkZoneAnchorId(zone, side);
  switch (zone) {
    case "deck":
      return zoneDescriptor(id, "Deck", "deck", ownerId, "secret");
    case "hand":
      return zoneDescriptor(id, "Hand", "hand", ownerId, "private");
    case "field":
      return zoneDescriptor(id, "Field", "battlefield", ownerId, "public");
    case "trash":
      return zoneDescriptor(id, "Trash", "discard", ownerId, "public");
    case "legendArea":
      return zoneDescriptor(id, "Legends", "leader", ownerId, "private");
    case "eddieArea":
      return zoneDescriptor(id, "Eddies", "resource", ownerId, "private");
    case "gigArea":
      return zoneDescriptor(id, "Gigs", "score", ownerId, "public");
  }
}

function zoneDescriptor(
  id: string,
  label: string,
  role: SimulatorZone["role"],
  ownerId: string,
  visibility: SimulatorZone["visibility"],
): SimulatorZone {
  return {
    id,
    label,
    role,
    ownerId,
    visibility,
    entityIds: [],
    hint: label,
  };
}

export function sideForPlayerId(playerId: string | number | undefined): Side | null {
  if (playerId === undefined) return null;
  const str = String(playerId);
  if (str === String(PLAYER_SIDE_TO_ID.player)) return "player";
  if (str === String(PLAYER_SIDE_TO_ID.opponent)) return "opponent";
  return null;
}

function phaseLabel(phase: string): string {
  switch (phase) {
    case "setup":
      return "Setup";
    case "start":
      return "Start";
    case "main":
      return "Main";
    case "end":
      return "End";
    default:
      return phase;
  }
}
