// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LafayetteSleepyDachshund,
//   OlafRecappingTheStory,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Olaf - Recapping the Story", () => {
//   It("ENDLESS TALE When you play this character, chosen opposing character gets -1 {S} this turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: olafRecappingTheStory.cost,
//         Hand: [olafRecappingTheStory],
//       },
//       {
//         Play: [lafayetteSleepyDachshund],
//       },
//     );
//
//     Const lafayette = testEngine.getCardModel(lafayetteSleepyDachshund);
//
//     Await testEngine.playCard(olafRecappingTheStory);
//     Await testEngine.resolveTopOfStack({ targets: [lafayette] });
//
//     Expect(lafayette.strength).toBe(lafayetteSleepyDachshund.strength - 1);
//     TestEngine.passTurn();
//     Expect(lafayette.strength).toBe(lafayetteSleepyDachshund.strength);
//   });
// });
//
