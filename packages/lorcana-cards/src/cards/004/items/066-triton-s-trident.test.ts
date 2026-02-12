// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { tritonsTrident } from "@lorcanito/lorcana-engine/cards/004/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Triton's Trident", () => {
//   It.skip("**SYMBOL OF POWER** Banish this item — Chosen character gets +1 {S} this turn for each card in your hand.", () => {
//     Const testStore = new TestStore({
//       Inkwell: tritonsTrident.cost,
//       Play: [tritonsTrident],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", tritonsTrident.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
