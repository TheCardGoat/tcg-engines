/**
 * @jest-environment node
 */

import { describe, expect, it, test } from "@jest/globals";
import {
  madamMimFox,
  pinocchioStarAttraction,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Madam Mim - Fox", () => {
  test("**Rush** _(This character can challenge the turn they’re played.)_", () => {
    const testStore = new TestStore({
      play: [madamMimFox],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", madamMimFox.id);

    expect(cardUnderTest.hasRush).toEqual(true);
  });

  describe("**CHASING THE RABBIT** When you play this character, banish her or return another chosen character of yours to your hand.", () => {
    it("skipping the effect banishes her", () => {
      const testStore = new TestStore({
        inkwell: madamMimFox.cost,
        hand: [madamMimFox],
        play: [pinocchioStarAttraction],
      });

      const cardUnderTest = testStore.getByZoneAndId("hand", madamMimFox.id);
      const target = testStore.getByZoneAndId(
        "play",
        pinocchioStarAttraction.id,
      );

      cardUnderTest.playFromHand();
      testStore.resolveTopOfStack({ skip: true });

      expect(target.zone).toEqual("play");
      expect(cardUnderTest.zone).toEqual("discard");
      expect(testStore.stackLayers).toHaveLength(0);
    });

    it("return another chosen character of yours to your hand.", () => {
      const testStore = new TestStore({
        inkwell: madamMimFox.cost,
        hand: [madamMimFox],
        play: [pinocchioStarAttraction],
      });

      const cardUnderTest = testStore.getByZoneAndId("hand", madamMimFox.id);
      const target = testStore.getByZoneAndId(
        "play",
        pinocchioStarAttraction.id,
      );

      cardUnderTest.playFromHand();
      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({ targets: [target] });

      expect(target.zone).toEqual("hand");
      expect(cardUnderTest.zone).toEqual("play");
      expect(testStore.stackLayers).toHaveLength(0);
    });
  });
});
