// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { magicBroomBucketBrigade } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { cinderellaKnightInTraining } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Cinderella- Knight in Training", () => {
//   It("**HAVE COURAGE** When you play this character, you may draw a card, then choose and discard a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: cinderellaKnightInTraining.cost,
//       Deck: [magicBroomBucketBrigade],
//       Hand: [cinderellaKnightInTraining],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       CinderellaKnightInTraining.id,
//     );
//
//     CardUnderTest.playFromHand();
//
//     Expect(testStore.stackLayers).toHaveLength(1);
//     TestStore.resolveOptionalAbility();
//
//     Expect(testStore.stackLayers).toHaveLength(1);
//
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 1, deck: 0, play: 1, discard: 0 }),
//     );
//
//     Const aCardToDiscard = testStore.getByZoneAndId(
//       "hand",
//       MagicBroomBucketBrigade.id,
//     );
//     TestStore.resolveTopOfStack({
//       Targets: [aCardToDiscard],
//     });
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 0, deck: 0, play: 1, discard: 1 }),
//     );
//   });
// });
//
