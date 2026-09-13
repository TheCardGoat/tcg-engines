import { describe, expect, it } from "vitest";
import { parseFabPersistedGameAnalyticsV1 } from "./analytics.ts";

const emptyTurnPlayer = {
  playerId: "player-1",
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

const v1Blob = {
  version: 1 as const,
  gameSlug: "flesh-and-blood" as const,
  gameId: "game_historical",
  matchId: "match_historical",
  dimensions: {
    matchType: "ranked" as const,
    format: "best_of_1" as const,
    authority: "server" as const,
    gameNumber: 1,
  },
  summary: {
    winnerId: "player-1",
    endReason: "lethal",
    totalTurns: 1,
    totalMoves: 1,
    durationMs: 1000,
    createdAt: "2026-09-01T00:00:00.000Z",
    completedAt: "2026-09-01T00:01:00.000Z",
  },
  participants: [
    { playerId: "player-1", displayName: "Alpha", username: "alpha" },
    { playerId: "player-2", displayName: "Beta", username: "beta" },
  ] as const,
  game: {
    schemaVersion: 1 as const,
    quality: "authoritative" as const,
    gameId: "game_historical",
    startedAt: 1,
    completedAt: 2,
    durationSeconds: 1,
    players: {
      "player-1": {
        ...emptyTurnPlayer,
        heroName: "Olympia",
        initialLife: 40,
        finalLife: 20,
        abilitiesActivated: 0,
        cards: [],
      },
    },
    turns: [],
    winnerId: "player-1",
    loserId: "player-2",
    endReason: "lethal",
  },
};

describe("parseFabPersistedGameAnalyticsV1", () => {
  it("parses a historical v1 blob", () => {
    expect(parseFabPersistedGameAnalyticsV1(v1Blob).version).toBe(1);
    expect(parseFabPersistedGameAnalyticsV1(v1Blob).game.players["player-1"]?.heroName).toBe(
      "Olympia",
    );
  });

  it("names the offending path when a required field is missing", () => {
    expect(() =>
      parseFabPersistedGameAnalyticsV1({
        ...v1Blob,
        dimensions: { ...v1Blob.dimensions, gameNumber: 0 },
      }),
    ).toThrow(/gameNumber/);
  });
});
