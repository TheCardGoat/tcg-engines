// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { tamatoaSoShiny } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { cogsworthMajordomo } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Cogsworth - Majordomo", () => {
//   It("AS YOU WERE! Whenever this character quests, you may give chosen character -2 {S} until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [cogsworthMajordomo],
//         Deck: 10,
//       },
//       {
//         Play: [tamatoaSoShiny],
//         Deck: 10,
//       },
//     );
//
//     Expect(testEngine.getCardModel(tamatoaSoShiny).strength).toBe(
//       TamatoaSoShiny.strength,
//     );
//
//     Await testEngine.questCard(cogsworthMajordomo);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack(
//       {
//         Targets: [tamatoaSoShiny],
//       },
//       True,
//     );
//
//     Expect(testEngine.getCardModel(tamatoaSoShiny).strength).toBe(
//       TamatoaSoShiny.strength - 2,
//     );
//
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getCardModel(tamatoaSoShiny).strength).toBe(
//       TamatoaSoShiny.strength - 2,
//     );
//
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getCardModel(tamatoaSoShiny).strength).toBe(
//       TamatoaSoShiny.strength,
//     );
//   });
// });
//
