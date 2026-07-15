// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DeweyLovableShowoff,
//   RapunzelHighClimber,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Rapunzel - High Climber", () => {
//   It.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [rapunzelHighClimber],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(rapunzelHighClimber);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It("WRAPPED UP Whenever this character quests, chosen opposing character can't quest during their next turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: rapunzelHighClimber.cost,
//         Play: [rapunzelHighClimber],
//       },
//       {
//         Play: [deweyLovableShowoff],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(rapunzelHighClimber);
//     Const target = testEngine.getCardModel(deweyLovableShowoff);
//
//     Await testEngine.questCard(cardUnderTest);
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     TestEngine.passTurn();
//     Expect(target.canQuest).toBe(false);
//   });
// });
//
