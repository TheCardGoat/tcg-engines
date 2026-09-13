import type { CommittedEvent, FabObjectSnapshot } from "@tcg/flesh-and-blood-engine/runtime";
import type { FabZone } from "@tcg/flesh-and-blood-types";
import { z } from "zod";

import {
  buildFabGameAnalytics,
  parseFabAnalyticsFactBatch,
  parseFabGameAnalytics,
  projectFabAnalyticsFacts,
  type FabAnalyticsCardRefV1,
  type FabAnalyticsFactV1,
  type FabAnalyticsPlayerSummaryV1,
  type FabAnalyticsPlayerSeedV1,
  type FabAnalyticsTurnPlayerSummaryV1,
  type FabGameAnalyticsV1,
} from "./analytics.ts";

export const FAB_ANALYTICS_SCHEMA_VERSION_V2 = 2 as const;

export type FabAnalyticsCardRefV2 = FabAnalyticsCardRefV1;

export type FabAnalyticsPlayOriginV2 = "hand" | "arsenal" | "banished" | "deck" | "graveyard";

export type FabAnalyticsZoneV2 =
  | "hand"
  | "deck"
  | "graveyard"
  | "banished"
  | "pitch"
  | "arsenal"
  | "soul"
  | "inventory"
  | "combat-chain"
  | "stack"
  | "permanent"
  | "hero"
  | "weapon"
  | "equipment-head"
  | "equipment-chest"
  | "equipment-arms"
  | "equipment-legs"
  | "under"
  | "arena"
  | "unknown";

export type FabAnalyticsDefenseOriginV2 =
  | FabAnalyticsZoneV2
  | "head"
  | "chest"
  | "arms"
  | "legs"
  | "weapon1"
  | "weapon2";

type VersionedLegacyFactV2<Fact> = Fact extends FabAnalyticsFactV1
  ? Omit<Fact, "schemaVersion"> & { readonly schemaVersion: typeof FAB_ANALYTICS_SCHEMA_VERSION_V2 }
  : never;

type UnchangedFabAnalyticsFactV2 = VersionedLegacyFactV2<
  Exclude<FabAnalyticsFactV1, { readonly kind: "card-played" | "card-pitched" | "card-defended" }>
>;

interface FabAnalyticsFactBaseV2 {
  readonly schemaVersion: typeof FAB_ANALYTICS_SCHEMA_VERSION_V2;
  readonly eventId: string;
  readonly turn: number;
  readonly activePlayerId: string | null;
  readonly phase: "start" | "action" | "end";
  readonly combatNumber: number | null;
  readonly chainLinkNumber: number | null;
}

export type FabAnalyticsFactV2 =
  | UnchangedFabAnalyticsFactV2
  | (FabAnalyticsFactBaseV2 & {
      readonly kind: "card-played";
      readonly playerId: string;
      readonly card: FabAnalyticsCardRefV2;
      readonly from: FabAnalyticsPlayOriginV2;
      readonly role: "action" | "instant" | "attack" | "attack-reaction" | "defense-reaction";
    })
  | (FabAnalyticsFactBaseV2 & {
      readonly kind: "card-pitched";
      readonly playerId: string;
      readonly card: FabAnalyticsCardRefV2;
      readonly from: "hand";
      readonly resourcesGenerated: number;
      readonly chiGenerated: number;
    })
  | (FabAnalyticsFactBaseV2 & {
      readonly kind: "card-defended";
      readonly playerId: string;
      readonly card: FabAnalyticsCardRefV2;
      readonly attack: FabAnalyticsCardRefV2;
      readonly from: FabAnalyticsDefenseOriginV2;
      readonly origin: FabAnalyticsDefenseOriginV2;
    })
  | (FabAnalyticsFactBaseV2 & {
      readonly kind: "card-drawn";
      readonly playerId: string;
      readonly card: FabAnalyticsCardRefV2;
      readonly reason: "draw-to-intellect" | "effect";
    })
  | (FabAnalyticsFactBaseV2 & {
      readonly kind: "card-moved";
      readonly playerId: string;
      readonly card: FabAnalyticsCardRefV2;
      readonly from: FabAnalyticsZoneV2;
      readonly to: FabAnalyticsZoneV2;
      readonly reason: string;
    });

export interface FabAnalyticsTransitionReceiptV2 {
  readonly schemaVersion: typeof FAB_ANALYTICS_SCHEMA_VERSION_V2;
  readonly commandId: string;
  readonly stateVersion: number;
  readonly timestamp: number;
  readonly facts: readonly FabAnalyticsFactV2[];
}

export interface FabAnalyticsPlayerSeedV2 extends FabAnalyticsPlayerSeedV1 {
  readonly seat: 1 | 2;
  readonly heroCanonicalId: string | null;
  readonly openingHand: readonly FabAnalyticsCardRefV2[];
}

export type FabHandActionKindV2 =
  | "drawn"
  | "played"
  | "pitched"
  | "defended"
  | "arsenaled"
  | "moved-from-hand"
  | "returned-to-hand";

export interface FabHandActionV2 {
  readonly sequence: number;
  readonly eventId: string;
  readonly turn: number;
  readonly kind: FabHandActionKindV2;
  readonly card: FabAnalyticsCardRefV2;
  readonly origin: FabAnalyticsZoneV2 | FabAnalyticsDefenseOriginV2 | null;
  readonly destination: FabAnalyticsZoneV2 | null;
  readonly role?: "action" | "instant" | "attack" | "attack-reaction" | "defense-reaction";
}

export interface FabHandCycleV2 {
  readonly cycle: number;
  readonly playerId: string;
  readonly openedAfterTurn: number | null;
  readonly openedBy: "opening-hand" | "draw-to-intellect";
  readonly startingCards: readonly FabAnalyticsCardRefV2[];
  readonly drawnCards: readonly FabAnalyticsCardRefV2[];
  readonly carriedCards: readonly FabAnalyticsCardRefV2[];
  readonly actions: readonly FabHandActionV2[];
  readonly endingCards: readonly FabAnalyticsCardRefV2[];
  readonly closedAfterTurn: number | null;
}

export type FabTurnActionV2 = FabHandActionV2;

export interface FabCardPlaysByOriginV2 {
  readonly hand: number;
  readonly arsenal: number;
  readonly banished: number;
  readonly deck: number;
  readonly graveyard: number;
}

export interface FabAnalyticsTurnPlayerSummaryV2 extends FabAnalyticsTurnPlayerSummaryV1 {
  readonly cardPlaysByOrigin: FabCardPlaysByOriginV2;
  readonly actions: readonly FabTurnActionV2[];
}

export interface FabAnalyticsTurnSummaryV2 {
  readonly turn: number;
  readonly activePlayerId: string;
  readonly completed: boolean;
  readonly players: Readonly<Record<string, FabAnalyticsTurnPlayerSummaryV2>>;
  readonly lifeAfter: Readonly<Record<string, number>>;
}

export interface FabAnalyticsPlayerSummaryV2 extends FabAnalyticsPlayerSummaryV1 {
  readonly seat: 1 | 2;
  readonly heroCanonicalId: string | null;
  readonly handCycles: readonly FabHandCycleV2[];
}

export interface FabAnalyticsCoverageV2 {
  readonly completeFromGameStart: boolean;
  readonly openingHandsComplete: boolean;
  readonly firstStateVersion: number | null;
  readonly lastStateVersion: number | null;
  readonly missingStateVersions: readonly number[];
  readonly duplicateStateVersions: readonly number[];
  readonly unresolvedCanonicalCardCount: number;
}

export interface FabGameAnalyticsV2 extends Omit<
  FabGameAnalyticsV1,
  "schemaVersion" | "players" | "turns" | "quality"
> {
  readonly schemaVersion: typeof FAB_ANALYTICS_SCHEMA_VERSION_V2;
  readonly quality: "authoritative" | "incomplete";
  readonly coverage: FabAnalyticsCoverageV2;
  readonly players: Readonly<Record<string, FabAnalyticsPlayerSummaryV2>>;
  readonly turns: readonly FabAnalyticsTurnSummaryV2[];
}

export interface FabPersistedGameAnalyticsV2 {
  readonly version: 2;
  readonly gameSlug: "flesh-and-blood";
  readonly gameId: string;
  readonly matchId: string;
  readonly dimensions: {
    readonly matchType: "ranked" | "casual" | "testing" | "practice_vs_bot" | "private";
    readonly format: "best_of_1" | "best_of_3";
    readonly queueFormatId?: string;
    readonly authority: "server" | "client";
    readonly gameNumber: number;
  };
  readonly summary: {
    readonly winnerId: string | null;
    readonly endReason: string | null;
    readonly totalTurns: number;
    readonly totalMoves: number;
    readonly durationMs: number;
    readonly createdAt: string;
    readonly completedAt: string;
  };
  readonly participants: readonly [
    {
      readonly playerId: string;
      readonly seat: 1;
      readonly displayName: string | null;
      readonly username: string | null;
    },
    {
      readonly playerId: string;
      readonly seat: 2;
      readonly displayName: string | null;
      readonly username: string | null;
    },
  ];
  readonly game: FabGameAnalyticsV2;
}

export type FabGameAnalytics = FabGameAnalyticsV2;

const analyticsCardRefSchema = z.object({
  canonicalId: z.string().nullable(),
  instanceId: z.string(),
  name: z.string(),
  ownerId: z.string(),
  controllerId: z.string().nullable(),
});

const factBaseSchema = z.object({
  schemaVersion: z.literal(FAB_ANALYTICS_SCHEMA_VERSION_V2),
  eventId: z.string(),
  turn: z.number().int().nonnegative(),
  activePlayerId: z.string().nullable(),
  phase: z.enum(["start", "action", "end"]),
  combatNumber: z.number().int().nullable(),
  chainLinkNumber: z.number().int().nullable(),
});

const playOriginSchema = z.enum(["hand", "arsenal", "banished", "deck", "graveyard"]);
const defenseOriginSchema = z.enum([
  "hand",
  "arsenal",
  "stack",
  "deck",
  "graveyard",
  "banished",
  "pitch",
  "soul",
  "inventory",
  "combat-chain",
  "permanent",
  "hero",
  "weapon",
  "equipment-head",
  "equipment-chest",
  "equipment-arms",
  "equipment-legs",
  "under",
  "arena",
  "unknown",
  "head",
  "chest",
  "arms",
  "legs",
  "weapon1",
  "weapon2",
]);
const zoneSchema = z.enum([
  "hand",
  "deck",
  "graveyard",
  "banished",
  "pitch",
  "arsenal",
  "soul",
  "inventory",
  "combat-chain",
  "stack",
  "permanent",
  "hero",
  "weapon",
  "equipment-head",
  "equipment-chest",
  "equipment-arms",
  "equipment-legs",
  "under",
  "arena",
  "unknown",
]);

const handActionSchema: z.ZodType<FabHandActionV2> = z.object({
  sequence: z.number().int().nonnegative(),
  eventId: z.string(),
  turn: z.number().int().nonnegative(),
  kind: z.enum([
    "drawn",
    "played",
    "pitched",
    "defended",
    "arsenaled",
    "moved-from-hand",
    "returned-to-hand",
  ]),
  card: analyticsCardRefSchema,
  origin: z.union([zoneSchema, defenseOriginSchema]).nullable(),
  destination: zoneSchema.nullable(),
  role: z.enum(["action", "instant", "attack", "attack-reaction", "defense-reaction"]).optional(),
});

const handCycleSchema: z.ZodType<FabHandCycleV2> = z.object({
  cycle: z.number().int().positive(),
  playerId: z.string(),
  openedAfterTurn: z.number().int().nonnegative().nullable(),
  openedBy: z.enum(["opening-hand", "draw-to-intellect"]),
  startingCards: z.array(analyticsCardRefSchema),
  drawnCards: z.array(analyticsCardRefSchema),
  carriedCards: z.array(analyticsCardRefSchema),
  actions: z.array(handActionSchema),
  endingCards: z.array(analyticsCardRefSchema),
  closedAfterTurn: z.number().int().nonnegative().nullable(),
});

const originCountsSchema: z.ZodType<FabCardPlaysByOriginV2> = z.object({
  hand: z.number().int().nonnegative(),
  arsenal: z.number().int().nonnegative(),
  banished: z.number().int().nonnegative(),
  deck: z.number().int().nonnegative(),
  graveyard: z.number().int().nonnegative(),
});

const coverageSchema: z.ZodType<FabAnalyticsCoverageV2> = z.object({
  completeFromGameStart: z.boolean(),
  openingHandsComplete: z.boolean(),
  firstStateVersion: z.number().int().nonnegative().nullable(),
  lastStateVersion: z.number().int().nonnegative().nullable(),
  missingStateVersions: z.array(z.number().int().positive()),
  duplicateStateVersions: z.array(z.number().int().positive()),
  unresolvedCanonicalCardCount: z.number().int().nonnegative(),
});

/** Validate a persisted or transported V2 aggregate without weakening the V1 scalar contract. */
export function parseFabGameAnalyticsV2(value: unknown): FabGameAnalyticsV2 {
  const root = z
    .object({
      schemaVersion: z.literal(FAB_ANALYTICS_SCHEMA_VERSION_V2),
      quality: z.enum(["authoritative", "incomplete"]),
      coverage: coverageSchema,
      players: z.record(z.string(), z.unknown()),
      turns: z.array(z.unknown()),
    })
    .passthrough()
    .parse(value);

  const playerAdditions = Object.fromEntries(
    Object.entries(root.players).map(([playerId, player]) => [
      playerId,
      z
        .object({
          seat: z.union([z.literal(1), z.literal(2)]),
          heroCanonicalId: z.string().nullable(),
          handCycles: z.array(handCycleSchema),
        })
        .parse(player),
    ]),
  );
  const turnAdditions = root.turns.map((turn) => {
    const parsed = z
      .object({
        players: z.record(z.string(), z.unknown()),
      })
      .parse(turn);
    return Object.fromEntries(
      Object.entries(parsed.players).map(([playerId, player]) => [
        playerId,
        z
          .object({
            cardPlaysByOrigin: originCountsSchema,
            actions: z.array(handActionSchema),
          })
          .parse(player),
      ]),
    );
  });

  const legacy = parseFabGameAnalytics({
    ...root,
    schemaVersion: 1,
    quality: "authoritative",
    players: Object.fromEntries(
      Object.entries(root.players).map(([playerId, player]) => {
        const parsed = z.record(z.string(), z.unknown()).parse(player);
        const {
          seat: _seat,
          heroCanonicalId: _heroCanonicalId,
          handCycles: _handCycles,
          ...base
        } = parsed;
        return [playerId, base];
      }),
    ),
    turns: root.turns.map((turn) => {
      const parsed = z.record(z.string(), z.unknown()).parse(turn);
      const players = z.record(z.string(), z.unknown()).parse(parsed.players);
      return {
        ...parsed,
        players: Object.fromEntries(
          Object.entries(players).map(([playerId, player]) => {
            const playerRecord = z.record(z.string(), z.unknown()).parse(player);
            const { cardPlaysByOrigin: _origins, actions: _actions, ...base } = playerRecord;
            return [playerId, base];
          }),
        ),
      };
    }),
  });

  return {
    ...legacy,
    schemaVersion: FAB_ANALYTICS_SCHEMA_VERSION_V2,
    quality: root.quality,
    coverage: root.coverage,
    players: Object.fromEntries(
      Object.entries(legacy.players).map(([playerId, player]) => [
        playerId,
        { ...player, ...playerAdditions[playerId]! },
      ]),
    ),
    turns: legacy.turns.map((turn, index) => ({
      ...turn,
      players: Object.fromEntries(
        Object.entries(turn.players).map(([playerId, player]) => [
          playerId,
          { ...player, ...turnAdditions[index]![playerId]! },
        ]),
      ),
    })),
  };
}

export function parseFabPersistedGameAnalyticsV2(value: unknown): FabPersistedGameAnalyticsV2 {
  const parsed = z
    .object({
      version: z.literal(2),
      gameSlug: z.literal("flesh-and-blood"),
      gameId: z.string(),
      matchId: z.string(),
      dimensions: z.object({
        matchType: z.enum(["ranked", "casual", "testing", "practice_vs_bot", "private"]),
        format: z.enum(["best_of_1", "best_of_3"]),
        queueFormatId: z.string().optional(),
        authority: z.enum(["server", "client"]),
        gameNumber: z.number().int().positive(),
      }),
      summary: z.object({
        winnerId: z.string().nullable(),
        endReason: z.string().nullable(),
        totalTurns: z.number().int().nonnegative(),
        totalMoves: z.number().int().nonnegative(),
        durationMs: z.number().nonnegative(),
        createdAt: z.string(),
        completedAt: z.string(),
      }),
      participants: z.tuple([
        z.object({
          playerId: z.string(),
          seat: z.literal(1),
          displayName: z.string().nullable(),
          username: z.string().nullable(),
        }),
        z.object({
          playerId: z.string(),
          seat: z.literal(2),
          displayName: z.string().nullable(),
          username: z.string().nullable(),
        }),
      ]),
      game: z.unknown(),
    })
    .parse(value);
  return { ...parsed, game: parseFabGameAnalyticsV2(parsed.game) };
}

const enrichedFactSchema = z.discriminatedUnion("kind", [
  factBaseSchema.extend({
    kind: z.literal("card-played"),
    playerId: z.string(),
    card: analyticsCardRefSchema,
    from: playOriginSchema,
    role: z.enum(["action", "instant", "attack", "attack-reaction", "defense-reaction"]),
  }),
  factBaseSchema.extend({
    kind: z.literal("card-pitched"),
    playerId: z.string(),
    card: analyticsCardRefSchema,
    from: z.literal("hand"),
    resourcesGenerated: z.number(),
    chiGenerated: z.number(),
  }),
  factBaseSchema.extend({
    kind: z.literal("card-defended"),
    playerId: z.string(),
    card: analyticsCardRefSchema,
    attack: analyticsCardRefSchema,
    from: defenseOriginSchema,
    origin: defenseOriginSchema,
  }),
  factBaseSchema.extend({
    kind: z.literal("card-drawn"),
    playerId: z.string(),
    card: analyticsCardRefSchema,
    reason: z.enum(["draw-to-intellect", "effect"]),
  }),
  factBaseSchema.extend({
    kind: z.literal("card-moved"),
    playerId: z.string(),
    card: analyticsCardRefSchema,
    from: zoneSchema,
    to: zoneSchema,
    reason: z.string(),
  }),
]);

function asV2LegacyFact(fact: FabAnalyticsFactV1): UnchangedFabAnalyticsFactV2 {
  return { ...fact, schemaVersion: FAB_ANALYTICS_SCHEMA_VERSION_V2 } as UnchangedFabAnalyticsFactV2;
}

function parseFabAnalyticsFactV2(value: unknown): FabAnalyticsFactV2 {
  const kind = z.object({ kind: z.string() }).parse(value).kind;
  if (
    kind === "card-played" ||
    kind === "card-pitched" ||
    kind === "card-defended" ||
    kind === "card-drawn" ||
    kind === "card-moved"
  ) {
    return enrichedFactSchema.parse(value);
  }
  const raw = z.record(z.string(), z.unknown()).parse(value);
  const legacyBatch = parseFabAnalyticsFactBatch({
    schemaVersion: 1,
    commandId: "validation",
    stateVersion: 0,
    timestamp: 0,
    facts: [{ ...raw, schemaVersion: 1 }],
  });
  const fact = legacyBatch.facts[0];
  if (
    !fact ||
    fact.kind === "card-played" ||
    fact.kind === "card-pitched" ||
    fact.kind === "card-defended"
  ) {
    throw new Error(`Invalid FAB analytics V2 fact: ${kind}`);
  }
  return asV2LegacyFact(fact);
}

export function parseFabAnalyticsTransitionReceiptV2(
  value: unknown,
): FabAnalyticsTransitionReceiptV2 {
  const parsed = z
    .object({
      schemaVersion: z.literal(FAB_ANALYTICS_SCHEMA_VERSION_V2),
      commandId: z.string(),
      stateVersion: z.number().int().nonnegative(),
      timestamp: z.number(),
      facts: z.array(z.unknown()),
    })
    .parse(value);
  return { ...parsed, facts: parsed.facts.map(parseFabAnalyticsFactV2) };
}

function baseFact(event: CommittedEvent): FabAnalyticsFactBaseV2 {
  return {
    schemaVersion: FAB_ANALYTICS_SCHEMA_VERSION_V2,
    eventId: event.eventId,
    turn: event.turnNumber,
    activePlayerId: event.context.turnPlayerId ?? null,
    phase: event.context.phase,
    combatNumber: event.context.combatNumber,
    chainLinkNumber: event.context.chainLinkNumber,
  };
}

function cardRef(object: FabObjectSnapshot): FabAnalyticsCardRefV2 {
  return {
    canonicalId: object.canonicalId,
    instanceId: object.instanceId,
    name: object.current.names.join(" // ") || "Unknown card",
    ownerId: object.ownerId,
    controllerId: object.controllerId,
  };
}

function playerForZoneMove(event: Extract<CommittedEvent, { readonly name: "move-zone" }>): string {
  return event.data.destinationPlayerId ?? event.controllerId ?? event.data.object.ownerId;
}

function playOrigin(from: FabZone): FabAnalyticsPlayOriginV2 {
  switch (from) {
    case "hand":
    case "arsenal":
    case "banished":
    case "deck":
    case "graveyard":
      return from;
    default:
      throw new Error(`FAB analytics cannot record an invalid play origin: ${from}`);
  }
}

/** Project one accepted FAB transition into stable, private analytics facts. */
export function projectFabAnalyticsFactsV2(
  events: readonly CommittedEvent[],
): readonly FabAnalyticsFactV2[] {
  return events.flatMap((event): readonly FabAnalyticsFactV2[] => {
    const base = baseFact(event);
    switch (event.name) {
      case "play":
        return [
          {
            ...base,
            kind: "card-played",
            playerId: event.data.actorId,
            card: cardRef(event.data.object),
            from: playOrigin(event.data.from),
            role: event.data.role,
          },
        ];
      case "pitch":
        return [
          {
            ...base,
            kind: "card-pitched",
            playerId: event.data.playerId,
            card: cardRef(event.data.object),
            from: "hand",
            resourcesGenerated: event.data.resourcesGenerated,
            chiGenerated: event.data.chiGenerated ?? 0,
          },
        ];
      case "defend":
        return [
          {
            ...base,
            kind: "card-defended",
            playerId: event.data.actorId,
            card: cardRef(event.data.object),
            attack: cardRef(event.data.attack),
            from: event.data.from,
            origin: event.data.origin,
          },
        ];
      case "draw":
        return [
          {
            ...base,
            kind: "card-drawn",
            playerId: event.data.playerId,
            card: cardRef(event.data.object),
            reason:
              event.cause.kind === "rule" && event.cause.rule === "end-phase-draw-to-intellect"
                ? "draw-to-intellect"
                : "effect",
          },
        ];
      case "move-zone":
        return [
          {
            ...base,
            kind: "card-moved",
            playerId: playerForZoneMove(event),
            card: cardRef(event.data.object),
            from: event.data.from,
            to: event.data.to,
            reason: event.data.reason,
          },
        ];
      case "discard":
        return [
          {
            ...base,
            kind: "card-moved",
            playerId: event.data.playerId,
            card: cardRef(event.data.object),
            from: "hand",
            to: "graveyard",
            reason: event.data.reason ?? "discard",
          },
        ];
      case "banish":
        return [
          {
            ...base,
            kind: "card-moved",
            playerId: event.controllerId ?? event.data.object.ownerId,
            card: cardRef(event.data.object),
            from: event.data.from,
            to: event.data.to,
            reason: event.data.reason,
          },
        ];
      default:
        return projectFabAnalyticsFacts([event]).map(asV2LegacyFact);
    }
  });
}

function asLegacyFact(fact: FabAnalyticsFactV2): FabAnalyticsFactV1 | null {
  switch (fact.kind) {
    case "card-drawn":
    case "card-moved":
      return null;
    case "card-played": {
      const { from: _from, ...legacy } = fact;
      return { ...legacy, schemaVersion: 1 };
    }
    case "card-pitched": {
      const { from: _from, ...legacy } = fact;
      return { ...legacy, schemaVersion: 1 };
    }
    case "card-defended": {
      const { from: _from, origin: _origin, ...legacy } = fact;
      return { ...legacy, schemaVersion: 1 };
    }
    default:
      return { ...fact, schemaVersion: 1 } as FabAnalyticsFactV1;
  }
}

function emptyOrigins(): FabCardPlaysByOriginV2 {
  return { hand: 0, arsenal: 0, banished: 0, deck: 0, graveyard: 0 };
}

interface MutableHandCycle {
  cycle: number;
  playerId: string;
  openedAfterTurn: number | null;
  openedBy: "opening-hand" | "draw-to-intellect";
  startingCards: FabAnalyticsCardRefV2[];
  drawnCards: FabAnalyticsCardRefV2[];
  carriedCards: FabAnalyticsCardRefV2[];
  actions: FabHandActionV2[];
  endingCards: FabAnalyticsCardRefV2[];
  closedAfterTurn: number | null;
}

function transitionCoverage(
  receipts: readonly FabAnalyticsTransitionReceiptV2[],
): Omit<FabAnalyticsCoverageV2, "unresolvedCanonicalCardCount" | "openingHandsComplete"> {
  if (receipts.length === 0) {
    return {
      completeFromGameStart: false,
      firstStateVersion: null,
      lastStateVersion: null,
      missingStateVersions: [],
      duplicateStateVersions: [],
    };
  }
  const counts = new Map<number, number>();
  for (const receipt of receipts) {
    counts.set(receipt.stateVersion, (counts.get(receipt.stateVersion) ?? 0) + 1);
  }
  const versions = [...counts.keys()].sort((left, right) => left - right);
  const last = versions.at(-1)!;
  const missing = Array.from({ length: last }, (_, index) => index + 1).filter(
    (version) => !counts.has(version),
  );
  const duplicates = versions.filter((version) => (counts.get(version) ?? 0) > 1);
  return {
    completeFromGameStart: versions[0] === 1 && missing.length === 0 && duplicates.length === 0,
    firstStateVersion: versions[0]!,
    lastStateVersion: last,
    missingStateVersions: missing,
    duplicateStateVersions: duplicates,
  };
}

function buildLifecycle(input: {
  readonly players: readonly FabAnalyticsPlayerSeedV2[];
  readonly receipts: readonly FabAnalyticsTransitionReceiptV2[];
  readonly legacy: FabGameAnalyticsV1;
}): {
  readonly players: FabGameAnalyticsV2["players"];
  readonly turns: FabGameAnalyticsV2["turns"];
  readonly unresolvedCanonicalCardCount: number;
} {
  const playerIds = input.players.map((player) => player.playerId);
  const handCards = new Map<string, Map<string, FabAnalyticsCardRefV2>>();
  const cycles = new Map<string, MutableHandCycle[]>();
  const cycleByInstance = new Map<string, MutableHandCycle>();
  const boundaryKeys = new Set<string>();
  let sequence = 0;
  let unresolvedCanonicalCardCount = 0;

  for (const seed of input.players) {
    const cards = new Map(seed.openingHand.map((card) => [card.instanceId, card]));
    handCards.set(seed.playerId, cards);
    const opening: MutableHandCycle = {
      cycle: 1,
      playerId: seed.playerId,
      openedAfterTurn: null,
      openedBy: "opening-hand",
      startingCards: [...seed.openingHand],
      drawnCards: [...seed.openingHand],
      carriedCards: [],
      actions: [],
      endingCards: [],
      closedAfterTurn: null,
    };
    cycles.set(seed.playerId, [opening]);
    for (const card of seed.openingHand) cycleByInstance.set(card.instanceId, opening);
  }

  const currentCycle = (playerId: string): MutableHandCycle | null =>
    cycles.get(playerId)?.at(-1) ?? null;
  const closeAndOpen = (playerId: string, afterTurn: number): void => {
    const key = `${playerId}:${afterTurn}`;
    if (boundaryKeys.has(key)) return;
    boundaryKeys.add(key);
    const current = currentCycle(playerId);
    const hand = handCards.get(playerId);
    if (!current || !hand) return;
    const carried = [...hand.values()];
    current.endingCards = carried;
    current.closedAfterTurn = afterTurn;
    const next: MutableHandCycle = {
      cycle: current.cycle + 1,
      playerId,
      openedAfterTurn: afterTurn,
      openedBy: "draw-to-intellect",
      startingCards: [...carried],
      drawnCards: [],
      carriedCards: [...carried],
      actions: [],
      endingCards: [],
      closedAfterTurn: null,
    };
    cycles.get(playerId)!.push(next);
    for (const card of carried) cycleByInstance.set(card.instanceId, next);
  };
  const appendAction = (
    playerId: string,
    fact: FabAnalyticsFactV2,
    action: Omit<FabHandActionV2, "sequence" | "eventId" | "turn">,
  ): FabHandActionV2 => {
    const complete: FabHandActionV2 = {
      ...action,
      sequence: sequence++,
      eventId: fact.eventId,
      turn: fact.turn,
    };
    (cycleByInstance.get(action.card.instanceId) ?? currentCycle(playerId))?.actions.push(complete);
    return complete;
  };

  const turnActions = new Map<string, FabTurnActionV2[]>();
  const turnOrigins = new Map<string, FabCardPlaysByOriginV2>();
  const addTurnAction = (playerId: string, turn: number, action: FabTurnActionV2): void => {
    const key = `${turn}:${playerId}`;
    const actions = turnActions.get(key) ?? [];
    actions.push(action);
    turnActions.set(key, actions);
  };

  const orderedReceipts = [...input.receipts].sort(
    (left, right) => left.stateVersion - right.stateVersion || left.timestamp - right.timestamp,
  );
  for (const receipt of orderedReceipts) {
    for (const fact of receipt.facts) {
      const card = "card" in fact ? fact.card : null;
      if (card?.canonicalId === null) unresolvedCanonicalCardCount += 1;
      switch (fact.kind) {
        case "card-drawn": {
          if (fact.reason === "draw-to-intellect") closeAndOpen(fact.playerId, fact.turn);
          const hand = handCards.get(fact.playerId);
          const cycle = currentCycle(fact.playerId);
          if (!hand || !cycle) break;
          hand.set(fact.card.instanceId, fact.card);
          cycle.drawnCards.push(fact.card);
          if (fact.reason === "draw-to-intellect") cycle.startingCards.push(fact.card);
          cycleByInstance.set(fact.card.instanceId, cycle);
          const action = appendAction(fact.playerId, fact, {
            kind: "drawn",
            card: fact.card,
            origin: "deck",
            destination: "hand",
          });
          addTurnAction(fact.playerId, fact.turn, action);
          break;
        }
        case "card-played": {
          if (fact.from === "hand") handCards.get(fact.playerId)?.delete(fact.card.instanceId);
          const action = appendAction(fact.playerId, fact, {
            kind: "played",
            card: fact.card,
            origin: fact.from,
            destination: "stack",
            role: fact.role,
          });
          addTurnAction(fact.playerId, fact.turn, action);
          const key = `${fact.turn}:${fact.playerId}`;
          const origins = turnOrigins.get(key) ?? emptyOrigins();
          turnOrigins.set(key, { ...origins, [fact.from]: origins[fact.from] + 1 });
          break;
        }
        case "card-pitched": {
          handCards.get(fact.playerId)?.delete(fact.card.instanceId);
          const action = appendAction(fact.playerId, fact, {
            kind: "pitched",
            card: fact.card,
            origin: "hand",
            destination: "pitch",
          });
          addTurnAction(fact.playerId, fact.turn, action);
          break;
        }
        case "card-defended": {
          if (fact.origin === "hand") handCards.get(fact.playerId)?.delete(fact.card.instanceId);
          const action = appendAction(fact.playerId, fact, {
            kind: "defended",
            card: fact.card,
            origin: fact.origin,
            destination: "combat-chain",
          });
          addTurnAction(fact.playerId, fact.turn, action);
          break;
        }
        case "card-moved": {
          // Zone-move facts identify the player that caused or received the
          // move. Effects such as Cullingsong can move an opposing card, so
          // that player is not necessarily the owner of the hand that changed.
          const handPlayerId =
            fact.from === "hand"
              ? (playerIds.find((playerId) => handCards.get(playerId)?.has(fact.card.instanceId)) ??
                fact.card.ownerId)
              : fact.to === "hand"
                ? fact.playerId
                : fact.card.ownerId;
          const hand = handCards.get(handPlayerId);
          if (!hand) break;
          if (fact.from === "hand") hand.delete(fact.card.instanceId);
          if (fact.to === "hand") {
            hand.set(fact.card.instanceId, fact.card);
            const cycle = currentCycle(handPlayerId);
            if (cycle && !cycleByInstance.has(fact.card.instanceId)) {
              cycleByInstance.set(fact.card.instanceId, cycle);
            }
          }
          if (fact.from !== "hand" && fact.to !== "hand") break;
          const kind: FabHandActionKindV2 =
            fact.from === "hand" && fact.to === "arsenal"
              ? "arsenaled"
              : fact.from === "hand"
                ? "moved-from-hand"
                : "returned-to-hand";
          const action = appendAction(handPlayerId, fact, {
            kind,
            card: fact.card,
            origin: fact.from,
            destination: fact.to,
          });
          addTurnAction(handPlayerId, fact.turn, action);
          break;
        }
        case "turn-completed": {
          const endedTurn = fact.nextTurn - 1;
          closeAndOpen(fact.playerId, endedTurn);
          if (endedTurn === 1) {
            for (const playerId of playerIds) closeAndOpen(playerId, endedTurn);
          }
          break;
        }
        default:
          break;
      }
    }
  }

  for (const playerId of playerIds) {
    const current = currentCycle(playerId);
    const hand = handCards.get(playerId);
    if (current && hand) current.endingCards = [...hand.values()];
  }

  const players = Object.fromEntries(
    input.players.map((seed) => [
      seed.playerId,
      {
        ...input.legacy.players[seed.playerId]!,
        seat: seed.seat,
        heroCanonicalId: seed.heroCanonicalId,
        handCycles: cycles.get(seed.playerId) ?? [],
      } satisfies FabAnalyticsPlayerSummaryV2,
    ]),
  );
  const turns = input.legacy.turns.map((turn) => ({
    ...turn,
    players: Object.fromEntries(
      Object.entries(turn.players).map(([playerId, summary]) => {
        const key = `${turn.turn}:${playerId}`;
        return [
          playerId,
          {
            ...summary,
            cardPlaysByOrigin: turnOrigins.get(key) ?? emptyOrigins(),
            actions: turnActions.get(key) ?? [],
          } satisfies FabAnalyticsTurnPlayerSummaryV2,
        ];
      }),
    ),
  }));
  return { players, turns, unresolvedCanonicalCardCount };
}

export function buildFabGameAnalyticsV2(input: {
  readonly gameId: string;
  readonly players: readonly FabAnalyticsPlayerSeedV2[];
  readonly initialTurnPlayerId: string;
  readonly startedAt: number;
  readonly completedAt?: number | null;
  readonly result?: {
    readonly winnerId: string | null;
    readonly loserId: string | null;
    readonly reason: string | null;
  };
  readonly transitionReceipts: readonly FabAnalyticsTransitionReceiptV2[];
  readonly openingHandsComplete?: boolean;
}): FabGameAnalyticsV2 {
  const legacy = buildFabGameAnalytics({
    ...input,
    players: input.players,
    factBatches: input.transitionReceipts.map((receipt) => ({
      ...receipt,
      schemaVersion: 1,
      facts: receipt.facts.flatMap((fact) => {
        const legacyFact = asLegacyFact(fact);
        return legacyFact ? [legacyFact] : [];
      }),
    })),
  });
  const lifecycle = buildLifecycle({
    players: input.players,
    receipts: input.transitionReceipts,
    legacy,
  });
  const baseCoverage = transitionCoverage(input.transitionReceipts);
  const openingHandsComplete = input.openingHandsComplete ?? true;
  const coverage: FabAnalyticsCoverageV2 = {
    ...baseCoverage,
    completeFromGameStart: baseCoverage.completeFromGameStart && openingHandsComplete,
    openingHandsComplete,
    unresolvedCanonicalCardCount: lifecycle.unresolvedCanonicalCardCount,
  };
  return {
    ...legacy,
    schemaVersion: FAB_ANALYTICS_SCHEMA_VERSION_V2,
    quality: coverage.completeFromGameStart ? "authoritative" : "incomplete",
    coverage,
    players: lifecycle.players,
    turns: lifecycle.turns,
  };
}
