import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  PLAYER_ONE,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { tamatoaSeekerOfShine } from "./156-tamatoa-seeker-of-shine";

describe("Tamatoa - Seeker of Shine", () => {
  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [tamatoaSeekerOfShine],
    });

    const cardUnderTest = testEngine.getCardModel(tamatoaSeekerOfShine);
    expect(cardUnderTest.hasWard()).toBe(true);
  });

  it("should be able to activate Boost 2", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [tamatoaSeekerOfShine],
      deck: 5,
      inkwell: 10,
    });

    const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

    expect(
      testEngine.asPlayerOne().activateAbility(tamatoaSeekerOfShine, { ability: "Boost" }),
    ).toBeSuccessfulCommand();

    const deckAfter = testEngine.asPlayerOne().getZonesCardCount().deck;
    expect(deckAfter).toBe(deckBefore - 1);
  });

  describe("ANYTHING THAT GLITTERS", () => {
    it("should have the correct trigger event and subject", () => {
      const abilities = tamatoaSeekerOfShine.abilities ?? [];
      const anythingThatGlitters = abilities.find(
        (a) => a.type === "triggered" && "name" in a && a.name === "ANYTHING THAT GLITTERS",
      );

      expect(anythingThatGlitters).toBeDefined();
      expect(anythingThatGlitters?.type).toBe("triggered");

      if (anythingThatGlitters?.type === "triggered") {
        expect(anythingThatGlitters.trigger.event).toBe("put-card-under");
        expect(anythingThatGlitters.trigger.on).toBe("YOUR_CHARACTERS_OR_LOCATIONS");
      }
    });

    it("should have a modify-stat lore +1 effect targeting SELF for this-turn duration", () => {
      const abilities = tamatoaSeekerOfShine.abilities ?? [];
      const anythingThatGlitters = abilities.find(
        (a) => a.type === "triggered" && "name" in a && a.name === "ANYTHING THAT GLITTERS",
      );

      expect(anythingThatGlitters?.type).toBe("triggered");

      if (anythingThatGlitters?.type === "triggered") {
        const effect = anythingThatGlitters.effect;
        expect(effect.type).toBe("modify-stat");

        if (effect.type === "modify-stat") {
          expect(effect.stat).toBe("lore");
          expect(effect.modifier).toBe(1);
          expect(effect.target).toBe("SELF");
          expect(effect.duration).toBe("this-turn");
        }
      }
    });

    it("gains +1 lore when Boost puts a card under itself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tamatoaSeekerOfShine],
        deck: 5,
        inkwell: 10,
      });

      const loreBefore = testEngine.asPlayerOne().getCard(tamatoaSeekerOfShine).lore;
      expect(loreBefore).toBe(tamatoaSeekerOfShine.lore);

      expect(
        testEngine.asPlayerOne().activateAbility(tamatoaSeekerOfShine, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      const loreAfter = testEngine.asPlayerOne().getCard(tamatoaSeekerOfShine).lore;
      expect(loreAfter).toBe(tamatoaSeekerOfShine.lore + 1);
    });

    it("lore bonus resets at the end of the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tamatoaSeekerOfShine],
          deck: 5,
          inkwell: 10,
        },
        {
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(tamatoaSeekerOfShine, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      const loreDuringTurn = testEngine.asPlayerOne().getCard(tamatoaSeekerOfShine).lore;
      expect(loreDuringTurn).toBe(tamatoaSeekerOfShine.lore + 1);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      const loreAfterTurn = testEngine.asPlayerOne().getCard(tamatoaSeekerOfShine).lore;
      expect(loreAfterTurn).toBe(tamatoaSeekerOfShine.lore);
    });

    it("regression: does NOT trigger when a card is put under an item (ability says characters or locations only)", () => {
      const boostItem = createMockItem({
        id: "tamatoa-test-boost-item",
        name: "Boost Item",
        cost: 2,
        abilities: [
          {
            id: "test-boost",
            type: "activated" as const,
            name: "Boost",
            text: "Boost 2 - Pay 2 ink to put top card of deck under this item",
            cost: { ink: 2 },
            effect: {
              type: "put-under",
              source: "top-of-deck",
              under: "self",
            },
          },
        ],
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tamatoaSeekerOfShine, boostItem],
        deck: 5,
        inkwell: 10,
      });

      const loreBefore = testEngine.asPlayerOne().getCard(tamatoaSeekerOfShine).lore;

      // Activate the item's boost
      const result = testEngine.asPlayerOne().activateAbility(boostItem, { ability: "Boost" });

      if (result.success) {
        // Tamatoa should NOT have gained lore from an item put-under event
        const loreAfter = testEngine.asPlayerOne().getCard(tamatoaSeekerOfShine).lore;
        expect(loreAfter).toBe(loreBefore);
      }
    });
  });
});
