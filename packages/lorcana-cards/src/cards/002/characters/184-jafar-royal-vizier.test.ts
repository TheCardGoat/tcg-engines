// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { jafarRoyalVizier } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Jafar- Royal Vizier", () => {
//   It.skip("I don't trust him, sire", () => {
//     Const testStore = new TestStore({
//       Inkwell: jafarRoyalVizier.cost,
//
//       Hand: [jafarRoyalVizier],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", jafarRoyalVizier.id);
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({});
//   });
// });
//
