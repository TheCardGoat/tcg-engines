// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   generalLiHeadOfTheImperialArmy,
//   mickeyMouseGiantMouse,
//   motherGothelKnowsWhatsBest,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mother Gothel - Knows What's Best", () => {
//   it("LOOK WHAT YOU'VE DONE When you play this character, you may deal 2 damage to another chosen character of yours to give that character Challenger +1 and “When this character is banished in a challenge, return this card to your hand” this turn. (They get +1 {S} while challenging.)", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: motherGothelKnowsWhatsBest.cost,
//         hand: [motherGothelKnowsWhatsBest],
//         play: [generalLiHeadOfTheImperialArmy],
//       },
//       {
//         play: [mickeyMouseGiantMouse],
//       },
//     );
//
//     await testEngine.playCard(
//       motherGothelKnowsWhatsBest,
//       {
//         targets: [generalLiHeadOfTheImperialArmy],
//         acceptOptionalLayer: true,
//       },
//       true,
//     );
//
//     // Check mickey has the Challenger
//     const generalLi = testEngine.getCardModel(generalLiHeadOfTheImperialArmy);
//     // expect(generalLi.hasChallenger).toBe(true);
//
//     // Verify 1 damage on general Li (it has resist 1)
//     expect(generalLi.damage).toBe(1);
//
//     // General Li challenges mickey
//     await testEngine.challenge({
//       attacker: generalLiHeadOfTheImperialArmy,
//       defender: mickeyMouseGiantMouse,
//       exertDefender: true,
//     });
//
//     // Verify that General Li is returned to hand
//     expect(testEngine.getCardModel(generalLiHeadOfTheImperialArmy).zone).toBe(
//       "hand",
//     );
//
//     // Verify 3 damage on mickey (2 damage and challenger +1)
//     expect(testEngine.getCardModel(mickeyMouseGiantMouse).damage).toBe(3);
//   });
// });
//
