// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BelleApprenticeInventor,
//   SpaghettiDinner,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Belle - Apprentice Inventor", () => {
//   It("WHAT A MESS During your turn, you may banish chosen item of yours to play this character for free.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 0,
//       Play: [spaghettiDinner],
//       Hand: [belleApprenticeInventor],
//     });
//
//     Await testEngine.playCard(belleApprenticeInventor, {
//       AlternativeCosts: [spaghettiDinner],
//     });
//
//     Expect(testEngine.getCardModel(spaghettiDinner).zone).toBe("discard");
//     Expect(testEngine.getCardModel(belleApprenticeInventor).zone).toBe("play");
//   });
// });
//
