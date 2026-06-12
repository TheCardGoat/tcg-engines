import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mirageSuperRecruiter } from "./053-mirage-super-recruiter";

const superAlly = createMockCharacter({
  id: "mirage-super-recruiter-super-ally",
  name: "Mr. Incredible",
  version: "Family Man",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Hero", "Super"],
});

const heroAlly = createMockCharacter({
  id: "mirage-super-recruiter-hero-ally",
  name: "Generic Hero",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

const nonQualifyingAlly = createMockCharacter({
  id: "mirage-super-recruiter-non-qualifying",
  name: "Generic Villain",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Villain"],
});

describe("Mirage - Super Recruiter", () => {
  describe("BUSINESS ARRANGEMENT - When you play this character, if you have a Super or Hero character in play, you may draw a card.", () => {
    it("draws a card when played with a Super character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mirageSuperRecruiter],
        inkwell: mirageSuperRecruiter.cost,
        play: [superAlly],
        deck: 5,
      });

      const playerOne = testEngine.asPlayerOne();
      const handCountBefore = playerOne.getCardsInZone("hand", "player_one").count;

      expect(playerOne.playCard(mirageSuperRecruiter)).toBeSuccessfulCommand();
      expect(playerOne.getBagCount()).toBe(1);

      expect(
        playerOne.resolvePendingByCard(mirageSuperRecruiter, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // Mirage left hand (-1) and one card was drawn (+1): net hand count unchanged.
      expect(playerOne.getCardsInZone("hand", "player_one").count).toBe(handCountBefore);
    });

    it("draws a card when played with a Hero character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mirageSuperRecruiter],
        inkwell: mirageSuperRecruiter.cost,
        play: [heroAlly],
        deck: 5,
      });

      const playerOne = testEngine.asPlayerOne();
      const handCountBefore = playerOne.getCardsInZone("hand", "player_one").count;

      expect(playerOne.playCard(mirageSuperRecruiter)).toBeSuccessfulCommand();
      expect(playerOne.getBagCount()).toBe(1);

      expect(
        playerOne.resolvePendingByCard(mirageSuperRecruiter, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(playerOne.getCardsInZone("hand", "player_one").count).toBe(handCountBefore);
    });

    it("does not draw a card when the controller declines the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mirageSuperRecruiter],
        inkwell: mirageSuperRecruiter.cost,
        play: [superAlly],
        deck: 5,
      });

      const playerOne = testEngine.asPlayerOne();
      const handCountBefore = playerOne.getCardsInZone("hand", "player_one").count;

      expect(playerOne.playCard(mirageSuperRecruiter)).toBeSuccessfulCommand();
      expect(playerOne.getBagCount()).toBe(1);

      expect(
        playerOne.resolvePendingByCard(mirageSuperRecruiter, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Mirage left hand but no card drawn: hand count decreased by 1.
      expect(playerOne.getCardsInZone("hand", "player_one").count).toBe(handCountBefore - 1);
    });

    it("does not draw when no Super or Hero character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mirageSuperRecruiter],
        inkwell: mirageSuperRecruiter.cost,
        play: [nonQualifyingAlly],
        deck: 5,
      });

      const playerOne = testEngine.asPlayerOne();
      const handCountBefore = playerOne.getCardsInZone("hand", "player_one").count;

      expect(playerOne.playCard(mirageSuperRecruiter)).toBeSuccessfulCommand();

      // Resolve any pending trigger (condition should fail, so no draw)
      const bagCount = playerOne.getBagCount();
      if (bagCount > 0) {
        expect(
          playerOne.resolvePendingByCard(mirageSuperRecruiter, {
            resolveOptional: true,
          }),
        ).toBeSuccessfulCommand();
      }

      // Hand count decreases by 1 (only Mirage was removed) – no card drawn.
      expect(playerOne.getCardsInZone("hand", "player_one").count).toBe(handCountBefore - 1);
    });

    it("does not draw when played alone (Mirage is neither Super nor Hero)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mirageSuperRecruiter],
        inkwell: mirageSuperRecruiter.cost,
        deck: 5,
      });

      const playerOne = testEngine.asPlayerOne();
      const handCountBefore = playerOne.getCardsInZone("hand", "player_one").count;

      expect(playerOne.playCard(mirageSuperRecruiter)).toBeSuccessfulCommand();

      const bagCount = playerOne.getBagCount();
      if (bagCount > 0) {
        expect(
          playerOne.resolvePendingByCard(mirageSuperRecruiter, {
            resolveOptional: true,
          }),
        ).toBeSuccessfulCommand();
      }

      expect(playerOne.getCardsInZone("hand", "player_one").count).toBe(handCountBefore - 1);
    });
  });
});
