import { createCardCatalog } from "@tcg/cyberpunk-cards";
import type { CardZone } from "@tcg/cyberpunk-types";
import {
  CyberpunkTestEngine,
  createCardInstanceId,
  createEmptyPlayerState,
  createGigDieId,
  createInitialGameState,
  createMatchId,
  createPlayerId,
  setCardRegistry,
  type AttackKind,
  type AttackState,
  type AttackStep,
  type CardInstance,
  type DieType,
  type FilteredCardView,
  type FilteredMatchView,
  type GamePhase,
  type GigDie,
  type MatchState,
  type PlayerId,
} from "@tcg/cyberpunk-engine";

const liveMatchCatalog = createCardCatalog();

export type CyberpunkViewerState = MatchState | FilteredMatchView;

export function createLiveMatchViewerEngine(
  state: CyberpunkViewerState,
  matchId = "live-viewer",
): CyberpunkTestEngine {
  // Server-authored Cyberpunk states store card instance definitions by the
  // stable card UUID. Register the production bundle before hydrating the
  // local viewer engine so render-time lookups resolve ids from Redis
  // snapshots instead of relying on prior practice setup.
  setCardRegistry(liveMatchCatalog);
  return CyberpunkTestEngine.fromState(
    isMatchState(state) ? state : viewerProjectionToMatchState(state, matchId),
    { autoGainGig: false },
  );
}

/**
 * Rebuild the minimum read model required by the existing Cyberpunk renderer.
 * Hidden cards are represented by inert placeholder instances, so their counts
 * remain correct without restoring any private definition or instance data.
 * Legality always comes from the server-provided interaction view.
 */
export function viewerProjectionToMatchState(
  projection: FilteredMatchView,
  matchId = "live-viewer",
): MatchState {
  const G = createInitialGameState();
  const playerIds = Object.keys(projection.players).map(createPlayerId);
  const placeholderDefinitionId = hiddenCardPlaceholderDefinitionId();

  G.players = {};
  G.cardIndex = {};
  G.gigDice = {};

  for (const [playerIndex, [rawPlayerId, projectedPlayer]] of Object.entries(
    projection.players,
  ).entries()) {
    const playerId = createPlayerId(rawPlayerId);
    const player = createEmptyPlayerState(playerId, playerIndex === 0);
    player.eddies = projectedPlayer.eddies;
    player.spentEddies = Math.max(0, projectedPlayer.eddies - projectedPlayer.availableEddies);

    for (const zone of CARD_ZONES) {
      const projectedZone = projectedPlayer.zones[zone];
      const cards = Array.isArray(projectedZone)
        ? projectedZone
        : hiddenCards(rawPlayerId, zone, projectedZone ?? 0, placeholderDefinitionId);
      for (const card of cards) {
        const instance = cardInstanceFromProjection(card, playerId, placeholderDefinitionId);
        G.cardIndex[String(instance.instanceId)] = instance;
        player.zones[zone].push(instance.instanceId);
      }
    }

    player.eddieCardIds = [...player.zones.eddieArea];
    player.gigArea = diceFromProjection(
      projectedPlayer.zones.gigArea,
      playerId,
      "gigArea",
      G.gigDice,
    );
    player.fixerArea = diceFromProjection(
      projectedPlayer.zones.fixerArea,
      playerId,
      "fixerArea",
      G.gigDice,
    );
    G.players[rawPlayerId] = player;
  }

  G.gamePhase = gamePhase(projection.gamePhase);
  G.turnMetadata.turnNumber = projection.turnNumber;
  G.turnMetadata.activePlayerId = createPlayerId(projection.activePlayerId);
  G.turnMetadata.playedCardTypesThisTurn = Object.fromEntries(
    Object.entries(projection.playedCardTypesThisTurn).map(([playerId, types]) => [
      playerId,
      [...types],
    ]),
  );
  G.attackState = attackStateFromProjection(projection, G.players);
  G.gameEnded = projection.gameEnded;
  G.winnerId = projection.winnerId ? createPlayerId(projection.winnerId) : null;
  G.winReason = projection.winReason;

  return {
    G,
    ctx: {
      matchId: createMatchId(matchId),
      stateID: projection.stateID,
      playerIds,
      seed: "viewer-projection",
      rngState: null,
    },
  };
}

export function isFilteredMatchView(value: unknown): value is FilteredMatchView {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<FilteredMatchView>;
  return (
    Boolean(candidate.players && typeof candidate.players === "object") &&
    typeof candidate.gamePhase === "string" &&
    typeof candidate.turnNumber === "number" &&
    typeof candidate.activePlayerId === "string" &&
    typeof candidate.stateID === "number" &&
    Boolean(candidate.prompt && typeof candidate.prompt === "object")
  );
}

export function isMatchState(value: unknown): value is MatchState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<MatchState>;
  return Boolean(candidate.G && candidate.ctx);
}

const CARD_ZONES = ["deck", "hand", "field", "trash", "legendArea", "eddieArea"] as const;

function hiddenCardPlaceholderDefinitionId(): string {
  for (const [definitionId, definition] of liveMatchCatalog.entries()) {
    if (
      definition.type === "unit" &&
      definition.abilities.length === 0 &&
      definition.timingTriggers.length === 0 &&
      definition.keywords.length === 0
    ) {
      return definitionId;
    }
  }
  const first = liveMatchCatalog.entries().next().value;
  if (!first) throw new Error("Cyberpunk live viewer requires a non-empty card catalog.");
  return first[0];
}

function hiddenCards(
  playerId: string,
  zone: CardZone,
  count: number,
  definitionId: string,
): FilteredCardView[] {
  return Array.from({ length: Math.max(0, count) }, (_, index) => ({
    instanceId: `viewer-hidden:${playerId}:${zone}:${index}`,
    definitionId,
    cardName: null,
    zone,
    faceDown: true,
    spent: false,
    damage: 0,
    power: 0,
    effectivePower: 0,
    cost: null,
    type: null,
    classifications: [],
    hasSellTag: false,
    attachedGearIds: [],
    attachedToId: null,
    hasLag: false,
    hasAttackedThisTurn: false,
    grantedRules: [],
    keywords: [],
    triggerHints: [],
    abilityHints: [],
  }));
}

function cardInstanceFromProjection(
  card: FilteredCardView,
  ownerId: PlayerId,
  placeholderDefinitionId: string,
): CardInstance {
  return {
    instanceId: createCardInstanceId(card.instanceId),
    definitionId: card.definitionId || placeholderDefinitionId,
    ownerId,
    controllerId: ownerId,
    zone: card.zone,
    meta: {
      spent: card.spent,
      faceDown: card.faceDown,
      damage: card.damage,
      powerModifier: card.effectivePower - card.power,
      powerMultiplier: 1,
      counters: {},
      attachedGearIds: card.attachedGearIds.map(createCardInstanceId),
      attachedToId: card.attachedToId ? createCardInstanceId(card.attachedToId) : null,
      hasLag: card.hasLag,
      hasAttackedThisTurn: card.hasAttackedThisTurn,
    },
  };
}

function diceFromProjection(
  value: FilteredCardView[] | number | undefined,
  ownerId: PlayerId,
  location: "gigArea" | "fixerArea",
  index: Record<string, GigDie>,
) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((card) => {
    if (!isDieType(card.definitionId)) return [];
    const id = createGigDieId(card.instanceId);
    index[card.instanceId] = {
      id,
      dieType: card.definitionId,
      faceValue: card.power,
      location,
      ownerId,
    };
    return [id];
  });
}

function gamePhase(value: string): GamePhase {
  return value === "setup" || value === "start" || value === "main" || value === "end"
    ? value
    : "setup";
}

function attackStateFromProjection(
  projection: FilteredMatchView,
  players: MatchState["G"]["players"],
): AttackState | null {
  const attack = projection.attackState;
  if (!attack || !attack.attackerId || !isAttackKind(attack.kind) || !isAttackStep(attack.step)) {
    return null;
  }
  const attackerOwner = Object.entries(players).find(([, player]) =>
    player.zones.field.some((id) => String(id) === attack.attackerId),
  )?.[0];
  const rivalId = Object.keys(players).find((playerId) => playerId !== attackerOwner);
  if (!rivalId) return null;
  return {
    attackerId: createCardInstanceId(attack.attackerId),
    defenderId: attack.defenderId ? createCardInstanceId(attack.defenderId) : null,
    rivalId: createPlayerId(rivalId),
    kind: attack.kind,
    step: attack.step,
    redirectedByBlocker: attack.redirectedByBlocker,
  };
}

function isAttackKind(value: string): value is AttackKind {
  return value === "fight" || value === "direct";
}

function isAttackStep(value: string): value is AttackStep {
  return value === "attack" || value === "react" || value === "fight" || value === "steal";
}

function isDieType(value: string): value is DieType {
  return (
    value === "d4" ||
    value === "d6" ||
    value === "d8" ||
    value === "d10" ||
    value === "d12" ||
    value === "d20"
  );
}
