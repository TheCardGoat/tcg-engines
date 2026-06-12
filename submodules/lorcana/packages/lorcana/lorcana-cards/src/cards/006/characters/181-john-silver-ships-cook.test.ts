import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { johnSilverShipsCook } from "./181-john-silver-ships-cook";

const targetCharacter = createMockCharacter({
  id: "john-silver-sc-target",
  name: "Target Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("John Silver - Ship's Cook", () => {
  describe("HUNK OF HARDWARE - When you play this character, chosen character can't challenge during their next turn.", () => {
    it("applies cant-challenge restriction to chosen character when John Silver is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [johnSilverShipsCook],
          inkwell: johnSilverShipsCook.cost,
          deck: 5,
        },
        {
          play: [targetCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(johnSilverShipsCook)).toBeSuccessfulCommand();

      // Triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Resolve by choosing target character
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(johnSilverShipsCook, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Pass turn to player two
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Target character should have cant-challenge restriction during player two's turn
      expect(testEngine.asPlayerTwo()).toHaveRestriction({
        card: targetCharacter,
        restriction: "cant-challenge",
      });
    });

    it("restriction is lifted after the target's turn ends", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [johnSilverShipsCook],
          inkwell: johnSilverShipsCook.cost,
          deck: 5,
        },
        {
          play: [targetCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(johnSilverShipsCook)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(johnSilverShipsCook, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Pass to player two's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo()).toHaveRestriction({
        card: targetCharacter,
        restriction: "cant-challenge",
      });

      // Pass back to player one's turn
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Restriction should be lifted after player two's turn ends
      expect(testEngine.asPlayerOne()).not.toHaveRestriction({
        card: targetCharacter,
        restriction: "cant-challenge",
      });
    });

    it("can target own characters — restriction applies on controller's next turn", () => {
      const ownCharacter = createMockCharacter({
        id: "john-silver-sc-own-char",
        name: "Own Character",
        cost: 1,
        strength: 1,
        willpower: 2,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [johnSilverShipsCook],
          inkwell: johnSilverShipsCook.cost,
          play: [ownCharacter],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(johnSilverShipsCook)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(johnSilverShipsCook, {
          targets: [ownCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Restriction is not yet active (it applies on the target's next turn)
      expect(testEngine.asPlayerOne()).not.toHaveRestriction({
        card: ownCharacter,
        restriction: "cant-challenge",
      });

      // Pass turns through player two and back to player one
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Now on player one's next turn, own character should have cant-challenge
      expect(testEngine.asPlayerOne()).toHaveRestriction({
        card: ownCharacter,
        restriction: "cant-challenge",
      });
    });
  });
});
