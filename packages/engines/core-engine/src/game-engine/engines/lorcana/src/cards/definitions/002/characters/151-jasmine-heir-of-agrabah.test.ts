/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { donaldDuckMusketeer } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { jasmineHeirOfAgrabah } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Jasmine - Heir of Agrabah", () => {
  it("**I'M A FAST LEARNER** When you play this character, remove up to 1 damage from chosen character of yours.", () => {
    const testStore = new TestStore({
      inkwell: jasmineHeirOfAgrabah.cost,
      hand: [jasmineHeirOfAgrabah],
      play: [donaldDuckMusketeer],
    });

    const cardUnderTest = testStore.getCard(jasmineHeirOfAgrabah);
    const target = testStore.getByZoneAndId("play", donaldDuckMusketeer.id);

    target.updateCardMeta({ damage: 2 });

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({ targetId: target.instanceId });

    expect(cardUnderTest.zone).toEqual("play");
    expect(target.meta.damage).toEqual(1);
  });
});

describe("Regression", () => {
  it("Should not get people stuck when playing alone", async () => {
    const testEngine = new TestEngine({
      inkwell: jasmineHeirOfAgrabah.cost,
      hand: [jasmineHeirOfAgrabah],
    });

    await testEngine.playCard(jasmineHeirOfAgrabah);

    expect(testEngine.stackLayers).toHaveLength(0);
  });
});
