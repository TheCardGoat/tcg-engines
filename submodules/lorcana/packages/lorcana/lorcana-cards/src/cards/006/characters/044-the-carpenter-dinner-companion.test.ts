import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theCarpenterDinnerCompanion } from "./044-the-carpenter-dinner-companion";

const targetCharacter = createMockCharacter({
  id: "carpenter-test-target",
  name: "Target Character",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
});

describe("The Carpenter - Dinner Companion", () => {
  describe("I'LL GET YOU! - When this character is banished, you may exert chosen character.", () => {
    it("triggers when The Carpenter is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theCarpenterDinnerCompanion],
        },
        {
          play: [targetCharacter],
        },
      );

      const carpenterId = testEngine.findCardInstanceId(theCarpenterDinnerCompanion, "play");

      // Banish The Carpenter via lethal damage
      expect(
        testEngine.asServer().manualSetDamage(carpenterId, theCarpenterDinnerCompanion.willpower),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(theCarpenterDinnerCompanion)).toBe("discard");

      // I'LL GET YOU! should trigger
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("exerts the chosen character when the optional ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theCarpenterDinnerCompanion],
        },
        {
          play: [targetCharacter],
        },
      );

      const carpenterId = testEngine.findCardInstanceId(theCarpenterDinnerCompanion, "play");

      expect(
        testEngine.asServer().manualSetDamage(carpenterId, theCarpenterDinnerCompanion.willpower),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theCarpenterDinnerCompanion, {
          resolveOptional: true,
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().isExerted(targetCharacter)).toBe(true);
    });

    it("does not exert when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theCarpenterDinnerCompanion],
        },
        {
          play: [targetCharacter],
        },
      );

      const carpenterId = testEngine.findCardInstanceId(theCarpenterDinnerCompanion, "play");

      expect(
        testEngine.asServer().manualSetDamage(carpenterId, theCarpenterDinnerCompanion.willpower),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(theCarpenterDinnerCompanion, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().isExerted(targetCharacter)).toBe(false);
    });

    it("can exert your own character", () => {
      const allyCharacter = createMockCharacter({
        id: "carpenter-test-ally",
        name: "Ally Character",
        cost: 2,
        strength: 2,
        willpower: 3,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [theCarpenterDinnerCompanion, allyCharacter],
      });

      const carpenterId = testEngine.findCardInstanceId(theCarpenterDinnerCompanion, "play");

      expect(
        testEngine.asServer().manualSetDamage(carpenterId, theCarpenterDinnerCompanion.willpower),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theCarpenterDinnerCompanion, {
          resolveOptional: true,
          targets: [allyCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(allyCharacter)).toBe(true);
    });
  });
});
