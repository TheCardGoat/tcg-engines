import { describe, expect, it } from "bun:test";
import { CANONICAL_PLAYER_ONE } from "@tcg/shared/testing";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { arielTreasureCollector } from "./139-ariel-treasure-collector";
import { flounderCollectorsCompanion } from "./144-flounder-collectors-companion";

const supportTarget = createMockCharacter({
  id: "flounder-collectors-companion-support-target",
  name: "Support Target",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Flounder - Collector's Companion", () => {
  it("adds Flounder's strength to another character when he quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [flounderCollectorsCompanion, supportTarget],
      deck: 2,
    });

    const targetStrengthBefore = testEngine.asPlayerOne().getCardStrength(supportTarget);

    expect(testEngine.asPlayerOne().quest(flounderCollectorsCompanion)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(flounderCollectorsCompanion, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      targetStrengthBefore + flounderCollectorsCompanion.strength,
    );
  });

  describe("I'M NOT A GUPPY — If you have a character named Ariel in play, you pay 1 {I} less to play this character.", () => {
    it("costs full cost when no Ariel is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [flounderCollectorsCompanion],
        inkwell: flounderCollectorsCompanion.cost,
        deck: 2,
      });

      expect(
        testEngine.asPlayerOne().playCard(flounderCollectorsCompanion),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(flounderCollectorsCompanion)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    });

    it("costs 1 less when an Ariel character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [flounderCollectorsCompanion],
        play: [arielTreasureCollector],
        // Only provide cost - 1 ink (should be enough with the discount)
        inkwell: flounderCollectorsCompanion.cost - 1,
        deck: 2,
      });

      expect(
        testEngine.asPlayerOne().playCard(flounderCollectorsCompanion),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(flounderCollectorsCompanion)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    });

    it("cannot be played for full cost when only cost - 1 ink is available and no Ariel in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [flounderCollectorsCompanion],
        // One ink short without discount
        inkwell: flounderCollectorsCompanion.cost - 1,
        deck: 2,
      });

      const result = testEngine.asPlayerOne().playCard(flounderCollectorsCompanion);
      expect(result).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(flounderCollectorsCompanion)).toBe("hand");
    });
  });
});
