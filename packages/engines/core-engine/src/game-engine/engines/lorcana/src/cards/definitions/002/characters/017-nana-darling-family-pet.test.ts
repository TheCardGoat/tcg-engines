import { describe, expect, it } from "bun:test";
import {
  goofyKnightForADay,
  herculesDivineHero,
  nanaDarlingFamilyPet,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Nana - Darling Family Pet", () => {
  describe("**NURSEMAID** Whenever you play a Floodborn character, you may remove all damage from chosen character.", () => {
    it("Playing a floodborn", () => {
      const testStore = new TestStore({
        inkwell: herculesDivineHero.cost,
        hand: [herculesDivineHero],
        play: [nanaDarlingFamilyPet, goofyKnightForADay],
      });

      const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
      const floodbornChar = testStore.getByZoneAndId(
        "hand",
        herculesDivineHero.id,
      );

      target.damage = goofyKnightForADay.willpower - 1;

      floodbornChar.playFromHand();
      expect(testStore.stackLayers).toHaveLength(1);

      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({ targets: [target] });
      expect(target.damage).toEqual(0);
    });
  });
});
