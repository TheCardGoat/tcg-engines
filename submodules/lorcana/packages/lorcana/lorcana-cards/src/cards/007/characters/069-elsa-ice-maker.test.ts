// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AnnaIceBreaker,
//   ElsaIceMaker,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Elsa - Ice Maker", () => {
//   It("Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Elsa.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [elsaIceMaker],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(elsaIceMaker);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   Describe("WINTER WALL Whenever this character quests, you may exert chosen character. If you do and you have a character named Anna in play, the chosen character can’t ready at the start of their next turn.", () => {
//     It("Anna is in play", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [elsaIceMaker, annaIceBreaker],
//         },
//         {
//           Play: [deweyLovableShowoff],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(elsaIceMaker);
//       Const target = testEngine.getCardModel(deweyLovableShowoff);
//
//       Await testEngine.questCard(cardUnderTest);
//
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [target] });
//
//       // Your turn
//       Expect(target.exerted).toBe(true);
//
//       // Opponent's turn
//       TestEngine.passTurn();
//       Expect(target.exerted).toBe(true);
//
//       // Your turn
//       TestEngine.passTurn();
//       Expect(target.exerted).toBe(true);
//
//       // Opponent's turn
//       TestEngine.passTurn();
//       Expect(target.exerted).toBe(false);
//     });
//
//     It("Anna is in NOT play", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [elsaIceMaker],
//         },
//         {
//           Play: [deweyLovableShowoff],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(elsaIceMaker);
//       Const target = testEngine.getCardModel(deweyLovableShowoff);
//
//       Await testEngine.questCard(cardUnderTest);
//
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [target] });
//
//       // Your turn
//       Expect(target.exerted).toBe(true);
//
//       // Opponent's turn
//       TestEngine.passTurn();
//       Expect(target.exerted).toBe(false);
//     });
//   });
// });
//
