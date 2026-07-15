// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { basilsMagnifyingGlass } from "@lorcanito/lorcana-engine/cards/005/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Basil's Magnifying Glass", () => {
//   It.skip("FIND WHAT’S HIDDEN", () => {
//     Const testStore = new TestStore({
//       Inkwell: basilsMagnifyingGlass.cost,
//       Play: [basilsMagnifyingGlass],
//     });
//
//     Const cardUnderTest = testStore.getCard(basilsMagnifyingGlass);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
