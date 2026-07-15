import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { dormouseEasilyAgitated } from "./103-dormouse-easily-agitated";

const targetCharacter = createMockCharacter({
  id: "dormouse-target",
  name: "Target Character",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
});

describe("Dormouse - Easily Agitated", () => {
  describe("VERY RUDE INDEED — When you play this character, you may put 1 damage counter on chosen character.", () => {
    it("puts 1 damage on the chosen character when the optional ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dormouseEasilyAgitated],
          inkwell: dormouseEasilyAgitated.cost,
          deck: 2,
        },
        {
          play: [targetCharacter],
          deck: 2,
        },
      );

      const targetId = testEngine.findCardInstanceId(targetCharacter, "play", PLAYER_TWO);

      expect(testEngine.asPlayerOne().playCard(dormouseEasilyAgitated)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(dormouseEasilyAgitated, {
          resolveOptional: true,
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asServer().getCard(targetId).damage).toBe(1);
    });

    it("does not put damage when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dormouseEasilyAgitated],
          inkwell: dormouseEasilyAgitated.cost,
          deck: 2,
        },
        {
          play: [targetCharacter],
          deck: 2,
        },
      );

      const targetId = testEngine.findCardInstanceId(targetCharacter, "play", PLAYER_TWO);

      expect(testEngine.asPlayerOne().playCard(dormouseEasilyAgitated)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(dormouseEasilyAgitated, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asServer().getCard(targetId).damage).toBe(0);
    });
  });
});
