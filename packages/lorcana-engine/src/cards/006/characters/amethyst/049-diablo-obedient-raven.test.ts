/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { fireTheCannons } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import { brawl } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
import { diabloDevotedHerald } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { diabloObedientRaven } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Diablo - Obedient Raven", () => {
  describe("FLY, MY PET! When this character is banished, you may draw a card.", () => {
    it("should draw a card when banished", async () => {
      const testEngine = new TestEngine({
        inkwell: fireTheCannons.cost,
        play: [diabloObedientRaven],
        hand: [fireTheCannons],
        deck: 2,
      });

      await testEngine.playCard(
        fireTheCannons,
        {
          targets: [diabloObedientRaven],
        },
        true,
      );

      await testEngine.resolveOptionalAbility();

      expect(testEngine.getZonesCardCount()).toEqual(
        expect.objectContaining({
          hand: 1,
          deck: 1,
        }),
      );
    });

    it("should not draw a card when banished after shifting", async () => {
      const testEngine = new TestEngine({
        inkwell: fireTheCannons.cost,
        play: [diabloObedientRaven],
        hand: [diabloDevotedHerald, brawl, fireTheCannons],
        deck: 2,
      });

      await testEngine.shiftCard({
        shifted: diabloObedientRaven,
        shifter: diabloDevotedHerald,
        costs: [brawl],
      });

      await testEngine.playCard(fireTheCannons, {
        targets: [diabloDevotedHerald],
      });

      expect(testEngine.stackLayers).toHaveLength(0);
      expect(testEngine.getZonesCardCount()).toEqual(
        expect.objectContaining({
          hand: 0,
          deck: 2,
        }),
      );
    });
  });
});
