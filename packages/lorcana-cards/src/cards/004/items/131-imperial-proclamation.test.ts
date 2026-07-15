// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { imperialProclamation } from "@lorcanito/lorcana-engine/cards/004/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Imperial Proclamation", () => {
//   It.skip("**CALL TO THE FRONT** Whenever one of your characters challenges another character, you pay 1 {I} less for the next character you play this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: imperialProclamation.cost,
//       Play: [imperialProclamation],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       ImperialProclamation.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
