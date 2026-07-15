// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ElsaQueenRegent,
//   MickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { castleWyvernAboveTheClouds } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe.skip("Castle Wyvern - Above the Clouds", () => {
//   Describe.skip("PROTECT THIS CASTLE", () => {
//     It("gives characters at the location Resist +1 - reduces damage taken by 1", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell:
//           CastleWyvernAboveTheClouds.moveCost +
//           MickeyMouseTrueFriend.cost +
//           ElsaQueenRegent.cost +
//           2,
//         Play: [castleWyvernAboveTheClouds],
//         Hand: [mickeyMouseTrueFriend, elsaQueenRegent],
//       });
//
//       // Play Mickey and move him to the location
//       Await testEngine.playCard(mickeyMouseTrueFriend);
//       Await testEngine.moveToLocation({
//         Location: castleWyvernAboveTheClouds,
//         Character: mickeyMouseTrueFriend,
//       });
//
//       // Play Elsa to challenge Mickey
//       Await testEngine.playCard(elsaQueenRegent);
//
//       Const mickey = testEngine.getCardModel(mickeyMouseTrueFriend);
//       Const elsa = testEngine.getCardModel(elsaQueenRegent);
//
//       Const initialMickeyWillpower = mickey.willpower;
//
//       // Elsa challenges Mickey
//       Await testEngine.challenge({
//         Attacker: elsa,
//         Defender: mickey,
//       });
//
//       // Mickey should have taken 1 less damage due to Resist +1
//       // (Elsa has 3 strength, Mickey should take 2 damage instead of 3)
//       Expect(mickey.willpower).toBe(initialMickeyWillpower - 2);
//     });
//
//     It("gives characters at the location Challenger +1 - deals +1 damage when challenging", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell:
//           CastleWyvernAboveTheClouds.moveCost +
//           MickeyMouseTrueFriend.cost +
//           ElsaQueenRegent.cost +
//           2,
//         Play: [castleWyvernAboveTheClouds],
//         Hand: [mickeyMouseTrueFriend, elsaQueenRegent],
//       });
//
//       // Play Mickey and move him to the location
//       Await testEngine.playCard(mickeyMouseTrueFriend);
//       Await testEngine.moveToLocation({
//         Location: castleWyvernAboveTheClouds,
//         Character: mickeyMouseTrueFriend,
//       });
//
//       // Play Elsa for Mickey to challenge
//       Await testEngine.playCard(elsaQueenRegent);
//
//       Const mickey = testEngine.getCardModel(mickeyMouseTrueFriend);
//       Const elsa = testEngine.getCardModel(elsaQueenRegent);
//
//       Const initialElsaWillpower = elsa.willpower;
//
//       // Mickey challenges Elsa - Mickey should get +1 strength from Challenger
//       Await testEngine.challenge({
//         Attacker: mickey,
//         Defender: elsa,
//       });
//
//       // Elsa should have taken 1 more damage due to Mickey's Challenger +1
//       // (Mickey has 2 strength + 1 from Challenger = 3 damage to Elsa)
//       Expect(elsa.willpower).toBe(initialElsaWillpower - 3);
//     });
//
//     It("gives both abilities to multiple characters at the location", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell:
//           CastleWyvernAboveTheClouds.moveCost * 2 +
//           MickeyMouseTrueFriend.cost +
//           ElsaQueenRegent.cost +
//           2,
//         Play: [castleWyvernAboveTheClouds],
//         Hand: [mickeyMouseTrueFriend, elsaQueenRegent],
//       });
//
//       // Play both characters and move them to the location
//       Await testEngine.playCard(mickeyMouseTrueFriend);
//       Await testEngine.playCard(elsaQueenRegent);
//
//       Await testEngine.moveToLocation({
//         Location: castleWyvernAboveTheClouds,
//         Character: mickeyMouseTrueFriend,
//       });
//       Await testEngine.moveToLocation({
//         Location: castleWyvernAboveTheClouds,
//         Character: elsaQueenRegent,
//       });
//
//       Const mickey = testEngine.getCardModel(mickeyMouseTrueFriend);
//       Const elsa = testEngine.getCardModel(elsaQueenRegent);
//
//       Const initialMickeyWillpower = mickey.willpower;
//       Const initialElsaWillpower = elsa.willpower;
//
//       // Test Mickey's abilities by having Elsa challenge him
//       Await testEngine.challenge({
//         Attacker: elsa,
//         Defender: mickey,
//       });
//
//       // Mickey should have taken reduced damage due to Resist +1
//       Expect(mickey.willpower).toBe(initialMickeyWillpower - 2);
//
//       // Test Elsa's abilities by having her challenge Mickey after he's damaged
//       Await testEngine.challenge({
//         Attacker: elsa,
//         Defender: mickey,
//       });
//
//       // Mickey should deal extra damage due to Challenger +1
//       // (Elsa had 3 willpower, took 2 from first challenge, should take 3 more from second challenge)
//       Expect(elsa.willpower).toBeLessThan(initialElsaWillpower - 4);
//     });
//
//     It("does not give abilities to characters not at the location", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: mickeyMouseTrueFriend.cost + elsaQueenRegent.cost + 2,
//         Play: [mickeyMouseTrueFriend, elsaQueenRegent],
//       });
//
//       Const mickey = testEngine.getCardModel(mickeyMouseTrueFriend);
//       Const elsa = testEngine.getCardModel(elsaQueenRegent);
//
//       Const initialElsaWillpower = elsa.willpower;
//
//       // Mickey challenges Elsa without being at the location
//       Await testEngine.challenge({
//         Attacker: mickey,
//         Defender: elsa,
//       });
//
//       // Elsa should take normal damage (Mickey's 2 strength) without Challenger bonus
//       Expect(elsa.willpower).toBe(initialElsaWillpower - 2);
//     });
//
//     It("abilities are removed when character leaves the location", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell:
//           CastleWyvernAboveTheClouds.moveCost +
//           MickeyMouseTrueFriend.cost +
//           ElsaQueenRegent.cost +
//           2,
//         Play: [castleWyvernAboveTheClouds],
//         Hand: [mickeyMouseTrueFriend, elsaQueenRegent],
//       });
//
//       // Play Mickey and move him to the location
//       Await testEngine.playCard(mickeyMouseTrueFriend);
//       Await testEngine.moveToLocation({
//         Location: castleWyvernAboveTheClouds,
//         Character: mickeyMouseTrueFriend,
//       });
//
//       // Play Elsa for Mickey to challenge
//       Await testEngine.playCard(elsaQueenRegent);
//
//       Const mickey = testEngine.getCardModel(mickeyMouseTrueFriend);
//       Const elsa = testEngine.getCardModel(elsaQueenRegent);
//
//       // First challenge with Mickey at the location (should have abilities)
//       Const initialElsaWillpower = elsa.willpower;
//       Await testEngine.challenge({
//         Attacker: mickey,
//         Defender: elsa,
//       });
//
//       // Elsa should have taken extra damage due to Mickey's Challenger +1
//       Expect(elsa.willpower).toBe(initialElsaWillpower - 3);
//
//       // Move Mickey away from the location (this will remove the location effect)
//       // Note: For now, we can't easily test this without implementing a move away from location
//       // The key tests above verify the core functionality works when characters are at the location
//     });
//   });
// });
//
