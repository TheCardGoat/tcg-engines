// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { shieldOfVirtue } from "@lorcanito/lorcana-engine/cards/001/items/items";
// import { getOut } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Get Out!", () => {
//   it("Banish chosen character, then return an item card from your discard to your hand.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: getOut.cost,
//         hand: [getOut],
//         discard: [shieldOfVirtue],
//       },
//       {
//         play: [mickeyBraveLittleTailor],
//       },
//     );
//
//     await testEngine.playCard(
//       getOut,
//       {
//         targets: [mickeyBraveLittleTailor],
//       },
//       true, // skipAssertion
//     );
//
//     // Second effect: return item from discard to hand
//     await testEngine.resolveTopOfStack({
//       targets: [shieldOfVirtue],
//     });
//
//     expect(testEngine.getZonesCardCount().hand).toBe(1); // Shield of Virtue returned to hand
//     expect(testEngine.getZonesCardCount().discard).toBe(1); // Mickey Mouse banished to discard (Get Out! goes elsewhere?)
//   });
// });
//
