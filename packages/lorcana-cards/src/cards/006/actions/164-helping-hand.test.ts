// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { helpingHand } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Helping Hand", () => {
//   it("Chosen character gains Support this turn. Draw a card.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: helpingHand.cost,
//       play: [mickeyBraveLittleTailor],
//       hand: [helpingHand],
//     });
//
//     await testEngine.playCard(helpingHand);
//     await testEngine.resolveTopOfStack({ targets: [mickeyBraveLittleTailor] });
//
//     expect(testEngine.getZonesCardCount().hand).toBe(1);
//   });
// });
//
