/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { pepaMadrigalWeatherMaker } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Pepa Madrigal - Weather Maker", () => {
  it.skip("**IT LOOKS LIKE RAIN** When you play this character, you may exert chosen opposing character. That character can't ready at the start of their next turn unless you're at a location.", () => {
    const testStore = new TestStore({
      inkwell: pepaMadrigalWeatherMaker.cost,
      hand: [pepaMadrigalWeatherMaker],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      pepaMadrigalWeatherMaker.id,
    );
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
