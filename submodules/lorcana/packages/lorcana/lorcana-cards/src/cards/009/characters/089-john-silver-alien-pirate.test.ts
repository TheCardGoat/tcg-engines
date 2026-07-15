import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { johnSilverAlienPirate } from "./089-john-silver-alien-pirate";

const opposingCharacter = createMockCharacter({
  id: "john-silver-ap-opponent",
  name: "Opposing Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("John Silver - Alien Pirate (Set 9)", () => {
  describe("PICK YOUR FIGHTS — When you play this character and whenever he quests, chosen opposing character gains Reckless during their next turn.", () => {
    it("gives Reckless to a chosen opposing character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [johnSilverAlienPirate],
          inkwell: johnSilverAlienPirate.cost,
          deck: 3,
        },
        {
          play: [opposingCharacter],
          deck: 3,
        },
      );

      const opposingId = testEngine.findCardInstanceId(opposingCharacter, "play", PLAYER_TWO);

      expect(testEngine.asPlayerOne().playCard(johnSilverAlienPirate)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(johnSilverAlienPirate, {
          targets: [opposingId],
        }),
      ).toBeSuccessfulCommand();

      // Reckless should not be active yet (it takes effect during opponent's next turn)
      expect(testEngine.asPlayerTwo().getCard(opposingCharacter)?.hasReckless).toBe(false);

      // Pass the turn to player two
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Now on player two's turn, the character should have Reckless
      expect(testEngine.asPlayerTwo().getCard(opposingCharacter)?.hasReckless).toBe(true);

      // After player two's turn ends, Reckless is removed
      expect(
        testEngine.executeMoveForView("authoritative", "manualPassTurn", {
          args: {},
        }).success,
      ).toBe(true);
      expect(testEngine.asPlayerTwo().getCard(opposingCharacter)?.hasReckless).toBe(false);
    });

    it("gives Reckless to a chosen opposing character when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [johnSilverAlienPirate],
          deck: 3,
        },
        {
          play: [opposingCharacter],
          deck: 3,
        },
      );

      // Pass turns to make John Silver ready
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      const opposingId = testEngine.findCardInstanceId(opposingCharacter, "play", PLAYER_TWO);

      expect(testEngine.asPlayerOne().quest(johnSilverAlienPirate)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(johnSilverAlienPirate, {
          targets: [opposingId],
        }),
      ).toBeSuccessfulCommand();

      // Reckless takes effect during the opponent's next turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCard(opposingCharacter)?.hasReckless).toBe(true);

      expect(
        testEngine.executeMoveForView("authoritative", "manualPassTurn", {
          args: {},
        }).success,
      ).toBe(true);
      expect(testEngine.asPlayerTwo().getCard(opposingCharacter)?.hasReckless).toBe(false);
    });
  });
});
