import { describe, expect, it, test } from "bun:test";
import {
  madamMimPurpleDragon,
  pinocchioStarAttraction,
  winnieThePoohHunnyWizard,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Madam Mim - Purple Dragon", () => {
  test("Evasive", () => {
    const testStore = new TestStore({
      play: [madamMimPurpleDragon],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      madamMimPurpleDragon.id,
    );

    expect(cardUnderTest.hasEvasive).toEqual(true);
  });

  describe("**I WIN, I WIN!** When you play this character, banish her or return another 2 chosen characters of yours to your hand.", () => {
    it("skipping the effect banishes her", () => {
      const testStore = new TestStore({
        inkwell: madamMimPurpleDragon.cost,
        hand: [madamMimPurpleDragon],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        madamMimPurpleDragon.id,
      );

      cardUnderTest.playFromHand();
      testStore.resolveTopOfStack({ skip: true });

      expect(cardUnderTest.zone).toEqual("discard");
      expect(testStore.stackLayers).toHaveLength(0);
    });

    it("return another chosen character of yours to your hand.", () => {
      const testStore = new TestStore({
        inkwell: madamMimPurpleDragon.cost,
        hand: [madamMimPurpleDragon],
        play: [pinocchioStarAttraction, winnieThePoohHunnyWizard],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        madamMimPurpleDragon.id,
      );
      const target = testStore.getByZoneAndId(
        "play",
        pinocchioStarAttraction.id,
      );
      const anotherTarget = testStore.getByZoneAndId(
        "play",
        winnieThePoohHunnyWizard.id,
      );

      cardUnderTest.playFromHand();
      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({ targets: [target, anotherTarget] });

      expect(target.zone).toEqual("hand");
      expect(anotherTarget.zone).toEqual("hand");
      expect(cardUnderTest.zone).toEqual("play");
      expect(testStore.stackLayers).toHaveLength(0);
    });
  });
});
