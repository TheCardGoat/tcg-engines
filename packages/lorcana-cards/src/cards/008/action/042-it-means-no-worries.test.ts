// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { simbaProtectiveCub } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { nalaFierceFriend } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { simbaAdventurousSuccessor } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { mufasaAmongTheStars } from "@lorcanito/lorcana-engine/cards/007";
// Import { itMeansNoWorries } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("It Means No Worries", () => {
//   It("Return up to 3 character cards from your discard to your hand.", async () => {
//     Const discardCards = [
//       SimbaAdventurousSuccessor,
//       NalaFierceFriend,
//       MufasaAmongTheStars,
//     ];
//     Const testEngine = new TestEngine({
//       Inkwell: itMeansNoWorries.cost,
//       Hand: [itMeansNoWorries],
//       Discard: discardCards,
//     });
//
//     Await testEngine.playCard(
//       ItMeansNoWorries,
//       {
//         Targets: discardCards,
//       },
//       True,
//     );
//
//     For (const card of discardCards) {
//       Expect(testEngine.getCardModel(card).zone).toEqual("hand");
//     }
//   });
//
//   It(" You pay 2 {I} less for the next character you play this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: itMeansNoWorries.cost,
//       Hand: [itMeansNoWorries, simbaProtectiveCub],
//     });
//
//     Expect(testEngine.getCardModel(simbaProtectiveCub).cost).toEqual(2);
//
//     Await testEngine.playCard(itMeansNoWorries);
//     Await testEngine.resolveTopOfStack({}, true);
//     Await testEngine.resolveTopOfStack({}, true);
//
//     Expect(testEngine.getCardModel(simbaProtectiveCub).cost).toEqual(0);
//   });
// });
//
