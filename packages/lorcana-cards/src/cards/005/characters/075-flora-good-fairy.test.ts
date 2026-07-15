// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { floraGoodFairy } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Flora - Good Fairy", () => {
//   It.skip("**FIDDLE FADDLE** While being challenged, this character gets +2 {S}.", () => {
//     Const testStore = new TestStore({
//       Inkwell: floraGoodFairy.cost,
//       Play: [floraGoodFairy],
//     });
//
//     Const cardUnderTest = testStore.getCard(floraGoodFairy);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
