import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { littleJohnSirReginald } from "./176-little-john-sir-reginald";

const alliedHero = createMockCharacter({
  id: "sir-reginald-allied-hero",
  name: "Allied Hero",
  cost: 2,
  classifications: ["Storyborn", "Hero"],
});

const opposingHero = createMockCharacter({
  id: "sir-reginald-opposing-hero",
  name: "Opposing Hero",
  cost: 2,
  classifications: ["Dreamborn", "Hero"],
});

const alliedVillain = createMockCharacter({
  id: "sir-reginald-allied-villain",
  name: "Allied Villain",
  cost: 2,
  classifications: ["Storyborn", "Villain"],
});

const opposingVillain = createMockCharacter({
  id: "sir-reginald-opposing-villain",
  name: "Opposing Villain",
  cost: 2,
  classifications: ["Dreamborn", "Villain"],
});

describe("Little John - Sir Reginald", () => {
  describe("WHAT A BEAUTIFUL BRAWL! - When you play this character, choose one:", () => {
    it("mode 0: Chosen Hero character gains Resist +2 this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [littleJohnSirReginald],
          inkwell: littleJohnSirReginald.cost,
          play: [alliedHero],
        },
        {
          play: [opposingHero],
        },
      );

      expect(testEngine.asPlayerOne().playCard(littleJohnSirReginald)).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(littleJohnSirReginald, { choiceIndex: 0, targets: [alliedHero] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(alliedHero, "Resist")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(alliedHero, "Resist")).toBe(2);
      expect(testEngine.asPlayerTwo().hasKeyword(opposingHero, "Resist")).toBe(false);
    });

    it("mode 1: Deal 2 damage to chosen Villain character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [littleJohnSirReginald],
          inkwell: littleJohnSirReginald.cost,
        },
        {
          play: [opposingVillain],
        },
      );

      expect(testEngine.asPlayerOne().playCard(littleJohnSirReginald)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(littleJohnSirReginald, {
          choiceIndex: 1,
          targets: [opposingVillain],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo()).toHaveDamage({ card: opposingVillain, value: 2 });
    });

    it("can target own Villain character with damage mode", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [littleJohnSirReginald],
        inkwell: littleJohnSirReginald.cost,
        play: [alliedVillain],
      });

      expect(testEngine.asPlayerOne().playCard(littleJohnSirReginald)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(littleJohnSirReginald, {
          choiceIndex: 1,
          targets: [alliedVillain],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveDamage({ card: alliedVillain, value: 2 });
    });

    it("can target opposing Hero character with Resist mode", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [littleJohnSirReginald],
          inkwell: littleJohnSirReginald.cost,
        },
        {
          play: [opposingHero],
        },
      );

      expect(testEngine.asPlayerOne().playCard(littleJohnSirReginald)).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(littleJohnSirReginald, { choiceIndex: 0, targets: [opposingHero] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().hasKeyword(opposingHero, "Resist")).toBe(true);
      expect(testEngine.asPlayerTwo().getKeywordValue(opposingHero, "Resist")).toBe(2);
    });
  });
});
