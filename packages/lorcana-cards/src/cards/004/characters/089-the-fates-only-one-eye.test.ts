// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { theFatesOnlyOneEye } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("The Fates - Only One Eye", () => {
//   It.skip("**ALL WILL BE SEEN** When you play this character, look at the top card of each opponent's deck.", () => {
//     Const testStore = new TestStore({
//       Inkwell: theFatesOnlyOneEye.cost,
//       Hand: [theFatesOnlyOneEye],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       TheFatesOnlyOneEye.id,
//     );
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
