/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { stitchAlienBuccaneer } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("Stitch - Alien Buccaneer", () => {
  it.skip("**READY FOR ACTION** _When you play this character, if you used Shift to play him, you may put an action card from your discard on the top of your deck._", () => {
    const testStore = new TestStore({
      inkwell: stitchAlienBuccaneer.cost,
      hand: [stitchAlienBuccaneer],
    });

    const cardUnderTest = testStore.getCard(stitchAlienBuccaneer);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
