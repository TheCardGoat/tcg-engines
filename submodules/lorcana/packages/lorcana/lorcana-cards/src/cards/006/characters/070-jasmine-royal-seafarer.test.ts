import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { jasmineRoyalSeafarer } from "./070-jasmine-royal-seafarer";

const damagedCharacter = createMockCharacter({
  id: "jasmine-rs-damaged-char",
  name: "Damaged Character",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
});

const opposingCharacter = createMockCharacter({
  id: "jasmine-rs-opposing-char",
  name: "Opposing Character",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
});

describe("Jasmine - Royal Seafarer", () => {
  describe("BY ORDER OF THE PRINCESS: When you play this character, choose one:", () => {
    it("mode 0: Exert chosen damaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: jasmineRoyalSeafarer.cost,
          hand: [jasmineRoyalSeafarer],
          deck: 2,
        },
        {
          play: [damagedCharacter],
          deck: 2,
        },
      );

      // Deal damage to the opposing character so it becomes a valid target
      expect(testEngine.asServer().manualSetDamage(damagedCharacter, 2)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().playCard(jasmineRoyalSeafarer)).toBeSuccessfulCommand();

      // The triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Choose mode 0: exert chosen damaged character
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jasmineRoyalSeafarer, {
          choiceIndex: 0,
          targets: [damagedCharacter],
        }),
      ).toBeSuccessfulCommand();

      // The damaged character should now be exerted
      expect(testEngine.isExerted(damagedCharacter)).toBe(true);
    });

    it("mode 1: Chosen opposing character gains Reckless during their next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: jasmineRoyalSeafarer.cost,
          hand: [jasmineRoyalSeafarer],
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(jasmineRoyalSeafarer)).toBeSuccessfulCommand();

      // The triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Choose mode 1: chosen opposing character gains Reckless during their next turn
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jasmineRoyalSeafarer, {
          choiceIndex: 1,
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Reckless should not be active yet on player one's turn
      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(false);

      // Pass to opponent's next turn
      testEngine.asServer().passTurn();

      // During opponent's next turn, the opposing character should have Reckless
      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(true);

      // Opponent must challenge due to Reckless — challenge Jasmine (who is ready/drying)
      // Pass opponent's turn to verify Reckless expires
      testEngine.asServer().passTurn();

      // Reckless should expire after opponent's turn ends
      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(false);
    });

    it("does not trigger when the card has no valid damaged target for mode 0 — ability still fires and player can select mode 1", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: jasmineRoyalSeafarer.cost,
          hand: [jasmineRoyalSeafarer],
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(jasmineRoyalSeafarer)).toBeSuccessfulCommand();

      // Triggered ability fires even without damaged targets
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Choose mode 1 instead
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jasmineRoyalSeafarer, {
          choiceIndex: 1,
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      testEngine.asServer().passTurn();
      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(true);
    });

    it("findCardInstanceId works for player two's play zone", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: jasmineRoyalSeafarer.cost,
          hand: [jasmineRoyalSeafarer],
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      const opposingCharId = testEngine.findCardInstanceId(opposingCharacter, "play", PLAYER_TWO);
      expect(opposingCharId).toBeDefined();
    });
  });
});
