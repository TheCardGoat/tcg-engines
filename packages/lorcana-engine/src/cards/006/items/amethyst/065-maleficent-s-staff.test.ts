/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { befuddle } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import { tamatoaSoShiny } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
import { retrosphere } from "@lorcanito/lorcana-engine/cards/005/items/items";
import {
  flotillaCoconutArmada,
  maleficentsStaff,
  mertleEdmondsLilosRival,
} from "@lorcanito/lorcana-engine/cards/006";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Maleficent's Staff", () => {
  describe("BACK, FOOLS! Whenever one of your opponents' characters, items, or locations is returned to their hand from play, gain 1 lore.", () => {
    it("should gain 1 lore when an opponent's ITEM is returned to their hand", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: befuddle.cost,
          play: [maleficentsStaff],
          hand: [befuddle],
        },
        {
          play: [dingleHopper],
        },
      );

      await testEngine.playCard(befuddle, { targets: [dingleHopper] });

      expect(testEngine.getLoreForPlayer("player_one")).toBe(1);
    });

    it("should gain 1 lore when an opponent's CHARACTER is returned to their hand", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: 2,
          play: [maleficentsStaff, retrosphere],
          hand: [befuddle],
        },
        {
          play: [mertleEdmondsLilosRival],
        },
      );

      await testEngine.activateCard(retrosphere, {
        targets: [mertleEdmondsLilosRival],
      });

      expect(testEngine.getLoreForPlayer("player_one")).toBe(1);
    });

    it("should gain 1 lore when an opponent's LOCATION is returned to their hand", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: 2,
          play: [maleficentsStaff, retrosphere],
          hand: [befuddle],
        },
        {
          play: [flotillaCoconutArmada],
        },
      );

      await testEngine.activateCard(retrosphere, {
        targets: [flotillaCoconutArmada],
      });

      expect(testEngine.getLoreForPlayer("player_one")).toBe(1);
    });
  });
});

describe("Regression", () => {
  it("should not gain lore when a card is returned to hand from discard", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: tamatoaSoShiny.cost,
        hand: [tamatoaSoShiny],
        discard: [dingleHopper],
      },
      {
        play: [maleficentsStaff],
      },
    );

    await testEngine.playCard(tamatoaSoShiny, {
      targets: [dingleHopper],
      acceptOptionalLayer: true,
    });

    expect(testEngine.getLoreForPlayer("player_two")).toBe(0);
    expect(testEngine.stackLayers).toHaveLength(0);
  });
});
