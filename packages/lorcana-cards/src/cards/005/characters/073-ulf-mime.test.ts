// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { ulfMime } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ulf - Mime", () => {
//   It.skip("**SILENT PERFORMANCE** This character can't {E} to sing songs.", () => {
//     Const testStore = new TestStore({
//       Inkwell: ulfMime.cost,
//       Play: [ulfMime],
//     });
//
//     Const cardUnderTest = testStore.getCard(ulfMime);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
