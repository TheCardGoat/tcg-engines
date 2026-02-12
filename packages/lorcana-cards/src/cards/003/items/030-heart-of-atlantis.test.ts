// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { heartOfAtlantis } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Heart of Atlantis", () => {
//   It.skip("**LIFE GIVER** {E} – You pay 2 {I} less for the next character you play this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: heartOfAtlantis.cost,
//       Play: [heartOfAtlantis],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", heartOfAtlantis.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
