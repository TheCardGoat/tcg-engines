import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { friendsOnTheOtherSide } from "../../001";
import { ursulaDeceiverOfAll } from "./091-ursula-deceiver-of-all";
import { ursulaDeceiverOfAllEnchanted } from "./212-ursula-deceiver-of-all-enchanted";

describe("Ursula - Deceiver of All (Enchanted)", () => {
  it("has the same canonicalId and abilities as the non-enchanted version", () => {
    expect(ursulaDeceiverOfAllEnchanted.canonicalId).toBe(ursulaDeceiverOfAll.canonicalId);
    expect(ursulaDeceiverOfAllEnchanted.abilities).toEqual(ursulaDeceiverOfAll.abilities);
  });

  it("replays the sung song from discard for free and then puts it on the bottom of the deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [friendsOnTheOtherSide],
      play: [{ card: ursulaDeceiverOfAllEnchanted, isDrying: false }],
      deck: 4,
    });

    expect(
      testEngine.asPlayerOne().singSong(friendsOnTheOtherSide, ursulaDeceiverOfAllEnchanted)
        .success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(ursulaDeceiverOfAllEnchanted).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(friendsOnTheOtherSide)).toBe("deck");
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 4,
        deck: 1,
        discard: 0,
      }),
    );
  });
});
