// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { earthGiantLivingMountain } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Earth Giant - Living Mountain", () => {
//   it("**UNEARTHED** When you play this character, each opponent draws a card.", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: earthGiantLivingMountain.cost,
//         hand: [earthGiantLivingMountain],
//       },
//       {
//         deck: 1,
//       },
//     );
//
//     const cardUnderTest = testStore.getCard(earthGiantLivingMountain);
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({});
//
//     expect(testStore.getZonesCardCount("player_two").hand).toEqual(1);
//     expect(testStore.getZonesCardCount("player_two").deck).toEqual(0);
//   });
// });
//
