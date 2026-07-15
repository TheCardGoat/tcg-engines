// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { submitToMyWill } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Submit to My Will", () => {
//   It("Each opponent discards all cards in their hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 10,
//       Play: [mickeyBraveLittleTailor],
//       Hand: [submitToMyWill],
//     });
//
//     Await testEngine.playCard(submitToMyWill);
//
//     Expect(testEngine.getZonesCardCount("opponent").hand).toBe(0);
//   });
// });
//
