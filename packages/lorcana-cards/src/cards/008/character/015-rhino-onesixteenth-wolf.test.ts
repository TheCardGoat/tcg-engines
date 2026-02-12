// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import type { CardModel } from "@lorcanito/lorcana-engine";
// Import {
//   LafayetteSleepyDachshund,
//   RhinoOnesixteenthWolf,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Rhino - One-Sixteenth Wolf", () => {
//   It("TINY HOWL When you play this character, chosen opposing character gets -1 {S} until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: rhinoOnesixteenthWolf.cost,
//         Hand: [rhinoOnesixteenthWolf],
//       },
//       {
//         Play: [lafayetteSleepyDachshund],
//       },
//     );
//
//     Const cardToTest = testEngine.getCardModel(rhinoOnesixteenthWolf);
//     Const targetCard: CardModel = testEngine.getCardModel(
//       LafayetteSleepyDachshund,
//     );
//
//     Await testEngine.playCard(cardToTest);
//     Await testEngine.resolveTopOfStack({ targets: [targetCard] });
//
//     Expect(targetCard.strength).toBe(lafayetteSleepyDachshund.strength - 1);
//
//     TestEngine.passTurn();
//
//     Expect(targetCard.strength).toBe(lafayetteSleepyDachshund.strength - 1);
//
//     TestEngine.passTurn();
//
//     Expect(targetCard.strength).toBe(lafayetteSleepyDachshund.strength);
//   });
// });
//
