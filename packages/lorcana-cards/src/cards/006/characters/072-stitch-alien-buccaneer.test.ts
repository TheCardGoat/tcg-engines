// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { stitchAlienBuccaneer } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Stitch - Alien Buccaneer", () => {
//   It.skip("**READY FOR ACTION** _When you play this character, if you used Shift to play him, you may put an action card from your discard on the top of your deck._", () => {
//     Const testStore = new TestStore({
//       Inkwell: stitchAlienBuccaneer.cost,
//       Hand: [stitchAlienBuccaneer],
//     });
//
//     Const cardUnderTest = testStore.getCard(stitchAlienBuccaneer);
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
