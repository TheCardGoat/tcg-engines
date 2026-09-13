import { describe, expect, it } from "bun:test";
import { parsePostGameRecordEnvelope } from "./notes-api.js";

describe("parsePostGameRecordEnvelope", () => {
  it("accepts canonical records from testing queues", async () => {
    const record = parsePostGameRecordEnvelope({
      gameId: "game-testing",
      matchId: "match-testing",
      note: "",
      postGame: {
        source: "redis",
        gameId: "game-testing",
        matchId: "match-testing",
        status: "completed",
        winnerId: "player-1",
        reason: "Opponent timed out",
        createdAt: new Date(0).toISOString(),
        completedAt: new Date(382_000).toISOString(),
        durationMs: 382_000,
        authority: "server",
        matchType: "testing",
        players: [
          { id: "player-1", side: "playerOne", displayName: null, username: null, mmr: null },
          { id: "player-2", side: "playerTwo", displayName: null, username: null, mmr: null },
        ],
        board: { stateID: 8 },
      },
    });

    expect(record.postGame?.matchType).toBe("testing");
    expect(record.postGame?.durationMs).toBe(382_000);
  });
});
