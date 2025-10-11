import { describe, it } from "bun:test";
import { jafarTyrannicalHypnotist } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
