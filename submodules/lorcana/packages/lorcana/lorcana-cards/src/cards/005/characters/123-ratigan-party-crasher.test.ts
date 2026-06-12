import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { ratiganPartyCrasher } from "./123-ratigan-party-crasher";

const allyCharacter = createMockCharacter({
  id: "ratigan-ally",
  name: "Ally Character",
  cost: 2,
  strength: 2,
  willpower: 4,
});

const anotherAlly = createMockCharacter({
  id: "ratigan-another-ally",
  name: "Another Ally",
  cost: 2,
  strength: 1,
  willpower: 3,
});

const opponentCharacter = createMockCharacter({
  id: "ratigan-opponent",
  name: "Opponent Character",
  cost: 2,
  strength: 3,
  willpower: 5,
});

describe("Ratigan - Party Crasher", () => {
  describe("DELIGHTFULLY WICKED - Your damaged characters get +2 {S}.", () => {
    it("gives +2 strength to your damaged characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: ratiganPartyCrasher, isDrying: false },
            { card: allyCharacter, isDrying: false, damage: 1 },
          ],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      // Damaged ally should get +2 strength (2 base + 2 = 4)
      expect(testEngine.asPlayerOne().getCard(allyCharacter).strength).toBe(4);
    });

    it("does not give +2 strength to undamaged characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: ratiganPartyCrasher, isDrying: false },
            { card: allyCharacter, isDrying: false },
          ],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      // Undamaged ally should keep base strength
      expect(testEngine.asPlayerOne().getCard(allyCharacter).strength).toBe(2);
    });

    it("gives +2 strength to Ratigan himself when he is damaged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: ratiganPartyCrasher, isDrying: false, damage: 1 }],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      // Ratigan should get +2 strength (5 base + 2 = 7)
      expect(testEngine.asPlayerOne().getCard(ratiganPartyCrasher).strength).toBe(7);
    });

    it("does not give +2 strength to opponent's damaged characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: ratiganPartyCrasher, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: opponentCharacter, isDrying: false, damage: 1 }],
          deck: 5,
        },
      );

      // Opponent's damaged character should keep base strength
      expect(testEngine.asPlayerTwo().getCard(opponentCharacter).strength).toBe(3);
    });

    it("buff applies dynamically when a character becomes damaged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: ratiganPartyCrasher, isDrying: false },
            { card: allyCharacter, isDrying: false, exerted: true },
          ],
          deck: 5,
        },
        {
          play: [{ card: opponentCharacter, isDrying: false }],
          deck: 5,
        },
      );

      // Before damage, ally should have base strength
      expect(testEngine.asPlayerOne().getCard(allyCharacter).strength).toBe(2);

      // Pass turn so opponent can act
      testEngine.asPlayerOne().passTurn();

      // Opponent challenges the ally (3 str opponent vs 4 wp ally = 3 damage)
      expect(
        testEngine.asPlayerTwo().challenge(opponentCharacter, allyCharacter),
      ).toBeSuccessfulCommand();

      // Now ally is damaged, should have +2 strength (2 base + 2 = 4)
      expect(testEngine.asPlayerOne().getCard(allyCharacter).strength).toBe(4);
    });
  });
});
