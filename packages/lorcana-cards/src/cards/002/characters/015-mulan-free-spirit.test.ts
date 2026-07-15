// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { mulanFreeSpirit } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mulan - Free Spirit", () => {
//   It.skip("", () => {
//     Const testStore = new TestStore({
//       Inkwell: mulanFreeSpirit.cost,
//
//       Play: [mulanFreeSpirit],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", mulanFreeSpirit.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
