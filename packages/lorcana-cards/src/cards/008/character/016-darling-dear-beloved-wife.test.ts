// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CharlotteLaBouffMardiGrasPrincess,
//   DarlingDearBelovedWife,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Darling Dear - Beloved Wife", () => {
//   It("HOW SWEET When you play this character, chosen character gets +2 {L} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: darlingDearBelovedWife.cost,
//       Hand: [darlingDearBelovedWife],
//       Play: [charlotteLaBouffMardiGrasPrincess],
//     });
//
//     Const cardToTest = testEngine.getCardModel(darlingDearBelovedWife);
//     Const targetCard = testEngine.getCardModel(
//       CharlotteLaBouffMardiGrasPrincess,
//     );
//
//     Await testEngine.playCard(cardToTest);
//     Await testEngine.resolveTopOfStack({ targets: [targetCard] });
//
//     Expect(targetCard.lore).toBe(targetCard.strength + 2);
//   });
// });
//
