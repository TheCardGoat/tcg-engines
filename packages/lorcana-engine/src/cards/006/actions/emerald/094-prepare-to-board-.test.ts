/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  donaldDuckBuccaneer,
  peterPanShadowFinder,
} from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { prepareToBoard } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
