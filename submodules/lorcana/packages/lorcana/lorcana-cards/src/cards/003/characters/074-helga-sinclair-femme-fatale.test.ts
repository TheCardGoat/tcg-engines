import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { helgaSinclairFemmeFatale } from "./074-helga-sinclair-femme-fatale";

const undamagedCharacter = createMockCharacter({
  id: "helga-femme-fatale-undamaged-character",
  name: "Undamaged Character",
  cost: 2,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const damagedCharacter = createMockCharacter({
  id: "helga-femme-fatale-damaged-character",
  name: "Damaged Character",
  cost: 2,
  strength: 2,
  willpower: 5,
  lore: 1,
});

describe("Helga Sinclair - Femme Fatale", () => {
  describe("THIS CHANGES EVERYTHING - Whenever this character quests, you may deal 3 damage to chosen damaged character.", () => {
    it("deals 3 damage to a chosen damaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: helgaSinclairFemmeFatale, isDrying: false }],
          deck: [],
        },
        {
          play: [{ card: damagedCharacter, damage: 1 }],
          deck: [],
        },
      );

      expect(testEngine.asPlayerOne().quest(helgaSinclairFemmeFatale)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(helgaSinclairFemmeFatale, {
          resolveOptional: true,
          targets: [damagedCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(damagedCharacter)).toBe(4);
    });

    it("regression: cannot choose an undamaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: helgaSinclairFemmeFatale, isDrying: false }],
          deck: [],
        },
        {
          play: [undamagedCharacter],
          deck: [],
        },
      );

      expect(testEngine.asPlayerOne().quest(helgaSinclairFemmeFatale)).toBeSuccessfulCommand();

      const result = testEngine.asPlayerOne().resolvePendingByCard(helgaSinclairFemmeFatale, {
        resolveOptional: true,
        targets: [undamagedCharacter],
      });

      expect(result).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getDamage(undamagedCharacter)).toBe(0);
    });
  });
});
