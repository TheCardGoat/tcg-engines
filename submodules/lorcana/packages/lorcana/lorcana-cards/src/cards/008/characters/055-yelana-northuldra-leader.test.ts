import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { yelanaNorthuldraLeader } from "./055-yelana-northuldra-leader";

const allyCharacter = createMockCharacter({
  id: "yelana-test-ally",
  name: "Ally Character",
  cost: 2,
  strength: 3,
  willpower: 4,
  lore: 1,
});

describe("Yelana - Northuldra Leader", () => {
  describe("WE ONLY TRUST NATURE - When you play this character, chosen character gains Challenger +2 this turn.", () => {
    it("grants Challenger +2 to chosen character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [yelanaNorthuldraLeader],
        play: [allyCharacter],
        inkwell: yelanaNorthuldraLeader.cost,
      });

      expect(testEngine.asPlayerOne().hasKeyword(allyCharacter, "Challenger")).toBe(false);

      expect(testEngine.asPlayerOne().playCard(yelanaNorthuldraLeader)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(yelanaNorthuldraLeader, { targets: [allyCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(allyCharacter, "Challenger")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(allyCharacter, "Challenger")).toBe(2);
    });

    it("Challenger +2 effect expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [yelanaNorthuldraLeader],
          play: [allyCharacter],
          inkwell: yelanaNorthuldraLeader.cost,
        },
        {},
      );

      expect(testEngine.asPlayerOne().playCard(yelanaNorthuldraLeader)).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(yelanaNorthuldraLeader, { targets: [allyCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(allyCharacter, "Challenger")).toBe(true);

      // Pass turn to expire the effect
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(allyCharacter, "Challenger")).toBe(false);
    });
  });
});
