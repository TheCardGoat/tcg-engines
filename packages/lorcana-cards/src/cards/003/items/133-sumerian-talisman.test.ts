// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { sumerianTalisman } from "@lorcanito/lorcana-engine/cards/003/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Sumerian Talisman", () => {
//   it.skip("**SOURCE OF MAGIC** During your turn, whenever one of your characters is banished in a challenge, you may draw a card.", () => {
//     const testStore = new TestStore({
//       inkwell: sumerianTalisman.cost,
//       play: [sumerianTalisman],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("play", sumerianTalisman.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
