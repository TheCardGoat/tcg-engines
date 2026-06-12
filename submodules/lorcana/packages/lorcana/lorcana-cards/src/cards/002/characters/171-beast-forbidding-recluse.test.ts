import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { beastForbiddingRecluse } from "./171-beast-forbidding-recluse";

const opponentCharacter = createMockCharacter({
  id: "beast-forbidding-recluse-opponent",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const ownCharacter = createMockCharacter({
  id: "beast-forbidding-recluse-own",
  name: "Own Character",
  cost: 1,
  strength: 1,
  willpower: 3,
});

describe("Beast - Forbidding Recluse", () => {
  describe("YOU'RE NOT WELCOME HERE - When you play this character, you may deal 1 damage to chosen character.", () => {
    it("deals 1 damage to chosen opposing character when played and accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [beastForbiddingRecluse],
          inkwell: beastForbiddingRecluse.cost,
        },
        {
          play: [opponentCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(beastForbiddingRecluse)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(beastForbiddingRecluse, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(opponentCharacter)).toBe(1);
    });

    it("can target own characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [beastForbiddingRecluse],
        play: [ownCharacter],
        inkwell: beastForbiddingRecluse.cost,
      });

      expect(testEngine.asPlayerOne().playCard(beastForbiddingRecluse)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(beastForbiddingRecluse, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [ownCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(ownCharacter)).toBe(1);
    });

    it("does not deal damage when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [beastForbiddingRecluse],
          inkwell: beastForbiddingRecluse.cost,
        },
        {
          play: [opponentCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(beastForbiddingRecluse)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(beastForbiddingRecluse, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(opponentCharacter)).toBe(0);
    });

    it("plays successfully even with no valid targets", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [beastForbiddingRecluse],
        inkwell: beastForbiddingRecluse.cost,
      });

      expect(testEngine.asPlayerOne().playCard(beastForbiddingRecluse)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(beastForbiddingRecluse)).toBe("play");
    });
  });
});
