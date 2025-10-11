import { describe, expect, it } from "bun:test";
import { liloGalacticHero } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import {
  buckySquirrelSqueakTutor,
  cheshireCatAlwaysGrinning,
  cheshireCatFromTheShadows,
  herculesDivineHero,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
