import { describe, expect, it } from "bun:test";
import { createPlayerId } from "#core";
import {
  CANONICAL_PLAYER_ONE,
  LorcanaMultiplayerTestEngine,
} from "../../../testing/lorcana-multiplayer-test-engine";

describe("forfeitGame", () => {
  it("records a judge-role move history entry so server drops can persist", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({ deck: 10 }, { deck: 10 });
    const server = testEngine.asServer();
    const before = server.getMoveHistory().length;
    const winnerId = createPlayerId(CANONICAL_PLAYER_ONE);

    const result = server.forfeitGame(winnerId, "disconnect");

    expect(result.success).toBe(true);
    const added = server.getMoveHistory().slice(before);
    expect(added).toEqual([
      expect.objectContaining({
        moveId: "forfeitGame",
        role: "judge",
        playerId: winnerId,
      }),
    ]);
    expect(server.hasGameEnded()).toBe(true);
    expect(server.getGameEndResult()).toBe(winnerId);
  });
});
