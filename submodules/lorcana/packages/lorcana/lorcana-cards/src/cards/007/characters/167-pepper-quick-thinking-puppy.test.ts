import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { pepperQuickthinkingPuppy } from "./167-pepper-quick-thinking-puppy";
import { frecklesGoodBoy } from "./168-freckles-good-boy";
import { gaetanMoliereTheMole } from "./158-gaetan-moliere-the-mole";

describe("Pepper - Quick-Thinking Puppy", () => {
  describe("IN THE NICK OF TIME - Whenever one of your Puppy characters is banished, you may put that card into your inkwell facedown and exerted.", () => {
    it("puts banished Puppy (Freckles) into inkwell when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [gaetanMoliereTheMole],
          deck: 1,
        },
        {
          play: [pepperQuickthinkingPuppy, { card: frecklesGoodBoy, exerted: true }],
          deck: 1,
        },
      );

      // Player one challenges Freckles (a Puppy) with Gaetan (3 str vs 2 will = banished)
      expect(
        testEngine.asPlayerOne().challenge(gaetanMoliereTheMole, frecklesGoodBoy),
      ).toBeSuccessfulCommand();

      // Freckles should be banished (in discard)
      expect(testEngine.asPlayerTwo().getCardZone(frecklesGoodBoy)).toBe("discard");

      // Pepper's trigger should fire - player two resolves optional ability
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerTwo()
          .resolvePendingByCard(pepperQuickthinkingPuppy, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Freckles should now be in inkwell, Pepper stays in play
      expect(testEngine.asPlayerTwo().getCardZone(frecklesGoodBoy)).toBe("inkwell");
      expect(testEngine.asPlayerTwo().getCardZone(pepperQuickthinkingPuppy)).toBe("play");
    });

    it("puts Pepper itself into inkwell when Pepper is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [gaetanMoliereTheMole],
          deck: 1,
        },
        {
          play: [{ card: pepperQuickthinkingPuppy, exerted: true }, frecklesGoodBoy],
          deck: 1,
        },
      );

      // Player one challenges Pepper (a Puppy) with Gaetan (3 str vs 2 will = banished)
      expect(
        testEngine.asPlayerOne().challenge(gaetanMoliereTheMole, pepperQuickthinkingPuppy),
      ).toBeSuccessfulCommand();

      // Pepper should be banished (in discard)
      expect(testEngine.asPlayerTwo().getCardZone(pepperQuickthinkingPuppy)).toBe("discard");

      // Pepper's trigger should fire - player two resolves optional ability
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerTwo()
          .resolvePendingByCard(pepperQuickthinkingPuppy, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Pepper should now be in inkwell
      expect(testEngine.asPlayerTwo().getCardZone(pepperQuickthinkingPuppy)).toBe("inkwell");
      // Freckles should still be in play
      expect(testEngine.asPlayerTwo().getCardZone(frecklesGoodBoy)).toBe("play");
    });
  });
});
