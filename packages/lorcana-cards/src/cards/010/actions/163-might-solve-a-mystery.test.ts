// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MagicBroomBucketBrigade,
//   MickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   MagicMirror,
//   UrsulaCaldron,
// } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import {
//   ChristopherRobinAdventurer,
//   MickeyMouseFriendlyFace,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   DragonGem,
//   TheSorcerersSpellbook,
// } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { mightSolveAMystery } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Might Solve a Mystery", () => {
//   Describe("Look at the top 4 cards of your deck. You may reveal up to 1 character card and up to 1 item card and put them into your hand. Put the rest on the bottom of your deck in any order.", () => {
//     Const deck = [
//       MickeyMouseTrueFriend,
//       MagicBroomBucketBrigade,
//       UrsulaCaldron,
//       MagicMirror,
//       ChristopherRobinAdventurer,
//       DragonGem,
//       MickeyMouseFriendlyFace,
//       TheSorcerersSpellbook,
//     ];
//
//     It("Happy Case - takes 1 character and 1 item to hand, rest go to bottom", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: mightSolveAMystery.cost,
//         Hand: [mightSolveAMystery],
//         Deck: deck,
//       });
//
//       Await testEngine.playCard(mightSolveAMystery, {
//         Scry: {
//           Hand: [mickeyMouseTrueFriend, ursulaCaldron],
//           Bottom: [magicBroomBucketBrigade, magicMirror],
//         },
//       });
//
//       // Should have drawn both the character and the item
//       Expect(testEngine.getCardModel(mickeyMouseTrueFriend).zone).toBe("hand");
//       Expect(testEngine.getCardModel(ursulaCaldron).zone).toBe("hand");
//       // The rest should be on bottom in the order we specified
//       Expect(testEngine.getCardModel(magicBroomBucketBrigade).zone).toBe(
//         "deck",
//       );
//       Expect(testEngine.getCardModel(magicMirror).zone).toBe("deck");
//     });
//
//     It("Choosing only a character, no item", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: mightSolveAMystery.cost,
//         Hand: [mightSolveAMystery],
//         Deck: deck,
//       });
//
//       Await testEngine.playCard(mightSolveAMystery, {
//         Scry: {
//           Hand: [christopherRobinAdventurer],
//           Bottom: [
//             MickeyMouseTrueFriend,
//             MagicBroomBucketBrigade,
//             UrsulaCaldron,
//           ],
//         },
//       });
//
//       Expect(testEngine.getCardModel(christopherRobinAdventurer).zone).toBe(
//         "hand",
//       );
//       Expect(testEngine.getCardModel(mickeyMouseTrueFriend).zone).toBe("deck");
//       Expect(testEngine.getCardModel(magicBroomBucketBrigade).zone).toBe(
//         "deck",
//       );
//       Expect(testEngine.getCardModel(ursulaCaldron).zone).toBe("deck");
//     });
//
//     It("Choosing only an item, no character", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: mightSolveAMystery.cost,
//         Hand: [mightSolveAMystery],
//         Deck: deck,
//       });
//
//       Await testEngine.playCard(mightSolveAMystery, {
//         Scry: {
//           Hand: [dragonGem],
//           Bottom: [
//             MickeyMouseTrueFriend,
//             MagicBroomBucketBrigade,
//             UrsulaCaldron,
//           ],
//         },
//       });
//
//       Expect(testEngine.getCardModel(dragonGem).zone).toBe("hand");
//       Expect(testEngine.getCardModel(mickeyMouseTrueFriend).zone).toBe("deck");
//       Expect(testEngine.getCardModel(magicBroomBucketBrigade).zone).toBe(
//         "deck",
//       );
//       Expect(testEngine.getCardModel(ursulaCaldron).zone).toBe("deck");
//     });
//
//     It("Choosing neither character nor item (all go to bottom)", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: mightSolveAMystery.cost,
//         Hand: [mightSolveAMystery],
//         Deck: deck,
//       });
//
//       Await testEngine.playCard(mightSolveAMystery, {
//         Scry: {
//           Hand: [],
//           Bottom: [
//             MickeyMouseTrueFriend,
//             MagicBroomBucketBrigade,
//             UrsulaCaldron,
//             MagicMirror,
//           ],
//         },
//       });
//
//       // All cards should remain in deck
//       Expect(testEngine.getCardModel(mickeyMouseTrueFriend).zone).toBe("deck");
//       Expect(testEngine.getCardModel(magicBroomBucketBrigade).zone).toBe(
//         "deck",
//       );
//       Expect(testEngine.getCardModel(ursulaCaldron).zone).toBe("deck");
//       Expect(testEngine.getCardModel(magicMirror).zone).toBe("deck");
//     });
//
//     It("Trying to take 2 characters (should only take 1)", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: mightSolveAMystery.cost,
//         Hand: [mightSolveAMystery],
//         Deck: deck,
//       });
//
//       // This test should fail because we're trying to take 2 characters
//       // The engine should only allow 1 character to be taken
//       Await testEngine.playCard(mightSolveAMystery, {
//         Scry: {
//           Hand: [mickeyMouseTrueFriend], // Only take the first character
//           Bottom: [
//             ChristopherRobinAdventurer,
//             MagicBroomBucketBrigade,
//             UrsulaCaldron,
//           ],
//         },
//       });
//
//       // Only first character should be taken to hand
//       Expect(testEngine.getCardModel(mickeyMouseTrueFriend).zone).toBe("hand");
//       Expect(testEngine.getCardModel(christopherRobinAdventurer).zone).toBe(
//         "deck",
//       );
//       Expect(testEngine.getCardModel(magicBroomBucketBrigade).zone).toBe(
//         "deck",
//       );
//       Expect(testEngine.getCardModel(ursulaCaldron).zone).toBe("deck");
//     });
//
//     It("Trying to take 2 items (should only take 1)", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: mightSolveAMystery.cost,
//         Hand: [mightSolveAMystery],
//         Deck: [ursulaCaldron, magicMirror, dragonGem, theSorcerersSpellbook],
//       });
//
//       // This test should fail because we're trying to take 2 items
//       // The engine should only allow 1 item to be taken
//       Await testEngine.playCard(mightSolveAMystery, {
//         Scry: {
//           Hand: [ursulaCaldron], // Only take the first item
//           Bottom: [magicMirror, dragonGem, theSorcerersSpellbook],
//         },
//       });
//
//       // Only first item should be taken to hand
//       Expect(testEngine.getCardModel(ursulaCaldron).zone).toBe("hand");
//       Expect(testEngine.getCardModel(magicMirror).zone).toBe("deck");
//       Expect(testEngine.getCardModel(dragonGem).zone).toBe("deck");
//       Expect(testEngine.getCardModel(theSorcerersSpellbook).zone).toBe("deck");
//     });
//
//     It("Takes 1 character and 1 item (correct limit)", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: mightSolveAMystery.cost,
//         Hand: [mightSolveAMystery],
//         Deck: deck,
//       });
//
//       Await testEngine.playCard(mightSolveAMystery, {
//         Scry: {
//           Hand: [mickeyMouseTrueFriend, ursulaCaldron], // 1 character + 1 item = correct
//           Bottom: [magicBroomBucketBrigade],
//         },
//       });
//
//       // Character and item should be taken to hand
//       Expect(testEngine.getCardModel(mickeyMouseTrueFriend).zone).toBe("hand");
//       Expect(testEngine.getCardModel(ursulaCaldron).zone).toBe("hand");
//       Expect(testEngine.getCardModel(magicBroomBucketBrigade).zone).toBe(
//         "deck",
//       );
//     });
//
//     It("No valid targets chosen (all go to bottom)", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: mightSolveAMystery.cost,
//         Hand: [mightSolveAMystery],
//         Deck: [
//           MickeyMouseTrueFriend, // character
//           UrsulaCaldron, // item
//           MagicBroomBucketBrigade, // character
//           MagicMirror, // item
//         ],
//       });
//
//       Await testEngine.playCard(mightSolveAMystery, {
//         Scry: {
//           Hand: [], // Choose to take nothing even though there are valid targets
//           Bottom: [
//             MickeyMouseTrueFriend,
//             UrsulaCaldron,
//             MagicBroomBucketBrigade,
//             MagicMirror,
//           ],
//         },
//       });
//
//       // All cards should remain in deck (user chose not to take any)
//       Expect(testEngine.getCardModel(mickeyMouseTrueFriend).zone).toBe("deck");
//       Expect(testEngine.getCardModel(ursulaCaldron).zone).toBe("deck");
//       Expect(testEngine.getCardModel(magicBroomBucketBrigade).zone).toBe(
//         "deck",
//       );
//       Expect(testEngine.getCardModel(magicMirror).zone).toBe("deck");
//     });
//   });
// });
//
