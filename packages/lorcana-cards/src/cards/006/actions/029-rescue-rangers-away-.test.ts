// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArielOnHumanLegs,
//   LiloMakingAWish,
//   MauiDemiGod,
//   StichtNewDog,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { rescueRangersAway } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Rescue Rangers Away!", () => {
//   It("Count the number of characters you have in play. Chosen character loses {S} equal to that number until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: rescueRangersAway.cost,
//       Hand: [rescueRangersAway],
//       Play: [liloMakingAWish, stichtNewDog, arielOnHumanLegs, mauiDemiGod],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(rescueRangersAway);
//     Const target = testEngine.getCardModel(mauiDemiGod);
//
//     Await testEngine.playCard(cardUnderTest);
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.strength).toBe(mauiDemiGod.strength - 4);
//   });
//   It("Count the number of characters you have in play. Chosen character loses {S} equal to that number until the start of your next turn. (zero case)", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: rescueRangersAway.cost,
//         Hand: [rescueRangersAway],
//       },
//       {
//         Play: [liloMakingAWish, stichtNewDog, arielOnHumanLegs, mauiDemiGod],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(rescueRangersAway);
//     Const target = testEngine.getCardModel(mauiDemiGod);
//
//     Await testEngine.playCard(cardUnderTest);
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.strength).toBe(mauiDemiGod.strength);
//   });
// });
//
