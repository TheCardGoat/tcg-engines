import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { tinkerBellQueenOfTheAzuriteFairies } from "./048-tinker-bell-queen-of-the-azurite-fairies";

const fairyAlly = createMockCharacter({
  id: "tinker-bell-fairy-ally",
  name: "Fairy Ally",
  cost: 2,
  lore: 1,
  classifications: ["Storyborn", "Fairy"],
});

const nonFairyAlly = createMockCharacter({
  id: "tinker-bell-non-fairy-ally",
  name: "Non-Fairy Ally",
  cost: 2,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

describe("Tinker Bell - Queen of the Azurite Fairies", () => {
  describe("base stats", () => {
    it("should have correct base stats", () => {
      expect(tinkerBellQueenOfTheAzuriteFairies.cost).toBe(7);
      expect(tinkerBellQueenOfTheAzuriteFairies.strength).toBe(5);
      expect(tinkerBellQueenOfTheAzuriteFairies.willpower).toBe(6);
      expect(tinkerBellQueenOfTheAzuriteFairies.lore).toBe(2);
      expect(tinkerBellQueenOfTheAzuriteFairies.inkable).toBe(true);
      expect(tinkerBellQueenOfTheAzuriteFairies.inkType).toEqual(["amethyst"]);
      expect(tinkerBellQueenOfTheAzuriteFairies.set).toBe("006");
      expect(tinkerBellQueenOfTheAzuriteFairies.cardNumber).toBe(48);
      expect(tinkerBellQueenOfTheAzuriteFairies.rarity).toBe("uncommon");
    });
  });

  describe("Shift 5 keyword", () => {
    it("should have the Shift keyword ability", () => {
      const shiftAbility = tinkerBellQueenOfTheAzuriteFairies.abilities?.find(
        (a) => a.type === "keyword" && a.keyword === "Shift",
      );
      expect(shiftAbility).toBeDefined();
    });
  });

  describe("Evasive keyword", () => {
    it("should have the Evasive keyword ability", () => {
      const evasiveAbility = tinkerBellQueenOfTheAzuriteFairies.abilities?.find(
        (a) => a.type === "keyword" && a.keyword === "Evasive",
      );
      expect(evasiveAbility).toBeDefined();
    });
  });

  describe("SHINING EXAMPLE - Whenever this character quests, your other Fairy characters get +1 lore this turn.", () => {
    it("gives your other Fairy characters +1 lore for the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: tinkerBellQueenOfTheAzuriteFairies, isDrying: false },
          { card: fairyAlly, isDrying: false },
          { card: nonFairyAlly, isDrying: false },
        ],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(tinkerBellQueenOfTheAzuriteFairies)).toBe(
        tinkerBellQueenOfTheAzuriteFairies.lore,
      );
      expect(testEngine.asPlayerOne().getCardLore(fairyAlly)).toBe(fairyAlly.lore);
      expect(testEngine.asPlayerOne().getCardLore(nonFairyAlly)).toBe(nonFairyAlly.lore);

      expect(
        testEngine.asPlayerOne().quest(tinkerBellQueenOfTheAzuriteFairies),
      ).toBeSuccessfulCommand();

      // Tinker Bell herself does NOT get the bonus (excludeSelf)
      expect(testEngine.asPlayerOne().getCardLore(tinkerBellQueenOfTheAzuriteFairies)).toBe(
        tinkerBellQueenOfTheAzuriteFairies.lore,
      );
      // Fairy ally gets +1 lore
      expect(testEngine.asPlayerOne().getCardLore(fairyAlly)).toBe(fairyAlly.lore + 1);
      // Non-Fairy ally does NOT get the bonus
      expect(testEngine.asPlayerOne().getCardLore(nonFairyAlly)).toBe(nonFairyAlly.lore);

      // Questing with the fairy ally should count the boosted lore
      expect(testEngine.asPlayerOne().quest(fairyAlly)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(
        tinkerBellQueenOfTheAzuriteFairies.lore + fairyAlly.lore + 1,
      );
    });

    it("removes the lore bonus at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: tinkerBellQueenOfTheAzuriteFairies, isDrying: false },
            { card: fairyAlly, isDrying: false },
          ],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().quest(tinkerBellQueenOfTheAzuriteFairies),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardLore(fairyAlly)).toBe(fairyAlly.lore + 1);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(fairyAlly)).toBe(fairyAlly.lore);
    });

    it("does not give lore bonus to opponent's Fairy characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: tinkerBellQueenOfTheAzuriteFairies, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: fairyAlly, isDrying: false }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().quest(tinkerBellQueenOfTheAzuriteFairies),
      ).toBeSuccessfulCommand();

      // Opponent's fairy should NOT get the bonus
      expect(testEngine.asPlayerTwo().getCardLore(fairyAlly)).toBe(fairyAlly.lore);
    });
  });
});
