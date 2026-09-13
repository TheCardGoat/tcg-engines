import { buildFabCombatValueReport, type FabCombatValueReport } from "./FabCombatValue";
import type { FabPresentationState } from "./state";
import { fabEndReasonForViewer } from "./end-reason";
import type { FabGameAnalytics } from "@tcg/flesh-and-blood-server-adapter";

export type FabSummaryDataSource = "runtime" | "session" | "backend" | "mock";

export interface FabSummaryValue<T> {
  readonly value: T;
  readonly source: FabSummaryDataSource;
}

export interface FabPostGameBackendData {
  readonly combatValue?: FabCombatValueReport | null;
  readonly durationSeconds?: number;
  readonly formatLabel?: string;
  readonly comparison?: readonly FabSummaryComparison[];
  readonly lifeByTurn?: FabLifeByTurn;
  readonly turns?: readonly FabTurnSummary[];
  readonly cards?: readonly FabCardSummary[];
  readonly opponentCards?: readonly FabCardSummary[];
  readonly hands?: readonly FabHandCycleSummary[];
  readonly match?: FabMatchSummary;
}

export interface FabPostGameSessionData {
  readonly durationSeconds: number;
  readonly comparison: readonly FabSummaryComparison[];
  readonly turns: readonly FabTurnSummary[];
  readonly cards: readonly FabCardSummary[];
  readonly opponentCards: readonly FabCardSummary[];
}

export interface FabSummaryParticipant {
  readonly id: string;
  readonly label: string;
  readonly heroName: string;
  readonly subscriptionTier?: string;
  readonly life: number;
  readonly result: "win" | "loss" | "draw";
}

export interface FabSummaryComparison {
  readonly id: string;
  readonly label: string;
  readonly viewer: string;
  readonly opponent: string;
  readonly source: FabSummaryDataSource;
}

export interface FabLifeByTurn {
  readonly turns: readonly number[];
  readonly viewer: readonly number[];
  readonly opponent: readonly number[];
  readonly source: FabSummaryDataSource;
}

export interface FabTurnSummary {
  readonly turn: number;
  readonly cardsPlayed: number;
  readonly cardsPitched: number;
  readonly resourcesGenerated: number;
  readonly damageDealt: number;
  readonly cardsDefended: number;
  readonly cardsPlayedFromArsenal: number;
  readonly source: FabSummaryDataSource;
}

export interface FabHandActionSummary {
  readonly sequence: number;
  readonly turn: number;
  readonly kind:
    | "drawn"
    | "played"
    | "pitched"
    | "defended"
    | "arsenaled"
    | "moved-from-hand"
    | "returned-to-hand";
  readonly cardId: string | null;
  readonly cardName: string;
  readonly origin: string | null;
  readonly destination: string | null;
}

export interface FabHandCycleSummary {
  readonly cycle: number;
  readonly openedAfterTurn: number | null;
  readonly openedBy: "opening-hand" | "draw-to-intellect";
  readonly startingCards: readonly { readonly id: string | null; readonly name: string }[];
  readonly carriedCards: readonly { readonly id: string | null; readonly name: string }[];
  readonly endingCards: readonly { readonly id: string | null; readonly name: string }[];
  readonly actions: readonly FabHandActionSummary[];
  readonly closedAfterTurn: number | null;
  readonly source: "backend" | "mock";
}

export interface FabCardSummary {
  readonly id: string;
  readonly name: string;
  readonly imageUrl?: string;
  readonly played: number;
  readonly pitched: number;
  readonly defended: number;
  readonly hits: number;
  readonly source: FabSummaryDataSource;
}

export interface FabMatchGameSummary {
  readonly game: number;
  readonly result: "win" | "loss" | "draw";
  readonly turnCount: number;
  readonly lifeRemaining: number | null;
  readonly ending: string;
}

export interface FabMatchSummary {
  readonly source: "backend" | "mock";
  readonly viewerWins: number;
  readonly opponentWins: number;
  readonly games: readonly FabMatchGameSummary[];
  readonly comparison: readonly FabSummaryComparison[];
  readonly cards?: readonly FabCardSummary[];
  readonly opponentCards?: readonly FabCardSummary[];
  readonly observations: readonly string[];
}

export interface FabPostGameSummaryModel {
  readonly combatValue?: FabCombatValueReport | null;
  readonly viewer: FabSummaryParticipant;
  readonly opponent: FabSummaryParticipant;
  readonly outcome: "victory" | "defeat" | "draw";
  readonly outcomeTitle: string;
  readonly outcomeDetail: string;
  readonly reason: FabSummaryValue<string>;
  readonly turnNumber: FabSummaryValue<number>;
  readonly durationSeconds: FabSummaryValue<number>;
  readonly formatLabel: FabSummaryValue<string>;
  readonly comparison: readonly FabSummaryComparison[];
  readonly lifeByTurn: FabLifeByTurn;
  readonly turns: readonly FabTurnSummary[];
  readonly cards: readonly FabCardSummary[];
  readonly opponentCards: readonly FabCardSummary[];
  readonly hands: readonly FabHandCycleSummary[];
  readonly match: FabMatchSummary;
  readonly hasMockData: boolean;
}

function analyticsComparison(
  analytics: FabGameAnalytics,
  viewerId: string,
  opponentId: string,
): readonly FabSummaryComparison[] {
  const viewer = analytics.players[viewerId];
  const opponent = analytics.players[opponentId];
  if (!viewer || !opponent) return [];
  return [
    ["attack-damage", "Attack damage", viewer.attackDamageDealt, opponent.attackDamageDealt],
    [
      "hits-attacks",
      "Hits / attacks",
      `${viewer.hits} / ${viewer.attacks}`,
      `${opponent.hits} / ${opponent.attacks}`,
    ],
    ["effective-defense", "Effective defense", viewer.effectiveDefense, opponent.effectiveDefense],
    ["damage-prevented", "Damage prevented", viewer.damagePrevented, opponent.damagePrevented],
    ["cards-pitched", "Cards pitched", viewer.cardsPitched, opponent.cardsPitched],
    ["resources-spent", "Resources spent", viewer.resourcesSpent, opponent.resourcesSpent],
  ].map(([id, label, viewerValue, opponentValue]) => ({
    id: String(id),
    label: String(label),
    viewer: String(viewerValue),
    opponent: String(opponentValue),
    source: "backend" as const,
  }));
}

/** Adapt the authoritative game aggregate to the existing post-game view model. */
export function fabPostGameBackendDataFromAnalytics(
  analytics: FabGameAnalytics,
  presentation: FabPresentationState,
  viewerId: string,
): FabPostGameBackendData {
  const opponentId = presentation.players.find((playerId) => playerId !== viewerId) ?? viewerId;
  const viewer = analytics.players[viewerId];
  const opponent = analytics.players[opponentId];
  const lifeTurns = analytics.turns.map((turn) => turn.turn);
  const viewerLife = analytics.turns.map(
    (turn) => turn.lifeAfter[viewerId] ?? viewer?.finalLife ?? 0,
  );
  const opponentLife = analytics.turns.map(
    (turn) => turn.lifeAfter[opponentId] ?? opponent?.finalLife ?? 0,
  );
  return {
    ...(analytics.durationSeconds === null ? {} : { durationSeconds: analytics.durationSeconds }),
    comparison: analyticsComparison(analytics, viewerId, opponentId),
    combatValue: buildFabCombatValueReport(analytics, viewerId, opponentId),
    lifeByTurn: {
      turns: [0, ...lifeTurns],
      viewer: [viewer?.initialLife ?? 0, ...viewerLife],
      opponent: [opponent?.initialLife ?? 0, ...opponentLife],
      source: "backend",
    },
    turns: analytics.turns.map((turn) => {
      const stats = turn.players[viewerId];
      return {
        turn: turn.turn,
        cardsPlayed: stats?.cardsPlayed ?? 0,
        cardsPitched: stats?.cardsPitched ?? 0,
        resourcesGenerated: stats?.resourcesGenerated ?? 0,
        damageDealt: stats?.totalDamageDealt ?? 0,
        cardsDefended: stats?.cardsDefended ?? 0,
        cardsPlayedFromArsenal: stats?.cardPlaysByOrigin.arsenal ?? 0,
        source: "backend" as const,
      };
    }),
    hands: (viewer?.handCycles ?? []).map((hand) => ({
      cycle: hand.cycle,
      openedAfterTurn: hand.openedAfterTurn,
      openedBy: hand.openedBy,
      startingCards: hand.startingCards.map((card) => ({ id: card.canonicalId, name: card.name })),
      carriedCards: hand.carriedCards.map((card) => ({ id: card.canonicalId, name: card.name })),
      endingCards: hand.endingCards.map((card) => ({ id: card.canonicalId, name: card.name })),
      actions: hand.actions.map((action) => ({
        sequence: action.sequence,
        turn: action.turn,
        kind: action.kind,
        cardId: action.card.canonicalId,
        cardName: action.card.name,
        origin: action.origin,
        destination: action.destination,
      })),
      closedAfterTurn: hand.closedAfterTurn,
      source: "backend" as const,
    })),
    cards: (viewer?.cards ?? []).map((card) => ({
      id: card.canonicalId ?? `name:${card.name}`,
      name: card.name,
      ...(card.canonicalId && presentation.cardDefinitions[card.canonicalId]?.imageUrl
        ? { imageUrl: presentation.cardDefinitions[card.canonicalId].imageUrl }
        : {}),
      played: card.played,
      pitched: card.pitched,
      defended: card.defended,
      hits: card.hits,
      source: "backend" as const,
    })),
    opponentCards: (opponent?.cards ?? []).map((card) => ({
      id: card.canonicalId ?? `name:${card.name}`,
      name: card.name,
      ...(card.canonicalId && presentation.cardDefinitions[card.canonicalId]?.imageUrl
        ? { imageUrl: presentation.cardDefinitions[card.canonicalId].imageUrl }
        : {}),
      played: card.played,
      pitched: card.pitched,
      defended: card.defended,
      hits: card.hits,
      source: "backend" as const,
    })),
  };
}

export function fabMatchSummaryFromAnalytics(
  games: readonly FabGameAnalytics[],
  viewerId: string,
  opponentId: string,
): FabMatchSummary {
  const aggregateCards = (playerId: string): readonly FabCardSummary[] => {
    const cards = new Map<string, FabCardSummary>();
    for (const game of games) {
      for (const card of game.players[playerId]?.cards ?? []) {
        const id = card.canonicalId ?? `name:${card.name}`;
        const current = cards.get(id);
        cards.set(id, {
          id,
          name: card.name,
          played: (current?.played ?? 0) + card.played,
          pitched: (current?.pitched ?? 0) + card.pitched,
          defended: (current?.defended ?? 0) + card.defended,
          hits: (current?.hits ?? 0) + card.hits,
          source: "backend",
        });
      }
    }
    return [...cards.values()].sort((a, b) => a.name.localeCompare(b.name));
  };
  const sum = (
    playerId: string,
    metric: "attackDamageDealt" | "hits" | "attacks" | "effectiveDefense" | "cardsPitched",
  ) => games.reduce((total, game) => total + (game.players[playerId]?.[metric] ?? 0), 0);
  const comparison: readonly FabSummaryComparison[] = [
    {
      id: "attack-damage",
      label: "Attack damage",
      viewer: String(sum(viewerId, "attackDamageDealt")),
      opponent: String(sum(opponentId, "attackDamageDealt")),
      source: "backend",
    },
    {
      id: "hits-attacks",
      label: "Hits / attacks",
      viewer: `${sum(viewerId, "hits")} / ${sum(viewerId, "attacks")}`,
      opponent: `${sum(opponentId, "hits")} / ${sum(opponentId, "attacks")}`,
      source: "backend",
    },
    {
      id: "effective-defense",
      label: "Effective defense",
      viewer: String(sum(viewerId, "effectiveDefense")),
      opponent: String(sum(opponentId, "effectiveDefense")),
      source: "backend",
    },
    {
      id: "cards-pitched",
      label: "Cards pitched",
      viewer: String(sum(viewerId, "cardsPitched")),
      opponent: String(sum(opponentId, "cardsPitched")),
      source: "backend",
    },
  ];
  return {
    source: "backend",
    viewerWins: games.filter((game) => game.winnerId === viewerId).length,
    opponentWins: games.filter((game) => game.winnerId === opponentId).length,
    games: games.map((game, index) => ({
      game: index + 1,
      result: game.winnerId === viewerId ? "win" : game.winnerId === opponentId ? "loss" : "draw",
      turnCount: game.turns.length,
      lifeRemaining: game.players[viewerId]?.finalLife ?? null,
      ending: game.endReason
        ? fabEndReasonForViewer(game.endReason, game.winnerId, viewerId)
        : "Game complete",
    })),
    comparison,
    cards: aggregateCards(viewerId),
    opponentCards: aggregateCards(opponentId),
    observations: [],
  };
}

interface CreateFabPostGameSummaryOptions {
  readonly presentation: FabPresentationState;
  readonly viewerId: string;
  readonly participantLabel: (playerId: string) => string;
  readonly participantSubscriptionTier?: (playerId: string) => string | undefined;
  readonly sessionFormatLabel: string;
  readonly session?: FabPostGameSessionData | null;
  readonly backend?: FabPostGameBackendData;
}

function valueFromBackendOrMock<T>(backend: T | undefined, mock: T): FabSummaryValue<T> {
  return backend === undefined
    ? { value: mock, source: "mock" }
    : { value: backend, source: "backend" };
}

function heroNameFor(presentation: FabPresentationState, playerId: string): string {
  const hero = Object.values(presentation.cards).find(
    (card) => card.ownerId === playerId && card.zone === "hero",
  );
  if (!hero) return "Unknown hero";
  return presentation.cardDefinitions[hero.cardId]?.name ?? "Unknown hero";
}

function resultFor(
  presentation: FabPresentationState,
  playerId: string,
): FabSummaryParticipant["result"] {
  if (!presentation.result || presentation.result.kind === "draw") return "draw";
  return presentation.result.winnerId === playerId ? "win" : "loss";
}

function mockComparison(viewerWon: boolean): readonly FabSummaryComparison[] {
  return [
    {
      id: "attack-damage",
      label: "Attack damage",
      viewer: viewerWon ? "42" : "35",
      opponent: viewerWon ? "35" : "42",
      source: "mock",
    },
    {
      id: "hits-attacks",
      label: "Hits / attacks",
      viewer: viewerWon ? "8 / 12" : "6 / 11",
      opponent: viewerWon ? "6 / 11" : "8 / 12",
      source: "mock",
    },
    {
      id: "effective-defense",
      label: "Effective defense",
      viewer: viewerWon ? "31" : "27",
      opponent: viewerWon ? "27" : "31",
      source: "mock",
    },
    {
      id: "cards-pitched",
      label: "Cards pitched",
      viewer: viewerWon ? "9" : "11",
      opponent: viewerWon ? "11" : "9",
      source: "mock",
    },
  ];
}

function mockLifeByTurn(
  turnNumber: number,
  viewerLife: number,
  opponentLife: number,
): FabLifeByTurn {
  const pointCount = Math.max(3, Math.min(8, turnNumber + 1));
  const turns = Array.from({ length: pointCount }, (_, index) =>
    Math.round((index / (pointCount - 1)) * turnNumber),
  );
  const curve = (endingLife: number, bias: number) =>
    turns.map((_, index) => {
      if (index === turns.length - 1) return endingLife;
      const progress = index / (turns.length - 1);
      return Math.max(endingLife, Math.round(40 - (40 - endingLife) * progress ** bias));
    });
  return {
    turns,
    viewer: curve(viewerLife, 1.35),
    opponent: curve(opponentLife, 0.9),
    source: "mock",
  };
}

function mockTurns(turnNumber: number, viewerWon: boolean): readonly FabTurnSummary[] {
  const first = Math.max(1, turnNumber - 4);
  return Array.from({ length: turnNumber - first + 1 }, (_, index) => {
    const turn = first + index;
    const closingTurn = turn === turnNumber;
    return {
      turn,
      cardsPlayed: closingTurn ? (viewerWon ? 4 : 2) : 2 + ((turn + 1) % 3),
      cardsPitched: 1 + (turn % 2),
      resourcesGenerated: 2 + (turn % 4),
      damageDealt: closingTurn ? (viewerWon ? 9 : 3) : 2 + ((turn * 3) % 7),
      cardsDefended: 1 + (turn % 3),
      cardsPlayedFromArsenal: 0,
      source: "mock" as const,
    };
  });
}

function mockCards(
  presentation: FabPresentationState,
  viewerId: string,
): readonly FabCardSummary[] {
  const seen = new Set<string>();
  const cards = Object.values(presentation.cards)
    .filter((card) => card.ownerId === viewerId)
    .filter((card) => !["hero", "head", "chest", "arms", "legs", "weapon"].includes(card.zone))
    .flatMap((card) => {
      const definition = presentation.cardDefinitions[card.cardId];
      if (!definition || seen.has(card.cardId)) return [];
      seen.add(card.cardId);
      return [{ id: card.cardId, definition }];
    })
    .slice(0, 5);

  return cards.map(({ id, definition }, index) => ({
    id,
    name: definition.name,
    ...(definition.imageUrl ? { imageUrl: definition.imageUrl } : {}),
    played: index < 3 ? 2 - (index % 2) : 0,
    pitched: index % 3,
    defended: (index + 1) % 3,
    hits: index < 2 ? 1 : 0,
    source: "mock" as const,
  }));
}

function mockMatch(
  viewerWon: boolean,
  turnNumber: number,
  viewerLife: number,
  reason: string,
): FabMatchSummary {
  return {
    source: "mock",
    viewerWins: viewerWon ? 2 : 1,
    opponentWins: viewerWon ? 1 : 2,
    games: [
      {
        game: 1,
        result: viewerWon ? "loss" : "win",
        turnCount: Math.max(5, turnNumber - 1),
        lifeRemaining: viewerWon ? null : 8,
        ending: "By lethal damage",
      },
      {
        game: 2,
        result: viewerWon ? "win" : "loss",
        turnCount: Math.max(6, turnNumber),
        lifeRemaining: viewerWon ? 5 : null,
        ending: "By lethal damage",
      },
      {
        game: 3,
        result: viewerWon ? "win" : "loss",
        turnCount: turnNumber,
        lifeRemaining: viewerWon ? viewerLife : null,
        ending: reason,
      },
    ],
    comparison: mockComparison(viewerWon).slice(0, 3),
    observations: viewerWon
      ? [
          "Your pressure improved in each game of this illustrative series.",
          "The deciding game had your strongest attack-to-hit conversion.",
        ]
      : [
          "The opponent defended more efficiently in the final two illustrative games.",
          "The deciding game turned on the last two attack cycles.",
        ],
  };
}

export function createFabPostGameSummary({
  presentation,
  viewerId,
  participantLabel,
  participantSubscriptionTier,
  sessionFormatLabel,
  session,
  backend,
}: CreateFabPostGameSummaryOptions): FabPostGameSummaryModel {
  if (!presentation.result) {
    throw new Error("A post-game summary requires a terminal Flesh and Blood result.");
  }

  const opponentId = presentation.players.find((playerId) => playerId !== viewerId) ?? viewerId;
  const viewerResult = resultFor(presentation, viewerId);
  const opponentResult = resultFor(presentation, opponentId);
  const viewerWon = viewerResult === "win";
  const reason = presentation.result.reason;
  const outcome = viewerResult === "win" ? "victory" : viewerResult === "loss" ? "defeat" : "draw";
  const viewerSubscriptionTier = participantSubscriptionTier?.(viewerId);
  const opponentSubscriptionTier = participantSubscriptionTier?.(opponentId);
  const viewer: FabSummaryParticipant = {
    id: viewerId,
    label: participantLabel(viewerId),
    heroName: heroNameFor(presentation, viewerId),
    ...(viewerSubscriptionTier ? { subscriptionTier: viewerSubscriptionTier } : {}),
    life: presentation.life[viewerId] ?? 0,
    result: viewerResult,
  };
  const opponent: FabSummaryParticipant = {
    id: opponentId,
    label: participantLabel(opponentId),
    heroName: heroNameFor(presentation, opponentId),
    ...(opponentSubscriptionTier ? { subscriptionTier: opponentSubscriptionTier } : {}),
    life: presentation.life[opponentId] ?? 0,
    result: opponentResult,
  };
  const comparison = backend?.comparison ?? session?.comparison ?? mockComparison(viewerWon);
  const lifeByTurn =
    backend?.lifeByTurn ?? mockLifeByTurn(presentation.turnNumber, viewer.life, opponent.life);
  const turns = backend?.turns ?? session?.turns ?? mockTurns(presentation.turnNumber, viewerWon);
  const cards = backend?.cards ?? session?.cards ?? mockCards(presentation, viewerId);
  const opponentCards =
    backend?.opponentCards ??
    session?.opponentCards ??
    (backend || session ? [] : mockCards(presentation, opponentId));
  const hands = backend?.hands ?? [];
  const match =
    backend?.match ?? mockMatch(viewerWon, presentation.turnNumber, viewer.life, reason);
  const durationSeconds =
    backend?.durationSeconds !== undefined
      ? ({ value: backend.durationSeconds, source: "backend" } as const)
      : session
        ? ({ value: session.durationSeconds, source: "session" } as const)
        : valueFromBackendOrMock(undefined, Math.max(60, presentation.turnNumber * 104));
  const formatLabel = backend?.formatLabel
    ? ({ value: backend.formatLabel, source: "backend" } as const)
    : ({ value: sessionFormatLabel, source: "session" } as const);

  return {
    viewer,
    opponent,
    outcome,
    outcomeTitle: outcome === "victory" ? "Victory" : outcome === "defeat" ? "Defeat" : "Draw",
    outcomeDetail:
      presentation.result.kind === "draw"
        ? "The game ended without a winner"
        : `${heroNameFor(presentation, presentation.result.winnerId)} defeated ${heroNameFor(
            presentation,
            presentation.result.loserId,
          )}`,
    reason: { value: reason, source: "runtime" },
    turnNumber: { value: presentation.turnNumber, source: "runtime" },
    durationSeconds,
    formatLabel,
    comparison,
    combatValue: backend?.combatValue ?? null,
    lifeByTurn,
    turns,
    cards,
    opponentCards,
    hands,
    match,
    hasMockData:
      durationSeconds.source === "mock" ||
      comparison.some((entry) => entry.source === "mock") ||
      lifeByTurn.source === "mock" ||
      turns.some((entry) => entry.source === "mock") ||
      cards.some((entry) => entry.source === "mock") ||
      match.source === "mock",
  };
}
