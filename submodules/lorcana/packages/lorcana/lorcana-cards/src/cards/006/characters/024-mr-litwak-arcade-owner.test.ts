import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mrLitwakArcadeOwner } from "./024-mr-litwak-arcade-owner";

const anotherCharacter = createMockCharacter({
  id: "litwak-test-another-char",
  name: "Another Character",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const thirdCharacter = createMockCharacter({
  id: "litwak-test-third-char",
  name: "Third Character",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

describe("Mr. Litwak - Arcade Owner", () => {
  describe("THE GANG'S ALL HERE — Once during your turn, whenever you play another character, you may ready this character. He can't quest or challenge for the rest of this turn.", () => {
    it("readies Mr. Litwak when another character is played and the optional ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mrLitwakArcadeOwner, exerted: true }],
          hand: [anotherCharacter],
          inkwell: anotherCharacter.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      // Verify Mr. Litwak starts exerted
      expect(testEngine.asPlayerOne().getCard(mrLitwakArcadeOwner).exerted).toBe(true);

      // Play another character to trigger the ability
      expect(testEngine.asPlayerOne().playCard(anotherCharacter)).toBeSuccessfulCommand();

      // Trigger should fire - accept the optional ability
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mrLitwakArcadeOwner, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Mr. Litwak should be readied
      expect(testEngine.asPlayerOne().getCard(mrLitwakArcadeOwner).exerted).toBe(false);
    });

    it("is optional - can decline the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mrLitwakArcadeOwner, exerted: true }],
          hand: [anotherCharacter],
          inkwell: anotherCharacter.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(anotherCharacter)).toBeSuccessfulCommand();

      // Decline the optional ability
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mrLitwakArcadeOwner, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Mr. Litwak should still be exerted
      expect(testEngine.asPlayerOne().getCard(mrLitwakArcadeOwner).exerted).toBe(true);
    });

    it("gives Mr. Litwak a quest restriction after readying", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mrLitwakArcadeOwner, exerted: true }],
          hand: [anotherCharacter],
          inkwell: anotherCharacter.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(anotherCharacter)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mrLitwakArcadeOwner, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Mr. Litwak should have a quest restriction
      expect(testEngine.asPlayerOne().getCard(mrLitwakArcadeOwner).hasQuestRestriction).toBe(true);
    });

    it("only triggers once per turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mrLitwakArcadeOwner, exerted: true }],
          hand: [anotherCharacter, thirdCharacter],
          inkwell: anotherCharacter.cost + thirdCharacter.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      // Play first character - trigger fires
      expect(testEngine.asPlayerOne().playCard(anotherCharacter)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mrLitwakArcadeOwner, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(mrLitwakArcadeOwner).exerted).toBe(false);

      // Play second character - trigger should NOT fire again (once per turn)
      expect(testEngine.asPlayerOne().playCard(thirdCharacter)).toBeSuccessfulCommand();

      // No new bag effect should be created for Mr. Litwak
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
