import { describe, expect, it } from "bun:test";
import { render } from "svelte/server";

import type { PostGameSummary } from "./types.js";
import PostGameTimelineSection from "./PostGameTimelineSection.svelte";

function createSummary(): PostGameSummary {
  const action = {
    id: "entry-1",
    turnNumber: 1,
    timestamp: 1_000,
    moveId: "playCard" as const,
    actorSide: "playerOne" as const,
    actorTone: "self" as const,
    moveCategoryId: "play-card" as const,
    moveCategoryLabel: "Play Card",
    timelineIconId: "play-card" as const,
    text: "Played Ariel - On Human Legs",
    source: "typed" as const,
    segments: [
      { kind: "text" as const, text: "Played " },
      {
        kind: "card" as const,
        cardId: "card-ariel",
        fallbackLabel: "Ariel - On Human Legs",
      },
    ],
    typedMessages: [
      {
        key: "lorcana.move.playCard",
        text: "Played Ariel - On Human Legs",
      },
    ],
  };

  return {
    board: {
      turnNumber: 4,
      reason: null,
    } as unknown as PostGameSummary["board"],
    outcome: {
      winnerSide: "playerOne",
      loserSide: "playerTwo",
      reason: null,
      finalTurnNumber: 4,
      viewerSide: "playerOne",
      viewerResult: "victory",
    },
    players: {
      playerOne: {
        side: "playerOne",
        lore: 20,
        deckCount: 22,
        handCount: 3,
        discardCount: 4,
        inkwellCount: 7,
        availableInk: 4,
        boardCount: 2,
        readyCount: 1,
        exertedCount: 1,
      },
      playerTwo: {
        side: "playerTwo",
        lore: 13,
        deckCount: 18,
        handCount: 2,
        discardCount: 5,
        inkwellCount: 6,
        availableInk: 2,
        boardCount: 1,
        readyCount: 1,
        exertedCount: 0,
      },
    },
    countersBySide: {
      playerOne: {
        cardsPlayed: 3,
        inked: 4,
        quests: 5,
        challengeInitiations: 1,
        movesToLocations: 0,
        abilityActivations: 1,
        effectResolutions: 1,
        passes: 2,
        concedes: 0,
      },
      playerTwo: {
        cardsPlayed: 2,
        inked: 3,
        quests: 4,
        challengeInitiations: 2,
        movesToLocations: 0,
        abilityActivations: 0,
        effectResolutions: 0,
        passes: 2,
        concedes: 0,
      },
    },
    topLoreContributors: [],
    mostPlayedCards: [],
    mostInvolvedChallengeCards: [],
    mostTriggeredAbilities: [],
    highlights: [
      {
        id: "highlight:outcome",
        title: "Victory secured",
        detail: "You won on turn 4.",
        emphasis: true,
        turnNumber: 4,
        actorSide: "playerOne",
      },
    ],
    timeline: [action],
    turns: [
      {
        id: "turn-1",
        turnNumber: 1,
        actorSide: "playerOne",
        startedAt: 1_000,
        endedAt: 1_000,
        durationMs: 0,
        moveCount: 1,
        actions: [action],
      },
    ],
    totalLogEntries: 1,
  };
}

describe("PostGameTimelineSection", () => {
  it("renders timeline turns collapsed by default", () => {
    const summary = createSummary();
    const { body } = render(PostGameTimelineSection, {
      props: {
        turns: summary.turns,
        totalLogEntries: summary.totalLogEntries,
        viewerSide: summary.outcome.viewerSide,
      },
    });

    expect(body).toContain('data-testid="timeline-turn-1"');
    expect(body).toContain('aria-expanded="false"');
    expect(body).toContain('data-move-category="play-card"');
    expect(body).not.toContain("Ariel - On Human Legs");
    expect(body).not.toContain("Move id");
  });

  it("renders expanded turns with card names and technical details when requested", () => {
    const summary = createSummary();
    const { body } = render(PostGameTimelineSection, {
      props: {
        turns: summary.turns,
        totalLogEntries: summary.totalLogEntries,
        viewerSide: summary.outcome.viewerSide,
        initialExpandedTurnNumbers: [1],
        defaultTechnicalTurnNumbers: [1],
      },
    });

    expect(body).toContain('aria-expanded="true"');
    expect(body).toContain("Ariel - On Human Legs");
    expect(body).toContain('data-timeline-icon="play-card"');
    expect(body).toContain("Move id");
    expect(body).toContain("playCard");
    expect(body).toContain("lorcana.move.playCard");
  });
});
