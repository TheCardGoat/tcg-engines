// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { gastonArrogantHunter } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { bellesHouseMauricesWorkshop } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Belle's House - Maurice's Workshop", () => {
//   It("**LABORATORY** If you have a character here, you pay 1 {I} less to play items.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: bellesHouseMauricesWorkshop.moveCost,
//       Play: [bellesHouseMauricesWorkshop, gastonArrogantHunter],
//       Hand: [pawpsicle],
//     });
//
//     Const character = testEngine.getCardModel(gastonArrogantHunter);
//     Const location = testEngine.getCardModel(bellesHouseMauricesWorkshop);
//     Const item = testEngine.getCardModel(pawpsicle);
//     Await testEngine.moveToLocation({ location, character });
//
//     Expect(item.cost).toBe(pawpsicle.cost - 1);
//   });
// });
//
