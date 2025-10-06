/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { magicBroomBucketBrigade } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { magicBroomSwiftCleaner } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import { magicBroomAerialCleaner } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Magic Broom - Fast Cleaner", () => {
  it("**Rush** _(This character can challenge the turn they’re played.)_**CLEAN THIS, CLEAN THAT** When you play this character, you may shuffle all Broom characters from your discard to your deck.", () => {
    const testStore = new TestStore({
      inkwell: magicBroomSwiftCleaner.cost,
      hand: [magicBroomSwiftCleaner],
      discard: [magicBroomAerialCleaner, magicBroomBucketBrigade],
    });

    const cardUnderTest = testStore.getCard(magicBroomSwiftCleaner);
    const magicBroomAerialCleanerInDiscard = testStore.getCard(
      magicBroomAerialCleaner,
    );
    const magicBroomBucketBrigadeInDiscard = testStore.getCard(
      magicBroomBucketBrigade,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    expect(magicBroomAerialCleanerInDiscard.zone).toBe("deck");
    expect(magicBroomBucketBrigadeInDiscard.zone).toBe("deck");
  });
});
