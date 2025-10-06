/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { fireTheCannons } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import { brawl } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { diabloDevotedHerald } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import { diabloObedientRaven } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
