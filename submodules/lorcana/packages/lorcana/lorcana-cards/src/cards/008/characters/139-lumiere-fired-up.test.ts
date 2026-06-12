import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { lumiereFiredUp } from "./139-lumiere-fired-up";
import { benjaGuardianOfTheDragonGem } from "../../002/characters/174-benja-guardian-of-the-dragon-gem";
import { dinglehopper } from "../../001/items/032-dinglehopper";

const mockCharacter = createMockCharacter({
  id: "lumiere-test-character",
  name: "Test Character",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const secondMockItem = createMockCharacter({
  id: "lumiere-test-item-2",
  name: "Second Test Item",
  cost: 1,
});

describe("Lumiere - Fired Up", () => {
  it("has correct base stats", () => {
    expect(lumiereFiredUp).toMatchObject({
      cardType: "character",
      name: "Lumiere",
      version: "Fired Up",
      cost: 5,
      strength: 4,
      willpower: 3,
      lore: 2,
      inkable: true,
      inkType: ["ruby", "sapphire"],
    });
  });

  describe("Shift 3", () => {
    it("has Shift 3 keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lumiereFiredUp],
      });

      expect(testEngine.hasKeyword(lumiereFiredUp, "Shift")).toBe(true);
    });
  });

  describe("Evasive", () => {
    it("has Evasive keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lumiereFiredUp],
      });

      expect(testEngine.hasKeyword(lumiereFiredUp, "Evasive")).toBe(true);
    });
  });

  describe("SACREBLEU! - Whenever one of your items is banished, this character gets +1 {L} this turn.", () => {
    it("has base lore of 2 when no items are banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lumiereFiredUp],
      });

      expect(testEngine.asPlayerOne().getCardLore(lumiereFiredUp)).toBe(2);
    });

    it("gains +1 lore when an item is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: benjaGuardianOfTheDragonGem.cost,
        play: [lumiereFiredUp, dinglehopper],
        hand: [benjaGuardianOfTheDragonGem],
      });

      expect(
        testEngine.asPlayerOne().playCard(benjaGuardianOfTheDragonGem),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(benjaGuardianOfTheDragonGem, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [dinglehopper] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(dinglehopper)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardLore(lumiereFiredUp)).toBe(3);
    });

    it("triggers once per item banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: benjaGuardianOfTheDragonGem.cost,
        play: [lumiereFiredUp, dinglehopper],
        hand: [benjaGuardianOfTheDragonGem],
      });

      expect(
        testEngine.asPlayerOne().playCard(benjaGuardianOfTheDragonGem),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(benjaGuardianOfTheDragonGem, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [dinglehopper] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(dinglehopper)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardLore(lumiereFiredUp)).toBe(3);
    });

    it("does NOT gain lore when a character is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lumiereFiredUp, mockCharacter],
      });

      expect(
        testEngine.asServer().manualSetDamage(mockCharacter, mockCharacter.willpower),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mockCharacter)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardLore(lumiereFiredUp)).toBe(2);
    });

    it("lore bonus lasts until end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: benjaGuardianOfTheDragonGem.cost,
        play: [lumiereFiredUp, dinglehopper],
        hand: [benjaGuardianOfTheDragonGem],
      });

      expect(
        testEngine.asPlayerOne().playCard(benjaGuardianOfTheDragonGem),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(benjaGuardianOfTheDragonGem, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [dinglehopper] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(lumiereFiredUp)).toBe(3);

      testEngine.asServer().passTurn();
      testEngine.asServer().passTurn();

      expect(testEngine.asPlayerOne().getCardLore(lumiereFiredUp)).toBe(2);
    });

    it("does NOT trigger when opponent's item is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [lumiereFiredUp],
        },
        {
          play: [dinglehopper],
          hand: [benjaGuardianOfTheDragonGem],
          inkwell: benjaGuardianOfTheDragonGem.cost,
        },
      );

      testEngine.asPlayerOne().passTurn();

      expect(
        testEngine.asPlayerTwo().playCard(benjaGuardianOfTheDragonGem),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerTwo()
          .resolvePendingByCard(benjaGuardianOfTheDragonGem, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [dinglehopper] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(dinglehopper)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardLore(lumiereFiredUp)).toBe(2);
    });
  });
});
