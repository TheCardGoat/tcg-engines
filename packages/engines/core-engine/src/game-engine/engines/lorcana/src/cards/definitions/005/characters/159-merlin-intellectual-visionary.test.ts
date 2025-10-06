/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { merlinIntellectualVisionary } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Merlin - Intellectual Visionary", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: merlinIntellectualVisionary.cost,
      play: [merlinIntellectualVisionary],
    });

    const cardUnderTest = testStore.getCard(merlinIntellectualVisionary);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});

describe("Regression Tests", () => {
  it("should let you play Merlin - Intellectual Visionary", async () => {
    const testEngine = new TestEngine({
      inkwell: merlinIntellectualVisionary.cost,
      hand: [merlinIntellectualVisionary],
    });

    await testEngine.playCard(merlinIntellectualVisionary);

    expect(testEngine.testStore.getCard(merlinIntellectualVisionary).zone).toBe(
      "play",
    );
  });
});
