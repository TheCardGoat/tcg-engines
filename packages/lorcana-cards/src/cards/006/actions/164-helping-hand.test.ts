// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { helpingHand } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Helping Hand", () => {
//   It("Chosen character gains Support this turn. Draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: helpingHand.cost,
//       Play: [mickeyBraveLittleTailor],
//       Hand: [helpingHand],
//     });
//
//     Await testEngine.playCard(helpingHand);
//     Await testEngine.resolveTopOfStack({ targets: [mickeyBraveLittleTailor] });
//
//     Expect(testEngine.getZonesCardCount().hand).toBe(1);
//   });
// });
//
