/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { camiloMadrigalPrankster } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Camilo Madrigal - Prankster", () => {
  it.skip("**MANY FORMS** At the start of your turn, you may chose one:• This character gets +1 {L} this turn.• This character gain **Challenger** +2 this turn. _(While challenging, this character gets +2 {S}.)_", () => {
    const testStore = new TestStore({
      inkwell: camiloMadrigalPrankster.cost,
      play: [camiloMadrigalPrankster],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      camiloMadrigalPrankster.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
