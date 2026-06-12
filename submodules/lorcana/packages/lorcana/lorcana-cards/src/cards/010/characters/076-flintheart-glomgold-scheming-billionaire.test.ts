import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { flintheartGlomgoldSchemingBillionaire } from "./076-flintheart-glomgold-scheming-billionaire";

const underCard = createMockCharacter({
  id: "flintheart-under-card",
  name: "Under Card",
  cost: 1,
});

const underLocationCard = createMockCharacter({
  id: "flintheart-under-location-card",
  name: "Under Location Card",
  cost: 1,
});

const underLocation = createMockLocation({
  id: "flintheart-under-location",
  name: "Under Location",
  cost: 2,
  moveCost: 1,
});

describe("Flintheart Glomgold - Scheming Billionaire", () => {
  it("should have correct base stats", () => {
    expect(flintheartGlomgoldSchemingBillionaire.cost).toBe(4);
    expect(flintheartGlomgoldSchemingBillionaire.strength).toBe(1);
    expect(flintheartGlomgoldSchemingBillionaire.willpower).toBe(4);
    expect(flintheartGlomgoldSchemingBillionaire.lore).toBe(3);
  });

  it("should have correct metadata", () => {
    expect(flintheartGlomgoldSchemingBillionaire.set).toBe("010");
    expect(flintheartGlomgoldSchemingBillionaire.cardNumber).toBe(76);
    expect(flintheartGlomgoldSchemingBillionaire.rarity).toBe("uncommon");
    expect(flintheartGlomgoldSchemingBillionaire.inkable).toBe(true);
    expect(flintheartGlomgoldSchemingBillionaire.inkType).toEqual(["emerald"]);
  });

  describe("TRY ME - While you have a character or location in play with a card under them, this character gains Ward.", () => {
    it("does not have Ward when nothing is under your play cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [flintheartGlomgoldSchemingBillionaire],
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().hasKeyword(flintheartGlomgoldSchemingBillionaire, "Ward"),
      ).toBe(false);
    });

    it("gains Ward while a friendly character has a card under them", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: flintheartGlomgoldSchemingBillionaire },
          { card: underCard, cardsUnder: [underLocationCard] },
        ],
        hand: [dragonFire],
        inkwell: dragonFire.cost,
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().hasKeyword(flintheartGlomgoldSchemingBillionaire, "Ward"),
      ).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().playCard(dragonFire, {
          targets: [flintheartGlomgoldSchemingBillionaire],
        }),
      ).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(flintheartGlomgoldSchemingBillionaire)).toBe(
        "play",
      );
    });

    it("gains Ward while a friendly location has a card under it", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: flintheartGlomgoldSchemingBillionaire },
          { card: underLocation, cardsUnder: [underLocationCard] },
        ],
        hand: [dragonFire],
        inkwell: dragonFire.cost,
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().hasKeyword(flintheartGlomgoldSchemingBillionaire, "Ward"),
      ).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().playCard(dragonFire, {
          targets: [flintheartGlomgoldSchemingBillionaire],
        }),
      ).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(flintheartGlomgoldSchemingBillionaire)).toBe(
        "play",
      );
    });
  });
});
