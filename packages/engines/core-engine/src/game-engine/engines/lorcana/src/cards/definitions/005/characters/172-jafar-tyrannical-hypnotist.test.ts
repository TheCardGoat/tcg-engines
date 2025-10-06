/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { jafarTyrannicalHypnotist } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Jafar - Tyrannical Hypnotist", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: jafarTyrannicalHypnotist.cost,
      play: [jafarTyrannicalHypnotist],
    });

    const cardUnderTest = testStore.getCard(jafarTyrannicalHypnotist);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  it.skip("Intimidating Gaze", () => {
    const testStore = new TestStore({
      inkwell: jafarTyrannicalHypnotist.cost,
      play: [jafarTyrannicalHypnotist],
    });

    const cardUnderTest = testStore.getCard(jafarTyrannicalHypnotist);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
