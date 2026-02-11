// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { pascalInquisitivePet } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Pascal - Inquisitive Pet", () => {
//   It.skip("**COLORFUL TACTICS** When you play this character, look at the top 3 cards of your deck and put them back in any order.", () => {
//     Const testStore = new TestStore({
//       Inkwell: pascalInquisitivePet.cost,
//       Hand: [pascalInquisitivePet],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       PascalInquisitivePet.id,
//     );
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
