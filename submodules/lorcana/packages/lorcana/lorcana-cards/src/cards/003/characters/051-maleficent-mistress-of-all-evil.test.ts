import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { friendsOnTheOtherSide } from "../../001";
import { maleficentMistressOfAllEvil } from "./051-maleficent-mistress-of-all-evil";

const damagedAlly = createMockCharacter({
  id: "maleficent-test-damaged-ally",
  name: "Damaged Ally",
  cost: 2,
  willpower: 5,
});

const opposingCharacter = createMockCharacter({
  id: "maleficent-test-opposing",
  name: "Opposing Character",
  cost: 2,
  willpower: 5,
});

describe("Maleficent - Mistress of All Evil", () => {
  it("should have correct base stats", () => {
    expect(maleficentMistressOfAllEvil.cost).toBe(5);
    expect(maleficentMistressOfAllEvil.strength).toBe(2);
    expect(maleficentMistressOfAllEvil.willpower).toBe(3);
    expect(maleficentMistressOfAllEvil.lore).toBe(2);
    expect(maleficentMistressOfAllEvil.inkable).toBe(true);
    expect(maleficentMistressOfAllEvil.inkType).toEqual(["amethyst"]);
    expect(maleficentMistressOfAllEvil.classifications).toEqual([
      "Storyborn",
      "Villain",
      "Sorcerer",
    ]);
  });

  describe("DARK KNOWLEDGE - Whenever this character quests, you may draw a card.", () => {
    it("triggers when Maleficent quests and optionally draws a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: maleficentMistressOfAllEvil, exerted: false, isDrying: false }],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(maleficentMistressOfAllEvil)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length).toBe(1);
    });

    it("is optional - can decline to draw", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: maleficentMistressOfAllEvil, exerted: false, isDrying: false }],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(maleficentMistressOfAllEvil)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length).toBe(0);
    });
  });

  describe("DIVINATION - During your turn, whenever you draw a card, you may move 1 damage counter from chosen character to chosen opposing character.", () => {
    it("triggers when you draw a card and moves 1 damage from chosen character to chosen opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [maleficentMistressOfAllEvil, { card: damagedAlly, damage: 2 }],
          hand: [friendsOnTheOtherSide],
          inkwell: friendsOnTheOtherSide.cost,
          deck: 5,
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(friendsOnTheOtherSide)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(2);

      const [bagEffect1, bagEffect2] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolveBag(bagEffect1!.id, {
          resolveOptional: true,
          targets: [damagedAlly, opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveBag(bagEffect2!.id, {
          resolveOptional: true,
          targets: [damagedAlly, opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(2);
    });

    it("is optional - can decline to move damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [maleficentMistressOfAllEvil, { card: damagedAlly, damage: 2 }],
          hand: [friendsOnTheOtherSide],
          inkwell: friendsOnTheOtherSide.cost,
          deck: 5,
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(friendsOnTheOtherSide)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(2);

      const [bagEffect1, bagEffect2] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolveBag(bagEffect1!.id, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveBag(bagEffect2!.id, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(2);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(0);
    });

    it("can target Maleficent herself as the damage source", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: maleficentMistressOfAllEvil, damage: 2 }],
          hand: [friendsOnTheOtherSide],
          inkwell: friendsOnTheOtherSide.cost,
          deck: 5,
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(friendsOnTheOtherSide)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(2);

      const [bagEffect1, bagEffect2] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolveBag(bagEffect1!.id, {
          resolveOptional: true,
          targets: [maleficentMistressOfAllEvil, opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveBag(bagEffect2!.id, {
          resolveOptional: true,
          targets: [maleficentMistressOfAllEvil, opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(maleficentMistressOfAllEvil)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(2);
    });

    it("does NOT trigger when opponent draws a card during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [maleficentMistressOfAllEvil, { card: damagedAlly, damage: 2 }],
          deck: 5,
        },
        {
          hand: [friendsOnTheOtherSide],
          inkwell: friendsOnTheOtherSide.cost,
          deck: 5,
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().playCard(friendsOnTheOtherSide)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(2);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(0);
    });
  });
});
