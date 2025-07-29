import { describe, expect, it } from "bun:test";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  donaldDuckBuccaneer,
  peterPanShadowFinder,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import { prepareToBoard } from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Prepare To Board!", () => {
  it("[Non Pirate] Chosen character gets +2 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: prepareToBoard.cost,
      hand: [prepareToBoard],
      play: [peterPanShadowFinder],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", prepareToBoard.id);
    const target = testStore.getByZoneAndId("play", peterPanShadowFinder.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targetId: target.instanceId });

    expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) + 2);
  });

  it("[Pirate] Chosen character gets +3 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: prepareToBoard.cost,
      hand: [prepareToBoard],
      play: [donaldDuckBuccaneer],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", prepareToBoard.id);
    const target = testStore.getByZoneAndId("play", donaldDuckBuccaneer.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targetId: target.instanceId });

    expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) + 3);
  });
});
