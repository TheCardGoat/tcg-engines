import { grandArchiveObjectFace } from "../../game/card-runtime.ts";
import {
  deriveGrandArchiveNumericProperty,
  grandArchiveObjectCurrentCharacteristics,
} from "../../rules/state/continuous.ts";
import type { GrandArchiveObjectId, GrandArchivePlayerId } from "../../game/identity.ts";
import type { GrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveCardInstance, GrandArchiveMatchState } from "../../game/model.ts";
import { grandArchiveObjectActiveKeywords } from "../../rules/abilities/intrinsic-keywords.ts";
import {
  grandArchiveObjectEffectiveStates,
  grandArchiveObjectHasState,
} from "../../game/object-state.ts";
import { projectGrandArchiveViewerState } from "../../projection/view.ts";
import { buildGrandArchiveHeuristicHistory } from "./history.ts";
import type { GrandArchiveHeuristicCard, GrandArchiveHeuristicSnapshot } from "./types.ts";

export function buildGrandArchiveHeuristicSnapshot(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
): GrandArchiveHeuristicSnapshot {
  const zones = state.zones[playerId];
  if (!zones) throw new Error(`Cannot build a heuristic snapshot for unknown player ${playerId}.`);
  const viewer = projectGrandArchiveViewerState(program, state, playerId);
  const visibleObjectIds = new Set<GrandArchiveObjectId>();
  for (const player of viewer.players) {
    for (const zone of Object.values(player.zones)) {
      const visibleObjects = zone.visibility === "visible" ? zone.objects : zone.revealedObjects;
      for (const object of visibleObjects) visibleObjectIds.add(object.id);
    }
  }
  for (const objectId of state.sharedZones["effects-stack"]) {
    const object = state.objects[objectId];
    if (object && (object.facing === "face-up" || object.controllerId === playerId)) {
      visibleObjectIds.add(objectId);
    }
  }
  const cards = (ids: readonly GrandArchiveObjectId[]) =>
    ids.flatMap((id) => {
      const object = state.objects[id];
      if (!object || !visibleObjectIds.has(id)) return [];
      return [heuristicCard(program, state, object)];
    });
  const field = Object.values(state.objects)
    .filter(
      (object) =>
        object.zone === "field" &&
        object.controllerId === playerId &&
        visibleObjectIds.has(object.id),
    )
    .map((object) => heuristicCard(program, state, object));
  const visibleOpponentCards = Object.values(state.objects)
    .filter((object) => object.ownerId !== playerId && visibleObjectIds.has(object.id))
    .map((object) => heuristicCard(program, state, object));
  const opponentsField = Object.values(state.objects)
    .filter(
      (object) =>
        object.zone === "field" &&
        object.controllerId !== playerId &&
        visibleObjectIds.has(object.id),
    )
    .map((object) => heuristicCard(program, state, object));
  const playerSummary = (summaryPlayerId: GrandArchivePlayerId) => {
    const player = state.players[summaryPlayerId];
    if (!player) throw new Error(`Missing heuristic player state for ${summaryPlayerId}.`);
    const championPool = summaryPlayerId === playerId ? field : opponentsField;
    return {
      id: player.id,
      name: player.name,
      turnOrder: player.turnOrder,
      hasTakenFirstTurn: player.hasTakenFirstTurn,
      lost: player.lost,
      conceded: player.conceded,
      states: player.states,
      mastery: player.mastery
        ? { name: player.mastery.name, counters: player.mastery.counters }
        : null,
      champion:
        championPool.find(
          (card) => card.controllerId === summaryPlayerId && card.types.includes("CHAMPION"),
        ) ?? null,
    };
  };
  const self = playerSummary(playerId);
  return {
    playerId,
    mode: state.mode,
    matchStatus: state.status,
    winnerIds: state.winnerIds,
    gameStates: state.gameStates,
    self,
    opponents: state.turnOrder.filter((candidateId) => candidateId !== playerId).map(playerSummary),
    turnPlayerId: state.turn.playerId,
    isTurnPlayer: state.turn.playerId === playerId,
    phase: state.turn.phase,
    turnNumber: state.turn.number,
    stackDepth: state.stack.length,
    opportunityHolderId: state.opportunity?.holderId ?? null,
    decisionKind: state.decision?.playerId === playerId ? state.decision.kind : null,
    combat: state.combat
      ? {
          attackerId: state.combat.attackerId,
          attackingPlayerId: state.combat.attackingPlayerId,
          defendingPlayerIds: state.combat.defendingPlayerIds,
          targetIds: state.combat.targetIds,
          cleavePlayerId: state.combat.cleavePlayerId ?? null,
          retaliatorIds: state.combat.retaliatorIds,
          retaliationOrderConfirmed: state.combat.retaliationOrderConfirmed,
          weaponIds: state.combat.weaponIds,
          intentIds: state.combat.intentIds,
          step: state.combat.step,
          actorIsAttackingPlayer: state.combat.attackingPlayerId === playerId,
          actorIsDefendingPlayer: state.combat.defendingPlayerIds.includes(playerId),
        }
      : null,
    history: buildGrandArchiveHeuristicHistory(state, visibleObjectIds),
    mainDeckCount: zones["main-deck"].length,
    revealedMainDeckCards: cards(zones["main-deck"]),
    hand: cards(zones.hand),
    memory: cards(zones.memory),
    materialDeck: cards(zones["material-deck"]),
    graveyard: cards(zones.graveyard),
    banishment: cards(zones.banishment),
    field,
    intent: cards(zones.intent),
    pantheon: cards(zones.pantheon),
    innerLineage: cards(zones["inner-lineage"]),
    loaded: cards(zones.loaded),
    effectsStackCards: cards(state.sharedZones["effects-stack"]),
    opponentsField,
    visibleOpponentCards,
    champion: self.champion,
  };
}

export function grandArchiveHeuristicCardById(
  snapshot: GrandArchiveHeuristicSnapshot,
  objectId: GrandArchiveObjectId,
): GrandArchiveHeuristicCard | undefined {
  return [
    ...snapshot.hand,
    ...snapshot.memory,
    ...snapshot.materialDeck,
    ...snapshot.graveyard,
    ...snapshot.banishment,
    ...snapshot.field,
    ...snapshot.intent,
    ...snapshot.pantheon,
    ...snapshot.innerLineage,
    ...snapshot.loaded,
    ...snapshot.effectsStackCards,
    ...snapshot.opponentsField,
    ...snapshot.revealedMainDeckCards,
    ...snapshot.visibleOpponentCards,
  ].find((card) => card.id === objectId);
}

function heuristicCard(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
): GrandArchiveHeuristicCard {
  const face = grandArchiveObjectFace(program, object);
  const characteristics = grandArchiveObjectCurrentCharacteristics(program, state, object);
  const numeric = (property: "level" | "power" | "life" | "durability") =>
    deriveGrandArchiveNumericProperty(object, property, {
      program,
      state,
      controllerId: object.controllerId,
      sourceId: object.id,
      abilityBearerId: object.id,
      bindings: {},
    }) ?? null;
  return {
    id: object.id,
    definitionId: object.activeDefinitionId ?? object.definitionId,
    name: face.name,
    lineageName: face.lineageName ?? null,
    ownerId: object.ownerId,
    controllerId: object.controllerId,
    zone: object.zone,
    facing: object.facing,
    isToken: object.isToken,
    hostId: object.hostId ?? null,
    banishedBySourceId: object.banishedBy?.sourceId ?? null,
    supertypes: characteristics.supertypes,
    types: characteristics.types,
    classes: characteristics.classes,
    subtypes: characteristics.subtypes,
    elements: characteristics.elements,
    keywords: grandArchiveObjectActiveKeywords(program, state, object),
    states: grandArchiveObjectEffectiveStates(state, object),
    activationStates: object.activationStates,
    counters: object.counters,
    costKind: face.cost.kind,
    cost:
      face.cost.kind !== "none" && typeof face.cost.amount === "number" ? face.cost.amount : null,
    level: numeric("level"),
    power: numeric("power"),
    life: numeric("life"),
    durability: numeric("durability"),
    damage: object.damage,
    ready: grandArchiveObjectHasState(state, object, "awake"),
  };
}
