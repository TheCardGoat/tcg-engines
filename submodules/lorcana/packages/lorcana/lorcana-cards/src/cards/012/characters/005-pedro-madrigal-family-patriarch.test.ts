import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { pedroMadrigalFamilyPatriarch } from "./005-pedro-madrigal-family-patriarch";

const madrigalAlly = createMockCharacter({
  id: "pedro-madrigal-ally",
  name: "Madrigal Ally",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
  classifications: ["Storyborn", "Madrigal"],
});

const nonMadrigalAlly = createMockCharacter({
  id: "pedro-non-madrigal-ally",
  name: "Non-Madrigal Ally",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

describe("Pedro Madrigal - Family Patriarch", () => {
  describe("DIFFICULT JOURNEY - This character enters play with 1 damage.", () => {
    it("enters play with 1 damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [pedroMadrigalFamilyPatriarch],
        inkwell: pedroMadrigalFamilyPatriarch.cost,
      });

      expect(
        testEngine.asPlayerOne().playCard(pedroMadrigalFamilyPatriarch),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(pedroMadrigalFamilyPatriarch)?.damage).toBe(1);
    });
  });

  describe("DEVOTED FAMILY - When you play this character, if you have another Madrigal character in play, you may remove up to 1 damage from him.", () => {
    it("removes 1 damage from Pedro when another Madrigal is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [pedroMadrigalFamilyPatriarch],
        play: [madrigalAlly],
        inkwell: pedroMadrigalFamilyPatriarch.cost,
      });

      expect(
        testEngine.asPlayerOne().playCard(pedroMadrigalFamilyPatriarch),
      ).toBeSuccessfulCommand();

      // Pedro entered with 1 damage from DIFFICULT JOURNEY
      expect(testEngine.asPlayerOne().getCard(pedroMadrigalFamilyPatriarch)?.damage).toBe(1);

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pedroMadrigalFamilyPatriarch, {
          resolveOptional: true,
          amount: 1,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(pedroMadrigalFamilyPatriarch)?.damage).toBe(0);
    });

    it("does not trigger when no other Madrigal character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [pedroMadrigalFamilyPatriarch],
        play: [nonMadrigalAlly],
        inkwell: pedroMadrigalFamilyPatriarch.cost,
      });

      expect(
        testEngine.asPlayerOne().playCard(pedroMadrigalFamilyPatriarch),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Pedro still has 1 damage from DIFFICULT JOURNEY
      expect(testEngine.asPlayerOne().getCard(pedroMadrigalFamilyPatriarch)?.damage).toBe(1);
    });

    it("can decline the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [pedroMadrigalFamilyPatriarch],
        play: [madrigalAlly],
        inkwell: pedroMadrigalFamilyPatriarch.cost,
      });

      expect(
        testEngine.asPlayerOne().playCard(pedroMadrigalFamilyPatriarch),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pedroMadrigalFamilyPatriarch, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Damage remains because player declined the optional effect
      expect(testEngine.asPlayerOne().getCard(pedroMadrigalFamilyPatriarch)?.damage).toBe(1);
    });
  });

  describe("release notes ruling", () => {
    it("'him' refers to this character only — cannot remove damage from another copy of Pedro Madrigal in play", () => {
      // Release-notes Q&A: When you play this character with another copy of
      // Pedro Madrigal in play, the "him" in Devoted Family refers to the
      // newly played Pedro, NOT the other copy.
      const otherPedroInPlay = {
        ...pedroMadrigalFamilyPatriarch,
        id: `${pedroMadrigalFamilyPatriarch.id}-second`,
      };

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [pedroMadrigalFamilyPatriarch],
        // The other Pedro is already in play and has 1 damage on him.
        play: [{ card: otherPedroInPlay, damage: 1, isDrying: false }],
        inkwell: pedroMadrigalFamilyPatriarch.cost,
      });

      expect(
        testEngine.asPlayerOne().playCard(pedroMadrigalFamilyPatriarch),
      ).toBeSuccessfulCommand();

      // Trigger should fire — there IS another Madrigal in play.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pedroMadrigalFamilyPatriarch, {
          resolveOptional: true,
          amount: 1,
        }),
      ).toBeSuccessfulCommand();

      // The newly played Pedro has its damage removed.
      expect(testEngine.asPlayerOne().getCard(pedroMadrigalFamilyPatriarch)?.damage).toBe(0);
      // The OTHER Pedro keeps its damage — the ability cannot target it.
      expect(testEngine.asPlayerOne().getCard(otherPedroInPlay)?.damage).toBe(1);
    });
  });
});
