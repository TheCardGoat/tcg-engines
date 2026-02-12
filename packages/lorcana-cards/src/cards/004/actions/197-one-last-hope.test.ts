// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { oneLastHope } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import {
//   FaZhouMulansFather,
//   GoofySuperGoof,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("One Last Hope", () => {
//   It("Chosen character gains **Resist** +2 until the start of your next turn. If a Hero character is chosen, they may also challenge ready characters this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: oneLastHope.cost,
//       Hand: [oneLastHope],
//       Play: [goofySuperGoof],
//     });
//
//     Const target = testEngine.getCardModel(goofySuperGoof);
//
//     Expect(target.hasResist).toBe(false);
//     Expect(target.canChallengeReadyCharacters).toBe(false);
//
//     Await testEngine.playCard(oneLastHope, { targets: [goofySuperGoof] });
//
//     Expect(target.hasResist).toBe(true);
//     Expect(target.canChallengeReadyCharacters).toBe(true);
//   });
//
//   It("Chosen character gains **Resist** +2 until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: oneLastHope.cost,
//       Hand: [oneLastHope],
//       Play: [faZhouMulansFather],
//     });
//
//     Const target = testEngine.getCardModel(faZhouMulansFather);
//
//     Expect(target.hasResist).toBe(false);
//     Expect(target.canChallengeReadyCharacters).toBe(false);
//
//     Await testEngine.playCard(oneLastHope, { targets: [target] });
//
//     Expect(target.hasResist).toBe(true);
//     Expect(target.canChallengeReadyCharacters).toBe(false);
//   });
// });
//
