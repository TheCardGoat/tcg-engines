import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockItem,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { plutoCleverCluefinder } from "./157-pluto-clever-cluefinder";
import { mickeyMouseDetective } from "./160-mickey-mouse-detective";

const itemInDiscard = createMockItem({
  id: "pluto-test-item",
  name: "Test Item",
  cost: 2,
});

const nonDetectiveCharacter = createMockCharacter({
  id: "pluto-test-non-detective",
  name: "Non Detective Character",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Pluto - Clever Cluefinder", () => {
  describe("ON THE TRAIL {E} - Activated ability", () => {
    it("returns an item card from discard to hand when Detective is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [plutoCleverCluefinder, mickeyMouseDetective],
        discard: [{ card: itemInDiscard }],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().getCardZone(plutoCleverCluefinder)).toBe("play");
      expect(testEngine.asPlayerOne().getCard(plutoCleverCluefinder).exerted).toBe(false);

      expect(
        testEngine.asPlayerOne().activateAbility(plutoCleverCluefinder, {
          ability: "ON THE TRAIL",
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [itemInDiscard] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(itemInDiscard)).toBe("hand");
      expect(testEngine.asPlayerOne().getCard(plutoCleverCluefinder).exerted).toBe(true);
    });

    it("puts an item card on top of deck when no Detective is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [plutoCleverCluefinder],
        discard: [{ card: itemInDiscard }],
        deck: 3,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(plutoCleverCluefinder, {
          ability: "ON THE TRAIL",
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [itemInDiscard] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(itemInDiscard)).toBe("deck");
      expect(testEngine.asPlayerOne().getCard(plutoCleverCluefinder).exerted).toBe(true);
    });

    it("cannot be activated when already exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: plutoCleverCluefinder, exerted: true }, mickeyMouseDetective],
        discard: [{ card: itemInDiscard }],
        deck: 3,
      });

      const result = testEngine.asPlayerOne().activateAbility(plutoCleverCluefinder, {
        ability: "ON THE TRAIL",
      });
      expect(result.success).toBe(false);
    });

    it("does nothing when there are no item cards in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [plutoCleverCluefinder, mickeyMouseDetective],
        deck: 3,
      });

      // With no items in discard, activating should still succeed (the ability fires)
      // but no item will be returned
      expect(
        testEngine.asPlayerOne().activateAbility(plutoCleverCluefinder, {
          ability: "ON THE TRAIL",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(plutoCleverCluefinder).exerted).toBe(true);
    });

    it("only targets item cards, not characters in discard", () => {
      const characterInDiscard = createMockCharacter({
        id: "pluto-test-discard-char",
        name: "Character In Discard",
        cost: 2,
        strength: 1,
        willpower: 1,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [plutoCleverCluefinder, mickeyMouseDetective],
        discard: [{ card: itemInDiscard }, { card: characterInDiscard }],
        deck: 3,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(plutoCleverCluefinder, {
          ability: "ON THE TRAIL",
        }),
      ).toBeSuccessfulCommand();

      // Should be able to target the item
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [itemInDiscard] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(itemInDiscard)).toBe("hand");
      // Character should still be in discard
      expect(testEngine.asPlayerOne().getCardZone(characterInDiscard)).toBe("discard");
    });

    it("checks for Detective classification — non-Detective character does not trigger 'return to hand'", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [plutoCleverCluefinder, nonDetectiveCharacter],
        discard: [{ card: itemInDiscard }],
        deck: 3,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(plutoCleverCluefinder, {
          ability: "ON THE TRAIL",
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [itemInDiscard] }),
      ).toBeSuccessfulCommand();

      // Without a Detective in play, item goes to top of deck
      expect(testEngine.asPlayerOne().getCardZone(itemInDiscard)).toBe("deck");
    });

    it("Detective in discard does not satisfy the condition — item goes to deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [plutoCleverCluefinder],
        discard: [{ card: itemInDiscard }, { card: mickeyMouseDetective }],
        deck: 3,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(plutoCleverCluefinder, {
          ability: "ON THE TRAIL",
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [itemInDiscard] }),
      ).toBeSuccessfulCommand();

      // Mickey is in discard, not play — item goes to deck
      expect(testEngine.asPlayerOne().getCardZone(itemInDiscard)).toBe("deck");
    });
  });

  describe("Stats and basic properties", () => {
    it("has correct stats", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [plutoCleverCluefinder],
      });

      const card = testEngine.asPlayerOne().getCard(plutoCleverCluefinder);
      expect(card.strength).toBe(2);
      expect(card.willpower).toBe(2);
      expect(card.lore).toBe(1);
      expect(plutoCleverCluefinder.cost).toBe(2);
    });

    it("is an inkable card", () => {
      expect(plutoCleverCluefinder.inkable).toBe(true);
    });

    it("has correct classifications", () => {
      expect(plutoCleverCluefinder.classifications).toEqual(["Dreamborn", "Ally"]);
    });

    it("is sapphire color", () => {
      expect(plutoCleverCluefinder.inkType).toEqual(["sapphire"]);
    });

    it("is uncommon rarity", () => {
      expect(plutoCleverCluefinder.rarity).toBe("uncommon");
    });

    it("has an activated ability with exert cost", () => {
      const ability = (plutoCleverCluefinder.abilities ?? []).find((a) => a.type === "activated");

      expect(ability).toBeDefined();
      if (ability && ability.type === "activated") {
        expect(ability.cost.exert).toBe(true);
      }
    });
  });
});
