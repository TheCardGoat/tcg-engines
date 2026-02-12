// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { theBossIsOnARoll } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("The Boss Is on a Roll", () => {
//   It.skip("_(A character with cost 3 or more can {E} to sing this song for free.)_Look at the top 5 cards of your deck. Put any number of them on the top or the bottom of your deck in any order. Gain 1 lore.", () => {
//     Const testStore = new TestStore({
//       Inkwell: theBossIsOnARoll.cost,
//       Hand: [theBossIsOnARoll],
//     });
//
//     Const cardUnderTest = testStore.getCard(theBossIsOnARoll);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
