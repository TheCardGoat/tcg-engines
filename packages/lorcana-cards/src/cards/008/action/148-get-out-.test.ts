// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { shieldOfVirtue } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { getOut } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Get Out!", () => {
//   It("Banish chosen character, then return an item card from your discard to your hand.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: getOut.cost,
//         Hand: [getOut],
//         Discard: [shieldOfVirtue],
//       },
//       {
//         Play: [mickeyBraveLittleTailor],
//       },
//     );
//
//     Await testEngine.playCard(
//       GetOut,
//       {
//         Targets: [mickeyBraveLittleTailor],
//       },
//       True, // skipAssertion
//     );
//
//     // Second effect: return item from discard to hand
//     Await testEngine.resolveTopOfStack({
//       Targets: [shieldOfVirtue],
//     });
//
//     Expect(testEngine.getZonesCardCount().hand).toBe(1); // Shield of Virtue returned to hand
//     Expect(testEngine.getZonesCardCount().discard).toBe(1); // Mickey Mouse banished to discard (Get Out! goes elsewhere?)
//   });
// });
//
