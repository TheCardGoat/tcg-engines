// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { magicBroomBucketBrigade } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { yzmaExasperatedSchemer } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Yzma - Exasperated Schemer", () => {
//   it("HOW SHALL I DO IT? When you play this character, you may draw a card, then choose and discard a card.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 10,
//       deck: [magicBroomBucketBrigade],
//       hand: [yzmaExasperatedSchemer],
//     });
//
//     await testEngine.playCard(yzmaExasperatedSchemer);
//
//     expect(testEngine.stackLayers).toHaveLength(1);
//     testEngine.resolveOptionalAbility();
//
//     expect(testEngine.stackLayers).toHaveLength(1);
//
//     expect(testEngine.getZonesCardCount()).toEqual(
//       expect.objectContaining({ hand: 1, deck: 0, play: 1, discard: 0 }),
//     );
//
//     const aCardToDiscard = testEngine.getCardModel(magicBroomBucketBrigade);
//     testEngine.resolveTopOfStack({
//       targets: [aCardToDiscard],
//     });
//     expect(testEngine.getZonesCardCount()).toEqual(
//       expect.objectContaining({ hand: 0, deck: 0, play: 1, discard: 1 }),
//     );
//   });
// });
//
