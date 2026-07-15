// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { bernardBrandNewAgent } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import {
//   MissBiancaIndefectibleAgent,
//   OrvilleAlbatrossAir,
// } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Orville - Albatross Air", () => {
//   It("Should not have Evasive when no Miss Bianca or Bernard in play", async () => {
//     Const testEngine = new TestEngine({
//       Play: [orvilleAlbatrossAir],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(orvilleAlbatrossAir);
//     Expect(cardUnderTest.hasEvasive).toBe(false);
//   });
//
//   It("Should gain Evasive during your turn when Miss Bianca is in play", async () => {
//     Const testEngine = new TestEngine({
//       Play: [orvilleAlbatrossAir, missBiancaIndefectibleAgent],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(orvilleAlbatrossAir);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//
//     // Test that it doesn't have Evasive during opponent's turn
//     Await testEngine.passTurn();
//     Expect(cardUnderTest.hasEvasive).toBe(false);
//
//     // Back to player's turn
//     Await testEngine.passTurn();
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It("Should gain Evasive during your turn when Bernard is in play", async () => {
//     Const testEngine = new TestEngine({
//       Play: [orvilleAlbatrossAir, bernardBrandNewAgent],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(orvilleAlbatrossAir);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//
//     // Test that it doesn't have Evasive during opponent's turn
//     Await testEngine.passTurn();
//     Expect(cardUnderTest.hasEvasive).toBe(false);
//
//     // Back to player's turn
//     Await testEngine.passTurn();
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
