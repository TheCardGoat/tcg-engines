import type { FilteredMatchView, MatchState } from "../runtime";
import type { ZoneConfig } from "../runtime/match-runtime.types";
import type { ZoneRegistry } from "../runtime/zone-registry";
import type {
  EngineActiveEffectProjection,
  EngineActorContext,
  EngineBoardProjection,
  EnginePendingEffectProjection,
  EngineProjectionSnapshot,
} from "./contracts";
import type { LorcanaG } from "../../types/runtime-state";

type ProjectableState = MatchState | FilteredMatchView;
type ProjectionCardMeta = Record<string, unknown>;
type ProjectionCardMetaStore = Record<string, ProjectionCardMeta>;
type ProjectionCardIndexEntry = {
  zoneKey: string;
  index?: number;
  ownerID: string;
  controllerID: string;
};
type ProjectionZoneDefs = Record<
  string,
  {
    id: string;
    name: string;
    visibility: "public" | "private" | "secret";
    ordered: boolean;
    ownerScoped: boolean;
    faceDown?: boolean;
    maxSize?: number;
  }
>;
type ProjectionZoneSummaries = Record<string, { count: number }>;
type ProjectionPrivateZones = {
  zoneCards: Record<string, string[]>;
  cardIndex: Record<string, ProjectionCardIndexEntry>;
  cardMeta: ProjectionCardMetaStore;
};
type ProjectionGameShape = {
  continuousEffects?: { instances?: readonly unknown[] };
  activeEffects?: readonly unknown[];
  pendingEffects?: readonly unknown[];
  turnMetadata?: {
    pendingCostReductionsByPlayer?: Partial<Record<string, readonly unknown[]>>;
  };
  temporaryPlayerRestrictions?: {
    restrictionsByPlayer?: Partial<Record<string, Record<string, number>>>;
    startsByPlayer?: Partial<Record<string, Record<string, number>>>;
    payloadsByPlayer?: Partial<
      Record<
        string,
        Record<
          string,
          { type?: string; sourceId?: string; duration?: string; activeWhileSourceInPlay?: boolean }
        >
      >
    >;
  };
};
type ProjectionStackStorage = {
  _stackStorage?: {
    items: readonly unknown[];
  };
};
type EffectDescriptor = {
  id?: string;
  kind?: string;
  type?: string;
  sourceId?: string;
  sourceCardId?: string;
  targetId?: string;
  targetCardId?: string;
  targetPlayerId?: string;
  createdAtTurn?: number;
  startsAtTurn?: number;
  expiresAtTurn?: number;
};
type PendingChoicePayload = NonNullable<MatchState["ctx"]["priority"]["pendingChoice"]>;

const EMPTY_PRIVATE_ZONES: ProjectionPrivateZones = {
  zoneCards: {},
  cardIndex: {},
  cardMeta: {},
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toEffectDescriptor(value: unknown): EffectDescriptor | undefined {
  if (!isRecord(value)) {
    return undefined;
  }
  return value as EffectDescriptor;
}

function normalizeNumberMap(raw: unknown): Record<string, number> {
  if (!isRecord(raw)) {
    return {};
  }

  const normalized: Record<string, number> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "number" && Number.isFinite(value)) {
      normalized[key] = value;
    }
  }

  return normalized;
}

function normalizePayloadMap<T extends { type?: string }>(raw: unknown): Record<string, T> {
  if (!isRecord(raw)) {
    return {};
  }

  const normalized: Record<string, T> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (isRecord(value) && typeof value.type === "string" && value.type.trim().length > 0) {
      normalized[key] = value as T;
    }
  }

  return normalized;
}

function isCardInPlay(state: ProjectableState, cardId: string): boolean {
  const { cardIndex } = getStateZones(state);
  const zoneKey = cardIndex[cardId]?.zoneKey;
  return typeof zoneKey === "string" && (zoneKey === "play" || zoneKey.startsWith("play:"));
}

function isCardAtLocation(state: ProjectableState, cardId: string): boolean {
  const { cardMeta } = getStateZones(state);
  return typeof cardMeta[cardId]?.atLocationId === "string";
}

function isEffectWindowActive(
  startsAtTurn: number,
  expiresAtTurn: number,
  currentTurn: number,
): boolean {
  return currentTurn >= startsAtTurn && currentTurn <= expiresAtTurn;
}

function isTemporaryKeywordActive(
  state: ProjectableState,
  sourceId: string | undefined,
  activeWhileSourceInPlay: boolean | undefined,
): boolean {
  if (!activeWhileSourceInPlay || !sourceId) {
    return true;
  }

  return isCardInPlay(state, sourceId);
}

function isTemporaryRestrictionConditionActive(
  state: ProjectableState,
  cardId: string,
  rawCondition: unknown,
): boolean {
  if (!isRecord(rawCondition)) {
    return true;
  }

  const conditionType = rawCondition.type;
  if (conditionType === "not" && isRecord(rawCondition.condition)) {
    return !(rawCondition.condition.type === "at-location" && isCardAtLocation(state, cardId));
  }

  return true;
}

function toZoneConfig(zoneId: string, zoneDef?: ProjectionZoneDefs[string]): ZoneConfig {
  if (!zoneDef) {
    return {
      id: zoneId,
      name: zoneId,
      visibility: "private",
      ordered: false,
      ownerScoped: false,
    };
  }

  return {
    id: zoneDef.id,
    name: zoneDef.name,
    visibility: zoneDef.visibility,
    ordered: zoneDef.ordered,
    ownerScoped: zoneDef.ownerScoped,
    faceDown: zoneDef.faceDown,
    maxSize: zoneDef.maxSize,
  };
}

function getStateZones(state: ProjectableState): {
  zoneSummaries: ProjectionZoneSummaries;
  zoneCards: ProjectionPrivateZones["zoneCards"];
  cardIndex: ProjectionPrivateZones["cardIndex"];
  cardMeta: ProjectionPrivateZones["cardMeta"];
} {
  const zones = state.ctx.zones as {
    public: { zoneSummaries: ProjectionZoneSummaries };
    private?: ProjectionPrivateZones;
  };
  const privateZones = zones.private ?? EMPTY_PRIVATE_ZONES;
  return {
    zoneSummaries: zones.public.zoneSummaries,
    zoneCards: privateZones.zoneCards,
    cardIndex: privateZones.cardIndex,
    cardMeta: privateZones.cardMeta,
  };
}

export function buildEngineBoardProjection(
  state: ProjectableState,
  zoneRegistry: ZoneRegistry,
  options?: { resolveDefinitionId?: (cardId: string) => string | undefined },
): EngineBoardProjection {
  const { zoneSummaries, zoneCards, cardIndex, cardMeta } = getStateZones(state);
  const zoneDefs = zoneRegistry as ProjectionZoneDefs;
  const board: EngineBoardProjection = { cards: {}, zones: {} };
  const zoneIds = new Set<string>([
    ...Object.keys(zoneDefs),
    ...Object.keys(zoneSummaries),
    ...Object.keys(zoneCards),
  ]);

  for (const indexEntry of Object.values(cardIndex)) {
    const zoneKey = indexEntry.zoneKey;
    if (zoneKey.length > 0) {
      zoneIds.add(zoneKey);
    }
  }

  for (const zoneId of zoneIds) {
    const summary = zoneSummaries[zoneId];
    const visibleCards = zoneCards[zoneId] ?? [];
    board.zones[zoneId] = {
      zoneId,
      config: toZoneConfig(zoneId, zoneDefs[zoneId]),
      cards: [...visibleCards],
      count: typeof summary?.count === "number" ? summary.count : visibleCards.length,
    };
  }

  for (const [cardId, indexEntry] of Object.entries(cardIndex)) {
    const zoneId = indexEntry.zoneKey || "unknown";
    const zone = board.zones[zoneId] ?? {
      zoneId,
      config: toZoneConfig(zoneId, zoneDefs[zoneId]),
      cards: [],
      count: 0,
    };

    const zoneDef = zone.config;
    const hasExplicitVisibleCards = Object.prototype.hasOwnProperty.call(zoneCards, zoneId);
    const shouldBackfillFromCardIndex =
      zoneDef.visibility !== "private" || !hasExplicitVisibleCards;

    if (shouldBackfillFromCardIndex && !zone.cards.includes(cardId)) {
      zone.cards.push(cardId);
    }

    const summary = zoneSummaries[zoneId];
    if (typeof summary?.count !== "number") {
      zone.count = zone.cards.length;
    }
    board.zones[zoneId] = zone;

    const cardProjection = {
      instanceId: cardId,
      zoneId,
      definitionId: options?.resolveDefinitionId?.(cardId) ?? cardId,
      ownerId: indexEntry.ownerID,
      controllerId: indexEntry.controllerID,
      zoneIndex: typeof indexEntry.index === "number" ? indexEntry.index : undefined,
      meta: cardMeta[cardId],
    };
    board.cards[cardId] = cardProjection;
  }

  for (const zone of Object.values(board.zones)) {
    if (!zone.config.ordered || zone.cards.length <= 1) {
      continue;
    }

    zone.cards.sort((left, right) => {
      const leftIndex = board.cards[left]?.zoneIndex ?? Number.MAX_SAFE_INTEGER;
      const rightIndex = board.cards[right]?.zoneIndex ?? Number.MAX_SAFE_INTEGER;
      if (leftIndex !== rightIndex) {
        return leftIndex - rightIndex;
      }
      return left.localeCompare(right);
    });
  }

  return board;
}

function effectIdFromRecord(record: EffectDescriptor | undefined, fallback: string): string {
  const id = record?.id;
  return typeof id === "string" && id.length > 0 ? id : fallback;
}

function effectTypeFromRecord(record: EffectDescriptor | undefined, fallback: string): string {
  if (typeof record?.kind === "string" && record.kind.length > 0) {
    return record.kind;
  }
  if (typeof record?.type === "string" && record.type.length > 0) {
    return record.type;
  }
  return fallback;
}

export function extractActiveEffects(state: ProjectableState): EngineActiveEffectProjection[] {
  const game = state.G as LorcanaG & ProjectionGameShape;
  const currentTurn = state.ctx.status.turn ?? 1;
  const { cardMeta } = getStateZones(state);

  const effects: EngineActiveEffectProjection[] = [];
  const continuousInstances = game.continuousEffects?.instances ?? [];

  for (let index = 0; index < continuousInstances.length; index++) {
    const effect = continuousInstances[index];
    const effectRecord = toEffectDescriptor(effect);
    effects.push({
      id: effectIdFromRecord(effectRecord, `continuous:${index}`),
      type: effectTypeFromRecord(effectRecord, "continuous"),
      sourceId: typeof effectRecord?.sourceId === "string" ? effectRecord.sourceId : undefined,
      targetCardId:
        typeof effectRecord?.targetCardId === "string"
          ? effectRecord.targetCardId
          : typeof effectRecord?.targetId === "string"
            ? effectRecord.targetId
            : undefined,
      startsAtTurn:
        typeof effectRecord?.startsAtTurn === "number"
          ? effectRecord.startsAtTurn
          : typeof effectRecord?.createdAtTurn === "number"
            ? effectRecord.createdAtTurn
            : undefined,
      expiresAtTurn:
        typeof effectRecord?.expiresAtTurn === "number" ? effectRecord.expiresAtTurn : undefined,
      payload: effect,
    });
  }

  const activeEffects = game.activeEffects ?? [];
  for (let index = 0; index < activeEffects.length; index++) {
    const effect = activeEffects[index];
    const effectRecord = toEffectDescriptor(effect);
    effects.push({
      id: effectIdFromRecord(effectRecord, `active:${index}`),
      type: effectTypeFromRecord(effectRecord, "active"),
      sourceId: typeof effectRecord?.sourceId === "string" ? effectRecord.sourceId : undefined,
      targetCardId:
        typeof effectRecord?.targetCardId === "string"
          ? effectRecord.targetCardId
          : typeof effectRecord?.targetId === "string"
            ? effectRecord.targetId
            : undefined,
      targetPlayerId:
        typeof effectRecord?.targetPlayerId === "string" ? effectRecord.targetPlayerId : undefined,
      startsAtTurn:
        typeof effectRecord?.startsAtTurn === "number"
          ? effectRecord.startsAtTurn
          : typeof effectRecord?.createdAtTurn === "number"
            ? effectRecord.createdAtTurn
            : undefined,
      expiresAtTurn:
        typeof effectRecord?.expiresAtTurn === "number" ? effectRecord.expiresAtTurn : undefined,
      payload: effect,
    });
  }

  for (const [cardId, meta] of Object.entries(cardMeta)) {
    const temporaryKeywords = normalizeNumberMap(meta.temporaryKeywords);
    const temporaryKeywordStarts = normalizeNumberMap(meta.temporaryKeywordStarts);
    const temporaryKeywordValues = normalizeNumberMap(meta.temporaryKeywordValues);
    const temporaryKeywordPayloads = normalizePayloadMap<{
      type?: string;
      sourceId?: string;
      duration?: string;
      activeWhileSourceInPlay?: boolean;
    }>(meta.temporaryKeywordPayloads);

    for (const [keyword, expiresAtTurn] of Object.entries(temporaryKeywords)) {
      const startsAtTurn = temporaryKeywordStarts[keyword] ?? 1;
      const payload = temporaryKeywordPayloads[keyword];
      if (!isEffectWindowActive(startsAtTurn, expiresAtTurn, currentTurn)) {
        continue;
      }
      if (!isTemporaryKeywordActive(state, payload?.sourceId, payload?.activeWhileSourceInPlay)) {
        continue;
      }

      effects.push({
        id: `temporary-keyword:${cardId}:${keyword}`,
        type: "temporary-keyword",
        sourceId: payload?.sourceId,
        targetCardId: cardId,
        startsAtTurn,
        expiresAtTurn,
        payload: {
          kind: "temporary-keyword",
          keyword,
          value: temporaryKeywordValues[keyword],
          sourceId: payload?.sourceId,
          duration: payload?.duration,
          activeWhileSourceInPlay: payload?.activeWhileSourceInPlay,
          targetCardId: cardId,
        },
      });
    }

    const temporaryAbilities = normalizeNumberMap(meta.temporaryAbilities);
    const temporaryAbilityStarts = normalizeNumberMap(meta.temporaryAbilityStarts);
    const temporaryAbilityPayloads = normalizePayloadMap<{
      type?: string;
      name?: string;
      text?: string;
      sourceId?: string;
      duration?: string;
    }>(meta.temporaryAbilityPayloads);

    for (const [ability, expiresAtTurn] of Object.entries(temporaryAbilities)) {
      const startsAtTurn = temporaryAbilityStarts[ability] ?? 1;
      const payload = temporaryAbilityPayloads[ability];
      if (!isEffectWindowActive(startsAtTurn, expiresAtTurn, currentTurn)) {
        continue;
      }

      effects.push({
        id: `temporary-ability:${cardId}:${ability}`,
        type: "temporary-ability",
        sourceId: payload?.sourceId,
        targetCardId: cardId,
        startsAtTurn,
        expiresAtTurn,
        payload: {
          kind: "temporary-ability",
          ability,
          abilityName: payload?.name,
          abilityText: payload?.text,
          sourceId: payload?.sourceId,
          duration: payload?.duration,
          targetCardId: cardId,
        },
      });
    }

    const temporaryRestrictions = normalizeNumberMap(meta.temporaryRestrictions);
    const temporaryRestrictionStarts = normalizeNumberMap(meta.temporaryRestrictionStarts);
    const temporaryRestrictionPayloads = normalizePayloadMap<{
      type?: string;
      sourceId?: string;
      duration?: string;
      activeWhileSourceInPlay?: boolean;
      condition?: unknown;
    }>(meta.temporaryRestrictionPayloads);

    for (const [restriction, expiresAtTurn] of Object.entries(temporaryRestrictions)) {
      const startsAtTurn = temporaryRestrictionStarts[restriction] ?? 1;
      const payload = temporaryRestrictionPayloads[restriction];
      if (!isEffectWindowActive(startsAtTurn, expiresAtTurn, currentTurn)) {
        continue;
      }
      if (
        !isTemporaryKeywordActive(state, payload?.sourceId, payload?.activeWhileSourceInPlay) ||
        !isTemporaryRestrictionConditionActive(state, cardId, payload?.condition)
      ) {
        continue;
      }

      effects.push({
        id: `temporary-restriction:${cardId}:${restriction}`,
        type: "temporary-restriction",
        sourceId: payload?.sourceId,
        targetCardId: cardId,
        startsAtTurn,
        expiresAtTurn,
        payload: {
          kind: "temporary-restriction",
          restriction,
          sourceId: payload?.sourceId,
          duration: payload?.duration,
          activeWhileSourceInPlay: payload?.activeWhileSourceInPlay,
          targetCardId: cardId,
        },
      });
    }
  }

  const reductionsByPlayer = game.turnMetadata?.pendingCostReductionsByPlayer ?? {};
  for (const [playerId, entries] of Object.entries(reductionsByPlayer)) {
    if (!Array.isArray(entries)) {
      continue;
    }

    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index];
      if (!isRecord(entry)) {
        continue;
      }

      const amount = typeof entry.amount === "number" ? entry.amount : undefined;
      const expiresAtTurn =
        typeof entry.expiresAtTurn === "number" ? entry.expiresAtTurn : undefined;
      if (
        typeof amount !== "number" ||
        typeof expiresAtTurn !== "number" ||
        expiresAtTurn < currentTurn
      ) {
        continue;
      }

      effects.push({
        id:
          typeof entry.id === "string"
            ? entry.id
            : `player-cost-reduction:${playerId}:${index}:${String(entry.sourceId ?? "unknown")}`,
        type: "player-cost-reduction",
        sourceId: typeof entry.sourceId === "string" ? entry.sourceId : undefined,
        targetPlayerId: playerId,
        expiresAtTurn,
        payload: {
          kind: "player-cost-reduction",
          amount,
          cardType: typeof entry.cardType === "string" ? entry.cardType : undefined,
          classification: entry.classification,
          consumeOnUse: entry.consumeOnUse === true,
          expiresAtTurn,
          sourceId: typeof entry.sourceId === "string" ? entry.sourceId : undefined,
          targetPlayerId: playerId,
        },
      });
    }
  }

  const temporaryPlayerRestrictions = game.temporaryPlayerRestrictions;
  const playerRestrictionsByPlayer = temporaryPlayerRestrictions?.restrictionsByPlayer ?? {};
  const playerRestrictionStartsByPlayer = temporaryPlayerRestrictions?.startsByPlayer ?? {};
  const playerRestrictionPayloadsByPlayer = temporaryPlayerRestrictions?.payloadsByPlayer ?? {};
  for (const [playerId, restrictions] of Object.entries(playerRestrictionsByPlayer)) {
    const starts = normalizeNumberMap(playerRestrictionStartsByPlayer[playerId]);
    const payloads = normalizePayloadMap<{
      type?: string;
      sourceId?: string;
      duration?: string;
      activeWhileSourceInPlay?: boolean;
    }>(playerRestrictionPayloadsByPlayer[playerId]);

    for (const [restriction, expiresAtTurn] of Object.entries(normalizeNumberMap(restrictions))) {
      const startsAtTurn = starts[restriction] ?? 1;
      const payload = payloads[restriction];
      if (!isEffectWindowActive(startsAtTurn, expiresAtTurn, currentTurn)) {
        continue;
      }
      if (!isTemporaryKeywordActive(state, payload?.sourceId, payload?.activeWhileSourceInPlay)) {
        continue;
      }

      effects.push({
        id: `player-restriction:${playerId}:${restriction}`,
        type: "player-restriction",
        sourceId: payload?.sourceId,
        targetPlayerId: playerId,
        startsAtTurn,
        expiresAtTurn,
        payload: {
          kind: "player-restriction",
          restriction,
          sourceId: payload?.sourceId,
          duration: payload?.duration,
          activeWhileSourceInPlay: payload?.activeWhileSourceInPlay,
          targetPlayerId: playerId,
        },
      });
    }
  }

  return effects;
}

export function extractPendingEffects(state: ProjectableState): EnginePendingEffectProjection[] {
  const pendingEffects: EnginePendingEffectProjection[] = [];

  const pendingChoice = state.ctx.priority.pendingChoice;
  if (pendingChoice) {
    pendingEffects.push({
      id: effectIdFromRecord(pendingChoice, "priority:pending-choice"),
      type: effectTypeFromRecord(pendingChoice, "pending-choice"),
      source: "priority",
      sourceId: pendingChoice.playerID,
      payload: pendingChoice,
    });
  }

  const ctx = state.ctx as typeof state.ctx & ProjectionStackStorage;
  const stackItems = ctx._stackStorage?.items ?? [];
  for (let index = 0; index < stackItems.length; index++) {
    const item = stackItems[index];
    const itemRecord = toEffectDescriptor(item);
    pendingEffects.push({
      id: effectIdFromRecord(itemRecord, `stack:${index}`),
      type: effectTypeFromRecord(itemRecord, "stack"),
      source: "stack",
      sourceId: typeof itemRecord?.sourceCardId === "string" ? itemRecord.sourceCardId : undefined,
      payload: item,
    });
  }

  const game = state.G as LorcanaG & ProjectionGameShape;
  const gamePendingEffects = game.pendingEffects ?? [];
  for (let index = 0; index < gamePendingEffects.length; index++) {
    const effect = gamePendingEffects[index];
    const effectRecord = toEffectDescriptor(effect);
    pendingEffects.push({
      id: effectIdFromRecord(effectRecord, `pending:${index}`),
      type: effectTypeFromRecord(effectRecord, "pending"),
      source: "game",
      sourceId: typeof effectRecord?.sourceId === "string" ? effectRecord.sourceId : undefined,
      payload: effect,
    });
  }

  return pendingEffects;
}

export function buildEngineProjectionSnapshot(
  state: ProjectableState,
  actorContext: EngineActorContext,
  zoneRegistry: ZoneRegistry,
  options?: { resolveDefinitionId?: (cardId: string) => string | undefined },
): EngineProjectionSnapshot {
  return {
    stateID: state.ctx._stateID,
    actor: actorContext,
    activeEffects: extractActiveEffects(state),
    pendingEffects: extractPendingEffects(state),
    board: buildEngineBoardProjection(state, zoneRegistry, options),
  };
}
