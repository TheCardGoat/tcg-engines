import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { crikeeLuckyCricket } from "./069-cri-kee-lucky-cricket";

const allyCharacter = createMockCharacter({
  id: "cri-kee-lucky-cricket-ally",
  name: "Mulan Ally",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Cri-Kee - Lucky Cricket", () => {
  describe("SPREADING GOOD FORTUNE - When you play this character, your other characters get +3 {S} this turn.", () => {
    it("gives other characters +3 strength and does not buff Cri-Kee himself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [crikeeLuckyCricket],
        inkwell: crikeeLuckyCricket.cost,
        play: [allyCharacter],
        deck: 5,
      });

      const initialAllyStrength = testEngine.asPlayerOne().getCardStrength(allyCharacter);
      const initialCriKeeStrength = testEngine.asPlayerOne().getCardStrength(crikeeLuckyCricket);

      expect(testEngine.asPlayerOne().playCard(crikeeLuckyCricket)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(allyCharacter)).toBe(initialAllyStrength + 3);
      expect(testEngine.asPlayerOne().getCardStrength(crikeeLuckyCricket)).toBe(
        initialCriKeeStrength,
      );
    });
  });
});
