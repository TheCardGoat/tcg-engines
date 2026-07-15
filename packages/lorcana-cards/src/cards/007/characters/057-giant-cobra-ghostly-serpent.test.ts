// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it, test } from "@jest/globals";
// Import { magicBroomIlluminaryKeeper } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import {
//   DuchessElegantFeline,
//   GiantCobraGhostlySerpent,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Giant Cobra - Ghostly Serpent", () => {
//   It("Vanish (When an opponent chooses this character for an action, banish them.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [giantCobraGhostlySerpent],
//     });
//
//     Expect(testEngine.getCardModel(giantCobraGhostlySerpent).hasVanish).toBe(
//       True,
//     );
//   });
//
//   It("MYSTERIOUS ADVANTAGE When you play this character, you may choose and discard a card to gain 2 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: giantCobraGhostlySerpent.cost,
//       Hand: [giantCobraGhostlySerpent, duchessElegantFeline],
//     });
//
//     Await testEngine.playCard(giantCobraGhostlySerpent);
//
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [duchessElegantFeline] });
//
//     Expect(testEngine.getCardModel(duchessElegantFeline).zone).toEqual(
//       "discard",
//     );
//     Expect(testEngine.getLoreForPlayer()).toBe(2);
//   });
// });
//
// Describe("Regression", () => {
//   Test("Giant Cobra + Broom Interaction", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: giantCobraGhostlySerpent.cost,
//       Hand: [giantCobraGhostlySerpent],
//       Play: [magicBroomIlluminaryKeeper],
//       Deck: [duchessElegantFeline],
//     });
//
//     Await testEngine.playCard(giantCobraGhostlySerpent);
//
//     Await testEngine.acceptOptionalLayerBySource({
//       Source: magicBroomIlluminaryKeeper,
//     });
//     Expect(testEngine.getCardModel(magicBroomIlluminaryKeeper).zone).toEqual(
//       "discard",
//     );
//
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [duchessElegantFeline] });
//
//     Expect(testEngine.getLoreForPlayer()).toBe(2);
//     Expect(testEngine.getCardModel(duchessElegantFeline).zone).toEqual(
//       "discard",
//     );
//   });
// });
//
