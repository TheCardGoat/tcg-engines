import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { zeusMrLightningBolts } from "./092-zeus-mr-lightning-bolts";
import { beastWounded } from "./103-beast-wounded";
import { herculesClumsyKid } from "./108-hercules-clumsy-kid";

describe("Zeus - Mr. Lightning Bolts", () => {
  describe("TARGET PRACTICE - Whenever this character challenges another character, he gets +{S} equal to the {S} of chosen character this turn.", () => {
    it("Zeus gets +strength equal to the strength of the chosen character after challenging, and the bonus expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: zeusMrLightningBolts, isDrying: false }],
          deck: 2,
        },
        {
          play: [{ card: beastWounded, exerted: true, damage: 4 }, herculesClumsyKid],
          deck: 2,
        },
      );

      // Before challenge, Zeus should have base strength (0)
      expect(testEngine.asPlayerOne().getCardStrength(zeusMrLightningBolts)).toBe(
        zeusMrLightningBolts.strength,
      );

      // Zeus challenges beastWounded (already exerted)
      expect(
        testEngine.asPlayerOne().challenge(zeusMrLightningBolts, beastWounded),
      ).toBeSuccessfulCommand();

      // Immediately after challenge, before resolving the bag, Zeus should still have base strength
      expect(testEngine.asPlayerOne().getCardStrength(zeusMrLightningBolts)).toBe(
        zeusMrLightningBolts.strength,
      );

      // Resolve TARGET PRACTICE by choosing Hercules - Clumsy Kid (strength 3)
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      if (!bagEffect) return;

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(zeusMrLightningBolts, { targets: [herculesClumsyKid] }),
      ).toBeSuccessfulCommand();

      // After resolving with Hercules (strength 3), Zeus should have 0 + 3 = 3 strength
      expect(testEngine.asPlayerOne().getCardStrength(zeusMrLightningBolts)).toBe(
        zeusMrLightningBolts.strength + herculesClumsyKid.strength,
      );

      // After passing the turn, the strength bonus expires and Zeus returns to base strength
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(zeusMrLightningBolts)).toBe(
        zeusMrLightningBolts.strength,
      );
    });
  });
});
