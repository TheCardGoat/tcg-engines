import { describe, expect, it } from "bun:test";
import { render } from "svelte/server";

import MatchmakingQueueCard from "./MatchmakingQueueCard.test-host.svelte";
import type { RankJourneyView } from "./matchmaking-lobby.constants";

const placementJourney = (gamesPlayed: number): RankJourneyView => ({
  bracket: "placement",
  bracketLabel: "Placement",
  gamesPlayed,
  gamesWon: 0,
  losses: 0,
  mmr: null,
  nextBracket: null,
  nextBracketLabel: null,
  nextWinsRequired: null,
  winsToNext: null,
  mmrToMaster: null,
  progressLabel: `${gamesPlayed}/20 placement games`,
  progressValue: gamesPlayed,
  progressMax: 20,
  progressPercent: (gamesPlayed / 20) * 100,
  primaryGoal: `${20 - gamesPlayed} games to reveal MMR`,
});

const silverJourney: RankJourneyView = {
  bracket: "silver",
  bracketLabel: "Silver",
  gamesPlayed: 31,
  gamesWon: 23,
  losses: 8,
  mmr: 1264,
  nextBracket: "gold",
  nextBracketLabel: "Gold",
  nextWinsRequired: 30,
  winsToNext: 7,
  mmrToMaster: null,
  progressLabel: "23/30 wins to Gold",
  progressValue: 23,
  progressMax: 30,
  progressPercent: 76.67,
  primaryGoal: "7 wins to Gold",
};

const baseProps = {
  status: "idle" as const,
  position: null,
  isAuthenticated: true,
  savingSelection: false,
  selectionDisabled: false,
  selectedQueueMode: "1" as const,
  selectedMatchType: "ranked" as const,
  rankedEnabled: false,
  testingEnabled: false,
  cards: [
    {
      definition: {
        format: "infinity" as const,
        labelKey: "sim.matchmaking.matchmaking.formats.infinity" as const,
        accentClass: "from-sky-400/20 via-sky-400/8 to-transparent",
      },
      stats: {
        format: "infinity" as const,
        mode: "1" as const,
        matchType: "ranked" as const,
        inQueue: 12,
        liveMatches: 4,
        placement: null,
      },
      isSelected: true,
      isActive: true,
      isDeckValid: true,
      winStreak: 0,
      mmr: null,
      placementGamesPlayed: null,
      rankJourney: null,
    },
  ],
  isDeckValidForSelectedFormat: true,
  hasDeckSelected: true,
  activeQueueFormat: "infinity" as const,
  activeQueueMode: "1" as const,
  queuedDeck: null,
  queuedProfile: null,
  wsConnected: true,
  queueActionDisabled: false,
  queueActionDisabledLabel: "Select a deck first",
  joinLabel: "Join Queue Infinity - Bo1",
  elapsedLabel: "0:45",
  remainingLabel: "4:15",
  progressPercent: 85,
  error: null,
  queuedAiError: null,
  matchCountdown: null,
  opponentDisplayName: null,
  selfAccepted: false,
  opponentAccepted: false,
  acceptTimeRemainingMs: 0,
  onSelectQueueMode: () => {},
  onSelectMatchType: () => {},
  onSelectQueueFormat: () => {},
  onJoinQueue: () => {},
  onLeaveQueue: () => {},
  onSkipCountdown: () => {},
  colorPreferenceCount: 0,
  modeStats: [
    { mode: "1" as const, inQueue: 12, liveMatches: 4 },
    { mode: "3" as const, inQueue: 5, liveMatches: 2 },
  ],
  matchTypeStats: [
    { matchType: "ranked" as const, inQueue: 0, liveMatches: 0 },
    { matchType: "casual" as const, inQueue: 17, liveMatches: 6 },
  ],
  onAcceptMatch: () => {},
  onDeclineMatch: () => {},
};

describe("MatchmakingQueueCard", () => {
  it("renders win streak badge when winStreak > 0", () => {
    const { body } = render(MatchmakingQueueCard, {
      props: {
        ...baseProps,
        cards: [{ ...baseProps.cards[0]!, winStreak: 3, mmr: null, placementGamesPlayed: null }],
      },
    });

    // The win streak badge has a unique orange class; tooltip content is not SSR-rendered
    expect(body).toContain("border-orange-400/20");
  });

  it("does not render win streak badge when winStreak is 0", () => {
    const { body } = render(MatchmakingQueueCard, {
      props: baseProps, // baseProps has winStreak: 0
    });

    expect(body).not.toContain("border-orange-400/20");
  });

  it("renders MMR badge when mmr is set, regardless of match type", () => {
    for (const selectedMatchType of ["ranked", "casual"] as const) {
      const { body } = render(MatchmakingQueueCard, {
        props: {
          ...baseProps,
          selectedMatchType,
          cards: [{ ...baseProps.cards[0]!, winStreak: 0, mmr: 1250, placementGamesPlayed: null }],
        },
      });

      expect(body).toContain("1250");
      expect(body).toContain("border-amber-400/20");
    }
  });

  it("renders a placement rank journey when player has never played ranked", () => {
    const { body } = render(MatchmakingQueueCard, {
      props: {
        ...baseProps,
        cards: [
          {
            ...baseProps.cards[0]!,
            winStreak: 0,
            mmr: null,
            placementGamesPlayed: 0,
            rankJourney: placementJourney(0),
          },
        ],
      },
    });

    expect(body).toContain("Placement");
    expect(body).toContain("0/20 placement games");
    expect(body).toContain("20 games to reveal MMR");
  });

  it("does not render placement indicator on casual queues (placementGamesPlayed null)", () => {
    const { body } = render(MatchmakingQueueCard, {
      props: {
        ...baseProps,
        selectedMatchType: "casual" as const,
        cards: [{ ...baseProps.cards[0]!, winStreak: 0, mmr: null, placementGamesPlayed: null }],
      },
    });

    expect(body).not.toContain("placement games");
  });

  it("renders N/20 placement progress when player has some ranked games but no mmr yet", () => {
    const { body } = render(MatchmakingQueueCard, {
      props: {
        ...baseProps,
        cards: [
          {
            ...baseProps.cards[0]!,
            winStreak: 0,
            mmr: null,
            placementGamesPlayed: 7,
            rankJourney: placementJourney(7),
          },
        ],
      },
    });

    expect(body).toContain("Placement");
    expect(body).toContain("7/20 placement games");
    expect(body).toContain("13 games to reveal MMR");
  });

  it("renders bracket progress and MMR once placement is complete", () => {
    const { body } = render(MatchmakingQueueCard, {
      props: {
        ...baseProps,
        cards: [
          {
            ...baseProps.cards[0]!,
            winStreak: 0,
            mmr: 1264,
            placementGamesPlayed: 31,
            rankJourney: silverJourney,
          },
        ],
      },
    });

    expect(body).not.toContain("placement games");
    expect(body).toContain("border-amber-400/20");
    expect(body).toContain("Silver");
    expect(body).toContain("1264 MMR");
    expect(body).toContain("7 wins to Gold");
    expect(body).toContain("Silver rank details");
  });

  it("renders the ranked tab as disabled with a coming-soon badge when rankedEnabled is false", () => {
    const { body } = render(MatchmakingQueueCard, {
      props: { ...baseProps, rankedEnabled: false },
    });

    expect(body).toContain('aria-disabled="true"');
    expect(body).toContain("Soon");
  });

  it("renders the ranked tab as a selectable button when rankedEnabled is true", () => {
    const { body } = render(MatchmakingQueueCard, {
      props: { ...baseProps, rankedEnabled: true, selectedMatchType: "casual" as const },
    });

    expect(body).not.toContain("Soon");
    // Ranked tab is now an enabled button alongside Casual
    expect(body).toContain(">Ranked<");
  });

  it("hides the BO1/BO3 selector entirely when ranked is selected", () => {
    const { body } = render(MatchmakingQueueCard, {
      props: { ...baseProps, selectedMatchType: "ranked" as const },
    });

    expect(body).not.toContain(">BO1<");
    expect(body).not.toContain(">BO3<");
  });

  it("shows both BO1 and BO3 tabs in casual", () => {
    const { body } = render(MatchmakingQueueCard, {
      props: { ...baseProps, selectedMatchType: "casual" as const },
    });

    expect(body).toContain(">BO1<");
    expect(body).toContain(">BO3<");
  });

  it("renders elapsed and remaining queue timers with the leave-queue CTA while queued", () => {
    const { body } = render(MatchmakingQueueCard, {
      props: {
        ...baseProps,
        status: "queued" as const,
        queuedDeck: {
          deckId: "deck-1",
          deckName: "Ruby Sapphire",
          activeDeckVersionId: "version-1",
          activeDeckListId: "deck-list-1",
          cardCount: 60,
          colorMask: 3,
          updatedAt: "2026-03-31T00:00:00.000Z",
          validFormats: ["infinity"],
        },
        queuedProfile: {
          gameProfileId: "profile-1",
          displayName: "Tester",
          selectedDeckId: "deck-1",
          selectedDeckSummary: null,
          decks: null,
        },
      },
    });

    expect(body).toContain("Searching");
    expect(body).toContain("0:45");
    expect(body).toContain("4:15");
    expect(body).toContain("Leave queue");
    expect(body).toContain("Ruby Sapphire");
  });
});
