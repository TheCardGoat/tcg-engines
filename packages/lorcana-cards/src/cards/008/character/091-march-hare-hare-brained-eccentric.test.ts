// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { beastTragicHero } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { marchHareHareBrainedEccentric } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("March Hare - Hare-Brained Eccentric", () => {
//   It("LIGHT THE CANDLES When you play this character, you may choose a character with one or more damage and deal 2 damage to it.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: marchHareHareBrainedEccentric.cost,
//         Hand: [marchHareHareBrainedEccentric],
//       },
//       {
//         Play: [beastTragicHero],
//       },
//     );
//
//     Const cardTarget = testEngine.getCardModel(beastTragicHero);
//     Expect(cardTarget.damage).toEqual(0);
//     TestEngine.setCardDamage(cardTarget, 1);
//
//     Await testEngine.playCard(marchHareHareBrainedEccentric);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [cardTarget] });
//
//     Expect(cardTarget.damage).toEqual(3);
//   });
// });
//
