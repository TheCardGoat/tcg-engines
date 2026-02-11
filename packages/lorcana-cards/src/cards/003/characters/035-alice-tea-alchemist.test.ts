// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MadamMimFox,
//   MerlinCrab,
//   MerlinGoat,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { aliceTeaAlchemist } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Alice - Tea Alchemist", () => {
//   It("**CURIOUSER AND CURIOUSER** {E} – Exert chosen opposing character and all other opposing characters with the same name.", () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: aliceTeaAlchemist.cost,
//         Play: [aliceTeaAlchemist],
//       },
//       {
//         Play: [merlinCrab, merlinGoat, madamMimFox],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(aliceTeaAlchemist);
//
//     TestEngine.activateCard(cardUnderTest);
//     TestEngine.resolveTopOfStack({ targets: [merlinCrab] });
//
//     Expect(testEngine.getCardModel(merlinCrab).exerted).toBe(true);
//     Expect(testEngine.getCardModel(merlinGoat).exerted).toBe(true);
//     Expect(testEngine.getCardModel(madamMimFox).exerted).toBe(false);
//   });
// });
//
