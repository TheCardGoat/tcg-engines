// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   KenaiProtectiveBrother,
//   WreckitRalphHerosDuty,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Kenai - Protective Brother", () => {
//   It("HE NEEDS ME At the end of your turn, if this character is exerted, you may ready another chosen character of yours and remove all damage from them.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [kenaiProtectiveBrother, wreckitRalphHerosDuty],
//       },
//       {
//         Deck: 7,
//       },
//     );
//
//     Await testEngine.setCardDamage(
//       WreckitRalphHerosDuty,
//       WreckitRalphHerosDuty.willpower - 1,
//     );
//     Await testEngine.tapCard(wreckitRalphHerosDuty);
//     Await testEngine.tapCard(kenaiProtectiveBrother);
//
//     Await testEngine.passTurn();
//     TestEngine.changeActivePlayer("player_one");
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({
//       Targets: [wreckitRalphHerosDuty],
//     });
//
//     Const cardModel = testEngine.getCardModel(wreckitRalphHerosDuty);
//     Expect(cardModel.damage).toBe(0);
//     Expect(cardModel.exerted).toBe(false);
//   });
// });
//
