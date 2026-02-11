// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GeneralLiHeadOfTheImperialArmy,
//   MickeyMouseGiantMouse,
//   MotherGothelKnowsWhatsBest,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mother Gothel - Knows What's Best", () => {
//   It("LOOK WHAT YOU'VE DONE When you play this character, you may deal 2 damage to another chosen character of yours to give that character Challenger +1 and “When this character is banished in a challenge, return this card to your hand” this turn. (They get +1 {S} while challenging.)", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: motherGothelKnowsWhatsBest.cost,
//         Hand: [motherGothelKnowsWhatsBest],
//         Play: [generalLiHeadOfTheImperialArmy],
//       },
//       {
//         Play: [mickeyMouseGiantMouse],
//       },
//     );
//
//     Await testEngine.playCard(
//       MotherGothelKnowsWhatsBest,
//       {
//         Targets: [generalLiHeadOfTheImperialArmy],
//         AcceptOptionalLayer: true,
//       },
//       True,
//     );
//
//     // Check mickey has the Challenger
//     Const generalLi = testEngine.getCardModel(generalLiHeadOfTheImperialArmy);
//     // expect(generalLi.hasChallenger).toBe(true);
//
//     // Verify 1 damage on general Li (it has resist 1)
//     Expect(generalLi.damage).toBe(1);
//
//     // General Li challenges mickey
//     Await testEngine.challenge({
//       Attacker: generalLiHeadOfTheImperialArmy,
//       Defender: mickeyMouseGiantMouse,
//       ExertDefender: true,
//     });
//
//     // Verify that General Li is returned to hand
//     Expect(testEngine.getCardModel(generalLiHeadOfTheImperialArmy).zone).toBe(
//       "hand",
//     );
//
//     // Verify 3 damage on mickey (2 damage and challenger +1)
//     Expect(testEngine.getCardModel(mickeyMouseGiantMouse).damage).toBe(3);
//   });
// });
//
