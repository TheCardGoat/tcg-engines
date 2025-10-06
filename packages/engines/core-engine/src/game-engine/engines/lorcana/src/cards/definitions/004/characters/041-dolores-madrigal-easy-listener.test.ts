/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { doloresMadrigalEasyListener } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Dolores Madrigal - Easy Listener", () => {
  it.skip("**MAGICAL INFORMANT** When you play this character, if an opponent has an exerted character in play, you may draw a card.", () => {
    const testStore = new TestStore({
      inkwell: doloresMadrigalEasyListener.cost,
      hand: [doloresMadrigalEasyListener],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      doloresMadrigalEasyListener.id,
    );
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
