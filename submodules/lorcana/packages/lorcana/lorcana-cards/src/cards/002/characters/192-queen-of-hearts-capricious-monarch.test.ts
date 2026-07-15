import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { queenOfHeartsCapriciousMonarch } from "./192-queen-of-hearts-capricious-monarch";
import { arthurTrainedSwordsman } from "./069-arthur-trained-swordsman";
import { herculesHeroInTraining } from "./182-hercules-hero-in-training";
import { brawl } from "../../004/actions/130-brawl";

describe("Queen of Hearts - Capricious Monarch", () => {
  describe("OFF WITH THEIR HEADS! - Whenever an opposing character is banished, you may ready this character.", () => {
    it("readies itself when an opposing character is banished in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: queenOfHeartsCapriciousMonarch, exerted: true }, arthurTrainedSwordsman],
          deck: 1,
        },
        {
          play: [{ card: herculesHeroInTraining, exerted: true }],
          deck: 1,
        },
      );

      // Queen should start exerted
      expect(testEngine.asPlayerOne().isExerted(queenOfHeartsCapriciousMonarch)).toBe(true);

      // Arthur challenges Hercules (4 str vs 3 wp — Hercules is banished)
      expect(
        testEngine.asPlayerOne().challenge(arthurTrainedSwordsman, herculesHeroInTraining),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(herculesHeroInTraining)).toBe("discard");

      // Optional trigger should fire
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional: ready the Queen
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(queenOfHeartsCapriciousMonarch, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Queen should now be readied
      expect(testEngine.asPlayerOne().isExerted(queenOfHeartsCapriciousMonarch)).toBe(false);
    });

    it("does not ready itself when declining the optional", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: queenOfHeartsCapriciousMonarch, exerted: true }, arthurTrainedSwordsman],
          deck: 1,
        },
        {
          play: [{ card: herculesHeroInTraining, exerted: true }],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().isExerted(queenOfHeartsCapriciousMonarch)).toBe(true);

      expect(
        testEngine.asPlayerOne().challenge(arthurTrainedSwordsman, herculesHeroInTraining),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline the optional
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(queenOfHeartsCapriciousMonarch, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Queen should remain exerted
      expect(testEngine.asPlayerOne().isExerted(queenOfHeartsCapriciousMonarch)).toBe(true);
    });

    it("readies itself when an opposing character is banished by an action", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: queenOfHeartsCapriciousMonarch, exerted: true }],
          hand: [brawl],
          inkwell: brawl.cost,
          deck: 1,
        },
        {
          play: [herculesHeroInTraining],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().isExerted(queenOfHeartsCapriciousMonarch)).toBe(true);

      // Play Brawl targeting Hercules (strength 2, within Brawl's ≤2 limit)
      expect(
        testEngine.asPlayerOne().playCard(brawl, { targets: [herculesHeroInTraining] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(herculesHeroInTraining)).toBe("discard");

      // Optional trigger should fire
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(queenOfHeartsCapriciousMonarch, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(queenOfHeartsCapriciousMonarch)).toBe(false);
    });

    it("does NOT trigger when one of your own characters is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: queenOfHeartsCapriciousMonarch, exerted: true },
            { card: herculesHeroInTraining, exerted: true },
          ],
          deck: 1,
        },
        {
          play: [arthurTrainedSwordsman],
          deck: 1,
        },
      );

      testEngine.asPlayerOne().passTurn();

      // Opponent challenges Hercules (Arthur str 4 vs Hercules wp 3 — Hercules banished)
      expect(
        testEngine.asPlayerTwo().challenge(arthurTrainedSwordsman, herculesHeroInTraining),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(herculesHeroInTraining)).toBe("discard");

      // Queen's trigger should NOT fire since it was your own character banished
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Queen should still be exerted
      expect(testEngine.asPlayerOne().isExerted(queenOfHeartsCapriciousMonarch)).toBe(true);
    });
  });
});
