// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { ulfMime } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Ulf - Mime", () => {
//   it.skip("**SILENT PERFORMANCE** This character can't {E} to sing songs.", () => {
//     const testStore = new TestStore({
//       inkwell: ulfMime.cost,
//       play: [ulfMime],
//     });
//
//     const cardUnderTest = testStore.getCard(ulfMime);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
