// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { scroogeMcduckRichestDuckInTheWorld } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { luckyDime } from "@lorcanito/lorcana-engine/cards/003/items/items";
// import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Scrooge McDuck - Richest Duck in the World", () => {
//   it("**I DIDN'T GET RICH BY BEING STUPID** During your turn, whenever this character banishes another character in a challenge, you may play an item for free.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: scroogeMcduckRichestDuckInTheWorld.cost,
//         play: [scroogeMcduckRichestDuckInTheWorld],
//         hand: [luckyDime],
//       },
//       {
//         play: [tipoGrowingSon],
//       },
//     );
//
//     const scrooge = testEngine.getCardModel(scroogeMcduckRichestDuckInTheWorld);
//     const tipo = testEngine.getCardModel(tipoGrowingSon);
//     const dime = testEngine.getCardModel(luckyDime);
//
//     tipo.updateCardMeta({ exerted: true });
//     scrooge.challenge(tipo);
//     expect(testEngine.stackLayers).toHaveLength(1);
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({ targets: [dime] });
//
//     expect(testEngine.getZonesCardCount().hand).toEqual(0);
//     expect(testEngine.getCardZone(luckyDime)).toBe("play");
//   });
// });
//
