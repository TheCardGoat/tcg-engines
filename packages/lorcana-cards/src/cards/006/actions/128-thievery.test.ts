// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { thievery } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe.skip("Thievery", () => {
//   It("Chosen opponent loses 1 lore. Gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 10,
//       Play: [mickeyBraveLittleTailor],
//       Hand: [thievery],
//     });
//
//     Await testEngine.playCard(thievery);
//     Await testEngine.resolveTopOfStack({ targets: [mickeyBraveLittleTailor] });
//
//     Expect(testEngine.getPlayerLore("opponent")).toBe(0);
//     Expect(testEngine.getPlayerLore()).toBe(1);
//   });
// });
//
