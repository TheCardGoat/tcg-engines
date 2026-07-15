import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { inkGeyser } from "./119-ink-geyser";

describe("Ink Geyser", () => {
  it("exerts all inkwell cards and returns random cards until each player has 3 left", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [inkGeyser],
        inkwell: 7,
      },
      {
        inkwell: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(inkGeyser)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(3);
    expect(testEngine.asPlayerTwo().getZonesCardCount().inkwell).toBe(3);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(4);
    expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(2);

    const authoritativeState = testEngine.getAuthoritativeState();
    for (const cardId of testEngine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)) {
      expect(authoritativeState.ctx.zones.private.cardMeta[cardId]?.state).toBe("exerted");
    }
    for (const cardId of testEngine.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)) {
      expect(authoritativeState.ctx.zones.private.cardMeta[cardId]?.state).toBe("exerted");
    }
  });
});
