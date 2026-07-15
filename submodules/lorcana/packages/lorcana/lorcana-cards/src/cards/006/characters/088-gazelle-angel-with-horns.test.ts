import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { gazelleAngelWithHorns } from "./088-gazelle-angel-with-horns";

const targetCharacter = createMockCharacter({
  id: "gazelle-awh-target",
  name: "Target Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Gazelle - Angel with Horns", () => {
  describe("YOU ARE A REALLY HOT DANCER", () => {
    it("grants Evasive to chosen character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [targetCharacter],
        hand: [gazelleAngelWithHorns],
        inkwell: gazelleAngelWithHorns.cost,
      });

      expect(testEngine.asPlayerOne().playCard(gazelleAngelWithHorns)).toBeSuccessfulCommand();

      // Resolve the bag effect
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(gazelleAngelWithHorns),
      ).toBeSuccessfulCommand();

      // Choose the target character
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      // Target character should now have Evasive
      expect(testEngine.asPlayerOne().hasKeyword(targetCharacter, "Evasive")).toBe(true);
    });

    it("Evasive expires at the start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [targetCharacter],
          hand: [gazelleAngelWithHorns],
          inkwell: gazelleAngelWithHorns.cost,
          deck: 5,
        },
        { deck: 5 },
      );

      testEngine.asPlayerOne().playCard(gazelleAngelWithHorns);
      testEngine.asPlayerOne().resolvePendingByCard(gazelleAngelWithHorns);
      testEngine.asPlayerOne().resolveNextPending({ targets: [targetCharacter] });

      expect(testEngine.asPlayerOne().hasKeyword(targetCharacter, "Evasive")).toBe(true);

      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();

      expect(testEngine.asPlayerOne().hasKeyword(targetCharacter, "Evasive")).toBe(false);
    });
  });
});
