import { describe, expect, it } from "bun:test";
import type { PostGameCanonicalData, PostGameRecordEnvelope } from "./notes-api.js";
import { isPostGameRecordFresh, loadFreshPostGameRecord } from "./post-game-record-loader.js";

function createRecord(stateID: number): PostGameRecordEnvelope {
  return {
    gameId: "game-1",
    matchId: "match-1",
    note: "",
    postGame: {
      source: "redis",
      gameId: "game-1",
      matchId: "match-1",
      status: "completed",
      winnerId: "player-1",
      reason: "Opponent disconnected",
      createdAt: new Date(0).toISOString(),
      completedAt: new Date(1).toISOString(),
      durationMs: 1,
      authority: "server",
      matchType: "casual",
      players: [
        { id: "player-1", side: "playerOne", displayName: null, username: null, mmr: null },
        { id: "player-2", side: "playerTwo", displayName: null, username: null, mmr: null },
      ],
      board: { stateID } as PostGameCanonicalData["board"],
    },
  };
}

describe("loadFreshPostGameRecord", () => {
  it("retries a stale record and returns the terminal board version", async () => {
    const records = [createRecord(90), createRecord(91)];
    let loadCount = 0;
    const delays: number[] = [];

    const record = await loadFreshPostGameRecord({
      gameId: "game-1",
      minimumStateId: 91,
      loadRecord: async () => records[loadCount++]!,
      sleep: async (delayMs) => {
        delays.push(delayMs);
      },
    });

    expect(record.postGame?.board.stateID).toBe(91);
    expect(loadCount).toBe(2);
    expect(delays).toEqual([250]);
  });

  it("does not retry an already-current record", async () => {
    const record = createRecord(91);

    expect(isPostGameRecordFresh(record, 91)).toBe(true);
    expect(
      await loadFreshPostGameRecord({
        gameId: "game-1",
        minimumStateId: 91,
        loadRecord: async () => record,
        sleep: async () => {
          throw new Error("should not retry");
        },
      }),
    ).toBe(record);
  });
});
