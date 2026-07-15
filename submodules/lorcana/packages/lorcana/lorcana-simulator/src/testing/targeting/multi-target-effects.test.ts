import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { darkwingDuckCoolUnderPressure } from "@tcg/lorcana-cards/cards/011";
import { loseTheWay } from "@tcg/lorcana-cards/cards/006";
import { madamMimRivalOfMerlin } from "@tcg/lorcana-cards/cards/002";
import { powerlineWorldsGreatestRockStar } from "@tcg/lorcana-cards/cards/009";
import { divebomb } from "@tcg/lorcana-cards/cards/003";
import { lastditchEffort } from "@tcg/lorcana-cards/cards/003";
import { mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import { minnieMouseAlwaysClassy } from "@tcg/lorcana-cards/cards/001";
import { theQueenCommandingPresence } from "@tcg/lorcana-cards/cards/002";
import { mauiHeroToAll } from "@tcg/lorcana-cards/cards/001";
import { donaldDuckAlongForTheRide } from "@tcg/lorcana-cards/cards/011";

describe("Multi Target Effects", () => {
  it(
    "should resolve multi-target effects correctly",
    () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: 20,
          hand: [divebomb, loseTheWay, lastditchEffort, mickeyMouseTrueFriend],
          play: [
            minnieMouseAlwaysClassy,
            theQueenCommandingPresence,
            mauiHeroToAll,
            { card: donaldDuckAlongForTheRide, exerted: true },
          ],
        },
        {
          play: [
            madamMimRivalOfMerlin,
            darkwingDuckCoolUnderPressure,
            powerlineWorldsGreatestRockStar,
          ],
        },
      );

      // Use The Queen - Commanding Presence to target two opposing characters
      expect(testEngine.asPlayerOne().quest(theQueenCommandingPresence)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      if (!bagEffect) {
        return;
      }

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(bagEffect.sourceId, {
          targets: [powerlineWorldsGreatestRockStar, minnieMouseAlwaysClassy],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(minnieMouseAlwaysClassy)?.strength).toBe(
        minnieMouseAlwaysClassy.strength + 4,
      );
      expect(testEngine.asPlayerOne().getCard(powerlineWorldsGreatestRockStar)?.strength).toBe(
        powerlineWorldsGreatestRockStar.strength - 4,
      );

      // Play Divebomb
      expect(
        testEngine.asPlayerOne().playCard(divebomb, {
          targets: [mauiHeroToAll],
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [powerlineWorldsGreatestRockStar],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(powerlineWorldsGreatestRockStar)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(mauiHeroToAll)).toBe("discard");

      // Play Last-Ditch Effort
      expect(
        testEngine.asPlayerOne().playCard(lastditchEffort, {
          targets: [madamMimRivalOfMerlin, minnieMouseAlwaysClassy],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().isExerted(madamMimRivalOfMerlin)).toBe(true);
      expect(testEngine.getKeywordValue(minnieMouseAlwaysClassy, "Challenger")).toBe(2);

      // Play Lose the Way
      expect(
        testEngine.asPlayerOne().playCard(loseTheWay, { targets: [darkwingDuckCoolUnderPressure] })
          .success,
      ).toBe(true);
      expect(testEngine.asPlayerTwo().isExerted(darkwingDuckCoolUnderPressure)).toBe(true);

      expect(
        testEngine.asPlayerOne().resolvePendingEffect(loseTheWay, {
          resolveOptional: true,
        }).success,
      ).toBe(true);
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [mickeyMouseTrueFriend],
        }).success,
      ).toBe(true);
      expect(testEngine.asPlayerOne().getCardZone(mickeyMouseTrueFriend)).toBe("discard");
    },
    { timeout: 15000 },
  );
});
