// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { energyBlast } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Energy Blast", () => {
//   It("Banish chosen character. Draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 10,
//       Play: [mickeyBraveLittleTailor],
//       Hand: [energyBlast],
//     });
//
//     Await testEngine.playCard(energyBlast);
//     Await testEngine.resolveTopOfStack({ targets: [mickeyBraveLittleTailor] });
//
//     Expect(testEngine.getCardModel(mickeyBraveLittleTailor).zone).toBe(
//       "discard",
//     );
//     Expect(testEngine.getZonesCardCount().hand).toBe(1);
//   });
// });
//
