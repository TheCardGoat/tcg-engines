import { describe, expect, it } from "vitest";
import type { FabPersistedGameAnalyticsV2 } from "./analytics-v2.ts";
import { projectPublicPostGameStatsV1 } from "./analytics-public.ts";

const secretCard = {
  canonicalId: "secret-card",
  instanceId: "inst-1",
  name: "Secret Card",
  ownerId: "p1",
  controllerId: "p1",
};

const analytics: FabPersistedGameAnalyticsV2 = {
  version: 2,
  gameSlug: "flesh-and-blood",
  gameId: "game-1",
  matchId: "match-1",
  dimensions: {
    matchType: "ranked",
    format: "best_of_1",
    authority: "server",
    gameNumber: 1,
  },
  summary: {
    winnerId: "p1",
    endReason: "lethal",
    totalTurns: 1,
    totalMoves: 1,
    durationMs: 1000,
    createdAt: "2026-09-10T00:00:00.000Z",
    completedAt: "2026-09-10T00:01:00.000Z",
  },
  participants: [
    {
      playerId: "p1",
      seat: 1,
      displayName: "hidden@tcg.localhost",
      username: "hidden@tcg.localhost",
    },
    { playerId: "p2", seat: 2, displayName: "Rival", username: "rival" },
  ],
  game: {
    schemaVersion: 2,
    quality: "authoritative",
    coverage: {
      completeFromGameStart: true,
      openingHandsComplete: true,
      firstStateVersion: 1,
      lastStateVersion: 1,
      missingStateVersions: [],
      duplicateStateVersions: [],
      unresolvedCanonicalCardCount: 0,
    },
    gameId: "game-1",
    startedAt: 1,
    completedAt: 2,
    durationSeconds: 1,
    players: {
      p1: {
        playerId: "p1",
        seat: 1,
        heroName: "Olympia",
        heroCanonicalId: "olympia",
        initialLife: 40,
        finalLife: 20,
        abilitiesActivated: 0,
        cardsPlayed: 1,
        cardsPitched: 0,
        cardsDefended: 0,
        resourcesGenerated: 0,
        resourcesSpent: 0,
        attackPowerThreatened: 6,
        attackDamageDealt: 6,
        totalDamageDealt: 6,
        damagePrevented: 0,
        defenseCommitted: 0,
        effectiveDefense: 0,
        overblock: 0,
        attacks: 1,
        hits: 1,
        cardPlaysByOrigin: { hand: 1, arsenal: 0, banished: 0, deck: 0, graveyard: 0 },
        actions: [
          {
            sequence: 1,
            eventId: "draw-1",
            turn: 1,
            kind: "drawn",
            card: secretCard,
            origin: "deck",
            destination: "hand",
          },
        ],
        cards: [
          {
            canonicalId: "razor-reflex-red",
            name: "Razor Reflex",
            played: 1,
            pitched: 0,
            defended: 0,
            hits: 1,
            finalDefense: 0,
          },
        ],
        handCycles: [
          {
            cycle: 1,
            playerId: "p1",
            openedAfterTurn: null,
            openedBy: "opening-hand",
            startingCards: [secretCard],
            drawnCards: [secretCard],
            carriedCards: [],
            actions: [
              {
                sequence: 1,
                eventId: "draw-1",
                turn: 1,
                kind: "drawn",
                card: secretCard,
                origin: "deck",
                destination: "hand",
              },
            ],
            endingCards: [secretCard],
            closedAfterTurn: 1,
          },
        ],
      },
    },
    turns: [
      {
        turn: 1,
        activePlayerId: "p1",
        completed: true,
        players: {
          p1: {
            playerId: "p1",
            cardsPlayed: 1,
            cardsPitched: 0,
            cardsDefended: 0,
            resourcesGenerated: 0,
            resourcesSpent: 0,
            attackPowerThreatened: 6,
            attackDamageDealt: 6,
            totalDamageDealt: 6,
            damagePrevented: 0,
            defenseCommitted: 0,
            effectiveDefense: 0,
            overblock: 0,
            attacks: 1,
            hits: 1,
            cardPlaysByOrigin: { hand: 1, arsenal: 0, banished: 0, deck: 0, graveyard: 0 },
            actions: [
              {
                sequence: 1,
                eventId: "draw-1",
                turn: 1,
                kind: "drawn",
                card: secretCard,
                origin: "deck",
                destination: "hand",
              },
            ],
          },
        },
        lifeAfter: { p1: 20, p2: 14 },
      },
    ],
    winnerId: "p1",
    loserId: "p2",
    endReason: "lethal",
  },
};

describe("projectPublicPostGameStatsV1", () => {
  it("keeps public card activity and strips private hands, draws, and identifiers", () => {
    const publicStats = projectPublicPostGameStatsV1(analytics, { onThePlaySeat: 1 });
    const serialized = JSON.stringify(publicStats);
    expect(publicStats.schema).toBe("PublicPostGameStatsV1");
    expect(publicStats.summary.winnerSeat).toBe(1);
    expect(publicStats.participants[0]?.displayName).toBeNull();
    expect(publicStats.participants[0]?.publicCards[0]?.canonicalId).toBe("razor-reflex-red");
    expect(serialized).not.toContain("secret-card");
    expect(serialized).not.toContain("inst-1");
    expect(serialized).not.toContain("handCycles");
  });
});
