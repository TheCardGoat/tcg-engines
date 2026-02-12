// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { sumerianTalisman } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Sumerian Talisman", () => {
//   It.skip("**SOURCE OF MAGIC** During your turn, whenever one of your characters is banished in a challenge, you may draw a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: sumerianTalisman.cost,
//       Play: [sumerianTalisman],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", sumerianTalisman.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
