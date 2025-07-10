/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { liloGalacticHero } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  buckySquirrelSqueakTutor,
  cheshireCatAlwaysGrinning,
  cheshireCatFromTheShadows,
  herculesDivineHero,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Bucky - Squirrel Squeak Tutor", () => {
  describe("**SQUEAK** Whenever you play a Floodborn character, if you used Shift to play them, each opponent chooses and discards a card.", () => {
    it("Playing a Floodborn character without Shift", () => {
      const testStore = new TestStore(
        {
          inkwell: herculesDivineHero.cost,
          hand: [herculesDivineHero],
          play: [buckySquirrelSqueakTutor],
        },
        {
          hand: [liloGalacticHero],
        },
      );

      const floodbornChar = testStore.getByZoneAndId(
        "hand",
        herculesDivineHero.id,
      );

      floodbornChar.playFromHand();
      expect(testStore.stackLayers).toHaveLength(0);
    });

    it("Playing a Floodborn character with Shift", () => {
      const testStore = new TestStore(
        {
          inkwell: cheshireCatFromTheShadows.cost,
          hand: [cheshireCatFromTheShadows],
          play: [buckySquirrelSqueakTutor, cheshireCatAlwaysGrinning],
        },
        {
          hand: [liloGalacticHero],
        },
      );

      const floodbornChar = testStore.getCard(cheshireCatFromTheShadows);
      const shiftedChar = testStore.getCard(cheshireCatAlwaysGrinning);
      const shifterChar = testStore.getCard(cheshireCatFromTheShadows);
      const target = testStore.getCard(liloGalacticHero);

      shifterChar.shift(shiftedChar);

      expect(testStore.stackLayers).toHaveLength(1);
      testStore.changePlayer().resolveTopOfStack({ targets: [target] });

      expect(target.zone).toEqual("discard");
    });
  });
});
