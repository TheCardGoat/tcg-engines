// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { magicBroomBucketBrigade } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { yzmaExasperatedSchemer } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Yzma - Exasperated Schemer", () => {
//   It("HOW SHALL I DO IT? When you play this character, you may draw a card, then choose and discard a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 10,
//       Deck: [magicBroomBucketBrigade],
//       Hand: [yzmaExasperatedSchemer],
//     });
//
//     Await testEngine.playCard(yzmaExasperatedSchemer);
//
//     Expect(testEngine.stackLayers).toHaveLength(1);
//     TestEngine.resolveOptionalAbility();
//
//     Expect(testEngine.stackLayers).toHaveLength(1);
//
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 1, deck: 0, play: 1, discard: 0 }),
//     );
//
//     Const aCardToDiscard = testEngine.getCardModel(magicBroomBucketBrigade);
//     TestEngine.resolveTopOfStack({
//       Targets: [aCardToDiscard],
//     });
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 0, deck: 0, play: 1, discard: 1 }),
//     );
//   });
// });
//
