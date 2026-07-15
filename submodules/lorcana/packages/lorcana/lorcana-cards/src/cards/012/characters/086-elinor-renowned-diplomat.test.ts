import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { elinorRenownedDiplomat } from "./086-elinor-renowned-diplomat";

const exertedAlly1 = createMockCharacter({
  id: "elinor-exerted-ally-1",
  name: "Exerted Ally 1",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const exertedAlly2 = createMockCharacter({
  id: "elinor-exerted-ally-2",
  name: "Exerted Ally 2",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const readyAlly = createMockCharacter({
  id: "elinor-ready-ally",
  name: "Ready Ally",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const opposingCharacter = createMockCharacter({
  id: "elinor-opposing-character",
  name: "Opposing Character",
  cost: 3,
  strength: 3,
  willpower: 5,
});

const deckCard = createMockCharacter({
  id: "elinor-deck-card",
  name: "Deck Card",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Elinor - Renowned Diplomat", () => {
  describe("COORDINATED EFFORTS - At the end of your turn, if you have 3 or more exerted characters in play, deal 1 damage to chosen opposing character, gain 1 lore, and draw a card.", () => {
    it("deals 1 damage to chosen opposing character, gains 1 lore, and draws a card when 3 or more of your characters are exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: elinorRenownedDiplomat, exerted: true, isDrying: false },
            { card: exertedAlly1, exerted: true, isDrying: false },
            { card: exertedAlly2, exerted: true, isDrying: false },
          ],
          deck: [deckCard],
        },
        {
          play: [{ card: opposingCharacter, isDrying: false }],
          deck: 2,
        },
      );

      const playerOne = testEngine.asPlayerOne();
      const loreBefore = playerOne.getLore("player_one");

      expect(playerOne.passTurn()).toBeSuccessfulCommand();

      expect(playerOne.getBagCount()).toBe(1);
      expect(
        playerOne.resolvePendingByCard(elinorRenownedDiplomat, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(1);
      expect(playerOne.getLore("player_one")).toBe(loreBefore + 1);
      expect(playerOne.getCardZone(deckCard)).toBe("hand");
    });

    it("auto-drains bag and does not apply effects when fewer than 3 characters are exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: elinorRenownedDiplomat, exerted: true, isDrying: false },
            { card: exertedAlly1, exerted: true, isDrying: false },
            { card: readyAlly, isDrying: false },
          ],
          deck: [deckCard],
        },
        {
          play: [{ card: opposingCharacter, isDrying: false }],
          deck: 2,
        },
      );

      const playerOne = testEngine.asPlayerOne();
      const loreBefore = playerOne.getLore("player_one");

      expect(playerOne.passTurn()).toBeSuccessfulCommand();

      // Condition fails — bag must auto-drain without requiring player input.
      expect(playerOne.getBagCount()).toBe(0);

      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(0);
      expect(playerOne.getLore("player_one")).toBe(loreBefore);
      expect(playerOne.getCardZone(deckCard)).toBe("deck");
    });

    it("auto-drains bag when 3 or more are exerted but there are no opposing characters", () => {
      // The condition IS met (3+ exerted), so the sequence triggers. The deal-damage
      // step fizzles (no opposing target), but gain-lore and draw still resolve
      // because Lorcana comma-separated effects are independent.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: elinorRenownedDiplomat, exerted: true, isDrying: false },
            { card: exertedAlly1, exerted: true, isDrying: false },
            { card: exertedAlly2, exerted: true, isDrying: false },
          ],
          deck: [deckCard],
        },
        {
          deck: 2,
        },
      );

      const playerOne = testEngine.asPlayerOne();
      const loreBefore = playerOne.getLore("player_one");

      expect(playerOne.passTurn()).toBeSuccessfulCommand();

      // No valid targets for the deal-damage step — bag must auto-drain without player input.
      expect(playerOne.getBagCount()).toBe(0);

      // gain-lore and draw still resolve even though deal-damage had no target.
      expect(playerOne.getLore("player_one")).toBe(loreBefore + 1);
      expect(playerOne.getCardZone(deckCard)).toBe("hand");
    });

    it("counts Elinor herself toward the 3 exerted characters threshold", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: elinorRenownedDiplomat, exerted: true, isDrying: false },
            { card: exertedAlly1, exerted: true, isDrying: false },
            { card: exertedAlly2, exerted: true, isDrying: false },
          ],
          deck: [deckCard],
        },
        {
          play: [{ card: opposingCharacter, isDrying: false }],
          deck: 2,
        },
      );

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.passTurn()).toBeSuccessfulCommand();

      expect(playerOne.getBagCount()).toBe(1);
      expect(
        playerOne.resolvePendingByCard(elinorRenownedDiplomat, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(1);
    });
  });
});
