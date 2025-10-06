/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  blueFairyRewardingGoodDeeds,
  cobraBubblesSimpleEducator,
  herculesDivineHero,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

describe("Blue Fairy - Rewarding Good Deeds", () => {
  describe("**ETHEREAL GLOW** Whenever you play a Floodborn character, you may draw a card.", () => {
    it("Playing a floodborn", () => {
      const testStore = new TestStore({
        inkwell: herculesDivineHero.cost,
        hand: [herculesDivineHero],
        play: [blueFairyRewardingGoodDeeds],
        deck: 2,
      });

      const floodbornChar = testStore.getByZoneAndId(
        "hand",
        herculesDivineHero.id,
      );

      floodbornChar.playFromHand();
      testStore.resolveOptionalAbility();

      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          hand: 1,
          deck: 1,
        }),
      );
    });

    it("Playing a NON floodborn", () => {
      const testStore = new TestStore({
        inkwell: cobraBubblesSimpleEducator.cost,
        hand: [cobraBubblesSimpleEducator],
        play: [blueFairyRewardingGoodDeeds],
        deck: 2,
      });

      const storybornChar = testStore.getByZoneAndId(
        "hand",
        cobraBubblesSimpleEducator.id,
      );

      storybornChar.playFromHand();

      expect(testStore.stackLayers).toHaveLength(0);
      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          hand: 0,
          deck: 2,
        }),
      );
    });
  });
});
