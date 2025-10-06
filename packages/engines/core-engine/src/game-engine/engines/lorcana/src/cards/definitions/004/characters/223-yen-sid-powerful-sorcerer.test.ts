/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { yenSidPowerfulSorcerer } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Yen Sid - Powerful Sorcerer", () => {
  it.skip("**TIMELY INTERVENTION** When you play this character, if you have a character named Magic Broom in play, you may draw a card.", () => {
    const testStore = new TestStore({
      inkwell: yenSidPowerfulSorcerer.cost,
      hand: [yenSidPowerfulSorcerer],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      yenSidPowerfulSorcerer.id,
    );
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  it.skip("**ARCANE STUDY** While you have 2 or more Broom characters in play, this character gets +2 {L}.", () => {
    const testStore = new TestStore({
      inkwell: yenSidPowerfulSorcerer.cost,
      play: [yenSidPowerfulSorcerer],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      yenSidPowerfulSorcerer.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
