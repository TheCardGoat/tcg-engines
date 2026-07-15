// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MauiDemiGod,
//   StichtNewDog,
//   TamatoaSoShiny,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { rayaFierceProtector } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Raya - Fierce Protector", () => {
//   It("**DON'T CROSS ME** Whenever this character challenges another character, gain 1 lore for each other damaged character you have in play.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: rayaFierceProtector.cost,
//         Play: [rayaFierceProtector, stichtNewDog, mauiDemiGod],
//       },
//       {
//         Play: [tamatoaSoShiny],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(rayaFierceProtector);
//     Const damagedCharacters = [
//       TestEngine.getCardModel(stichtNewDog),
//       TestEngine.getCardModel(mauiDemiGod),
//     ];
//     Const defender = testEngine.getCardModel(tamatoaSoShiny);
//     Await testEngine.tapCard(defender);
//
//     DamagedCharacters.forEach((card) => {
//       Card.updateCardDamage(1, "add");
//     });
//     Await testEngine.challenge({ attacker: cardUnderTest, defender });
//
//     Expect(testEngine.getLoreForPlayer()).toBe(2);
//   });
// });
//
