// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { submitToMyWill } from "@lorcanito/lorcana-engine/cards/006";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Submit to My Will", () => {
//   it("Each opponent discards all cards in their hand.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 10,
//       play: [mickeyBraveLittleTailor],
//       hand: [submitToMyWill],
//     });
//
//     await testEngine.playCard(submitToMyWill);
//
//     expect(testEngine.getZonesCardCount("opponent").hand).toBe(0);
//   });
// });
//
