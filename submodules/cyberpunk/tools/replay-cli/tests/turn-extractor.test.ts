import { describe, expect, test } from "bun:test";
import type { PersistedReplayData } from "../src/fetch.ts";
import { extractTurn } from "../src/turn-extractor.ts";

function fixture(): PersistedReplayData {
  return {
    version: 2,
    gameId: "cyberpunk-game-test",
    matchId: "match-test",
    gameType: "cyberpunk",
    seed: "seed",
    playerIds: ["p1", "p2"],
    cardsMaps: {
      cardInstances: { c1: "alt-cunningham-soulkiller-architect" },
      owners: { p1: ["c1"], p2: [] },
    },
    initialState: JSON.stringify({
      gameSlug: "cyberpunk",
      state: {
        G: { turnMetadata: { turnNumber: 1, pendingChoice: undefined }, cards: { c1: "deck" } },
        ctx: { seed: "seed" },
      },
      historyLength: 0,
    }),
    steps: [
      {
        acceptedMove: {
          stateVersion: 1,
          turnNumber: 1,
          actorId: "p1",
          moveId: "passPhase",
          timestamp: 1,
        },
        logs: [],
        patches: [
          {
            op: "replace",
            path: ["G", "turnMetadata", "turnNumber"],
            value: 2,
          },
        ],
      },
      {
        acceptedMove: {
          stateVersion: 2,
          turnNumber: 2,
          actorId: "p1",
          moveId: "playCard",
          input: { args: { cardId: "c1" } },
          timestamp: 2,
        },
        logs: [{ type: "cardPlayed", cardId: "c1" }],
        patches: [],
      },
    ],
    metadata: {
      totalMoves: 2,
      totalTurns: 2,
      createdAt: "2026-01-01T00:00:00.000Z",
      completedAt: "2026-01-01T00:01:00.000Z",
    },
  };
}

describe("extractTurn", () => {
  test("reconstructs pre-turn state and card involvement", () => {
    const extracted = extractTurn(fixture(), 2);

    expect(extracted.preTurnState).toMatchObject({
      G: { turnMetadata: { turnNumber: 2 } },
    });
    expect(extracted.involvedInstanceIds).toEqual(["c1"]);
    expect(extracted.cardInstances.c1).toBe("alt-cunningham-soulkiller-architect");
    expect(extracted.turnSteps).toHaveLength(1);
  });

  test("reports available turns for out-of-range input", () => {
    expect(() => extractTurn(fixture(), 3)).toThrow("Available turns: 1, 2");
  });
});
