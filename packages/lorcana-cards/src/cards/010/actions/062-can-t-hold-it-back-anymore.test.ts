// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   aladdinStreetRat,
//   elsaQueenRegent,
//   mickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import {
//   cinderellaBallroomSensation,
//   goofyKnightForADay,
//   rapunzelGiftedArtist,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { daisyDuckDonaldsDate } from "@lorcanito/lorcana-engine/cards/005/characters/016-daisy-duck-donalds-date";
// import { cantHoldItBackAnymore } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Can't Hold It Back Anymore", () => {
//   it("exerts chosen opposing character and moves all damage counters from all other characters to that character", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: cantHoldItBackAnymore.cost,
//         hand: [cantHoldItBackAnymore],
//         play: [goofyKnightForADay, mickeyMouseTrueFriend],
//       },
//       {
//         play: [daisyDuckDonaldsDate],
//       },
//     );
//
//     // Add damage to multiple characters
//     await testEngine.setCardDamage(goofyKnightForADay, 1);
//     await testEngine.setCardDamage(mickeyMouseTrueFriend, 2);
//
//     // Play the action and target the opponent's character
//     await testEngine.playCard(cantHoldItBackAnymore, {
//       targets: [daisyDuckDonaldsDate],
//     });
//
//     // Opponent's character should be exerted
//     expect(testEngine.getCardModel(daisyDuckDonaldsDate).ready).toBe(false);
//     // All damage from own character should be moved to opponent's character
//     expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(0);
//     expect(testEngine.getCardModel(mickeyMouseTrueFriend).damage).toBe(0);
//     expect(testEngine.getCardModel(daisyDuckDonaldsDate).damage).toBe(3); // 2 + 1 = 3
//   });
//
//   it("moves damage from multiple characters to the target", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: cantHoldItBackAnymore.cost,
//         hand: [cantHoldItBackAnymore],
//         play: [rapunzelGiftedArtist, cinderellaBallroomSensation],
//       },
//       {
//         play: [elsaQueenRegent, aladdinStreetRat],
//       },
//     );
//
//     // Add damage to all characters (keeping below willpower to avoid banishing)
//     await testEngine.setCardDamage(rapunzelGiftedArtist, 1); // Rapunzel has 6 willpower
//     await testEngine.setCardDamage(cinderellaBallroomSensation, 1); // Cinderella has 2 willpower
//     await testEngine.setCardDamage(elsaQueenRegent, 2); // Elsa has 4 willpower
//     await testEngine.setCardDamage(aladdinStreetRat, 1); // Aladdin has 2 willpower
//
//     expect(testEngine.getCardModel(rapunzelGiftedArtist).damage).toBe(1);
//     expect(testEngine.getCardModel(cinderellaBallroomSensation).damage).toBe(1);
//     expect(testEngine.getCardModel(elsaQueenRegent).damage).toBe(2);
//     expect(testEngine.getCardModel(aladdinStreetRat).damage).toBe(1);
//
//     // Play the action targeting Elsa (skipAssertion because Rapunzel's ability will trigger)
//     await testEngine.playCard(
//       cantHoldItBackAnymore,
//       {
//         targets: [elsaQueenRegent],
//       },
//       true, // skipAssertion - Rapunzel's heal ability will create an optional layer
//     );
//
//     // Skip Rapunzel's optional "Let Your Power Shine" ability (triggered by damage removal)
//     await testEngine.skipTopOfStack();
//
//     // Target should be exerted and have all damage moved to it
//     expect(testEngine.getCardModel(rapunzelGiftedArtist).damage).toBe(0);
//     expect(testEngine.getCardModel(cinderellaBallroomSensation).damage).toBe(0);
//     // Elsa keeps its original 2 damage + receives 1+1+1 from other characters = 5 total
//     expect(testEngine.getCardModel(aladdinStreetRat).damage).toBe(0); // Moved to Elsa
//
//     expect(testEngine.getCardModel(elsaQueenRegent).isBanished).toBe(true);
//   });
//
//   it("works when no other characters have damage", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: cantHoldItBackAnymore.cost,
//         hand: [cantHoldItBackAnymore],
//       },
//       {
//         play: [mickeyMouseTrueFriend],
//       },
//     );
//
//     expect(testEngine.getCardModel(mickeyMouseTrueFriend).damage).toBe(0);
//     expect(testEngine.getCardModel(mickeyMouseTrueFriend).ready).toBe(true);
//
//     // Play the action
//     await testEngine.playCard(cantHoldItBackAnymore, {
//       targets: [mickeyMouseTrueFriend],
//     });
//
//     // Character should still be exerted even with no damage to move
//     expect(testEngine.getCardModel(mickeyMouseTrueFriend).ready).toBe(false);
//     expect(testEngine.getCardModel(mickeyMouseTrueFriend).damage).toBe(0);
//   });
//
//   it("triggers Aurora's Sweet Dreams ability when moving damage counters", async () => {
//     const { auroraWakingBeauty } = await import(
//       "@lorcanito/lorcana-engine/cards/007"
//     );
//
//     const testEngine = new TestEngine(
//       {
//         inkwell: cantHoldItBackAnymore.cost,
//         hand: [cantHoldItBackAnymore],
//         play: [auroraWakingBeauty, goofyKnightForADay],
//       },
//       {
//         play: [mickeyMouseTrueFriend],
//       },
//     );
//
//     // Quest with Aurora to exert her
//     await testEngine.questCard(auroraWakingBeauty);
//
//     // Add damage to Goofy
//     await testEngine.setCardDamage(goofyKnightForADay, 2);
//
//     const auroraModel = testEngine.getCardModel(auroraWakingBeauty);
//     const goofyModel = testEngine.getCardModel(goofyKnightForADay);
//     const mickeyModel = testEngine.getCardModel(mickeyMouseTrueFriend);
//
//     // Verify Aurora is exerted and Goofy has damage
//     expect(auroraModel.ready).toBe(false);
//     expect(goofyModel.damage).toBe(2);
//
//     // Play Can't Hold It Back Anymore targeting opponent's Mickey
//     await testEngine.playCard(cantHoldItBackAnymore, {
//       targets: [mickeyMouseTrueFriend],
//     });
//
//     // Verify damage was moved from Goofy to Mickey
//     expect(goofyModel.damage).toBe(0);
//     expect(mickeyModel.damage).toBe(2);
//
//     // Aurora should be readied by Sweet Dreams ability (triggered by removing damage from Goofy)
//     expect(auroraModel.ready).toBe(true);
//     expect(auroraModel.hasQuestRestriction).toBe(true);
//     expect(auroraModel.hasChallengeRestriction).toBe(true);
//   });
// });
//
