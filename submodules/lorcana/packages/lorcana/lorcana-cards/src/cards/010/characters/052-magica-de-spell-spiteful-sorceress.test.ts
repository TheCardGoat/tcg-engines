import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { magicaDeSpellSpitefulSorceress } from "./052-magica-de-spell-spiteful-sorceress";
import { megaraSecretKeeper } from "./086-megara-secret-keeper";
import { blessedBagpipes } from "../items/101-blessed-bagpipes";

const topDeckCard = createMockCharacter({
  id: "magica-test-top-deck",
  name: "Top Deck Card",
  cost: 1,
});

const damagedAlly = createMockCharacter({
  id: "magica-test-damaged-ally",
  name: "Damaged Ally",
  cost: 2,
  willpower: 5,
});

const opposingCharacter = createMockCharacter({
  id: "magica-test-opposing",
  name: "Opposing Character",
  cost: 2,
  willpower: 5,
});

describe("Magica De Spell - Spiteful Sorceress", () => {
  it("should have correct base stats", () => {
    expect(magicaDeSpellSpitefulSorceress.cost).toBe(5);
    expect(magicaDeSpellSpitefulSorceress.strength).toBe(3);
    expect(magicaDeSpellSpitefulSorceress.willpower).toBe(6);
    expect(magicaDeSpellSpitefulSorceress.lore).toBe(2);
    expect(magicaDeSpellSpitefulSorceress.inkable).toBe(true);
    expect(magicaDeSpellSpitefulSorceress.inkType).toEqual(["amethyst"]);
    expect(magicaDeSpellSpitefulSorceress.classifications).toEqual([
      "Storyborn",
      "Villain",
      "Sorcerer",
    ]);
  });

  describe("MYSTICAL MANIPULATION - Whenever you put a card under one of your characters or locations, you may move 1 damage counter from chosen character to chosen opposing character.", () => {
    it("should trigger when a card is put under a character and move 1 damage from chosen character to chosen opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            magicaDeSpellSpitefulSorceress,
            megaraSecretKeeper,
            { card: damagedAlly, damage: 2 },
          ],
          hand: [blessedBagpipes],
          inkwell: blessedBagpipes.cost,
          deck: [topDeckCard],
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(blessedBagpipes)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          resolveOptional: true,
          targets: [megaraSecretKeeper],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          resolveOptional: true,
          targets: [damagedAlly, opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(1);
    });

    it("should be optional - can decline to move damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            magicaDeSpellSpitefulSorceress,
            megaraSecretKeeper,
            { card: damagedAlly, damage: 2 },
          ],
          hand: [blessedBagpipes],
          inkwell: blessedBagpipes.cost,
          deck: [topDeckCard],
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(blessedBagpipes)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          resolveOptional: true,
          targets: [megaraSecretKeeper],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(2);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(0);
    });

    it("can target Magica herself as the damage source", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: magicaDeSpellSpitefulSorceress, damage: 2 }, megaraSecretKeeper],
          hand: [blessedBagpipes],
          inkwell: blessedBagpipes.cost,
          deck: [topDeckCard],
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(blessedBagpipes)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          resolveOptional: true,
          targets: [megaraSecretKeeper],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          resolveOptional: true,
          targets: [magicaDeSpellSpitefulSorceress, opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(magicaDeSpellSpitefulSorceress)).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(1);
    });

    it("does NOT trigger when opponent puts a card under their character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [magicaDeSpellSpitefulSorceress, { card: damagedAlly, damage: 2 }],
          deck: [topDeckCard],
        },
        {
          play: [megaraSecretKeeper, opposingCharacter],
          hand: [blessedBagpipes],
          inkwell: blessedBagpipes.cost,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().playCard(blessedBagpipes)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().resolveOnlyBag({
          resolveOptional: true,
          targets: [megaraSecretKeeper],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);

      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(2);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(0);
    });
  });
});
