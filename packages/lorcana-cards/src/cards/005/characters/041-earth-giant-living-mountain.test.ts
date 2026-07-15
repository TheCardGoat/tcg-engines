// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { earthGiantLivingMountain } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Earth Giant - Living Mountain", () => {
//   It("**UNEARTHED** When you play this character, each opponent draws a card.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: earthGiantLivingMountain.cost,
//         Hand: [earthGiantLivingMountain],
//       },
//       {
//         Deck: 1,
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(earthGiantLivingMountain);
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({});
//
//     Expect(testStore.getZonesCardCount("player_two").hand).toEqual(1);
//     Expect(testStore.getZonesCardCount("player_two").deck).toEqual(0);
//   });
// });
//
