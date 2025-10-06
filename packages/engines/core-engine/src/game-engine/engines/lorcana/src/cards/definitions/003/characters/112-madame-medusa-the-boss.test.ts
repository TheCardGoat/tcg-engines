/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  madameMedusaTheBoss,
  webbyVanderquackEnthusiasticDuck,
} from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Madame Medusa - The Boss", () => {
  it("**THAT TERRIBLE WOMAN** When you play this character, banish chosen opposing character with 3 {S} or less.", () => {
    const testStore = new TestStore(
      {
        inkwell: madameMedusaTheBoss.cost,
        hand: [madameMedusaTheBoss],
      },
      {
        play: [webbyVanderquackEnthusiasticDuck],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      madameMedusaTheBoss.id,
    );
    const target = testStore.getByZoneAndId(
      "play",
      webbyVanderquackEnthusiasticDuck.id,
      "player_two",
    );

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toEqual("discard");
  });
});
