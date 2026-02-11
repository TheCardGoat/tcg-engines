// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { scroogeMcduckRichestDuckInTheWorld } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { luckyDime } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Scrooge McDuck - Richest Duck in the World", () => {
//   It("**I DIDN'T GET RICH BY BEING STUPID** During your turn, whenever this character banishes another character in a challenge, you may play an item for free.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: scroogeMcduckRichestDuckInTheWorld.cost,
//         Play: [scroogeMcduckRichestDuckInTheWorld],
//         Hand: [luckyDime],
//       },
//       {
//         Play: [tipoGrowingSon],
//       },
//     );
//
//     Const scrooge = testEngine.getCardModel(scroogeMcduckRichestDuckInTheWorld);
//     Const tipo = testEngine.getCardModel(tipoGrowingSon);
//     Const dime = testEngine.getCardModel(luckyDime);
//
//     Tipo.updateCardMeta({ exerted: true });
//     Scrooge.challenge(tipo);
//     Expect(testEngine.stackLayers).toHaveLength(1);
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [dime] });
//
//     Expect(testEngine.getZonesCardCount().hand).toEqual(0);
//     Expect(testEngine.getCardZone(luckyDime)).toBe("play");
//   });
// });
//
