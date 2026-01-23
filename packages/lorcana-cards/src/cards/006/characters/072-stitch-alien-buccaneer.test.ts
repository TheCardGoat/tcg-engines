// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { stitchAlienBuccaneer } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Stitch - Alien Buccaneer", () => {
//   it.skip("**READY FOR ACTION** _When you play this character, if you used Shift to play him, you may put an action card from your discard on the top of your deck._", () => {
//     const testStore = new TestStore({
//       inkwell: stitchAlienBuccaneer.cost,
//       hand: [stitchAlienBuccaneer],
//     });
//
//     const cardUnderTest = testStore.getCard(stitchAlienBuccaneer);
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
