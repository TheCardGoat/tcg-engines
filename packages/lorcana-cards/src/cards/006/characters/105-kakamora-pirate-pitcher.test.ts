// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { kakamoraPiratePitcher } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Kakamora - Pirate Pitcher", () => {
//   it("DIZZYING SPEED When you play this character, chosen Pirate character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: kakamoraPiratePitcher.cost,
//       hand: [kakamoraPiratePitcher],
//       play: [mrSmeeBumblingMate],
//     });
//     const target = testEngine.getCardModel(mrSmeeBumblingMate);
//
//     await testEngine.playCard(kakamoraPiratePitcher, {
//       targets: [mrSmeeBumblingMate],
//     });
//     expect(target.hasEvasive);
//   });
//
//   it("Cannot target non-pirate character.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: kakamoraPiratePitcher.cost,
//       hand: [kakamoraPiratePitcher],
//       play: [tipoGrowingSon],
//     });
//
//     await testEngine.playCard(kakamoraPiratePitcher);
//     const target = testEngine.getCardModel(tipoGrowingSon);
//
//     await testEngine.resolveOptionalAbility();
//     expect(testEngine.stackLayers).toHaveLength(0);
//     expect(!target.hasEvasive);
//   });
// });
//
