// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { digALittleDeeper } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Dig A Little Deeper", () => {
//   It.skip("**Sing Together** 8 _(Any number of your of your teammates' characters with total cost 8 or more may {E} to sing this song for free.)_Look at the top 7 cards of your deck. Put 2 into your hand. Put the rest on teh bottom of your deck in any order.", () => {
//     Const testStore = new TestStore({
//       Inkwell: digALittleDeeper.cost,
//       Hand: [digALittleDeeper],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", digALittleDeeper.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
