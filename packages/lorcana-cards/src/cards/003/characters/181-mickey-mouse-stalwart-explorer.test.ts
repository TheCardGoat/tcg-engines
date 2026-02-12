// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { mickeyMouseStalwartExplorer } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mickey Mouse - Stalwart Explorer", () => {
//   It.skip("**LET'S TAKE A LOOK** This character gets +1 {S} for each location you have in play.", () => {
//     Const testStore = new TestStore({
//       Inkwell: mickeyMouseStalwartExplorer.cost,
//       Play: [mickeyMouseStalwartExplorer],
//     });
//
//     Const cardUnderTest = testStore.getCard(mickeyMouseStalwartExplorer);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
