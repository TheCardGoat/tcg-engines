import type { CommittedEvent, FabObjectSnapshot } from "@tcg/flesh-and-blood-engine/runtime";
import { z } from "zod";

export const FAB_ANALYTICS_SCHEMA_VERSION = 1 as const;

export interface FabAnalyticsCardRefV1 {
  readonly canonicalId: string | null;
  readonly instanceId: string;
  readonly name: string;
  readonly ownerId: string;
  readonly controllerId: string | null;
}

interface FabAnalyticsFactBaseV1 {
  readonly schemaVersion: typeof FAB_ANALYTICS_SCHEMA_VERSION;
  readonly eventId: string;
  readonly turn: number;
  readonly activePlayerId: string | null;
  readonly phase: "start" | "action" | "end";
  readonly combatNumber: number | null;
  readonly chainLinkNumber: number | null;
}

export type FabAnalyticsFactV1 =
  | (FabAnalyticsFactBaseV1 & {
      readonly kind: "card-played";
      readonly playerId: string;
      readonly card: FabAnalyticsCardRefV1;
      readonly role: "action" | "instant" | "attack" | "attack-reaction" | "defense-reaction";
    })
  | (FabAnalyticsFactBaseV1 & {
      readonly kind: "card-pitched";
      readonly playerId: string;
      readonly card: FabAnalyticsCardRefV1;
      readonly resourcesGenerated: number;
      readonly chiGenerated: number;
    })
  | (FabAnalyticsFactBaseV1 & {
      readonly kind: "card-defended";
      readonly playerId: string;
      readonly card: FabAnalyticsCardRefV1;
      readonly attack: FabAnalyticsCardRefV1;
    })
  | (FabAnalyticsFactBaseV1 & {
      readonly kind: "ability-activated";
      readonly playerId: string;
      readonly card: FabAnalyticsCardRefV1;
      readonly abilityId: string;
    })
  | (FabAnalyticsFactBaseV1 & {
      readonly kind: "assets-spent";
      readonly playerId: string;
      readonly resources: number;
      readonly chi: number;
      readonly life: number;
      readonly actionPoints: number;
    })
  | (FabAnalyticsFactBaseV1 & {
      readonly kind: "assets-gained";
      readonly playerId: string;
      readonly resources: number;
      readonly chi: number;
      readonly actionPoints: number;
    })
  | (FabAnalyticsFactBaseV1 & {
      readonly kind: "resources-paid";
      readonly playerId: string;
      readonly amount: number;
    })
  | (FabAnalyticsFactBaseV1 & {
      readonly kind: "combat-resolved";
      readonly attackingPlayerId: string;
      readonly defendingPlayerId: string;
      readonly attack: FabAnalyticsCardRefV1;
      readonly attackPower: number;
      readonly totalDefense: number;
      readonly unpreventedDamageBeforePrevention: number;
      readonly defenders: readonly {
        readonly card: FabAnalyticsCardRefV1;
        readonly defense: number;
      }[];
    })
  | (FabAnalyticsFactBaseV1 & {
      readonly kind: "damage-dealt";
      readonly sourcePlayerId: string | null;
      readonly source: FabAnalyticsCardRefV1 | null;
      readonly targetPlayerId: string | null;
      readonly amount: number;
      readonly damageType: "physical" | "arcane" | "generic";
    })
  | (FabAnalyticsFactBaseV1 & {
      readonly kind: "damage-prevented";
      readonly preventingPlayerId: string;
      readonly sourcePlayerId: string | null;
      readonly amount: number;
      readonly damageType: "physical" | "arcane" | "generic";
    })
  | (FabAnalyticsFactBaseV1 & {
      readonly kind: "attack-hit";
      readonly playerId: string;
      readonly attack: FabAnalyticsCardRefV1;
      readonly targetPlayerId: string | null;
      readonly damage: number;
    })
  | (FabAnalyticsFactBaseV1 & {
      readonly kind: "life-changed";
      readonly playerId: string;
      readonly direction: "gained" | "lost";
      readonly amount: number;
    })
  | (FabAnalyticsFactBaseV1 & {
      readonly kind: "turn-completed";
      readonly playerId: string;
      readonly nextPlayerId: string;
      readonly nextTurn: number;
    })
  | (FabAnalyticsFactBaseV1 & {
      readonly kind: "game-lost";
      readonly playerId: string;
      readonly reason: string;
    });

export interface FabAnalyticsFactBatchV1 {
  readonly schemaVersion: typeof FAB_ANALYTICS_SCHEMA_VERSION;
  readonly commandId: string;
  readonly stateVersion: number;
  readonly timestamp: number;
  readonly facts: readonly FabAnalyticsFactV1[];
}

const analyticsCardRefSchema: z.ZodType<FabAnalyticsCardRefV1> = z.object({
  canonicalId: z.string().nullable(),
  instanceId: z.string(),
  name: z.string(),
  ownerId: z.string(),
  controllerId: z.string().nullable(),
});

const analyticsFactBaseSchema = z.object({
  schemaVersion: z.literal(FAB_ANALYTICS_SCHEMA_VERSION),
  eventId: z.string(),
  turn: z.number().int().nonnegative(),
  activePlayerId: z.string().nullable(),
  phase: z.enum(["start", "action", "end"]),
  combatNumber: z.number().int().nullable(),
  chainLinkNumber: z.number().int().nullable(),
});

const analyticsFactSchema: z.ZodType<FabAnalyticsFactV1> = z.discriminatedUnion("kind", [
  analyticsFactBaseSchema.extend({
    kind: z.literal("card-played"),
    playerId: z.string(),
    card: analyticsCardRefSchema,
    role: z.enum(["action", "instant", "attack", "attack-reaction", "defense-reaction"]),
  }),
  analyticsFactBaseSchema.extend({
    kind: z.literal("card-pitched"),
    playerId: z.string(),
    card: analyticsCardRefSchema,
    resourcesGenerated: z.number(),
    chiGenerated: z.number(),
  }),
  analyticsFactBaseSchema.extend({
    kind: z.literal("card-defended"),
    playerId: z.string(),
    card: analyticsCardRefSchema,
    attack: analyticsCardRefSchema,
  }),
  analyticsFactBaseSchema.extend({
    kind: z.literal("ability-activated"),
    playerId: z.string(),
    card: analyticsCardRefSchema,
    abilityId: z.string(),
  }),
  analyticsFactBaseSchema.extend({
    kind: z.literal("assets-spent"),
    playerId: z.string(),
    resources: z.number(),
    chi: z.number(),
    life: z.number(),
    actionPoints: z.number(),
  }),
  analyticsFactBaseSchema.extend({
    kind: z.literal("assets-gained"),
    playerId: z.string(),
    resources: z.number(),
    chi: z.number(),
    actionPoints: z.number(),
  }),
  analyticsFactBaseSchema.extend({
    kind: z.literal("resources-paid"),
    playerId: z.string(),
    amount: z.number(),
  }),
  analyticsFactBaseSchema.extend({
    kind: z.literal("combat-resolved"),
    attackingPlayerId: z.string(),
    defendingPlayerId: z.string(),
    attack: analyticsCardRefSchema,
    attackPower: z.number(),
    totalDefense: z.number(),
    unpreventedDamageBeforePrevention: z.number(),
    defenders: z.array(z.object({ card: analyticsCardRefSchema, defense: z.number() })),
  }),
  analyticsFactBaseSchema.extend({
    kind: z.literal("damage-dealt"),
    sourcePlayerId: z.string().nullable(),
    source: analyticsCardRefSchema.nullable(),
    targetPlayerId: z.string().nullable(),
    amount: z.number(),
    damageType: z.enum(["physical", "arcane", "generic"]),
  }),
  analyticsFactBaseSchema.extend({
    kind: z.literal("damage-prevented"),
    preventingPlayerId: z.string(),
    sourcePlayerId: z.string().nullable(),
    amount: z.number(),
    damageType: z.enum(["physical", "arcane", "generic"]),
  }),
  analyticsFactBaseSchema.extend({
    kind: z.literal("attack-hit"),
    playerId: z.string(),
    attack: analyticsCardRefSchema,
    targetPlayerId: z.string().nullable(),
    damage: z.number(),
  }),
  analyticsFactBaseSchema.extend({
    kind: z.literal("life-changed"),
    playerId: z.string(),
    direction: z.enum(["gained", "lost"]),
    amount: z.number(),
  }),
  analyticsFactBaseSchema.extend({
    kind: z.literal("turn-completed"),
    playerId: z.string(),
    nextPlayerId: z.string(),
    nextTurn: z.number().int().nonnegative(),
  }),
  analyticsFactBaseSchema.extend({
    kind: z.literal("game-lost"),
    playerId: z.string(),
    reason: z.string(),
  }),
]);

const analyticsFactBatchSchema: z.ZodType<FabAnalyticsFactBatchV1> = z.object({
  schemaVersion: z.literal(FAB_ANALYTICS_SCHEMA_VERSION),
  commandId: z.string(),
  stateVersion: z.number().int().nonnegative(),
  timestamp: z.number(),
  facts: z.array(analyticsFactSchema),
});

export function parseFabAnalyticsFactBatch(value: unknown): FabAnalyticsFactBatchV1 {
  return analyticsFactBatchSchema.parse(value);
}

export interface FabAnalyticsPlayerSeedV1 {
  readonly playerId: string;
  readonly heroName: string;
  readonly initialLife: number;
}

export interface FabAnalyticsCardSummaryV1 {
  readonly canonicalId: string | null;
  readonly name: string;
  readonly played: number;
  readonly pitched: number;
  readonly defended: number;
  readonly hits: number;
  readonly finalDefense: number;
}

export interface FabAnalyticsTurnPlayerSummaryV1 {
  readonly playerId: string;
  readonly cardsPlayed: number;
  readonly cardsPitched: number;
  readonly cardsDefended: number;
  readonly resourcesGenerated: number;
  readonly resourcesSpent: number;
  readonly attackPowerThreatened: number;
  readonly attackDamageDealt: number;
  readonly totalDamageDealt: number;
  readonly damagePrevented: number;
  readonly defenseCommitted: number;
  readonly effectiveDefense: number;
  readonly overblock: number;
  readonly attacks: number;
  readonly hits: number;
}

export interface FabAnalyticsTurnSummaryV1 {
  readonly turn: number;
  readonly activePlayerId: string;
  readonly completed: boolean;
  readonly players: Readonly<Record<string, FabAnalyticsTurnPlayerSummaryV1>>;
  readonly lifeAfter: Readonly<Record<string, number>>;
}

export interface FabAnalyticsPlayerSummaryV1 extends FabAnalyticsTurnPlayerSummaryV1 {
  readonly heroName: string;
  readonly initialLife: number;
  readonly finalLife: number;
  readonly abilitiesActivated: number;
  readonly cards: readonly FabAnalyticsCardSummaryV1[];
}

export interface FabGameAnalyticsV1 {
  readonly schemaVersion: typeof FAB_ANALYTICS_SCHEMA_VERSION;
  readonly quality: "authoritative";
  readonly gameId: string;
  readonly startedAt: number;
  readonly completedAt: number | null;
  readonly durationSeconds: number | null;
  readonly players: Readonly<Record<string, FabAnalyticsPlayerSummaryV1>>;
  readonly turns: readonly FabAnalyticsTurnSummaryV1[];
  readonly winnerId: string | null;
  readonly loserId: string | null;
  readonly endReason: string | null;
}

const nonnegativeMetricSchema = z.number().nonnegative();
const turnPlayerSummarySchema = z.object({
  playerId: z.string(),
  cardsPlayed: nonnegativeMetricSchema,
  cardsPitched: nonnegativeMetricSchema,
  cardsDefended: nonnegativeMetricSchema,
  resourcesGenerated: nonnegativeMetricSchema,
  resourcesSpent: nonnegativeMetricSchema,
  attackPowerThreatened: nonnegativeMetricSchema,
  attackDamageDealt: nonnegativeMetricSchema,
  totalDamageDealt: nonnegativeMetricSchema,
  damagePrevented: nonnegativeMetricSchema,
  defenseCommitted: nonnegativeMetricSchema,
  effectiveDefense: nonnegativeMetricSchema,
  overblock: nonnegativeMetricSchema,
  attacks: nonnegativeMetricSchema,
  hits: nonnegativeMetricSchema,
}) satisfies z.ZodType<FabAnalyticsTurnPlayerSummaryV1>;
const cardSummarySchema = z.object({
  canonicalId: z.string().nullable(),
  name: z.string(),
  played: nonnegativeMetricSchema,
  pitched: nonnegativeMetricSchema,
  defended: nonnegativeMetricSchema,
  hits: nonnegativeMetricSchema,
  finalDefense: nonnegativeMetricSchema,
}) satisfies z.ZodType<FabAnalyticsCardSummaryV1>;
const playerSummarySchema = turnPlayerSummarySchema.extend({
  heroName: z.string(),
  initialLife: nonnegativeMetricSchema,
  finalLife: nonnegativeMetricSchema,
  abilitiesActivated: nonnegativeMetricSchema,
  cards: z.array(cardSummarySchema),
}) satisfies z.ZodType<FabAnalyticsPlayerSummaryV1>;
const fabGameAnalyticsSchema: z.ZodType<FabGameAnalyticsV1> = z.object({
  schemaVersion: z.literal(FAB_ANALYTICS_SCHEMA_VERSION),
  quality: z.literal("authoritative"),
  gameId: z.string(),
  startedAt: z.number(),
  completedAt: z.number().nullable(),
  durationSeconds: nonnegativeMetricSchema.nullable(),
  players: z.record(z.string(), playerSummarySchema),
  turns: z.array(
    z.object({
      turn: z.number().int().nonnegative(),
      activePlayerId: z.string(),
      completed: z.boolean(),
      players: z.record(z.string(), turnPlayerSummarySchema),
      lifeAfter: z.record(z.string(), nonnegativeMetricSchema),
    }),
  ),
  winnerId: z.string().nullable(),
  loserId: z.string().nullable(),
  endReason: z.string().nullable(),
});

export function parseFabGameAnalytics(value: unknown): FabGameAnalyticsV1 {
  return fabGameAnalyticsSchema.parse(value);
}

export interface FabPersistedGameAnalyticsV1 {
  readonly version: 1;
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
      readonly displayName: string | null;
      readonly username: string | null;
    },
    {
      readonly playerId: string;
      readonly displayName: string | null;
      readonly username: string | null;
    },
  ];
  readonly game: FabGameAnalyticsV1;
}

const fabPersistedDimensionsSchema = z.object({
  matchType: z.enum(["ranked", "casual", "testing", "practice_vs_bot", "private"]),
  format: z.enum(["best_of_1", "best_of_3"]),
  queueFormatId: z.string().optional(),
  authority: z.enum(["server", "client"]),
  gameNumber: z.number().int().positive(),
});

const fabPersistedSummarySchema = z.object({
  winnerId: z.string().nullable(),
  endReason: z.string().nullable(),
  totalTurns: z.number().int().nonnegative(),
  totalMoves: z.number().int().nonnegative(),
  durationMs: z.number().nonnegative(),
  createdAt: z.string(),
  completedAt: z.string(),
});

export function parseFabPersistedGameAnalyticsV1(value: unknown): FabPersistedGameAnalyticsV1 {
  const parsed = z
    .object({
      version: z.literal(1),
      gameSlug: z.literal("flesh-and-blood"),
      gameId: z.string(),
      matchId: z.string(),
      dimensions: fabPersistedDimensionsSchema,
      summary: fabPersistedSummarySchema,
      participants: z.tuple([
        z.object({
          playerId: z.string(),
          displayName: z.string().nullable(),
          username: z.string().nullable(),
        }),
        z.object({
          playerId: z.string(),
          displayName: z.string().nullable(),
          username: z.string().nullable(),
        }),
      ]),
      game: z.unknown(),
    })
    .parse(value);
  return { ...parsed, game: parseFabGameAnalytics(parsed.game) };
}

function cardRef(object: FabObjectSnapshot): FabAnalyticsCardRefV1 {
  return {
    canonicalId: object.canonicalId,
    instanceId: object.instanceId,
    name: object.current.names.join(" // ") || "Unknown card",
    ownerId: object.ownerId,
    controllerId: object.controllerId,
  };
}

function baseFact(event: CommittedEvent): FabAnalyticsFactBaseV1 {
  return {
    schemaVersion: FAB_ANALYTICS_SCHEMA_VERSION,
    eventId: event.eventId,
    turn: event.turnNumber,
    activePlayerId: event.context.turnPlayerId ?? null,
    phase: event.context.phase,
    combatNumber: event.context.combatNumber,
    chainLinkNumber: event.context.chainLinkNumber,
  };
}

function heroTargetPlayerId(
  target: { readonly kind: "hero"; readonly playerId: string } | FabObjectSnapshot,
): string | null {
  return "kind" in target && target.kind === "hero" ? target.playerId : null;
}

/** Project private engine events into a compact, stable analytics vocabulary. */
export function projectFabAnalyticsFacts(
  events: readonly CommittedEvent[],
): readonly FabAnalyticsFactV1[] {
  return events.flatMap((event): readonly FabAnalyticsFactV1[] => {
    const base = baseFact(event);
    switch (event.name) {
      case "play":
        return [
          {
            ...base,
            kind: "card-played",
            playerId: event.data.actorId,
            card: cardRef(event.data.object),
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
          },
        ];
      case "activate":
        return [
          {
            ...base,
            kind: "ability-activated",
            playerId: event.data.actorId,
            card: cardRef(event.data.object),
            abilityId: event.data.abilityId,
          },
        ];
      case "spend-assets":
        return [
          {
            ...base,
            kind: "assets-spent",
            playerId: event.data.playerId,
            resources: event.data.resources,
            chi: event.data.chi,
            life: event.data.life,
            actionPoints: event.data.actionPoints,
          },
        ];
      case "gain-assets":
        return [
          {
            ...base,
            kind: "assets-gained",
            playerId: event.data.playerId,
            resources: event.data.resources,
            chi: event.data.chi,
            actionPoints: event.data.actionPoints,
          },
        ];
      case "pay-resources":
        return [
          {
            ...base,
            kind: "resources-paid",
            playerId: event.data.playerId,
            amount: event.data.amount,
          },
        ];
      case "resolve-combat-damage":
        return [
          {
            ...base,
            kind: "combat-resolved",
            attackingPlayerId: event.data.attackingPlayerId,
            defendingPlayerId: event.data.defendingPlayerId,
            attack: cardRef(event.data.attack),
            attackPower: event.data.attackPower,
            totalDefense: event.data.totalDefense,
            unpreventedDamageBeforePrevention: event.data.damage,
            defenders: event.data.defenders.map((defender) => ({
              card: cardRef(defender.object),
              defense: defender.defense,
            })),
          },
        ];
      case "dealt-damage":
        return [
          {
            ...base,
            kind: "damage-dealt",
            sourcePlayerId: event.data.source?.controllerId ?? null,
            source: event.data.source ? cardRef(event.data.source) : null,
            targetPlayerId: heroTargetPlayerId(event.data.target),
            amount: event.data.amount,
            damageType: event.data.damageType,
          },
        ];
      case "prevent":
        return event.data.preventedAmount > 0
          ? [
              {
                ...base,
                kind: "damage-prevented",
                preventingPlayerId:
                  event.controllerId ?? heroTargetPlayerId(event.data.target) ?? "unknown",
                sourcePlayerId: event.data.source?.controllerId ?? null,
                amount: event.data.preventedAmount,
                damageType: event.data.damageType,
              },
            ]
          : [];
      case "hit":
        return event.data.damage > 0
          ? [
              {
                ...base,
                kind: "attack-hit",
                playerId: event.data.actorId,
                attack: cardRef(event.data.object),
                targetPlayerId: heroTargetPlayerId(event.data.target),
                damage: event.data.damage,
              },
            ]
          : [];
      case "gain-life":
        return [
          {
            ...base,
            kind: "life-changed",
            playerId: event.data.playerId,
            direction: "gained",
            amount: event.data.amount,
          },
        ];
      case "lose-life":
        return [
          {
            ...base,
            kind: "life-changed",
            playerId: event.data.playerId,
            direction: "lost",
            amount: event.data.amount,
          },
        ];
      case "advance-turn":
        return [
          {
            ...base,
            kind: "turn-completed",
            playerId: event.data.previousPlayerId,
            nextPlayerId: event.data.nextPlayerId,
            nextTurn: event.data.nextTurnNumber,
          },
        ];
      case "lose-game":
        return [
          { ...base, kind: "game-lost", playerId: event.data.playerId, reason: event.data.reason },
        ];
      default:
        return [];
    }
  });
}

function emptyTurnPlayer(playerId: string): FabAnalyticsTurnPlayerSummaryV1 {
  return {
    playerId,
    cardsPlayed: 0,
    cardsPitched: 0,
    cardsDefended: 0,
    resourcesGenerated: 0,
    resourcesSpent: 0,
    attackPowerThreatened: 0,
    attackDamageDealt: 0,
    totalDamageDealt: 0,
    damagePrevented: 0,
    defenseCommitted: 0,
    effectiveDefense: 0,
    overblock: 0,
    attacks: 0,
    hits: 0,
  };
}

interface MutableTurnPlayer {
  playerId: string;
  cardsPlayed: number;
  cardsPitched: number;
  cardsDefended: number;
  resourcesGenerated: number;
  resourcesSpent: number;
  attackPowerThreatened: number;
  attackDamageDealt: number;
  totalDamageDealt: number;
  damagePrevented: number;
  defenseCommitted: number;
  effectiveDefense: number;
  overblock: number;
  attacks: number;
  hits: number;
}

interface MutablePlayer extends MutableTurnPlayer {
  heroName: string;
  initialLife: number;
  finalLife: number;
  abilitiesActivated: number;
  cards: Map<string, FabAnalyticsCardSummaryV1>;
}

interface MutableTurn {
  turn: number;
  activePlayerId: string;
  completed: boolean;
  players: Record<string, MutableTurnPlayer>;
  lifeAfter: Record<string, number>;
}

function cardKey(card: FabAnalyticsCardRefV1): string {
  return card.canonicalId ?? `name:${card.name}`;
}

function updateCard(
  player: MutablePlayer,
  card: FabAnalyticsCardRefV1,
  field: "played" | "pitched" | "defended" | "hits",
  amount = 1,
): void {
  const key = cardKey(card);
  const current = player.cards.get(key) ?? {
    canonicalId: card.canonicalId,
    name: card.name,
    played: 0,
    pitched: 0,
    defended: 0,
    hits: 0,
    finalDefense: 0,
  };
  player.cards.set(key, { ...current, [field]: current[field] + amount });
}

type FabNumericMetric = Exclude<keyof MutableTurnPlayer, "playerId">;

function addMetric(target: MutableTurnPlayer, field: FabNumericMetric, amount: number): void {
  target[field] += amount;
}

export function buildFabGameAnalytics(input: {
  readonly gameId: string;
  readonly players: readonly FabAnalyticsPlayerSeedV1[];
  readonly initialTurnPlayerId: string;
  readonly startedAt: number;
  readonly completedAt?: number | null;
  readonly result?: {
    readonly winnerId: string | null;
    readonly loserId: string | null;
    readonly reason: string | null;
  };
  readonly factBatches: readonly FabAnalyticsFactBatchV1[];
}): FabGameAnalyticsV1 {
  const playerIds = input.players.map((player) => player.playerId);
  const life = Object.fromEntries(
    input.players.map((player) => [player.playerId, player.initialLife]),
  );
  const players = Object.fromEntries(
    input.players.map((seed) => [
      seed.playerId,
      {
        ...emptyTurnPlayer(seed.playerId),
        heroName: seed.heroName,
        initialLife: seed.initialLife,
        finalLife: seed.initialLife,
        abilitiesActivated: 0,
        cards: new Map<string, FabAnalyticsCardSummaryV1>(),
      } satisfies MutablePlayer,
    ]),
  ) as Record<string, MutablePlayer>;
  const turns = new Map<number, MutableTurn>();
  let currentTurnPlayerId = input.initialTurnPlayerId;
  let loserId: string | null = null;
  let endReason: string | null = null;

  const turnFor = (turnNumber: number): MutableTurn => {
    const existing = turns.get(turnNumber);
    if (existing) return existing;
    const created: MutableTurn = {
      turn: turnNumber,
      activePlayerId: currentTurnPlayerId,
      completed: false,
      players: Object.fromEntries(playerIds.map((id) => [id, emptyTurnPlayer(id)])),
      lifeAfter: { ...life },
    };
    turns.set(turnNumber, created);
    return created;
  };
  const add = (
    turn: MutableTurn,
    playerId: string,
    field: FabNumericMetric,
    amount: number,
  ): void => {
    const perTurn = turn.players[playerId];
    const total = players[playerId];
    if (!perTurn || !total) return;
    addMetric(perTurn, field, amount);
    addMetric(total, field, amount);
  };

  for (const batch of input.factBatches) {
    for (const fact of batch.facts) {
      // advance-turn receipts carry post-transition turn metadata. Use the
      // payload to close the previous turn, including already retained facts.
      if (fact.kind === "turn-completed") {
        currentTurnPlayerId = fact.playerId;
        const completed = turnFor(fact.nextTurn - 1);
        completed.completed = true;
        completed.lifeAfter = { ...life };
        currentTurnPlayerId = fact.nextPlayerId;
        turnFor(fact.nextTurn);
        continue;
      }
      if (fact.activePlayerId) currentTurnPlayerId = fact.activePlayerId;
      const turn = turnFor(fact.turn);
      if (fact.activePlayerId) turn.activePlayerId = fact.activePlayerId;
      switch (fact.kind) {
        case "card-played":
          add(turn, fact.playerId, "cardsPlayed", 1);
          if (players[fact.playerId]) updateCard(players[fact.playerId], fact.card, "played");
          break;
        case "card-pitched":
          add(turn, fact.playerId, "cardsPitched", 1);
          add(turn, fact.playerId, "resourcesGenerated", fact.resourcesGenerated);
          if (players[fact.playerId]) updateCard(players[fact.playerId], fact.card, "pitched");
          break;
        case "card-defended":
          add(turn, fact.playerId, "cardsDefended", 1);
          if (players[fact.playerId]) updateCard(players[fact.playerId], fact.card, "defended");
          break;
        case "ability-activated":
          if (players[fact.playerId]) players[fact.playerId].abilitiesActivated += 1;
          break;
        case "assets-spent":
          add(turn, fact.playerId, "resourcesSpent", fact.resources);
          life[fact.playerId] = Math.max(0, (life[fact.playerId] ?? 0) - fact.life);
          break;
        case "resources-paid":
          add(turn, fact.playerId, "resourcesSpent", fact.amount);
          break;
        case "assets-gained":
          add(turn, fact.playerId, "resourcesGenerated", fact.resources);
          break;
        case "combat-resolved": {
          add(turn, fact.attackingPlayerId, "attacks", 1);
          add(turn, fact.attackingPlayerId, "attackPowerThreatened", fact.attackPower);
          add(turn, fact.defendingPlayerId, "defenseCommitted", fact.totalDefense);
          add(
            turn,
            fact.defendingPlayerId,
            "effectiveDefense",
            Math.min(fact.attackPower, fact.totalDefense),
          );
          add(
            turn,
            fact.defendingPlayerId,
            "overblock",
            Math.max(0, fact.totalDefense - fact.attackPower),
          );
          for (const defender of fact.defenders) {
            const defenderPlayer = players[fact.defendingPlayerId];
            if (!defenderPlayer) continue;
            const key = cardKey(defender.card);
            const current = defenderPlayer.cards.get(key) ?? {
              canonicalId: defender.card.canonicalId,
              name: defender.card.name,
              played: 0,
              pitched: 0,
              defended: 0,
              hits: 0,
              finalDefense: 0,
            };
            defenderPlayer.cards.set(key, {
              ...current,
              finalDefense: current.finalDefense + defender.defense,
            });
          }
          break;
        }
        case "damage-dealt": {
          if (fact.sourcePlayerId) {
            add(turn, fact.sourcePlayerId, "totalDamageDealt", fact.amount);
          }
          if (fact.targetPlayerId)
            life[fact.targetPlayerId] = Math.max(0, (life[fact.targetPlayerId] ?? 0) - fact.amount);
          break;
        }
        case "damage-prevented":
          add(turn, fact.preventingPlayerId, "damagePrevented", fact.amount);
          break;
        case "attack-hit":
          add(turn, fact.playerId, "hits", 1);
          add(turn, fact.playerId, "attackDamageDealt", fact.damage);
          if (players[fact.playerId]) updateCard(players[fact.playerId], fact.attack, "hits");
          break;
        case "life-changed":
          life[fact.playerId] = Math.max(
            0,
            (life[fact.playerId] ?? 0) + (fact.direction === "gained" ? fact.amount : -fact.amount),
          );
          break;
        case "game-lost":
          loserId = fact.playerId;
          endReason = fact.reason;
          break;
      }
      turn.lifeAfter = { ...life };
    }
  }

  for (const [playerId, player] of Object.entries(players))
    player.finalLife = life[playerId] ?? player.finalLife;
  const resolvedLoserId = loserId ?? input.result?.loserId ?? null;
  const winnerId =
    input.result?.winnerId ??
    (resolvedLoserId === null ? null : (playerIds.find((id) => id !== resolvedLoserId) ?? null));
  const completedAt = input.completedAt ?? null;
  return {
    schemaVersion: FAB_ANALYTICS_SCHEMA_VERSION,
    quality: "authoritative",
    gameId: input.gameId,
    startedAt: input.startedAt,
    completedAt,
    durationSeconds:
      completedAt === null ? null : Math.max(0, Math.round((completedAt - input.startedAt) / 1000)),
    players: Object.fromEntries(
      Object.entries(players).map(([id, player]) => [
        id,
        {
          ...player,
          cards: [...player.cards.values()].sort((a, b) => a.name.localeCompare(b.name)),
        },
      ]),
    ),
    turns: [...turns.values()].sort((a, b) => a.turn - b.turn),
    winnerId,
    loserId: resolvedLoserId,
    endReason: endReason ?? input.result?.reason ?? null,
  };
}
