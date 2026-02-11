// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { magicBroomBucketBrigade } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { magicBroomSwiftCleaner } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { magicBroomAerialCleaner } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Magic Broom - Fast Cleaner", () => {
//   It("**Rush** _(This character can challenge the turn they’re played.)_**CLEAN THIS, CLEAN THAT** When you play this character, you may shuffle all Broom characters from your discard to your deck.", () => {
//     Const testStore = new TestStore({
//       Inkwell: magicBroomSwiftCleaner.cost,
//       Hand: [magicBroomSwiftCleaner],
//       Discard: [magicBroomAerialCleaner, magicBroomBucketBrigade],
//     });
//
//     Const cardUnderTest = testStore.getCard(magicBroomSwiftCleaner);
//     Const magicBroomAerialCleanerInDiscard = testStore.getCard(
//       MagicBroomAerialCleaner,
//     );
//     Const magicBroomBucketBrigadeInDiscard = testStore.getCard(
//       MagicBroomBucketBrigade,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     Expect(magicBroomAerialCleanerInDiscard.zone).toBe("deck");
//     Expect(magicBroomBucketBrigadeInDiscard.zone).toBe("deck");
//   });
// });
//
