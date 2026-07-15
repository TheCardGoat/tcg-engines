// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { herculesBabyDemigod } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Hercules - Baby Demigod", () => {
//   It.skip("Ward (Opponents can't choose this character except to challenge.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [herculesBabyDemigod],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(herculesBabyDemigod);
//     Expect(cardUnderTest.hasWard).toBe(true);
//   });
//
//   It.skip("STRONG LIKE HIS DAD 3 {I} - Deal 1 damage to chosen damaged character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: herculesBabyDemigod.cost,
//       Play: [herculesBabyDemigod],
//       Hand: [herculesBabyDemigod],
//     });
//
//     Await testEngine.playCard(herculesBabyDemigod);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
