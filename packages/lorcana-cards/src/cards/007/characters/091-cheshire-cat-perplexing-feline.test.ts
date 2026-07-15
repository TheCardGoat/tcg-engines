// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { letTheStormRageOn } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { beastTragicHero } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { cheshireCatPerplexingFeline } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("MAD GRIN When you play this character, you may deal 2 damage to chosen damaged character.", () => {
//   It.skip("should deal 2 damage to chosend damaged character, when played", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: 10,
//         Hand: [cheshireCatPerplexingFeline, letTheStormRageOn],
//       },
//       {
//         Play: [beastTragicHero],
//       },
//     );
//
//     Await testEngine.playCard(cheshireCatPerplexingFeline);
//     Const cardTarget = testEngine.getCardModel(beastTragicHero);
//     Expect(cardTarget.damage).toEqual(0);
//     Await testEngine.playCard(
//       LetTheStormRageOn,
//       {
//         Targets: [beastTragicHero],
//       },
//       True,
//     );
//     Expect(cardTarget.damage).toEqual(2);
//     Await testEngine.playCard(
//       BeastTragicHero,
//       {
//         Targets: [beastTragicHero],
//       },
//       True,
//     );
//     Expect(cardTarget.damage).toEqual(2);
//   });
// });
//
