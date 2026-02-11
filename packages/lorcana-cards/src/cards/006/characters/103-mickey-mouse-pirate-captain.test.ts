// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AbuBoldHelmsman,
//   KakamoraBoardingParty,
//   MickeyMousePirateCaptain,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mickey Mouse - Pirate Captain", () => {
//   It("Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Mickey Mouse.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [mickeyMousePirateCaptain],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mickeyMousePirateCaptain);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("MARINER’S MIGHT Whenever this character quests, chosen Pirate character gets +2 {S} and gains 'This character takes no damage from challenges' this turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [mickeyMousePirateCaptain, kakamoraBoardingParty],
//       },
//       {
//         Play: [abuBoldHelmsman],
//       },
//     );
//
//     Await testEngine.tapCard(abuBoldHelmsman);
//
//     Await testEngine.questCard(mickeyMousePirateCaptain, {
//       Targets: [kakamoraBoardingParty],
//     });
//
//     Const { attacker } = await testEngine.challenge({
//       Attacker: kakamoraBoardingParty,
//       Defender: abuBoldHelmsman,
//     });
//
//     Expect(attacker.strength).toEqual(kakamoraBoardingParty.strength + 2);
//     Expect(attacker.damage).toEqual(0);
//     Expect(attacker.zone).toEqual("play");
//   });
// });
//
