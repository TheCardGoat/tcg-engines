// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { kakamoraPiratePitcher } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Kakamora - Pirate Pitcher", () => {
//   It("DIZZYING SPEED When you play this character, chosen Pirate character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: kakamoraPiratePitcher.cost,
//       Hand: [kakamoraPiratePitcher],
//       Play: [mrSmeeBumblingMate],
//     });
//     Const target = testEngine.getCardModel(mrSmeeBumblingMate);
//
//     Await testEngine.playCard(kakamoraPiratePitcher, {
//       Targets: [mrSmeeBumblingMate],
//     });
//     Expect(target.hasEvasive);
//   });
//
//   It("Cannot target non-pirate character.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: kakamoraPiratePitcher.cost,
//       Hand: [kakamoraPiratePitcher],
//       Play: [tipoGrowingSon],
//     });
//
//     Await testEngine.playCard(kakamoraPiratePitcher);
//     Const target = testEngine.getCardModel(tipoGrowingSon);
//
//     Await testEngine.resolveOptionalAbility();
//     Expect(testEngine.stackLayers).toHaveLength(0);
//     Expect(!target.hasEvasive);
//   });
// });
//
