// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { scroogesTopHat } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Scrooge's Top Hat", () => {
//   It.skip("**BUSINESS EXPERTISE** {E} – You pay 1 {I} less for the next item you play this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: scroogesTopHat.cost,
//       Play: [scroogesTopHat],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", scroogesTopHat.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
