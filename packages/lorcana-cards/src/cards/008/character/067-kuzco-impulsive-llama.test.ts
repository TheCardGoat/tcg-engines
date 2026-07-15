// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DeweyLovableShowoff,
//   KuzcoImpulsiveLlama,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Kuzco - Impulsive Llama", () => {
//   It("Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Kuzco.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [kuzcoImpulsiveLlama],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(kuzcoImpulsiveLlama);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("WHAT DOES THIS DO? When you play this character, each opponent chooses one of their characters and puts that card on the bottom of their deck. Then, each opponent may draw a card.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: kuzcoImpulsiveLlama.cost,
//         Hand: [kuzcoImpulsiveLlama],
//       },
//       {
//         Play: [deweyLovableShowoff],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(kuzcoImpulsiveLlama);
//     Const target = testEngine.getCardModel(deweyLovableShowoff);
//     Expect(testEngine.getCardsByZone("hand", "player_two").length).toEqual(0);
//
//     Await testEngine.playCard(cardUnderTest);
//
//     Await testEngine.changeActivePlayer("player_two");
//
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//     // await testEngine.acceptOptionalLayer();
//
//     Expect(testEngine.getCardsByZone("hand", "player_two").length).toEqual(1);
//   });
// });
//
