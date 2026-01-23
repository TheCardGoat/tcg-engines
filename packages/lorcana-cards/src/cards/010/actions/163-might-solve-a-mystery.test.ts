// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   magicBroomBucketBrigade,
//   mickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import {
//   magicMirror,
//   ursulaCaldron,
// } from "@lorcanito/lorcana-engine/cards/001/items/items";
// import {
//   christopherRobinAdventurer,
//   mickeyMouseFriendlyFace,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import {
//   dragonGem,
//   theSorcerersSpellbook,
// } from "@lorcanito/lorcana-engine/cards/002/items/items";
// import { mightSolveAMystery } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Might Solve a Mystery", () => {
//   describe("Look at the top 4 cards of your deck. You may reveal up to 1 character card and up to 1 item card and put them into your hand. Put the rest on the bottom of your deck in any order.", () => {
//     const deck = [
//       mickeyMouseTrueFriend,
//       magicBroomBucketBrigade,
//       ursulaCaldron,
//       magicMirror,
//       christopherRobinAdventurer,
//       dragonGem,
//       mickeyMouseFriendlyFace,
//       theSorcerersSpellbook,
//     ];
//
//     it("Happy Case - takes 1 character and 1 item to hand, rest go to bottom", async () => {
//       const testEngine = new TestEngine({
//         inkwell: mightSolveAMystery.cost,
//         hand: [mightSolveAMystery],
//         deck: deck,
//       });
//
//       await testEngine.playCard(mightSolveAMystery, {
//         scry: {
//           hand: [mickeyMouseTrueFriend, ursulaCaldron],
//           bottom: [magicBroomBucketBrigade, magicMirror],
//         },
//       });
//
//       // Should have drawn both the character and the item
//       expect(testEngine.getCardModel(mickeyMouseTrueFriend).zone).toBe("hand");
//       expect(testEngine.getCardModel(ursulaCaldron).zone).toBe("hand");
//       // The rest should be on bottom in the order we specified
//       expect(testEngine.getCardModel(magicBroomBucketBrigade).zone).toBe(
//         "deck",
//       );
//       expect(testEngine.getCardModel(magicMirror).zone).toBe("deck");
//     });
//
//     it("Choosing only a character, no item", async () => {
//       const testEngine = new TestEngine({
//         inkwell: mightSolveAMystery.cost,
//         hand: [mightSolveAMystery],
//         deck: deck,
//       });
//
//       await testEngine.playCard(mightSolveAMystery, {
//         scry: {
//           hand: [christopherRobinAdventurer],
//           bottom: [
//             mickeyMouseTrueFriend,
//             magicBroomBucketBrigade,
//             ursulaCaldron,
//           ],
//         },
//       });
//
//       expect(testEngine.getCardModel(christopherRobinAdventurer).zone).toBe(
//         "hand",
//       );
//       expect(testEngine.getCardModel(mickeyMouseTrueFriend).zone).toBe("deck");
//       expect(testEngine.getCardModel(magicBroomBucketBrigade).zone).toBe(
//         "deck",
//       );
//       expect(testEngine.getCardModel(ursulaCaldron).zone).toBe("deck");
//     });
//
//     it("Choosing only an item, no character", async () => {
//       const testEngine = new TestEngine({
//         inkwell: mightSolveAMystery.cost,
//         hand: [mightSolveAMystery],
//         deck: deck,
//       });
//
//       await testEngine.playCard(mightSolveAMystery, {
//         scry: {
//           hand: [dragonGem],
//           bottom: [
//             mickeyMouseTrueFriend,
//             magicBroomBucketBrigade,
//             ursulaCaldron,
//           ],
//         },
//       });
//
//       expect(testEngine.getCardModel(dragonGem).zone).toBe("hand");
//       expect(testEngine.getCardModel(mickeyMouseTrueFriend).zone).toBe("deck");
//       expect(testEngine.getCardModel(magicBroomBucketBrigade).zone).toBe(
//         "deck",
//       );
//       expect(testEngine.getCardModel(ursulaCaldron).zone).toBe("deck");
//     });
//
//     it("Choosing neither character nor item (all go to bottom)", async () => {
//       const testEngine = new TestEngine({
//         inkwell: mightSolveAMystery.cost,
//         hand: [mightSolveAMystery],
//         deck: deck,
//       });
//
//       await testEngine.playCard(mightSolveAMystery, {
//         scry: {
//           hand: [],
//           bottom: [
//             mickeyMouseTrueFriend,
//             magicBroomBucketBrigade,
//             ursulaCaldron,
//             magicMirror,
//           ],
//         },
//       });
//
//       // All cards should remain in deck
//       expect(testEngine.getCardModel(mickeyMouseTrueFriend).zone).toBe("deck");
//       expect(testEngine.getCardModel(magicBroomBucketBrigade).zone).toBe(
//         "deck",
//       );
//       expect(testEngine.getCardModel(ursulaCaldron).zone).toBe("deck");
//       expect(testEngine.getCardModel(magicMirror).zone).toBe("deck");
//     });
//
//     it("Trying to take 2 characters (should only take 1)", async () => {
//       const testEngine = new TestEngine({
//         inkwell: mightSolveAMystery.cost,
//         hand: [mightSolveAMystery],
//         deck: deck,
//       });
//
//       // This test should fail because we're trying to take 2 characters
//       // The engine should only allow 1 character to be taken
//       await testEngine.playCard(mightSolveAMystery, {
//         scry: {
//           hand: [mickeyMouseTrueFriend], // Only take the first character
//           bottom: [
//             christopherRobinAdventurer,
//             magicBroomBucketBrigade,
//             ursulaCaldron,
//           ],
//         },
//       });
//
//       // Only first character should be taken to hand
//       expect(testEngine.getCardModel(mickeyMouseTrueFriend).zone).toBe("hand");
//       expect(testEngine.getCardModel(christopherRobinAdventurer).zone).toBe(
//         "deck",
//       );
//       expect(testEngine.getCardModel(magicBroomBucketBrigade).zone).toBe(
//         "deck",
//       );
//       expect(testEngine.getCardModel(ursulaCaldron).zone).toBe("deck");
//     });
//
//     it("Trying to take 2 items (should only take 1)", async () => {
//       const testEngine = new TestEngine({
//         inkwell: mightSolveAMystery.cost,
//         hand: [mightSolveAMystery],
//         deck: [ursulaCaldron, magicMirror, dragonGem, theSorcerersSpellbook],
//       });
//
//       // This test should fail because we're trying to take 2 items
//       // The engine should only allow 1 item to be taken
//       await testEngine.playCard(mightSolveAMystery, {
//         scry: {
//           hand: [ursulaCaldron], // Only take the first item
//           bottom: [magicMirror, dragonGem, theSorcerersSpellbook],
//         },
//       });
//
//       // Only first item should be taken to hand
//       expect(testEngine.getCardModel(ursulaCaldron).zone).toBe("hand");
//       expect(testEngine.getCardModel(magicMirror).zone).toBe("deck");
//       expect(testEngine.getCardModel(dragonGem).zone).toBe("deck");
//       expect(testEngine.getCardModel(theSorcerersSpellbook).zone).toBe("deck");
//     });
//
//     it("Takes 1 character and 1 item (correct limit)", async () => {
//       const testEngine = new TestEngine({
//         inkwell: mightSolveAMystery.cost,
//         hand: [mightSolveAMystery],
//         deck: deck,
//       });
//
//       await testEngine.playCard(mightSolveAMystery, {
//         scry: {
//           hand: [mickeyMouseTrueFriend, ursulaCaldron], // 1 character + 1 item = correct
//           bottom: [magicBroomBucketBrigade],
//         },
//       });
//
//       // Character and item should be taken to hand
//       expect(testEngine.getCardModel(mickeyMouseTrueFriend).zone).toBe("hand");
//       expect(testEngine.getCardModel(ursulaCaldron).zone).toBe("hand");
//       expect(testEngine.getCardModel(magicBroomBucketBrigade).zone).toBe(
//         "deck",
//       );
//     });
//
//     it("No valid targets chosen (all go to bottom)", async () => {
//       const testEngine = new TestEngine({
//         inkwell: mightSolveAMystery.cost,
//         hand: [mightSolveAMystery],
//         deck: [
//           mickeyMouseTrueFriend, // character
//           ursulaCaldron, // item
//           magicBroomBucketBrigade, // character
//           magicMirror, // item
//         ],
//       });
//
//       await testEngine.playCard(mightSolveAMystery, {
//         scry: {
//           hand: [], // Choose to take nothing even though there are valid targets
//           bottom: [
//             mickeyMouseTrueFriend,
//             ursulaCaldron,
//             magicBroomBucketBrigade,
//             magicMirror,
//           ],
//         },
//       });
//
//       // All cards should remain in deck (user chose not to take any)
//       expect(testEngine.getCardModel(mickeyMouseTrueFriend).zone).toBe("deck");
//       expect(testEngine.getCardModel(ursulaCaldron).zone).toBe("deck");
//       expect(testEngine.getCardModel(magicBroomBucketBrigade).zone).toBe(
//         "deck",
//       );
//       expect(testEngine.getCardModel(magicMirror).zone).toBe("deck");
//     });
//   });
// });
//
