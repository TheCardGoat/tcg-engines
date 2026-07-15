import type { LorcanaLogMessage, LorcanaProjectedBoardView } from "@tcg/lorcana-engine";
import { m } from "$lib/i18n/messages.js";
import {
  getAvailableInkForSide,
  getOwnerIdForSide,
  getSideForOwnerId,
  getZoneCardIds,
  type LorcanaPlayerSide,
  type MoveLogEntrySnapshot,
  type SimulatorSerializedObject,
} from "@/features/simulator/model/contracts.js";
import {
  formatEventLogBody,
  type CardReferenceResolver,
} from "@/features/simulator/model/event-log-formatting.js";
import {
  getMoveCategoryId,
  getMoveCategoryLabel,
} from "@/features/simulator/model/move-presentation.js";
import type { GameAnalyticsSummary, PostGameCanonicalData } from "./notes-api.js";
import type {
  PostGameActionCounters,
  PostGameActorTone,
  PostGameForensicEntry,
  PostGameHighlight,
  PostGameSpotlightAbility,
  PostGameSpotlightCard,
  PostGameSummary,
  PostGameTimelineIconId,
  PostGameTurnSummary,
} from "./types.js";

type CardReferenceMeta = {
  cardId: string;
  label: string;
  ownerSide: LorcanaPlayerSide | null;
  loreValue: number | null;
};

type MutableCardAggregate = {
  cardId: string;
  label: string;
  ownerSide: LorcanaPlayerSide | null;
  value: number;
  detail: string;
};

type MutableAbilityAggregate = {
  label: string;
  cardId: string | null;
  cardLabel: string | null;
  ownerSide: LorcanaPlayerSide | null;
  count: number;
};

export interface BuildPostGameSummaryInput {
  board: LorcanaProjectedBoardView;
  entries: MoveLogEntrySnapshot[];
  viewerSide?: LorcanaPlayerSide | null;
}

const PLAYER_SIDES: LorcanaPlayerSide[] = ["playerOne", "playerTwo"];

export function buildPostGameSummaryFromCanonical(
  postGame: PostGameCanonicalData,
  viewerSide?: LorcanaPlayerSide | null,
): PostGameSummary {
  // Analytics source: raw moves not available — use pre-computed analytics record
  if (postGame.source === "analytics" && postGame.analytics) {
    return buildPostGameSummaryFromAnalytics(postGame, viewerSide);
  }

  // Redis source: full raw moves available — build forensic summary
  return buildPostGameSummary({
    board: {
      ...postGame.board,
      reason: postGame.reason ?? postGame.board.reason ?? null,
    },
    entries: createPersistedMoveLogEntries(postGame),
    viewerSide,
  });
}

function buildPostGameSummaryFromAnalytics(
  postGame: PostGameCanonicalData,
  viewerSide?: LorcanaPlayerSide | null,
): PostGameSummary {
  const analytics = postGame.analytics!;
  const board = { ...postGame.board, reason: postGame.reason ?? postGame.board.reason ?? null };
  const resolvedViewerSide = viewerSide ?? null;
  const outcome = buildOutcomeSummary(board, resolvedViewerSide);

  // buildAnalyticsDerivedData consumes the same shape as AnalyticsPlayerData — the
  // expanded PlayerAnalyticsSummary now includes cardEvents + full counters.
  const derived = buildAnalyticsDerivedData({
    players: analytics.players as [AnalyticsPlayerData, AnalyticsPlayerData],
  });

  const highlights = buildHighlightsFromAnalytics(
    board,
    analytics,
    outcome,
    derived,
    resolvedViewerSide,
  );
  const turns = buildTurnSummariesFromAnalytics(analytics);

  return {
    board,
    outcome,
    players: {
      playerOne: buildPlayerBoardSummary(board, "playerOne"),
      playerTwo: buildPlayerBoardSummary(board, "playerTwo"),
    },
    countersBySide: derived.countersBySide,
    topLoreContributors: derived.topLoreContributors,
    mostPlayedCards: derived.mostPlayedCards,
    mostInvolvedChallengeCards: derived.mostInvolvedChallengeCards,
    mostTriggeredAbilities: [],
    highlights: highlights.slice(0, 6),
    timeline: [],
    turns,
    totalLogEntries: analytics.summary.totalMoves,
    analytics,
  };
}

function buildHighlightsFromAnalytics(
  board: LorcanaProjectedBoardView,
  analytics: GameAnalyticsSummary,
  outcome: ReturnType<typeof buildOutcomeSummary>,
  derived: ReturnType<typeof buildAnalyticsDerivedData>,
  viewerSide: LorcanaPlayerSide | null,
): PostGameHighlight[] {
  const highlights: PostGameHighlight[] = [];

  // First challenge milestone (whichever player challenged first)
  const firstChallengePlayers = [...analytics.players].sort(
    (a, b) =>
      (a.metrics.firstChallengeTurn ?? Infinity) - (b.metrics.firstChallengeTurn ?? Infinity),
  );
  const firstChallengePlayer = firstChallengePlayers[0];
  if (firstChallengePlayer?.metrics.firstChallengeTurn !== null) {
    const side: LorcanaPlayerSide = firstChallengePlayer.seat === 1 ? "playerOne" : "playerTwo";
    highlights.push({
      id: `highlight:first-challenge`,
      title: m["sim.postGame.highlight.challenge.title"]({}),
      detail: m["sim.postGame.highlight.challenge.detail"]({}),
      turnNumber: firstChallengePlayer.metrics.firstChallengeTurn ?? undefined,
      actorSide: side,
    });
  }

  // First quest milestone (whichever player quested first)
  const firstQuestPlayers = [...analytics.players].sort(
    (a, b) => (a.metrics.firstQuestTurn ?? Infinity) - (b.metrics.firstQuestTurn ?? Infinity),
  );
  const firstQuestPlayer = firstQuestPlayers[0];
  if (firstQuestPlayer?.metrics.firstQuestTurn !== null) {
    const side: LorcanaPlayerSide = firstQuestPlayer.seat === 1 ? "playerOne" : "playerTwo";
    highlights.push({
      id: `highlight:first-quest`,
      title: m["sim.postGame.highlight.quest.title"]({}),
      detail: m["sim.postGame.highlight.quest.detail"]({}),
      turnNumber: firstQuestPlayer.metrics.firstQuestTurn ?? undefined,
      actorSide: side,
    });
  }

  // Game outcome
  const outcomeTitle =
    outcome.viewerResult === "victory"
      ? m["sim.postGame.highlight.outcome.victory.title"]({})
      : outcome.viewerResult === "defeat"
        ? m["sim.postGame.highlight.outcome.defeat.title"]({})
        : m["sim.postGame.highlight.outcome.complete.title"]({});
  highlights.push({
    id: "highlight:outcome",
    title: outcomeTitle,
    detail: buildOutcomeDetail(board, outcome.winnerSide, viewerSide),
    emphasis: true,
    turnNumber: analytics.summary.totalTurns,
    actorSide: outcome.winnerSide,
  });

  // Top spotlight cards
  if (derived.topLoreContributors[0]) {
    highlights.push({
      id: "highlight:top-lore-card",
      title: m["sim.postGame.highlight.topLore.title"]({}),
      detail: m["sim.postGame.highlight.topLore.detail"]({
        card: derived.topLoreContributors[0].label,
        value: derived.topLoreContributors[0].value,
      }),
      actorSide: derived.topLoreContributors[0].ownerSide,
    });
  }
  if (derived.mostPlayedCards[0]) {
    highlights.push({
      id: "highlight:most-played-card",
      title: m["sim.postGame.highlight.mostPlayed.title"]({}),
      detail: m["sim.postGame.highlight.mostPlayed.detail"]({
        card: derived.mostPlayedCards[0].label,
        value: derived.mostPlayedCards[0].value,
      }),
      actorSide: derived.mostPlayedCards[0].ownerSide,
    });
  }

  return highlights;
}

function buildTurnSummariesFromAnalytics(analytics: GameAnalyticsSummary): PostGameTurnSummary[] {
  // Merge both players' perTurn arrays into a single list keyed by turn number
  const turnMap = new Map<number, PostGameTurnSummary>();

  for (const player of analytics.players) {
    const side: LorcanaPlayerSide = player.seat === 1 ? "playerOne" : "playerTwo";
    for (const t of player.perTurn) {
      if (!turnMap.has(t.turn)) {
        turnMap.set(t.turn, {
          id: `turn:${t.turn}`,
          turnNumber: t.turn,
          actorSide: side,
          startedAt: 0,
          endedAt: t.durationMs,
          durationMs: t.durationMs,
          moveCount:
            t.cardsPlayedThisTurn +
            t.cardsInkedThisTurn +
            t.questsMadeThisTurn +
            t.challengesMadeThisTurn,
          actions: [],
        });
      }
    }
  }

  return Array.from(turnMap.values()).sort((a, b) => a.turnNumber - b.turnNumber);
}

export function buildPostGameSummary(input: BuildPostGameSummaryInput): PostGameSummary {
  const viewerSide = input.viewerSide ?? null;
  const board = input.board;
  const cardReferenceMap = buildCardReferenceMap(board, input.entries);
  const resolveCard = buildCardResolver(cardReferenceMap);
  const countersBySide = {
    playerOne: createEmptyCounters(),
    playerTwo: createEmptyCounters(),
  } satisfies Record<LorcanaPlayerSide, PostGameActionCounters>;
  const loreContributors = new Map<string, MutableCardAggregate>();
  const playedCards = new Map<string, MutableCardAggregate>();
  const challengedCards = new Map<string, MutableCardAggregate>();
  const triggeredAbilities = new Map<string, MutableAbilityAggregate>();
  const highlights: PostGameHighlight[] = [];
  const timeline: PostGameForensicEntry[] = [];

  let firstChallengeHighlight: PostGameHighlight | null = null;
  let firstQuestHighlight: PostGameHighlight | null = null;
  let concedeHighlight: PostGameHighlight | null = null;

  for (const entry of input.entries) {
    const actorSide = resolveEntryActorSide(board, entry);
    const body = formatEventLogBody(entry, viewerSide, undefined, resolveCard);
    const normalizedBodyText = normalizeTimelineText(entry, body.text, resolveCard);
    const typedMessages = getTypedMessages(entry);
    const moveCategoryId = resolveMoveCategoryId(entry);

    timeline.push({
      id: entry.id,
      turnNumber: entry.turnNumber,
      timestamp: entry.timestamp,
      moveId: entry.moveId,
      actorSide,
      actorTone: resolveActorTone(actorSide, viewerSide),
      moveCategoryId,
      moveCategoryLabel: resolveMoveCategoryLabel(moveCategoryId, entry.moveId),
      timelineIconId: resolveTimelineIconId(moveCategoryId),
      text: normalizedBodyText,
      source: body.source,
      segments: body.segments,
      typedMessages: typedMessages.map((message) => ({
        key: message.key,
        text: renderTypedMessageText(entry, message, viewerSide, resolveCard),
      })),
    });

    if (!actorSide) {
      continue;
    }

    const counters = countersBySide[actorSide];
    switch (entry.moveId) {
      case "playCard": {
        counters.cardsPlayed += 1;
        const cardId = getStringValue(entry.params, "cardId");
        if (cardId) {
          incrementCardAggregate(
            playedCards,
            resolveCardAggregate(cardReferenceMap, cardId, actorSide, ""),
          );
        }
        break;
      }
      case "putCardIntoInkwell":
        counters.inked += 1;
        break;
      case "quest": {
        counters.quests += 1;
        applyLoreContribution(entry, actorSide, cardReferenceMap, loreContributors);
        if (!firstQuestHighlight) {
          firstQuestHighlight = {
            id: `highlight:${entry.id}:quest`,
            title: m["sim.postGame.highlight.quest.title"]({}),
            detail: normalizedBodyText,
            turnNumber: entry.turnNumber,
            actorSide,
          };
        }
        break;
      }
      case "questWithAll": {
        counters.quests += 1;
        applyLoreContribution(entry, actorSide, cardReferenceMap, loreContributors);
        if (!firstQuestHighlight) {
          firstQuestHighlight = {
            id: `highlight:${entry.id}:quest-all`,
            title: m["sim.postGame.highlight.questAll.title"]({}),
            detail: normalizedBodyText,
            turnNumber: entry.turnNumber,
            actorSide,
          };
        }
        break;
      }
      case "challenge": {
        counters.challengeInitiations += 1;
        const attackerId = getStringValue(entry.params, "attackerId");
        const defenderId = getStringValue(entry.params, "defenderId");
        if (attackerId) {
          incrementCardAggregate(
            challengedCards,
            resolveCardAggregate(cardReferenceMap, attackerId, actorSide, ""),
          );
        }
        if (defenderId) {
          incrementCardAggregate(
            challengedCards,
            resolveCardAggregate(
              cardReferenceMap,
              defenderId,
              actorSide === "playerOne" ? "playerTwo" : "playerOne",
              "",
            ),
          );
        }
        if (!firstChallengeHighlight) {
          firstChallengeHighlight = {
            id: `highlight:${entry.id}:challenge`,
            title: m["sim.postGame.highlight.challenge.title"]({}),
            detail: normalizedBodyText,
            turnNumber: entry.turnNumber,
            actorSide,
          };
        }
        break;
      }
      case "moveCharacterToLocation":
        counters.movesToLocations += 1;
        break;
      case "activateAbility":
        counters.abilityActivations += 1;
        applyAbilityContribution(entry, actorSide, cardReferenceMap, triggeredAbilities);
        break;
      case "resolveBag":
      case "resolveEffect":
        counters.effectResolutions += 1;
        applyAbilityContribution(entry, actorSide, cardReferenceMap, triggeredAbilities);
        break;
      case "passTurn":
        counters.passes += 1;
        break;
      case "concede":
        counters.concedes += 1;
        concedeHighlight = {
          id: `highlight:${entry.id}:concede`,
          title: m["sim.postGame.highlight.concede.title"]({}),
          detail: normalizedBodyText,
          emphasis: true,
          turnNumber: entry.turnNumber,
          actorSide,
        };
        break;
      default:
        break;
    }
  }

  const outcome = buildOutcomeSummary(board, viewerSide);
  const outcomeTitle =
    outcome.viewerResult === "victory"
      ? m["sim.postGame.highlight.outcome.victory.title"]({})
      : outcome.viewerResult === "defeat"
        ? m["sim.postGame.highlight.outcome.defeat.title"]({})
        : m["sim.postGame.highlight.outcome.complete.title"]({});
  const outcomeDetail = buildOutcomeDetail(board, outcome.winnerSide, viewerSide);

  highlights.push({
    id: "highlight:outcome",
    title: outcomeTitle,
    detail: outcomeDetail,
    emphasis: true,
    turnNumber: board.turnNumber,
    actorSide: outcome.winnerSide,
  });

  if (concedeHighlight) {
    highlights.push(concedeHighlight);
  }
  if (firstQuestHighlight) {
    highlights.push(firstQuestHighlight);
  }
  if (firstChallengeHighlight) {
    highlights.push(firstChallengeHighlight);
  }

  const topLoreContributors = rankCardAggregates(
    loreContributors,
    m["sim.postGame.spotlight.detail.loreGenerated"]({ value: "{value}" }),
  );
  const mostPlayedCards = rankCardAggregates(
    playedCards,
    m["sim.postGame.spotlight.detail.timesPlayed"]({ value: "{value}" }),
  );
  const mostInvolvedChallengeCards = rankCardAggregates(
    challengedCards,
    m["sim.postGame.spotlight.detail.challenges"]({ value: "{value}" }),
  );
  const mostTriggeredAbilities = rankAbilityAggregates(triggeredAbilities);

  if (topLoreContributors[0]) {
    highlights.push({
      id: "highlight:top-lore-contributor",
      title: m["sim.postGame.highlight.topLore.title"]({}),
      detail: m["sim.postGame.highlight.topLore.detail"]({
        card: topLoreContributors[0].label,
        value: topLoreContributors[0].value,
      }),
      actorSide: topLoreContributors[0].ownerSide,
    });
  }
  if (mostPlayedCards[0]) {
    highlights.push({
      id: "highlight:most-played-card",
      title: m["sim.postGame.highlight.mostPlayed.title"]({}),
      detail: m["sim.postGame.highlight.mostPlayed.detail"]({
        card: mostPlayedCards[0].label,
        value: mostPlayedCards[0].value,
      }),
      actorSide: mostPlayedCards[0].ownerSide,
    });
  }

  const turns = buildTurnSummaries(timeline);

  return {
    board,
    outcome,
    players: {
      playerOne: buildPlayerBoardSummary(board, "playerOne"),
      playerTwo: buildPlayerBoardSummary(board, "playerTwo"),
    },
    countersBySide,
    topLoreContributors,
    mostPlayedCards,
    mostInvolvedChallengeCards,
    mostTriggeredAbilities,
    highlights: highlights.slice(0, 6),
    timeline,
    turns,
    totalLogEntries: input.entries.length,
  };
}

function getTypedMessages(entry: MoveLogEntrySnapshot): LorcanaLogMessage[] {
  if (!entry.typedLogEntry) return [];
  if ("moveType" in entry.typedLogEntry && Array.isArray(entry.typedLogEntry.public)) {
    return entry.typedLogEntry.public;
  }
  if (!("values" in entry.typedLogEntry)) return [];
  return [
    {
      key: entry.typedLogEntry.type,
      values: entry.typedLogEntry.values,
    } as LorcanaLogMessage,
  ];
}

function createEmptyCounters(): PostGameActionCounters {
  return {
    cardsPlayed: 0,
    inked: 0,
    quests: 0,
    challengeInitiations: 0,
    movesToLocations: 0,
    abilityActivations: 0,
    effectResolutions: 0,
    passes: 0,
    concedes: 0,
  };
}

function buildTurnSummaries(entries: PostGameForensicEntry[]): PostGameTurnSummary[] {
  const turns: PostGameTurnSummary[] = [];

  for (const entry of entries) {
    const currentTurn = turns.at(-1);
    if (!currentTurn || currentTurn.turnNumber !== entry.turnNumber) {
      turns.push({
        id: `turn-${entry.turnNumber}`,
        turnNumber: entry.turnNumber,
        actorSide: entry.actorSide,
        startedAt: entry.timestamp,
        endedAt: entry.timestamp,
        durationMs: 0,
        moveCount: 1,
        actions: [entry],
      });
      continue;
    }

    currentTurn.actions.push(entry);
    currentTurn.endedAt = entry.timestamp;
    currentTurn.durationMs = Math.max(0, currentTurn.endedAt - currentTurn.startedAt);
    currentTurn.moveCount += 1;
    if (!currentTurn.actorSide && entry.actorSide) {
      currentTurn.actorSide = entry.actorSide;
    }
  }

  return turns;
}

function buildPlayerBoardSummary(board: LorcanaProjectedBoardView, side: LorcanaPlayerSide) {
  const ownerId = getOwnerIdForSide(board, side);
  const projected = ownerId ? board.players[ownerId] : null;
  const playCardIds = getZoneCardIds(board, side, "play");
  let readyCount = 0;
  let exertedCount = 0;

  for (const cardId of playCardIds) {
    if (board.cards[cardId]?.exerted) {
      exertedCount += 1;
    } else {
      readyCount += 1;
    }
  }

  return {
    side,
    lore: projected?.lore ?? 0,
    deckCount: projected?.deckCount ?? 0,
    handCount: projected?.handCount ?? 0,
    discardCount: projected?.discard.length ?? 0,
    inkwellCount: projected?.inkwell.length ?? 0,
    availableInk: getAvailableInkForSide(board, side),
    boardCount: playCardIds.length,
    readyCount,
    exertedCount,
  };
}

function buildOutcomeSummary(
  board: LorcanaProjectedBoardView,
  viewerSide: LorcanaPlayerSide | null,
) {
  const winnerSide = resolveWinnerSide(board);
  const loserSide =
    winnerSide === "playerOne" ? "playerTwo" : winnerSide === "playerTwo" ? "playerOne" : null;

  return {
    winnerSide,
    loserSide,
    reason: board.reason,
    finalTurnNumber: board.turnNumber,
    viewerSide,
    viewerResult:
      winnerSide && viewerSide
        ? winnerSide === viewerSide
          ? "victory"
          : "defeat"
        : viewerSide
          ? "unknown"
          : "spectator",
  } as const;
}

function resolveWinnerSide(board: LorcanaProjectedBoardView): LorcanaPlayerSide | null {
  if (typeof board.winner !== "string") {
    return null;
  }

  if (board.winner === "player_one") {
    return "playerOne";
  }

  if (board.winner === "player_two") {
    return "playerTwo";
  }

  return getSideForOwnerId(board, board.winner);
}

function buildCardReferenceMap(
  board: LorcanaProjectedBoardView,
  _entries: MoveLogEntrySnapshot[],
): Map<string, CardReferenceMeta> {
  const cards = new Map<string, CardReferenceMeta>();

  for (const side of PLAYER_SIDES) {
    for (const zoneId of ["play", "hand", "inkwell", "discard"] as const) {
      for (const cardId of getZoneCardIds(board, side, zoneId)) {
        if (!cards.has(cardId)) {
          const boardCard = board.cards[cardId];
          cards.set(cardId, {
            cardId,
            label: boardCard?.fullName ?? cardId,
            ownerSide: side,
            loreValue: boardCard?.lore ?? null,
          });
        }
      }
    }
  }

  // Capture any remaining cards from board.cards that weren't in a zone
  // (e.g. cards referenced in log entries but removed from zones).
  for (const [cardId, boardCard] of Object.entries(board.cards)) {
    if (!cards.has(cardId) && boardCard) {
      cards.set(cardId, {
        cardId,
        label: boardCard.fullName ?? cardId,
        ownerSide: null,
        loreValue: boardCard.lore ?? null,
      });
    }
  }

  return cards;
}

function buildCardResolver(
  cardReferenceMap: Map<string, CardReferenceMeta>,
): CardReferenceResolver {
  return (cardId: string) => {
    const card = cardReferenceMap.get(cardId);
    if (!card) return null;
    return { label: card.label };
  };
}

function resolveEntryActorSide(
  board: LorcanaProjectedBoardView,
  entry: MoveLogEntrySnapshot,
): LorcanaPlayerSide | null {
  if (entry.actorSide) {
    return entry.actorSide;
  }

  const rawPlayerId = entry.playerId;
  if (!rawPlayerId) {
    return null;
  }

  if (rawPlayerId === "player_one") {
    return "playerOne";
  }

  if (rawPlayerId === "player_two") {
    return "playerTwo";
  }

  return getSideForOwnerId(board, rawPlayerId);
}

function resolveActorTone(
  actorSide: LorcanaPlayerSide | null,
  viewerSide: LorcanaPlayerSide | null,
): PostGameActorTone {
  if (!actorSide) {
    return "system";
  }

  if (viewerSide && actorSide === viewerSide) {
    return "self";
  }

  if (viewerSide && actorSide !== viewerSide) {
    return "opponent";
  }

  return actorSide;
}

function renderTypedMessageText(
  entry: MoveLogEntrySnapshot,
  message: LorcanaLogMessage,
  viewerSide: LorcanaPlayerSide | null,
  resolveCard?: CardReferenceResolver,
): string {
  const legacyTypedEntry =
    entry.typedLogEntry && "values" in entry.typedLogEntry ? entry.typedLogEntry : undefined;
  const syntheticEntry: MoveLogEntrySnapshot = {
    ...entry,
    typedLogEntry: {
      type: message.key,
      values: message.values,
      visibility: legacyTypedEntry?.visibility ?? { mode: "PUBLIC" },
      category: legacyTypedEntry?.category ?? "action",
    } as import("@tcg/lorcana-engine").LorcanaGameLogEntry,
  };

  return formatEventLogBody(syntheticEntry, viewerSide, undefined, resolveCard).text;
}

function buildOutcomeDetail(
  board: LorcanaProjectedBoardView,
  winnerSide: LorcanaPlayerSide | null,
  viewerSide: LorcanaPlayerSide | null,
): string {
  const normalizedReason = normalizeOutcomeReason(board.reason);
  if (normalizedReason) {
    return normalizedReason;
  }

  if (winnerSide) {
    return m["sim.postGame.highlight.outcome.winnerDetail"]({
      winner: sideToLabel(winnerSide, viewerSide),
      turn: board.turnNumber,
    });
  }

  return m["sim.postGame.highlight.outcome.finishedDetail"]({
    turn: board.turnNumber,
  });
}

function resolveCardReference(
  cardReferenceMap: Map<string, CardReferenceMeta>,
  cardId: string,
): { label?: string } | null {
  const card = cardReferenceMap.get(cardId);
  if (!card) {
    return null;
  }

  return {
    label: card.label,
  };
}

function resolveMoveCategoryId(
  entry: MoveLogEntrySnapshot,
): PostGameForensicEntry["moveCategoryId"] {
  switch (entry.moveId) {
    case "resolveBag":
    case "resolveEffect":
      return "activate-ability";
    default:
      return getMoveCategoryId(entry.moveId);
  }
}

function resolveTimelineIconId(
  moveCategoryId: PostGameForensicEntry["moveCategoryId"],
): PostGameTimelineIconId {
  return moveCategoryId === "unknown" ? "system" : moveCategoryId;
}

function resolveMoveCategoryLabel(
  moveCategoryId: PostGameForensicEntry["moveCategoryId"],
  moveId: MoveLogEntrySnapshot["moveId"],
): string {
  if (moveCategoryId === "activate-ability" && moveId !== "activateAbility") {
    return m["sim.actions.label.activateAbility"]({});
  }

  return getMoveCategoryLabel(moveId);
}

function resolveCardAggregate(
  cardReferenceMap: Map<string, CardReferenceMeta>,
  cardId: string,
  ownerSide: LorcanaPlayerSide | null,
  detail: string,
): MutableCardAggregate {
  const card = cardReferenceMap.get(cardId);

  return {
    cardId,
    label: card?.label ?? cardId,
    ownerSide: card?.ownerSide ?? ownerSide,
    value: 1,
    detail,
  };
}

function incrementCardAggregate(
  store: Map<string, MutableCardAggregate>,
  aggregate: MutableCardAggregate,
  incrementBy = 1,
): void {
  const existing = store.get(aggregate.cardId);
  if (existing) {
    existing.value += incrementBy;
    return;
  }

  store.set(aggregate.cardId, {
    ...aggregate,
    value: incrementBy,
  });
}

function applyLoreContribution(
  entry: MoveLogEntrySnapshot,
  actorSide: LorcanaPlayerSide,
  cardReferenceMap: Map<string, CardReferenceMeta>,
  store: Map<string, MutableCardAggregate>,
): void {
  const params = entry.params;

  if (entry.moveId === "quest") {
    const cardId = getStringValue(params, "cardId");
    if (!cardId) {
      return;
    }

    const loreGained = getMoveLogLoreGained(entry) ?? 0;
    incrementCardAggregate(
      store,
      resolveCardAggregate(cardReferenceMap, cardId, actorSide, ""),
      Math.max(1, loreGained),
    );
    return;
  }

  if (entry.moveId !== "questWithAll") {
    return;
  }

  // cardIds come from the MoveLog (typedLogEntry), not from move params
  // (questWithAll takes Record<string, never> args — no cardIds in params)
  const cardIds = getMoveLogCardIds(entry) ?? getStringArrayValue(params, "cardIds");
  if (cardIds.length === 0) {
    return;
  }

  const totalLore =
    getMoveLogTotalLore(entry) ??
    getNumericValueFromMessages(entry, "loreGained") ??
    cardIds.length;
  const knownLoreTotal = cardIds.reduce((sum, cardId) => {
    return sum + Math.max(0, cardReferenceMap.get(cardId)?.loreValue ?? 0);
  }, 0);

  const fallbackLore =
    knownLoreTotal > 0 ? null : Math.max(1, Math.floor(totalLore / Math.max(1, cardIds.length)));

  for (const [index, cardId] of cardIds.entries()) {
    const knownLore = cardReferenceMap.get(cardId)?.loreValue ?? null;
    const contribution =
      knownLore !== null && knownLore > 0
        ? knownLore
        : fallbackLore !== null
          ? fallbackLore
          : index === 0
            ? Math.max(1, totalLore - knownLoreTotal)
            : 1;

    incrementCardAggregate(
      store,
      resolveCardAggregate(cardReferenceMap, cardId, actorSide, ""),
      Math.max(1, contribution),
    );
  }
}

function getMoveLogLoreGained(entry: MoveLogEntrySnapshot): number | null {
  const log = entry.typedLogEntry;
  if (log && "loreGained" in log && typeof log.loreGained === "number") {
    return log.loreGained;
  }
  return getNumericValueFromMessages(entry, "loreGained");
}

function getMoveLogCardIds(entry: MoveLogEntrySnapshot): string[] | null {
  for (const message of getTypedMessages(entry)) {
    if (message.key !== "lorcana.move.questWithAll") {
      continue;
    }
    const cardIds = message.values.cardIds;
    if (Array.isArray(cardIds)) {
      return cardIds.filter((id) => typeof id === "string").map((id) => String(id));
    }
  }
  return null;
}

function getMoveLogTotalLore(entry: MoveLogEntrySnapshot): number | null {
  const log = entry.typedLogEntry;
  if (log && "totalLore" in log && typeof log.totalLore === "number") {
    return log.totalLore;
  }
  return null;
}

function applyAbilityContribution(
  entry: MoveLogEntrySnapshot,
  actorSide: LorcanaPlayerSide,
  cardReferenceMap: Map<string, CardReferenceMeta>,
  store: Map<string, MutableAbilityAggregate>,
): void {
  const typedMessages = getTypedMessages(entry);
  let recorded = false;

  for (const message of typedMessages) {
    const abilityName =
      "abilityName" in message.values && typeof message.values.abilityName === "string"
        ? message.values.abilityName
        : null;
    const sourceCardId =
      ("cardId" in message.values && typeof message.values.cardId === "string"
        ? message.values.cardId
        : null) ??
      ("sourceId" in message.values && typeof message.values.sourceId === "string"
        ? message.values.sourceId
        : null) ??
      ("sourceCardId" in message.values && typeof message.values.sourceCardId === "string"
        ? message.values.sourceCardId
        : null);

    if (!abilityName && !sourceCardId) {
      continue;
    }

    const card = sourceCardId ? cardReferenceMap.get(sourceCardId) : null;
    const label = abilityName ?? card?.label ?? m["sim.postGame.ability.unnamed"]({});
    const key = `${sourceCardId ?? "no-card"}:${label}`;
    const existing = store.get(key);

    if (existing) {
      existing.count += 1;
    } else {
      store.set(key, {
        label,
        cardId: sourceCardId,
        cardLabel: card?.label ?? null,
        ownerSide: card?.ownerSide ?? actorSide,
        count: 1,
      });
    }
    recorded = true;
  }

  if (recorded) {
    return;
  }

  if (entry.moveId !== "activateAbility") {
    return;
  }

  const sourceCardId = getStringValue(entry.params, "cardId");
  if (!sourceCardId) {
    return;
  }

  const card = cardReferenceMap.get(sourceCardId);
  const fallbackActivatedAbilityLabel = m["sim.postGame.ability.activated"]({});
  const key = `${sourceCardId}:${fallbackActivatedAbilityLabel}`;
  const existing = store.get(key);
  if (existing) {
    existing.count += 1;
    return;
  }

  store.set(key, {
    label: fallbackActivatedAbilityLabel,
    cardId: sourceCardId,
    cardLabel: card?.label ?? null,
    ownerSide: card?.ownerSide ?? actorSide,
    count: 1,
  });
}

function rankCardAggregates(
  store: Map<string, MutableCardAggregate>,
  detailLabel: string,
): PostGameSpotlightCard[] {
  return [...store.values()]
    .sort((left, right) => {
      if (right.value !== left.value) {
        return right.value - left.value;
      }
      return left.label.localeCompare(right.label);
    })
    .slice(0, 5)
    .map((entry) => ({
      id: entry.cardId,
      cardId: entry.cardId,
      label: entry.label,
      ownerSide: entry.ownerSide,
      value: entry.value,
      detail: detailLabel.replace("{value}", String(entry.value)),
    }));
}

function rankAbilityAggregates(
  store: Map<string, MutableAbilityAggregate>,
): PostGameSpotlightAbility[] {
  return [...store.entries()]
    .sort(([, left], [, right]) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }
      return left.label.localeCompare(right.label);
    })
    .slice(0, 5)
    .map(([id, entry]) => ({
      id,
      label: entry.label,
      cardId: entry.cardId,
      cardLabel: entry.cardLabel,
      ownerSide: entry.ownerSide,
      count: entry.count,
    }));
}

function getNumericValueFromMessages(entry: MoveLogEntrySnapshot, key: string): number | null {
  const typedMessages = getTypedMessages(entry);

  for (const message of typedMessages) {
    const candidate = message.values[key as keyof typeof message.values];
    if (typeof candidate === "number") {
      return candidate;
    }
  }

  const raw = entry.params?.[key];
  return typeof raw === "number" ? raw : null;
}

function getStringValue(values: SimulatorSerializedObject | undefined, key: string): string | null {
  const candidate = values?.[key];
  return typeof candidate === "string" ? candidate : null;
}

function getStringArrayValue(values: SimulatorSerializedObject | undefined, key: string): string[] {
  const candidate = values?.[key];
  if (!Array.isArray(candidate)) {
    return [];
  }

  return candidate.filter((value): value is string => typeof value === "string");
}

function sideToLabel(side: LorcanaPlayerSide, viewerSide: LorcanaPlayerSide | null): string {
  if (viewerSide && side === viewerSide) {
    return m["sim.player.you"]({});
  }

  if (viewerSide && side !== viewerSide) {
    return m["sim.player.opponent"]({});
  }

  return side === "playerOne"
    ? m["sim.player.side.playerOne"]({})
    : m["sim.player.side.playerTwo"]({});
}

function createPersistedMoveLogEntries(postGame: PostGameCanonicalData): MoveLogEntrySnapshot[] {
  if (!postGame.acceptedMoves || !postGame.engineLogs) return [];
  return postGame.acceptedMoves.flatMap((acceptedMove, index) => {
    const matchingLog = postGame.engineLogs!.find(
      (record) => record.stateVersion === acceptedMove.stateVersion,
    );
    const actorSide = postGame.players.find((player) => player.id === acceptedMove.actorId)?.side;
    const entry: MoveLogEntrySnapshot = {
      actorSide,
      id: `post-game-${acceptedMove.stateVersion}-${index}-${acceptedMove.moveId}`,
      moveId: acceptedMove.moveId as MoveLogEntrySnapshot["moveId"],
      playerId: acceptedMove.actorId,
      params: normalizePersistedMoveParams(acceptedMove.input),
      timestamp: acceptedMove.timestamp,
      title: "",
      turnNumber: acceptedMove.turnNumber,
      typedLogEntry: matchingLog?.log as MoveLogEntrySnapshot["typedLogEntry"],
    };
    const presentation = formatEventLogBody(entry);

    return [
      {
        ...entry,
        title: matchingLog ? normalizeTimelineText(entry, presentation.text) : "",
      },
    ];
  });
}

function normalizePersistedMoveParams(input?: unknown): SimulatorSerializedObject | undefined {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return undefined;
  }

  const args = "args" in input ? input.args : undefined;
  if (!args || typeof args !== "object" || Array.isArray(args)) {
    return undefined;
  }

  return args as SimulatorSerializedObject;
}

function normalizeTimelineText(
  entry: MoveLogEntrySnapshot,
  text: string,
  resolveCard?: CardReferenceResolver,
): string {
  const shouldUseFallback = (genericLabels: string[] = []) => {
    if (!text) {
      return true;
    }

    if (text === entry.moveId) {
      return true;
    }

    return genericLabels.includes(text);
  };

  const labelFor = (cardId: string | null) => {
    if (!cardId) {
      return null;
    }
    return resolveCard?.(cardId)?.label ?? cardId;
  };

  switch (entry.moveId) {
    case "putCardIntoInkwell": {
      if (!shouldUseFallback([m["sim.actions.label.inkCard"]({})])) {
        return text;
      }

      const cardLabel = labelFor(getStringValue(entry.params, "cardId"));
      return cardLabel
        ? m["sim.postGame.fallback.inkCard.named"]({ card: cardLabel })
        : m["sim.actions.label.inkCard"]({});
    }
    case "questWithAll":
      if (!shouldUseFallback([m["sim.actions.label.quest"]({})])) {
        return text;
      }

      return m["sim.postGame.fallback.questWithAll"]({});
    case "moveCharacterToLocation": {
      if (!shouldUseFallback([m["sim.actions.label.moveToLocation"]({})])) {
        return text;
      }

      const character = labelFor(getStringValue(entry.params, "characterId"));
      const location = labelFor(getStringValue(entry.params, "locationId"));
      if (character && location) {
        return m["sim.postGame.fallback.moveToLocation.named"]({
          character,
          location,
        });
      }
      return m["sim.actions.label.moveToLocation"]({});
    }
    case "passTurn":
      if (!shouldUseFallback([m["sim.actions.label.passTurn"]({})])) {
        return text;
      }

      return m["sim.postGame.fallback.passTurn"]({});
    case "concede":
      if (!shouldUseFallback([m["sim.actions.label.concede"]({})])) {
        return text;
      }

      return m["sim.postGame.fallback.concede"]({});
    case "challenge":
      if (!shouldUseFallback([m["sim.actions.label.challenge"]({})])) {
        return text;
      }

      return m["sim.actions.label.challenge"]({});
    case "playCard":
      if (!shouldUseFallback([m["sim.actions.label.playCard"]({})])) {
        return text;
      }

      return m["sim.actions.label.playCard"]({});
    case "activateAbility":
    case "resolveEffect":
    case "resolveBag":
      if (!shouldUseFallback([m["sim.actions.label.activateAbility"]({})])) {
        return text;
      }

      return m["sim.actions.label.activateAbility"]({});
    case "quest":
      if (!shouldUseFallback([m["sim.actions.label.quest"]({})])) {
        return text;
      }

      return m["sim.actions.label.quest"]({});
    default:
      return text || getMoveCategoryLabel(entry.moveId);
  }
}

function normalizeOutcomeReason(reason: string | null | undefined): string | null {
  if (!reason) {
    return null;
  }

  if (reason === "Game completed") {
    return null;
  }

  return reason;
}

// ─── Analytics-Derived Summary Data ──────────────────────────────────────────

/**
 * Input type for the analytics adapter — matches the shape from the API's
 * GameAnalyticsRecord without importing the server-side type directly.
 */
export interface AnalyticsPlayerData {
  playerId: string;
  seat: 1 | 2;
  counters: {
    cardsPlayed: number;
    cardsInked: number;
    quests: number;
    challenges: number;
    movesToLocations: number;
    abilitiesActivated: number;
    effectsResolved: number;
    turnsPassed: number;
    conceded: boolean;
  };
  cardEvents: Record<
    string,
    {
      cardPublicId: string;
      fullName: string;
      loreGenerated: number;
      timesPlayed: number;
      timesAttacked: number;
      timesDefended: number;
      timesAbilityActivated: number;
    }
  >;
}

export interface AnalyticsSummaryInput {
  players: [AnalyticsPlayerData, AnalyticsPlayerData];
}

/**
 * Extract PostGameActionCounters and spotlight cards from a GameAnalyticsRecord.
 * Use this to enrich the post-game UI with analytics data without needing
 * the full board or timeline.
 */
export function buildAnalyticsDerivedData(input: AnalyticsSummaryInput): {
  countersBySide: Record<LorcanaPlayerSide, PostGameActionCounters>;
  topLoreContributors: PostGameSpotlightCard[];
  mostPlayedCards: PostGameSpotlightCard[];
  mostInvolvedChallengeCards: PostGameSpotlightCard[];
} {
  const sideForSeat = (seat: 1 | 2): LorcanaPlayerSide => (seat === 1 ? "playerOne" : "playerTwo");

  const countersBySide: Record<LorcanaPlayerSide, PostGameActionCounters> = {
    playerOne: createEmptyCounters(),
    playerTwo: createEmptyCounters(),
  };

  const loreAgg: PostGameSpotlightCard[] = [];
  const playedAgg: PostGameSpotlightCard[] = [];
  const challengeAgg: PostGameSpotlightCard[] = [];

  for (const player of input.players) {
    const side = sideForSeat(player.seat);
    const c = player.counters;
    countersBySide[side] = {
      cardsPlayed: c.cardsPlayed,
      inked: c.cardsInked,
      quests: c.quests,
      challengeInitiations: c.challenges,
      movesToLocations: c.movesToLocations,
      abilityActivations: c.abilitiesActivated,
      effectResolutions: c.effectsResolved,
      passes: c.turnsPassed,
      concedes: c.conceded ? 1 : 0,
    };

    for (const [cardId, ev] of Object.entries(player.cardEvents)) {
      if (ev.loreGenerated > 0) {
        loreAgg.push({
          id: `lore-${cardId}-${side}`,
          cardId,
          label: ev.fullName,
          ownerSide: side,
          value: ev.loreGenerated,
          detail: m["sim.postGame.spotlight.detail.loreGenerated"]({
            value: String(ev.loreGenerated),
          }),
        });
      }
      if (ev.timesPlayed > 0) {
        playedAgg.push({
          id: `played-${cardId}-${side}`,
          cardId,
          label: ev.fullName,
          ownerSide: side,
          value: ev.timesPlayed,
          detail: m["sim.postGame.spotlight.detail.timesPlayed"]({ value: String(ev.timesPlayed) }),
        });
      }
      const challengeCount = ev.timesAttacked + ev.timesDefended;
      if (challengeCount > 0) {
        challengeAgg.push({
          id: `challenge-${cardId}-${side}`,
          cardId,
          label: ev.fullName,
          ownerSide: side,
          value: challengeCount,
          detail: m["sim.postGame.spotlight.detail.challenges"]({ value: String(challengeCount) }),
        });
      }
    }
  }

  const sortDesc = (a: PostGameSpotlightCard, b: PostGameSpotlightCard) => b.value - a.value;

  return {
    countersBySide,
    topLoreContributors: loreAgg.sort(sortDesc).slice(0, 5),
    mostPlayedCards: playedAgg.sort(sortDesc).slice(0, 5),
    mostInvolvedChallengeCards: challengeAgg.sort(sortDesc).slice(0, 5),
  };
}
