// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   lafayetteSleepyDachshund,
//   olafRecappingTheStory,
// } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Olaf - Recapping the Story", () => {
//   it("ENDLESS TALE When you play this character, chosen opposing character gets -1 {S} this turn.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: olafRecappingTheStory.cost,
//         hand: [olafRecappingTheStory],
//       },
//       {
//         play: [lafayetteSleepyDachshund],
//       },
//     );
//
//     const lafayette = testEngine.getCardModel(lafayetteSleepyDachshund);
//
//     await testEngine.playCard(olafRecappingTheStory);
//     await testEngine.resolveTopOfStack({ targets: [lafayette] });
//
//     expect(lafayette.strength).toBe(lafayetteSleepyDachshund.strength - 1);
//     testEngine.passTurn();
//     expect(lafayette.strength).toBe(lafayetteSleepyDachshund.strength);
//   });
// });
//
