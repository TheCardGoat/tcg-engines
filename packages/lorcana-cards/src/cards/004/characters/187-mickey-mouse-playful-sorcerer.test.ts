// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { magicBroomBucketBrigade } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   MagicBroomAerialCleaner,
//   MickeyMousePlayfulSorcerer,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mickey Mouse - Playful Sorcerer", () => {
//   It("**SWEEP AWAY** When you play this character, deal damage to chosen character equal to the number of Broom characters you have in play.", () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mickeyMousePlayfulSorcerer.cost,
//       Hand: [mickeyMousePlayfulSorcerer],
//       Play: [magicBroomBucketBrigade, magicBroomAerialCleaner],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mickeyMousePlayfulSorcerer);
//     Const target = testEngine.getCardModel(magicBroomAerialCleaner);
//     Const expectedDamage = testEngine.getZonesCardCount().play;
//
//     CardUnderTest.playFromHand();
//     TestEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.meta.damage).toEqual(expectedDamage);
//   });
//
//   It("**SWEEP AWAY** When you play this character, deal damage to chosen character equal to the number of Broom characters you have in play.", () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: mickeyMousePlayfulSorcerer.cost,
//         Hand: [mickeyMousePlayfulSorcerer],
//       },
//       {
//         Play: [magicBroomBucketBrigade, magicBroomAerialCleaner],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(mickeyMousePlayfulSorcerer);
//     Const target = testEngine.getCardModel(magicBroomAerialCleaner);
//     Const expectedDamage = testEngine.getZonesCardCount().play;
//
//     CardUnderTest.playFromHand();
//     TestEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.meta.damage).toEqual(expectedDamage);
//   });
// });
//
