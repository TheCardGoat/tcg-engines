// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   JumbaJookibaCriticalScientist,
//   KhanWarHorse,
//   PouncingPractice,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Pouncing Practice", () => {
//   It("Chosen character gets -2 {S} this turn. Chosen character of yours gains Evasive this turn. (They can challenge characters with Evasive.)", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: pouncingPractice.cost,
//         Hand: [pouncingPractice],
//         Play: [jumbaJookibaCriticalScientist],
//       },
//       {
//         Play: [khanWarHorse],
//       },
//     );
//
//     Await testEngine.playCard(
//       PouncingPractice,
//       { targets: [khanWarHorse] },
//       True,
//     );
//     Expect(testEngine.getCardModel(khanWarHorse).strength).toBe(
//       KhanWarHorse.strength - 2,
//     );
//
//     Await testEngine.resolveTopOfStack({
//       Targets: [jumbaJookibaCriticalScientist],
//     });
//     Expect(
//       TestEngine.getCardModel(jumbaJookibaCriticalScientist).hasEvasive,
//     ).toBe(true);
//   });
// });
//
