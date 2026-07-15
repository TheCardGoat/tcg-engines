import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { genieSupportiveFriend } from "./054-genie-supportive-friend";

describe("Genie - Supportive Friend - Set 009", () => {
  it("matches the base card's optional shuffle-and-draw quest trigger", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: genieSupportiveFriend, isDrying: false }],
      deck: 30,
    });

    const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;
    const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;
    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    expect(testEngine.asPlayerOne().quest(genieSupportiveFriend)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(genieSupportiveFriend),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(genieSupportiveFriend)).not.toBe("play");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(handBefore + 3);
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(deckBefore + 1 - 3);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(
      loreBefore + genieSupportiveFriend.lore,
    );
  });
});
