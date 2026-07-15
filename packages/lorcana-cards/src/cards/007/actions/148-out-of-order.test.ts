// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { arielSpectacularSinger } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { outOfOrder } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Out Of Order", () => {
//   It("Banish chosen character", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: outOfOrder.cost,
//       Hand: [outOfOrder],
//       Play: [arielSpectacularSinger],
//     });
//
//     Await testEngine.playCard(outOfOrder, {
//       Targets: [arielSpectacularSinger],
//     });
//
//     Expect(testEngine.getCardModel(arielSpectacularSinger).zone).toBe(
//       "discard",
//     );
//   });
// });
//
