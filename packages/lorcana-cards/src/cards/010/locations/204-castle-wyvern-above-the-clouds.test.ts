// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   elsaQueenRegent,
//   mickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { castleWyvernAboveTheClouds } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe.skip("Castle Wyvern - Above the Clouds", () => {
//   describe.skip("PROTECT THIS CASTLE", () => {
//     it("gives characters at the location Resist +1 - reduces damage taken by 1", async () => {
//       const testEngine = new TestEngine({
//         inkwell:
//           castleWyvernAboveTheClouds.moveCost +
//           mickeyMouseTrueFriend.cost +
//           elsaQueenRegent.cost +
//           2,
//         play: [castleWyvernAboveTheClouds],
//         hand: [mickeyMouseTrueFriend, elsaQueenRegent],
//       });
//
//       // Play Mickey and move him to the location
//       await testEngine.playCard(mickeyMouseTrueFriend);
//       await testEngine.moveToLocation({
//         location: castleWyvernAboveTheClouds,
//         character: mickeyMouseTrueFriend,
//       });
//
//       // Play Elsa to challenge Mickey
//       await testEngine.playCard(elsaQueenRegent);
//
//       const mickey = testEngine.getCardModel(mickeyMouseTrueFriend);
//       const elsa = testEngine.getCardModel(elsaQueenRegent);
//
//       const initialMickeyWillpower = mickey.willpower;
//
//       // Elsa challenges Mickey
//       await testEngine.challenge({
//         attacker: elsa,
//         defender: mickey,
//       });
//
//       // Mickey should have taken 1 less damage due to Resist +1
//       // (Elsa has 3 strength, Mickey should take 2 damage instead of 3)
//       expect(mickey.willpower).toBe(initialMickeyWillpower - 2);
//     });
//
//     it("gives characters at the location Challenger +1 - deals +1 damage when challenging", async () => {
//       const testEngine = new TestEngine({
//         inkwell:
//           castleWyvernAboveTheClouds.moveCost +
//           mickeyMouseTrueFriend.cost +
//           elsaQueenRegent.cost +
//           2,
//         play: [castleWyvernAboveTheClouds],
//         hand: [mickeyMouseTrueFriend, elsaQueenRegent],
//       });
//
//       // Play Mickey and move him to the location
//       await testEngine.playCard(mickeyMouseTrueFriend);
//       await testEngine.moveToLocation({
//         location: castleWyvernAboveTheClouds,
//         character: mickeyMouseTrueFriend,
//       });
//
//       // Play Elsa for Mickey to challenge
//       await testEngine.playCard(elsaQueenRegent);
//
//       const mickey = testEngine.getCardModel(mickeyMouseTrueFriend);
//       const elsa = testEngine.getCardModel(elsaQueenRegent);
//
//       const initialElsaWillpower = elsa.willpower;
//
//       // Mickey challenges Elsa - Mickey should get +1 strength from Challenger
//       await testEngine.challenge({
//         attacker: mickey,
//         defender: elsa,
//       });
//
//       // Elsa should have taken 1 more damage due to Mickey's Challenger +1
//       // (Mickey has 2 strength + 1 from Challenger = 3 damage to Elsa)
//       expect(elsa.willpower).toBe(initialElsaWillpower - 3);
//     });
//
//     it("gives both abilities to multiple characters at the location", async () => {
//       const testEngine = new TestEngine({
//         inkwell:
//           castleWyvernAboveTheClouds.moveCost * 2 +
//           mickeyMouseTrueFriend.cost +
//           elsaQueenRegent.cost +
//           2,
//         play: [castleWyvernAboveTheClouds],
//         hand: [mickeyMouseTrueFriend, elsaQueenRegent],
//       });
//
//       // Play both characters and move them to the location
//       await testEngine.playCard(mickeyMouseTrueFriend);
//       await testEngine.playCard(elsaQueenRegent);
//
//       await testEngine.moveToLocation({
//         location: castleWyvernAboveTheClouds,
//         character: mickeyMouseTrueFriend,
//       });
//       await testEngine.moveToLocation({
//         location: castleWyvernAboveTheClouds,
//         character: elsaQueenRegent,
//       });
//
//       const mickey = testEngine.getCardModel(mickeyMouseTrueFriend);
//       const elsa = testEngine.getCardModel(elsaQueenRegent);
//
//       const initialMickeyWillpower = mickey.willpower;
//       const initialElsaWillpower = elsa.willpower;
//
//       // Test Mickey's abilities by having Elsa challenge him
//       await testEngine.challenge({
//         attacker: elsa,
//         defender: mickey,
//       });
//
//       // Mickey should have taken reduced damage due to Resist +1
//       expect(mickey.willpower).toBe(initialMickeyWillpower - 2);
//
//       // Test Elsa's abilities by having her challenge Mickey after he's damaged
//       await testEngine.challenge({
//         attacker: elsa,
//         defender: mickey,
//       });
//
//       // Mickey should deal extra damage due to Challenger +1
//       // (Elsa had 3 willpower, took 2 from first challenge, should take 3 more from second challenge)
//       expect(elsa.willpower).toBeLessThan(initialElsaWillpower - 4);
//     });
//
//     it("does not give abilities to characters not at the location", async () => {
//       const testEngine = new TestEngine({
//         inkwell: mickeyMouseTrueFriend.cost + elsaQueenRegent.cost + 2,
//         play: [mickeyMouseTrueFriend, elsaQueenRegent],
//       });
//
//       const mickey = testEngine.getCardModel(mickeyMouseTrueFriend);
//       const elsa = testEngine.getCardModel(elsaQueenRegent);
//
//       const initialElsaWillpower = elsa.willpower;
//
//       // Mickey challenges Elsa without being at the location
//       await testEngine.challenge({
//         attacker: mickey,
//         defender: elsa,
//       });
//
//       // Elsa should take normal damage (Mickey's 2 strength) without Challenger bonus
//       expect(elsa.willpower).toBe(initialElsaWillpower - 2);
//     });
//
//     it("abilities are removed when character leaves the location", async () => {
//       const testEngine = new TestEngine({
//         inkwell:
//           castleWyvernAboveTheClouds.moveCost +
//           mickeyMouseTrueFriend.cost +
//           elsaQueenRegent.cost +
//           2,
//         play: [castleWyvernAboveTheClouds],
//         hand: [mickeyMouseTrueFriend, elsaQueenRegent],
//       });
//
//       // Play Mickey and move him to the location
//       await testEngine.playCard(mickeyMouseTrueFriend);
//       await testEngine.moveToLocation({
//         location: castleWyvernAboveTheClouds,
//         character: mickeyMouseTrueFriend,
//       });
//
//       // Play Elsa for Mickey to challenge
//       await testEngine.playCard(elsaQueenRegent);
//
//       const mickey = testEngine.getCardModel(mickeyMouseTrueFriend);
//       const elsa = testEngine.getCardModel(elsaQueenRegent);
//
//       // First challenge with Mickey at the location (should have abilities)
//       const initialElsaWillpower = elsa.willpower;
//       await testEngine.challenge({
//         attacker: mickey,
//         defender: elsa,
//       });
//
//       // Elsa should have taken extra damage due to Mickey's Challenger +1
//       expect(elsa.willpower).toBe(initialElsaWillpower - 3);
//
//       // Move Mickey away from the location (this will remove the location effect)
//       // Note: For now, we can't easily test this without implementing a move away from location
//       // The key tests above verify the core functionality works when characters are at the location
//     });
//   });
// });
//
