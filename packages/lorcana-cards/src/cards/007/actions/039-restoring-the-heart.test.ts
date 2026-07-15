// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { arielSpectacularSinger } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { theQueensCastleMirrorChamber } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { restoringTheHeart } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Restoring The Heart", () => {
//   It.skip("Draw a card", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: restoringTheHeart.cost,
//       Hand: [restoringTheHeart],
//       Deck: [tipoGrowingSon],
//     });
//
//     Await testEngine.playCard(restoringTheHeart);
//
//     Expect(testEngine.getZonesCardCount().hand).toEqual(1);
//   });
//
//   It("Remove up to 3 damage from chosen character", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: restoringTheHeart.cost,
//       Hand: [restoringTheHeart],
//       Deck: [arielSpectacularSinger],
//       Play: [tipoGrowingSon],
//     });
//
//     Const tipo = testEngine.getCardModel(tipoGrowingSon);
//
//     Tipo.updateCardDamage(2, "add");
//
//     Await testEngine.playCard(restoringTheHeart);
//
//     Expect(tipo.damage).toBe(0);
//   });
//
//   It("Remove up to 3 damage from chosen location", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: restoringTheHeart.cost,
//       Hand: [restoringTheHeart],
//       Deck: [arielSpectacularSinger],
//       Play: [theQueensCastleMirrorChamber],
//     });
//
//     Const location = testEngine.getCardModel(theQueensCastleMirrorChamber);
//
//     Location.updateCardDamage(3, "add");
//
//     Await testEngine.playCard(restoringTheHeart);
//     Await testEngine.resolveTopOfStack({ targets: [location] });
//
//     Expect(location.damage).toBe(0);
//   });
//
//   It.skip("No targets available should give you a card draw", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: restoringTheHeart.cost,
//       Hand: [restoringTheHeart],
//       Deck: 4,
//     });
//
//     Await testEngine.playCard(restoringTheHeart);
//
//     Expect(testEngine.getZonesCardCount().hand).toEqual(1);
//     Expect(testEngine.getZonesCardCount().deck).toEqual(3);
//   });
// });
//
