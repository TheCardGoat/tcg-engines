// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DonaldDuck,
//   MickeyBraveLittleTailor,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   GoofyKnightForADay,
//   MadamMimSnake,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   BelleAccomplishedMystic,
//   GoofySuperGoof,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Belle - Accomplished Mystic", () => {
//   It("**ENHANCED HEALING** When you play this character, move up to 3 damage counters from chosen character to chosen opposing character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: belleAccomplishedMystic.cost * 2 + madamMimSnake.cost,
//         Play: [goofySuperGoof, donaldDuck],
//         Hand: [belleAccomplishedMystic, madamMimSnake],
//       },
//       {
//         Play: [mickeyBraveLittleTailor, goofyKnightForADay],
//       },
//     );
//
//     Await testEngine.setCardDamage(donaldDuck, 2);
//     Await testEngine.playCard(
//       BelleAccomplishedMystic,
//       {
//         Targets: [donaldDuck],
//       },
//       True,
//     );
//     Await testEngine.resolveTopOfStack({
//       Targets: [goofyKnightForADay],
//     });
//
//     Expect(testEngine.getCardModel(donaldDuck).damage).toBe(0);
//     Expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(2);
//
//     // Returning Belle to the hand, so we can test teh same instance of the card model
//     Await testEngine.playCard(
//       MadamMimSnake,
//       {
//         Targets: [belleAccomplishedMystic],
//         AcceptOptionalLayer: true,
//       },
//       True,
//     );
//     Expect(testEngine.getCardModel(belleAccomplishedMystic).zone).toBe("hand");
//
//     Await testEngine.setCardDamage(goofySuperGoof, 3);
//     Await testEngine.playCard(
//       BelleAccomplishedMystic,
//       {
//         Targets: [goofySuperGoof],
//       },
//       True,
//     );
//     Await testEngine.resolveTopOfStack({
//       Targets: [mickeyBraveLittleTailor],
//     });
//
//     Expect(testEngine.getCardModel(goofySuperGoof).damage).toBe(0);
//     Expect(testEngine.getCardModel(mickeyBraveLittleTailor).damage).toBe(3);
//   });
// });
//
// Describe("Regression", () => {
//   It("Should be able to move less than 3 damage", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: belleAccomplishedMystic.cost + mickeyBraveLittleTailor.cost,
//         Play: [mickeyBraveLittleTailor],
//         Hand: [belleAccomplishedMystic],
//       },
//       {
//         Play: [goofyKnightForADay],
//       },
//     );
//
//     Await testEngine.setCardDamage(mickeyBraveLittleTailor, 4);
//     Await testEngine.playCard(
//       BelleAccomplishedMystic,
//       {
//         Targets: [mickeyBraveLittleTailor],
//         Amount: 2,
//       },
//       True,
//     );
//     Await testEngine.resolveTopOfStack({
//       Targets: [goofyKnightForADay],
//     });
//
//     Expect(testEngine.getCardModel(mickeyBraveLittleTailor).damage).toBe(2);
//     Expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(2);
//   });
// });
//
