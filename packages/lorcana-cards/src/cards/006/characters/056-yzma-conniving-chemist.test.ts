// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LiloGalacticHero,
//   MauiDemiGod,
//   StichtNewDog,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { madamMimFox } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { madamMimElephant } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { yzmaConnivingChemist } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Yzma - Conniving Chemist", () => {
//   It("**FEEL THE POWER** – _If you have fewer than 3 cards in your hand, draw until you have 3 cards in your hand._", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: yzmaConnivingChemist.cost,
//         Hand: [yzmaConnivingChemist],
//         Deck: [
//           LiloGalacticHero,
//           StichtNewDog,
//           MauiDemiGod,
//           MadamMimFox,
//           MadamMimElephant,
//         ],
//       },
//       { deck: 1 },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(yzmaConnivingChemist);
//     Await testEngine.playCard(cardUnderTest);
//
//     Expect(testEngine.getZonesCardCount().hand).toBe(0);
//
//     Await testEngine.passTurn();
//
//     Await testEngine.passTurn();
//     Await testEngine.activateCard(cardUnderTest);
//
//     Expect(testEngine.getZonesCardCount().hand).toBe(3);
//   });
// });
//
