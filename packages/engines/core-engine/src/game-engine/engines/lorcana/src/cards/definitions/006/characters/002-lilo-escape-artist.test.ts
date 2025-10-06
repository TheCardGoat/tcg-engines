/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  liloGalacticHero,
  liloMakingAWish,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { liloEscapeArtist } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("Lilo - Escape Artist", () => {
  describe("NO PLACE I’D RATHER BE At the start of your turn, if this card is in your discard, you may play her and she enters play exerted.", () => {
    it("On discard", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: liloEscapeArtist.cost,
          discard: [liloEscapeArtist],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      const cardUnderTest = testEngine.getCardModel(liloEscapeArtist);

      await testEngine.passTurn();
      await testEngine.passTurn();

      await testEngine.resolveOptionalAbility();

      expect(cardUnderTest.zone).toBe("play");
      expect(cardUnderTest.exerted).toBe(true);
      expect(testEngine.getAvailableInkwellCardCount()).toEqual(0);
    });

    it("More than one lilo in discard", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: 2,
          discard: [
            liloEscapeArtist,
            liloEscapeArtist,
            liloGalacticHero,
            liloMakingAWish,
          ],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      await testEngine.passTurn();
      await testEngine.passTurn();

      expect(testEngine.stackLayers.length).toEqual(2);
    });

    it("On play", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: liloEscapeArtist.cost,
          play: [liloEscapeArtist],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      await testEngine.passTurn();
      expect(testEngine.stackLayers).toHaveLength(0);
      await testEngine.passTurn();
      expect(testEngine.stackLayers).toHaveLength(0);
    });
  });
});
