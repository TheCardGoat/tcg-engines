// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { hiddenInkcaster } from "@lorcanito/lorcana-engine/cards/004/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Hidden Inkcaster", () => {
//   It.skip("**FRESH INK** When you play this item, draw a card.**UNEXPECTED TREASURE** All cards in your hand count as having ⏣.", () => {
//     Const testStore = new TestStore({
//       Inkwell: hiddenInkcaster.cost,
//       Play: [hiddenInkcaster],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", hiddenInkcaster.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
