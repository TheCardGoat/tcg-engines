/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";
import { wasabiMethodicalEngineer } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("Wasabi - Methodical Engineer", () => {
  describe("**BLADES OF FURY** When you play this character, you may banish chosen item. Its player gains 1 lore.", () => {
    it("Targeting your own card", async () => {
      const testEngine = new TestEngine({
        inkwell: wasabiMethodicalEngineer.cost,
        hand: [wasabiMethodicalEngineer],
        play: [pawpsicle],
      });

      const cardUnderTest = testEngine.getCardModel(wasabiMethodicalEngineer);
      const target = testEngine.getCardModel(pawpsicle);

      await testEngine.playCard(cardUnderTest);

      await testEngine.resolveOptionalAbility();
      await testEngine.resolveTopOfStack({ targets: [target] });
      expect(testEngine.getLoreForPlayer()).toEqual(1);
    });

    it("Targeting opponent's card", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: wasabiMethodicalEngineer.cost,
          hand: [wasabiMethodicalEngineer],
        },
        {
          play: [pawpsicle],
        },
      );

      const cardUnderTest = testEngine.getCardModel(wasabiMethodicalEngineer);
      const target = testEngine.getCardModel(pawpsicle);

      await testEngine.playCard(cardUnderTest);

      await testEngine.resolveOptionalAbility();
      await testEngine.resolveTopOfStack({ targets: [target] });
      expect(testEngine.getLoreForPlayer("player_two")).toEqual(1);
    });
  });
});
