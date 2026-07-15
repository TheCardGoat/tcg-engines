import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { basilGreatMouseDetective } from "./138-basil-great-mouse-detective";
import { basilOfBakerStreet } from "./139-basil-of-baker-street";

describe("Basil - Great Mouse Detective", () => {
  it("should have Shift 5 keyword ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [basilGreatMouseDetective],
    });

    expect(testEngine.hasKeyword(basilGreatMouseDetective, "Shift")).toBe(true);
  });

  describe("THERE'S ALWAYS A CHANCE - If you used Shift to play this character, you may draw 2 cards when he enters play.", () => {
    it("draws 2 cards when played via Shift and ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: basilGreatMouseDetective.cost,
        hand: [basilGreatMouseDetective],
        play: [basilOfBakerStreet],
        deck: 5,
      });

      const shiftTarget = testEngine.findCardInstanceId(basilOfBakerStreet, "play", "player_one");

      expect(
        testEngine.asPlayerOne().playCard(basilGreatMouseDetective, {
          cost: {
            cost: "shift",
            shiftTarget,
          },
        }),
      ).toBeSuccessfulCommand();

      // Resolve optional triggered ability (THERE'S ALWAYS A CHANCE) - accept
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(basilGreatMouseDetective, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Started with 1 in hand (basil), played it (-1), drew 2 (+2) = 2 in hand
      // Deck started with 5, drew 2 = 3 remaining
      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        hand: 2,
        deck: 3,
        play: 1,
      });
    });

    it("does not trigger when played normally (without Shift)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: basilGreatMouseDetective.cost,
        hand: [basilGreatMouseDetective],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(basilGreatMouseDetective)).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Not played via Shift — no cards drawn, hand just loses the played card
      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        hand: 0,
        deck: 5,
        play: 1,
      });
    });
  });
});
