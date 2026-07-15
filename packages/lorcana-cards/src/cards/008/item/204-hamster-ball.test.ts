// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HamsterBall,
//   JumbaJookibaCriticalScientist,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Hamster Ball", () => {
//   It("ROLL WITH THE PUNCHES {E}, 1 {I} – Chosen character with no damage gains Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 1,
//       Play: [hamsterBall, jumbaJookibaCriticalScientist],
//     });
//
//     Await testEngine.activateCard(hamsterBall, {
//       Targets: [jumbaJookibaCriticalScientist],
//     });
//
//     Expect(
//       TestEngine.getCardModel(jumbaJookibaCriticalScientist).hasResist,
//     ).toBe(true);
//   });
// });
//
