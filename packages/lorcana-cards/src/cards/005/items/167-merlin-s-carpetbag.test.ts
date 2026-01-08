// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { merlinsCarpetbag } from "@lorcanito/lorcana-engine/cards/005/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Merlin's Carpetbag", () => {
//   it.skip("**Hockety Pockety**{E}, 1 {I} – Return an item card from your discard to your hand.", () => {
//     const testStore = new TestStore({
//       inkwell: merlinsCarpetbag.cost,
//       play: [merlinsCarpetbag],
//     });
//
//     const cardUnderTest = testStore.getCard(merlinsCarpetbag);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
