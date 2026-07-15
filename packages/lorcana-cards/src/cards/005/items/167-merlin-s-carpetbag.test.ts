// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { merlinsCarpetbag } from "@lorcanito/lorcana-engine/cards/005/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Merlin's Carpetbag", () => {
//   It.skip("**Hockety Pockety**{E}, 1 {I} – Return an item card from your discard to your hand.", () => {
//     Const testStore = new TestStore({
//       Inkwell: merlinsCarpetbag.cost,
//       Play: [merlinsCarpetbag],
//     });
//
//     Const cardUnderTest = testStore.getCard(merlinsCarpetbag);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
