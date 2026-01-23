// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   jumbaJookibaCriticalScientist,
//   khanWarHorse,
//   pouncingPractice,
// } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Pouncing Practice", () => {
//   it("Chosen character gets -2 {S} this turn. Chosen character of yours gains Evasive this turn. (They can challenge characters with Evasive.)", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: pouncingPractice.cost,
//         hand: [pouncingPractice],
//         play: [jumbaJookibaCriticalScientist],
//       },
//       {
//         play: [khanWarHorse],
//       },
//     );
//
//     await testEngine.playCard(
//       pouncingPractice,
//       { targets: [khanWarHorse] },
//       true,
//     );
//     expect(testEngine.getCardModel(khanWarHorse).strength).toBe(
//       khanWarHorse.strength - 2,
//     );
//
//     await testEngine.resolveTopOfStack({
//       targets: [jumbaJookibaCriticalScientist],
//     });
//     expect(
//       testEngine.getCardModel(jumbaJookibaCriticalScientist).hasEvasive,
//     ).toBe(true);
//   });
// });
//
