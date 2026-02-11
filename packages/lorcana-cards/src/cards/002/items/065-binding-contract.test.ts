// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GrandDukeAdvisorToTheKing,
//   PigletVerySmallAnimal,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { bindingContract } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Binding Contract", () => {
//   It("**FOR ALL ETERNITY** {E}, {E} one of your characters − Exert chosen character.", () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [bindingContract, grandDukeAdvisorToTheKing],
//       },
//       {
//         Play: [pigletVerySmallAnimal],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(bindingContract);
//     Const cardToPayCost = testEngine.getCardModel(grandDukeAdvisorToTheKing);
//     Const target = testEngine.getCardModel(pigletVerySmallAnimal);
//
//     Expect(target.ready).toEqual(true);
//     Expect(cardToPayCost.ready).toEqual(true);
//
//     TestEngine.activateCard(cardUnderTest, {
//       Ability: "For All Eternity",
//       Costs: [cardToPayCost],
//     });
//     TestEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.ready).toEqual(false);
//     Expect(cardToPayCost.ready).toEqual(false);
//   });
// });
//
