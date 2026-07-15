import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { describe, expect, it } from "bun:test";
import { hammPiggyBank } from "./011-hamm-piggy-bank";

const testCharacter = createMockCharacter({
  id: "hamm-piggy-test-character",
  name: "Test Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const anotherCharacter = createMockCharacter({
  id: "hamm-piggy-another-character",
  name: "Another Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const testItem = createMockItem({
  id: "hamm-piggy-test-item",
  name: "Test Item",
  cost: 3,
});

describe("Hamm - Piggy Bank", () => {
  describe("LOOSE CHANGE - {E} — You pay 1 {I} less for the next character you play this turn.", () => {
    it("reduces cost by 1 for the next character you play this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [testCharacter],
        inkwell: testCharacter.cost - 1,
        play: [{ card: hammPiggyBank, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().canPlayCard(testCharacter)).toBe(false);

      expect(
        testEngine.asPlayerOne().activateAbility(hammPiggyBank, {
          ability: "LOOSE CHANGE",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().canPlayCard(testCharacter)).toBe(true);
      expect(testEngine.asPlayerOne().playCard(testCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(testCharacter)).toBe("play");
    });

    it("exerts Hamm when the ability is activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: hammPiggyBank, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().isExerted(hammPiggyBank)).toBe(false);

      expect(
        testEngine.asPlayerOne().activateAbility(hammPiggyBank, {
          ability: "LOOSE CHANGE",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(hammPiggyBank)).toBe(true);
    });

    it("only reduces cost for characters, not items", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [testItem],
        inkwell: testItem.cost - 1,
        play: [{ card: hammPiggyBank, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().canPlayCard(testItem)).toBe(false);

      testEngine.asPlayerOne().activateAbility(hammPiggyBank, {
        ability: "LOOSE CHANGE",
      });

      expect(testEngine.asPlayerOne().canPlayCard(testItem)).toBe(false);
    });

    it("only reduces cost for the NEXT character, not subsequent ones", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [testCharacter, anotherCharacter],
        inkwell: testCharacter.cost - 1 + anotherCharacter.cost - 1,
        play: [{ card: hammPiggyBank, isDrying: false }],
      });

      testEngine.asPlayerOne().activateAbility(hammPiggyBank, {
        ability: "LOOSE CHANGE",
      });

      expect(testEngine.asPlayerOne().playCard(testCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().canPlayCard(anotherCharacter)).toBe(false);
    });

    it("cannot be activated when Hamm is already exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: hammPiggyBank, exerted: true }],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(hammPiggyBank, {
          ability: "LOOSE CHANGE",
        }).success,
      ).toBe(false);
    });
  });
});
