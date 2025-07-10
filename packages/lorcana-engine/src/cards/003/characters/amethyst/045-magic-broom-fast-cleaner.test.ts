/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { magicBroomBucketBrigade } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { magicBroomSwiftCleaner } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { magicBroomAerialCleaner } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
