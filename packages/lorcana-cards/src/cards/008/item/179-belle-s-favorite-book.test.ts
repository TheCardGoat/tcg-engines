// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AtlanteanCrystal,
//   BellesFavoriteBook,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Belle's Favorite Book", () => {
//   It("CHAPTER THREE {E}, Banish one of your other items – Put the top card of your deck into your inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [bellesFavoriteBook, atlanteanCrystal],
//     });
//
//     Expect(testEngine.getZonesCardCount().inkwell).toBe(0);
//
//     Await testEngine.activateCard(bellesFavoriteBook, {
//       Costs: [atlanteanCrystal],
//     });
//
//     Expect(testEngine.getCardModel(bellesFavoriteBook).exerted).toBe(true);
//     Expect(testEngine.getZonesCardCount().inkwell).toBe(1);
//   });
// });
//
