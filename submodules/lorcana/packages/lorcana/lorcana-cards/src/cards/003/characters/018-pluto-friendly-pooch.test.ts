import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { plutoFriendlyPooch } from "./018-pluto-friendly-pooch";

const testCharacter = createMockCharacter({
  id: "pluto-friendly-test-character",
  name: "Test Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const anotherCharacter = createMockCharacter({
  id: "pluto-friendly-another-character",
  name: "Another Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const testItem = createMockItem({
  id: "pluto-friendly-test-item",
  name: "Test Item",
  cost: 3,
});

describe("Pluto - Friendly Pooch", () => {
  describe("GOOD DOG - {E} — You pay 1 {I} less for the next character you play this turn.", () => {
    it("reduces cost by 1 for the next character you play this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [testCharacter],
        inkwell: testCharacter.cost - 1,
        play: [{ card: plutoFriendlyPooch, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().canPlayCard(testCharacter)).toBe(false);

      expect(
        testEngine.asPlayerOne().activateAbility(plutoFriendlyPooch, {
          ability: "GOOD DOG",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().canPlayCard(testCharacter)).toBe(true);
      expect(testEngine.asPlayerOne().playCard(testCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(testCharacter)).toBe("play");
    });

    it("exerts Pluto when the ability is activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: plutoFriendlyPooch, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().isExerted(plutoFriendlyPooch)).toBe(false);

      expect(
        testEngine.asPlayerOne().activateAbility(plutoFriendlyPooch, {
          ability: "GOOD DOG",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(plutoFriendlyPooch)).toBe(true);
    });

    it("only reduces cost for characters, not items", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [testItem],
        inkwell: testItem.cost - 1,
        play: [{ card: plutoFriendlyPooch, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().canPlayCard(testItem)).toBe(false);

      testEngine.asPlayerOne().activateAbility(plutoFriendlyPooch, {
        ability: "GOOD DOG",
      });

      expect(testEngine.asPlayerOne().canPlayCard(testItem)).toBe(false);
    });

    it("only reduces cost for the NEXT character, not subsequent ones", () => {
      // inkwell = (testCharacter.cost - 1) + (anotherCharacter.cost - 1)
      // After playing testCharacter discounted, only (anotherCharacter.cost - 1) remains — not enough for full cost
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [testCharacter, anotherCharacter],
        inkwell: testCharacter.cost - 1 + anotherCharacter.cost - 1,
        play: [{ card: plutoFriendlyPooch, isDrying: false }],
      });

      testEngine.asPlayerOne().activateAbility(plutoFriendlyPooch, {
        ability: "GOOD DOG",
      });

      expect(testEngine.asPlayerOne().playCard(testCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().canPlayCard(anotherCharacter)).toBe(false);
    });

    it("cannot be activated when Pluto is already exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: plutoFriendlyPooch, exerted: true }],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(plutoFriendlyPooch, {
          ability: "GOOD DOG",
        }).success,
      ).toBe(false);
    });
  });
});
