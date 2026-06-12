import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { jasmineQueenOfAgrabah } from "./149-jasmine-queen-of-agrabah";

const woundedAlly = createMockCharacter({
  id: "jasmine-qoa-wounded-ally",
  name: "Wounded Ally",
  cost: 2,
  willpower: 5,
});

const anotherWoundedAlly = createMockCharacter({
  id: "jasmine-qoa-another-wounded-ally",
  name: "Another Wounded Ally",
  cost: 2,
  willpower: 5,
});

describe("Jasmine - Queen of Agrabah", () => {
  describe("CARETAKER - When you play this character and whenever she quests, you may remove up to 2 damage from each of your characters.", () => {
    it("On play: removes up to 2 damage from each of your characters when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: 2,
        hand: [jasmineQueenOfAgrabah],
        inkwell: jasmineQueenOfAgrabah.cost,
        play: [
          { card: woundedAlly, damage: 4 },
          { card: anotherWoundedAlly, damage: 4 },
        ],
      });

      expect(testEngine.asPlayerOne().playCard(jasmineQueenOfAgrabah)).toBeSuccessfulCommand();

      // Optional triggered ability queued in bag — resolve it (accept)
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(jasmineQueenOfAgrabah, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(woundedAlly)).toBe(2);
      expect(testEngine.asPlayerOne().getDamage(anotherWoundedAlly)).toBe(2);
    });

    it("On play: optional — no damage removed when declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: 2,
        hand: [jasmineQueenOfAgrabah],
        inkwell: jasmineQueenOfAgrabah.cost,
        play: [
          { card: woundedAlly, damage: 4 },
          { card: anotherWoundedAlly, damage: 4 },
        ],
      });

      expect(testEngine.asPlayerOne().playCard(jasmineQueenOfAgrabah)).toBeSuccessfulCommand();

      // Optional triggered ability queued in bag — decline it
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(jasmineQueenOfAgrabah, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(woundedAlly)).toBe(4);
      expect(testEngine.asPlayerOne().getDamage(anotherWoundedAlly)).toBe(4);
    });

    it("On quest: removes up to 2 damage from each of your characters when she quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: 2,
        play: [
          { card: jasmineQueenOfAgrabah, isDrying: false },
          { card: woundedAlly, damage: 2 },
          { card: anotherWoundedAlly, damage: 2 },
        ],
      });

      expect(testEngine.asPlayerOne().quest(jasmineQueenOfAgrabah)).toBeSuccessfulCommand();

      // Optional triggered ability queued in bag — resolve it (accept)
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(jasmineQueenOfAgrabah, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(woundedAlly)).toBe(0);
      expect(testEngine.asPlayerOne().getDamage(anotherWoundedAlly)).toBe(0);
    });

    it("On quest: optional — no damage removed when declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: 2,
        play: [
          { card: jasmineQueenOfAgrabah, isDrying: false },
          { card: woundedAlly, damage: 2 },
          { card: anotherWoundedAlly, damage: 2 },
        ],
      });

      expect(testEngine.asPlayerOne().quest(jasmineQueenOfAgrabah)).toBeSuccessfulCommand();

      // Optional triggered ability queued in bag — decline it
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(jasmineQueenOfAgrabah, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(woundedAlly)).toBe(2);
      expect(testEngine.asPlayerOne().getDamage(anotherWoundedAlly)).toBe(2);
    });
  });
});
