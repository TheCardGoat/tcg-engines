import type { BaseCardDefinition } from "./card-contracts";
import type { LorcanaG } from "../../types/runtime-state";
import type { MatchRuntimeConfig, Player, ZoneDefinitions } from "./match-runtime.types";
import {
  createInitialTCGCtx,
  type CtxPriority,
  type CtxStatus,
  type FilteredMatchView,
  type MatchState,
  type PlayerId,
} from "./types";
import type {
  FilteredCtxRandom,
  PublicZoneSummary,
  TimeContext,
  ViewRoleContext,
  ZoneCardIndexEntry,
  ZoneRuntimeDef,
} from "./types";
import type { MatchStaticResources } from "./static-resources";
import { buildZoneRegistry, zoneOwnerFromKey } from "./zone-registry";

import type { MoveRecord } from "./match-runtime.types";

type CompactZoneCardIndexEntry = Partial<ZoneCardIndexEntry>;

type CompactZoneRuntimeState = {
  public?: {
    zoneSummaries?: Record<string, PublicZoneSummary>;
  };
  private?: {
    zoneCards?: Record<string, string[]>;
    cardIndex?: Record<string, CompactZoneCardIndexEntry>;
    cardMeta?: Record<string, Record<string, unknown>>;
  };
  reveals?: {
    active?: Array<Record<string, unknown>>;
    nextSeq?: number;
  };
};

type CompactTCGCtx = {
  status?: Partial<CtxStatus>;
  priority?: Partial<CtxPriority>;
  zones?: CompactZoneRuntimeState;
  time?: TimeContext;
  random?: Partial<FilteredCtxRandom>;
};

export type CompactMatchView = {
  G?: Partial<LorcanaG>;
  ctx?: CompactTCGCtx;
};

export type NetworkMatchView = MatchState | FilteredMatchView | CompactMatchView;

export interface NetworkMatchData {
  gameID: string;
  rulesetHash: string;
  playerIds: string[];
  spectatorPolicy?: "public" | "private" | "judges-only";
}

type NormalizationBaseline = {
  ctxDefaults: ReturnType<typeof createInitialTCGCtx>;
  defaultGame: unknown;
  zoneDefs: Record<string, ZoneRuntimeDef>;
  visibleZoneCards: Record<string, string[]>;
  zoneSummaries: Record<string, PublicZoneSummary>;
};

const normalizationBaselineCache = new WeakMap<object, Map<string, NormalizationBaseline>>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMergeDefaults<T>(base: T, patch: unknown): T {
  if (patch === undefined) {
    return base;
  }

  if (Array.isArray(base)) {
    return (Array.isArray(patch) ? [...patch] : [...base]) as T;
  }

  if (!isRecord(base) || !isRecord(patch)) {
    return patch as T;
  }

  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    const current = result[key];
    if (Array.isArray(value)) {
      result[key] = [...value];
      continue;
    }

    if (isRecord(value) && isRecord(current)) {
      result[key] = deepMergeDefaults(current, value);
      continue;
    }

    result[key] = value;
  }
  return result as T;
}

function getNormalizationBaseline(
  runtimeConfig: MatchRuntimeConfig,
  staticResources: MatchStaticResources,
  roleCtx: ViewRoleContext,
  matchData: NetworkMatchData,
  message: { matchID: string },
): NormalizationBaseline {
  const roleKey =
    roleCtx.role === "player" ? `${roleCtx.role}:${roleCtx.playerID ?? ""}` : roleCtx.role;
  const cacheKey = [
    message.matchID,
    matchData.gameID,
    matchData.rulesetHash,
    matchData.playerIds.join(","),
    roleKey,
  ].join("|");
  const existing = normalizationBaselineCache.get(runtimeConfig)?.get(cacheKey);
  if (existing) {
    return existing;
  }

  const zoneDefs = buildZoneRegistry(runtimeConfig.zones, matchData.playerIds);
  const ctxDefaults = createInitialTCGCtx({
    matchID: message.matchID,
    gameID: matchData.gameID,
    rulesetHash: matchData.rulesetHash,
    players: matchData.playerIds.map((id) => ({ id: id as PlayerId })),
    statusConfig: extractInitialStatusConfig(runtimeConfig),
  });
  ctxDefaults.playerIds = [...matchData.playerIds] as PlayerId[];

  const baseline: NormalizationBaseline = {
    ctxDefaults,
    defaultGame: buildDefaultGameState(runtimeConfig, staticResources, matchData.playerIds),
    zoneDefs,
    visibleZoneCards: buildVisibleZoneDefaults(zoneDefs, roleCtx),
    zoneSummaries: Object.fromEntries(
      Object.keys(zoneDefs).map((zoneId) => [zoneId, { revision: 0, count: 0 }]),
    ),
  };

  const cacheForConfig = normalizationBaselineCache.get(runtimeConfig) ?? new Map();
  cacheForConfig.set(cacheKey, baseline);
  normalizationBaselineCache.set(runtimeConfig, cacheForConfig);
  return baseline;
}

function stripUndefined<T extends Record<string, unknown>>(value: T): Partial<T> {
  const next: Partial<T> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (entry !== undefined) {
      next[key as keyof T] = entry as T[keyof T];
    }
  }
  return next;
}

function extractInitialStatusConfig(config: MatchRuntimeConfig): {
  initialGameSegment?: string;
  initialPhase?: string;
} {
  const segmentId = config.flow.initialGameSegment ?? Object.keys(config.flow.gameSegments)[0];
  const segment = segmentId ? config.flow.gameSegments[segmentId] : undefined;
  return {
    initialGameSegment: segmentId,
    initialPhase: segment?.turn?.initialPhase,
  };
}

export function buildZoneDefsFromConfig(
  zones: ZoneDefinitions,
  playerIds: readonly string[],
): Record<string, ZoneRuntimeDef> {
  return buildZoneRegistry(zones, playerIds);
}

function getStaticInstanceRecords(
  staticResources: MatchStaticResources,
): Array<{ instanceId: string; ownerID: string }> {
  if (typeof staticResources.instances.entries !== "function") {
    return [];
  }

  return Array.from(staticResources.instances.entries()).map((record) => ({
    instanceId: record.instanceId,
    ownerID: record.ownerID,
  }));
}

function inferHiddenOwnerCardIndexEntries(
  cardIndex: Record<string, ZoneCardIndexEntry>,
  cardMeta: Record<string, Record<string, unknown>>,
  zoneDefs: Record<string, ZoneRuntimeDef>,
  staticResources: MatchStaticResources,
  roleCtx: ViewRoleContext,
): void {
  if (roleCtx.role !== "player" || !roleCtx.playerID) {
    return;
  }

  const playerID = roleCtx.playerID;
  const inferredLimboCards = new Set<string>();
  for (const meta of Object.values(cardMeta)) {
    const cardsUnder = meta?.cardsUnder;
    if (!Array.isArray(cardsUnder)) {
      continue;
    }

    for (const cardId of cardsUnder) {
      if (typeof cardId === "string") {
        inferredLimboCards.add(cardId);
      }
    }
  }

  const secretOwnerZones = Object.keys(zoneDefs).filter((zoneKey) => {
    const zoneDef = zoneDefs[zoneKey];
    return (
      zoneDef?.visibility === "secret" &&
      zoneDef.ownerScoped &&
      zoneOwnerFromKey(zoneKey) === playerID
    );
  });
  const defaultSecretZone = secretOwnerZones.length === 1 ? secretOwnerZones[0] : undefined;

  let nextLimboIndex = Math.max(
    -1,
    ...Object.values(cardIndex)
      .filter((entry) => entry.zoneKey === "limbo" && typeof entry.index === "number")
      .map((entry) => entry.index as number),
  );
  let nextSecretIndex = Math.max(
    -1,
    ...Object.values(cardIndex)
      .filter((entry) => entry.zoneKey === defaultSecretZone && typeof entry.index === "number")
      .map((entry) => entry.index as number),
  );

  for (const record of getStaticInstanceRecords(staticResources)) {
    if (record.ownerID !== playerID || cardIndex[record.instanceId]) {
      continue;
    }

    if (inferredLimboCards.has(record.instanceId)) {
      nextLimboIndex += 1;
      cardIndex[record.instanceId] = {
        zoneKey: "limbo" as ZoneCardIndexEntry["zoneKey"],
        ownerID: playerID as PlayerId,
        controllerID: playerID as PlayerId,
        index: nextLimboIndex,
      };
      continue;
    }

    if (!defaultSecretZone) {
      continue;
    }

    nextSecretIndex += 1;
    cardIndex[record.instanceId] = {
      zoneKey: defaultSecretZone as ZoneCardIndexEntry["zoneKey"],
      ownerID: playerID as PlayerId,
      controllerID: playerID as PlayerId,
      index: nextSecretIndex,
    };
  }
}

function buildVisibleZoneDefaults(
  zoneDefs: Record<string, ZoneRuntimeDef>,
  roleCtx: ViewRoleContext,
): Record<string, string[]> {
  if (roleCtx.role === "judge") {
    return Object.fromEntries(Object.keys(zoneDefs).map((zoneId) => [zoneId, []]));
  }

  if (roleCtx.role !== "player" || !roleCtx.playerID) {
    return {};
  }

  const zoneCards: Record<string, string[]> = {};
  for (const [zoneId, zoneDef] of Object.entries(zoneDefs)) {
    if (zoneDef.visibility === "public") {
      zoneCards[zoneId] = [];
      continue;
    }

    if (zoneDef.visibility === "private") {
      if (
        !zoneDef.ownerScoped ||
        !zoneId.includes(":") ||
        zoneOwnerFromKey(zoneId) === roleCtx.playerID
      ) {
        zoneCards[zoneId] = [];
      }
      continue;
    }

    if (
      zoneDef.visibility === "secret" &&
      zoneDef.ownerScoped &&
      zoneId.includes(":") &&
      zoneOwnerFromKey(zoneId) === roleCtx.playerID
    ) {
      zoneCards[zoneId] = [];
    }
  }

  return zoneCards;
}

function buildVisibleZoneMap(zoneCards: Record<string, string[]>): Map<string, string[]> {
  const visibleZones = new Map<string, string[]>();
  for (const [zoneKey, cardIds] of Object.entries(zoneCards)) {
    for (const cardId of cardIds) {
      const zones = visibleZones.get(cardId) ?? [];
      zones.push(zoneKey);
      visibleZones.set(cardId, zones);
    }
  }
  return visibleZones;
}

function deriveAggregateSummaries(
  zoneDefs: Record<string, ZoneRuntimeDef>,
  zoneSummaries: Record<string, PublicZoneSummary>,
  playerIds: readonly string[],
): void {
  for (const [zoneId, zoneDef] of Object.entries(zoneDefs)) {
    if (!zoneDef.ownerScoped || zoneId.includes(":")) {
      continue;
    }

    const scopedSummaries = playerIds
      .map((playerId) => zoneSummaries[`${zoneId}:${playerId}`])
      .filter((summary): summary is PublicZoneSummary => summary !== undefined);

    if (scopedSummaries.length === 0) {
      continue;
    }

    zoneSummaries[zoneId] = {
      count: scopedSummaries.reduce((sum, summary) => sum + summary.count, 0),
      revision: Math.max(...scopedSummaries.map((summary) => summary.revision)),
      topPublicCardID: [...scopedSummaries].reverse().find((summary) => summary.topPublicCardID)
        ?.topPublicCardID,
    };
  }
}

function buildDefaultGameState(
  runtimeConfig: MatchRuntimeConfig,
  staticResources: MatchStaticResources,
  playerIds: readonly string[],
): LorcanaG {
  const players: Player[] = playerIds.map((id) => ({ id: id as PlayerId }));
  return runtimeConfig.setup({ players, staticResources });
}

export function compactCoreNetworkView(
  state: FilteredMatchView,
  zoneRegistry: Record<string, ZoneRuntimeDef>,
  _staticResources?: MatchStaticResources,
): CompactMatchView {
  const zoneSummaries: Record<string, PublicZoneSummary> = {};

  for (const [zoneId, summary] of Object.entries(state.ctx.zones.public.zoneSummaries)) {
    const zoneDef = zoneRegistry[zoneId];
    if (zoneDef?.ownerScoped && !zoneId.includes(":")) {
      continue;
    }

    zoneSummaries[zoneId] = {
      revision: summary.revision,
      count: summary.count,
      ...(summary.topPublicCardID ? { topPublicCardID: summary.topPublicCardID } : {}),
    };
  }

  const compactState: CompactMatchView = {
    G: state.G as Partial<LorcanaG>,
    ctx: {
      status: stripUndefined({
        ...state.ctx.status,
        step: state.ctx.status.step === "" ? undefined : state.ctx.status.step,
        pendingMulligan:
          Array.isArray(state.ctx.status.pendingMulligan) &&
          state.ctx.status.pendingMulligan.length === 0
            ? undefined
            : state.ctx.status.pendingMulligan,
      }),
      priority: stripUndefined({
        ...state.ctx.priority,
        passSequence:
          Array.isArray(state.ctx.priority.passSequence) &&
          state.ctx.priority.passSequence.length === 0
            ? undefined
            : state.ctx.priority.passSequence,
      }),
      zones: {
        public: {
          zoneSummaries,
        },
      },
    },
  };

  const privateZones = state.ctx.zones.private;
  if (privateZones) {
    const compactZoneCards: Record<string, string[]> = {};
    for (const [zoneId, cards] of Object.entries(privateZones.zoneCards)) {
      if (cards.length > 0) {
        compactZoneCards[zoneId] = [...cards];
      }
    }

    const compactCardIndex: Record<string, CompactZoneCardIndexEntry> = {};
    for (const [cardId, entry] of Object.entries(privateZones.cardIndex)) {
      compactCardIndex[cardId] = {
        zoneKey: entry.zoneKey,
        ownerID: entry.ownerID,
        controllerID: entry.controllerID,
        ...(entry.index !== undefined ? { index: entry.index } : {}),
      };
    }

    const compactCardMeta: Record<string, Record<string, unknown>> = {};
    for (const [cardId, meta] of Object.entries(privateZones.cardMeta)) {
      if (isRecord(meta) && Object.keys(meta).length > 0) {
        compactCardMeta[cardId] = meta;
      }
    }

    if (
      Object.keys(compactZoneCards).length > 0 ||
      Object.keys(compactCardIndex).length > 0 ||
      Object.keys(compactCardMeta).length > 0
    ) {
      compactState.ctx!.zones!.private = {};
      if (Object.keys(compactZoneCards).length > 0) {
        compactState.ctx!.zones!.private.zoneCards = compactZoneCards;
      }
      if (Object.keys(compactCardIndex).length > 0) {
        compactState.ctx!.zones!.private.cardIndex = compactCardIndex;
      }
      if (Object.keys(compactCardMeta).length > 0) {
        compactState.ctx!.zones!.private.cardMeta = compactCardMeta;
      }
    }
  }

  const revealWindows = (
    state.ctx as unknown as { zones?: { reveals?: { active?: Array<Record<string, unknown>> } } }
  ).zones?.reveals?.active;
  if (revealWindows?.length) {
    compactState.ctx!.zones!.reveals = {
      active: [...revealWindows],
    };
  }

  if (state.ctx.time.mode !== "none") {
    compactState.ctx!.time = state.ctx.time;
  }

  return compactState;
}

export function normalizeNetworkView(
  state: NetworkMatchView,
  message: {
    stateID: number;
    matchID: string;
    protocolVersion: number;
  },
  runtimeConfig: MatchRuntimeConfig,
  staticResources: MatchStaticResources,
  roleCtx: ViewRoleContext,
  matchData?: NetworkMatchData,
): FilteredMatchView {
  if (
    isRecord(state) &&
    isRecord((state as { ctx?: unknown }).ctx) &&
    typeof (state as { ctx: { _stateID?: unknown } }).ctx._stateID === "number" &&
    isRecord((state as { ctx: { zones?: unknown } }).ctx.zones)
  ) {
    return state as FilteredMatchView;
  }

  if (!matchData) {
    throw new Error("Compact network state requires matchData");
  }

  const baseline = getNormalizationBaseline(
    runtimeConfig,
    staticResources,
    roleCtx,
    matchData,
    message,
  );
  const zoneDefs = baseline.zoneDefs;
  const ctxDefaults = {
    ...baseline.ctxDefaults,
    playerIds: [...baseline.ctxDefaults.playerIds],
    status: { ...baseline.ctxDefaults.status },
    priority: {
      ...baseline.ctxDefaults.priority,
      passSequence: [...baseline.ctxDefaults.priority.passSequence],
    },
    zones: {
      ...baseline.ctxDefaults.zones,
      public: {
        zoneSummaries: Object.fromEntries(
          Object.entries(baseline.zoneSummaries).map(([zoneId, summary]) => [
            zoneId,
            { ...summary },
          ]),
        ),
      },
      private: {
        zoneCards: Object.fromEntries(
          Object.entries(baseline.visibleZoneCards).map(([zoneId, cards]) => [zoneId, [...cards]]),
        ),
        cardIndex: {},
        cardMeta: {},
      },
      reveals: baseline.ctxDefaults.zones.reveals,
    },
    random: { ...baseline.ctxDefaults.random },
  };
  ctxDefaults.protocolVersion = message.protocolVersion;
  ctxDefaults._stateID = message.stateID;

  const compactState = state as CompactMatchView;
  const compactCtx = compactState.ctx ?? {};
  const compactZones = compactCtx.zones ?? {};
  const compactPublic = compactZones.public?.zoneSummaries ?? {};
  const zoneSummaries = {
    ...ctxDefaults.zones.public.zoneSummaries,
    ...compactPublic,
  };
  deriveAggregateSummaries(zoneDefs, zoneSummaries, matchData.playerIds);

  const zoneCards = {
    ...ctxDefaults.zones.private.zoneCards,
    ...compactZones.private?.zoneCards,
  };
  const cardMeta = {
    ...ctxDefaults.zones.private.cardMeta,
    ...compactZones.private?.cardMeta,
  };
  const visibleZoneMap = buildVisibleZoneMap(zoneCards);
  const compactCardIndex = compactZones.private?.cardIndex ?? {};
  const cardIndex: Record<string, ZoneCardIndexEntry> = {};

  for (const [cardId, partialEntry] of Object.entries(compactCardIndex)) {
    const visibleZones = visibleZoneMap.get(cardId) ?? [];
    const inferredZoneKey = visibleZones.length === 1 ? visibleZones[0] : undefined;
    const zoneKey = partialEntry.zoneKey ?? inferredZoneKey ?? "";
    const zoneDef = zoneDefs[zoneKey];
    const zoneOwner = zoneOwnerFromKey(zoneKey);
    const staticOwner = staticResources.instances.get(cardId)?.ownerID;
    const ownerID = (partialEntry.ownerID ?? zoneOwner ?? staticOwner ?? "unknown") as PlayerId;
    const controllerID = (partialEntry.controllerID ?? ownerID) as PlayerId;
    const ordered = zoneDef?.ordered ?? true;
    const inferredIndex =
      ordered && zoneKey && Array.isArray(zoneCards[zoneKey])
        ? zoneCards[zoneKey].indexOf(cardId)
        : undefined;

    cardIndex[cardId] = {
      zoneKey,
      ownerID,
      controllerID,
      ...(ordered && typeof (partialEntry.index ?? inferredIndex) === "number"
        ? { index: partialEntry.index ?? inferredIndex }
        : {}),
    };
  }

  for (const [zoneKey, cardIds] of Object.entries(zoneCards)) {
    const zoneDef = zoneDefs[zoneKey];
    const ordered = zoneDef?.ordered ?? true;
    const zoneOwner = zoneOwnerFromKey(zoneKey);
    for (let index = 0; index < cardIds.length; index++) {
      const cardId = cardIds[index];
      if (cardIndex[cardId]) {
        continue;
      }

      const ownerID = (staticResources.instances.get(cardId)?.ownerID ??
        zoneOwner ??
        "unknown") as PlayerId;
      cardIndex[cardId] = {
        zoneKey,
        ownerID,
        controllerID: ownerID,
        ...(ordered ? { index } : {}),
      };
    }
  }

  inferHiddenOwnerCardIndexEntries(cardIndex, cardMeta, zoneDefs, staticResources, roleCtx);

  const defaultGame = baseline.defaultGame as LorcanaG;

  return {
    G: deepMergeDefaults(defaultGame, compactState.G ?? {}),
    ctx: {
      ...ctxDefaults,
      status: {
        ...ctxDefaults.status,
        ...compactCtx.status,
      },
      priority: {
        ...ctxDefaults.priority,
        ...compactCtx.priority,
        passSequence:
          compactCtx.priority?.passSequence !== undefined
            ? [...compactCtx.priority.passSequence]
            : ctxDefaults.priority.passSequence,
      },
      zones: {
        ...ctxDefaults.zones,
        public: {
          zoneSummaries,
        },
        private: {
          zoneCards,
          cardIndex,
          cardMeta,
        },
      },
      time: compactCtx.time ?? ctxDefaults.time,
      random: {
        ...ctxDefaults.random,
        ...compactCtx.random,
      },
    },
  } as FilteredMatchView;
}
