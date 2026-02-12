// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { herculesBabyDemigod } from "@lorcanito/lorcana-engine/cards/006";
// Import { pennyTheOrphanCleverChild } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Penny The Orphan - Clever Child", () => {
//   It("OUR BOTTLE WORKED! While you have a Hero character in play, this character gains Ward. (Opponents can't choose them except to challenge.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: herculesBabyDemigod.cost,
//       Play: [pennyTheOrphanCleverChild],
//       Hand: [herculesBabyDemigod],
//     });
//
//     Expect(testEngine.getCardModel(pennyTheOrphanCleverChild).hasWard).toBe(
//       False,
//     );
//     Await testEngine.playCard(herculesBabyDemigod);
//     Expect(testEngine.getCardModel(herculesBabyDemigod).zone).toBe("play");
//     Expect(testEngine.getCardModel(pennyTheOrphanCleverChild).hasWard).toBe(
//       True,
//     );
//   });
// });
//
