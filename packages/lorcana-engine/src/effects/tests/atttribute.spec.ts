/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { controlYourTemper } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import {
  liloMakingAWish,
  moanaOfMotunui,
  seargentTibbies,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Attribute effect", () => {
  it("[Control Your Temper!] should not reduce attack to less than zero", () => {
    const testStore = new TestStore({
      inkwell: controlYourTemper.cost,
      hand: [controlYourTemper],
      play: [moanaOfMotunui],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      controlYourTemper.id,
    );
    const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targetId: target.instanceId });

    expect(target.strength).toEqual(0);
  });

  describe("Regression", () => {
    it("[Control Your Temper!] should be counted during challenge", () => {
      const testStore = new TestStore(
        {
          inkwell: controlYourTemper.cost,
          hand: [controlYourTemper],
          play: [liloMakingAWish],
        },
        {
          play: [seargentTibbies],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        controlYourTemper.id,
      );
      const attacker = testStore.getByZoneAndId(
        "play",
        liloMakingAWish.id,
        "player_one",
      );
      const target = testStore.getByZoneAndId(
        "play",
        seargentTibbies.id,
        "player_two",
      );
      target.updateCardMeta({ exerted: true });

      cardUnderTest.playFromHand();
      testStore.resolveTopOfStack({ targets: [target] });
      expect(target.strength).toEqual(0);

      attacker.challenge(target);

      expect(target.meta.damage).toEqual(1);
      expect(attacker.meta.damage).toBeFalsy();
      expect(attacker.zone).toEqual("play");
    });
  });
});
