// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AladdinStreetRat,
//   ElsaQueenRegent,
//   MickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   CinderellaBallroomSensation,
//   GoofyKnightForADay,
//   RapunzelGiftedArtist,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { daisyDuckDonaldsDate } from "@lorcanito/lorcana-engine/cards/005/characters/016-daisy-duck-donalds-date";
// Import { cantHoldItBackAnymore } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Can't Hold It Back Anymore", () => {
//   It("exerts chosen opposing character and moves all damage counters from all other characters to that character", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: cantHoldItBackAnymore.cost,
//         Hand: [cantHoldItBackAnymore],
//         Play: [goofyKnightForADay, mickeyMouseTrueFriend],
//       },
//       {
//         Play: [daisyDuckDonaldsDate],
//       },
//     );
//
//     // Add damage to multiple characters
//     Await testEngine.setCardDamage(goofyKnightForADay, 1);
//     Await testEngine.setCardDamage(mickeyMouseTrueFriend, 2);
//
//     // Play the action and target the opponent's character
//     Await testEngine.playCard(cantHoldItBackAnymore, {
//       Targets: [daisyDuckDonaldsDate],
//     });
//
//     // Opponent's character should be exerted
//     Expect(testEngine.getCardModel(daisyDuckDonaldsDate).ready).toBe(false);
//     // All damage from own character should be moved to opponent's character
//     Expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(0);
//     Expect(testEngine.getCardModel(mickeyMouseTrueFriend).damage).toBe(0);
//     Expect(testEngine.getCardModel(daisyDuckDonaldsDate).damage).toBe(3); // 2 + 1 = 3
//   });
//
//   It("moves damage from multiple characters to the target", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: cantHoldItBackAnymore.cost,
//         Hand: [cantHoldItBackAnymore],
//         Play: [rapunzelGiftedArtist, cinderellaBallroomSensation],
//       },
//       {
//         Play: [elsaQueenRegent, aladdinStreetRat],
//       },
//     );
//
//     // Add damage to all characters (keeping below willpower to avoid banishing)
//     Await testEngine.setCardDamage(rapunzelGiftedArtist, 1); // Rapunzel has 6 willpower
//     Await testEngine.setCardDamage(cinderellaBallroomSensation, 1); // Cinderella has 2 willpower
//     Await testEngine.setCardDamage(elsaQueenRegent, 2); // Elsa has 4 willpower
//     Await testEngine.setCardDamage(aladdinStreetRat, 1); // Aladdin has 2 willpower
//
//     Expect(testEngine.getCardModel(rapunzelGiftedArtist).damage).toBe(1);
//     Expect(testEngine.getCardModel(cinderellaBallroomSensation).damage).toBe(1);
//     Expect(testEngine.getCardModel(elsaQueenRegent).damage).toBe(2);
//     Expect(testEngine.getCardModel(aladdinStreetRat).damage).toBe(1);
//
//     // Play the action targeting Elsa (skipAssertion because Rapunzel's ability will trigger)
//     Await testEngine.playCard(
//       CantHoldItBackAnymore,
//       {
//         Targets: [elsaQueenRegent],
//       },
//       True, // skipAssertion - Rapunzel's heal ability will create an optional layer
//     );
//
//     // Skip Rapunzel's optional "Let Your Power Shine" ability (triggered by damage removal)
//     Await testEngine.skipTopOfStack();
//
//     // Target should be exerted and have all damage moved to it
//     Expect(testEngine.getCardModel(rapunzelGiftedArtist).damage).toBe(0);
//     Expect(testEngine.getCardModel(cinderellaBallroomSensation).damage).toBe(0);
//     // Elsa keeps its original 2 damage + receives 1+1+1 from other characters = 5 total
//     Expect(testEngine.getCardModel(aladdinStreetRat).damage).toBe(0); // Moved to Elsa
//
//     Expect(testEngine.getCardModel(elsaQueenRegent).isBanished).toBe(true);
//   });
//
//   It("works when no other characters have damage", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: cantHoldItBackAnymore.cost,
//         Hand: [cantHoldItBackAnymore],
//       },
//       {
//         Play: [mickeyMouseTrueFriend],
//       },
//     );
//
//     Expect(testEngine.getCardModel(mickeyMouseTrueFriend).damage).toBe(0);
//     Expect(testEngine.getCardModel(mickeyMouseTrueFriend).ready).toBe(true);
//
//     // Play the action
//     Await testEngine.playCard(cantHoldItBackAnymore, {
//       Targets: [mickeyMouseTrueFriend],
//     });
//
//     // Character should still be exerted even with no damage to move
//     Expect(testEngine.getCardModel(mickeyMouseTrueFriend).ready).toBe(false);
//     Expect(testEngine.getCardModel(mickeyMouseTrueFriend).damage).toBe(0);
//   });
//
//   It("triggers Aurora's Sweet Dreams ability when moving damage counters", async () => {
//     Const { auroraWakingBeauty } = await import(
//       "@lorcanito/lorcana-engine/cards/007"
//     );
//
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: cantHoldItBackAnymore.cost,
//         Hand: [cantHoldItBackAnymore],
//         Play: [auroraWakingBeauty, goofyKnightForADay],
//       },
//       {
//         Play: [mickeyMouseTrueFriend],
//       },
//     );
//
//     // Quest with Aurora to exert her
//     Await testEngine.questCard(auroraWakingBeauty);
//
//     // Add damage to Goofy
//     Await testEngine.setCardDamage(goofyKnightForADay, 2);
//
//     Const auroraModel = testEngine.getCardModel(auroraWakingBeauty);
//     Const goofyModel = testEngine.getCardModel(goofyKnightForADay);
//     Const mickeyModel = testEngine.getCardModel(mickeyMouseTrueFriend);
//
//     // Verify Aurora is exerted and Goofy has damage
//     Expect(auroraModel.ready).toBe(false);
//     Expect(goofyModel.damage).toBe(2);
//
//     // Play Can't Hold It Back Anymore targeting opponent's Mickey
//     Await testEngine.playCard(cantHoldItBackAnymore, {
//       Targets: [mickeyMouseTrueFriend],
//     });
//
//     // Verify damage was moved from Goofy to Mickey
//     Expect(goofyModel.damage).toBe(0);
//     Expect(mickeyModel.damage).toBe(2);
//
//     // Aurora should be readied by Sweet Dreams ability (triggered by removing damage from Goofy)
//     Expect(auroraModel.ready).toBe(true);
//     Expect(auroraModel.hasQuestRestriction).toBe(true);
//     Expect(auroraModel.hasChallengeRestriction).toBe(true);
//   });
// });
//
