// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { iceBlock } from "@lorcanito/lorcana-engine/cards/004/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ice Block", () => {
//   It.skip("**CHILLY LABOR** {E} − Chosen character gets -1 {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: iceBlock.cost,
//       Play: [iceBlock],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", iceBlock.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
