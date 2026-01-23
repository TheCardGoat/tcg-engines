// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import {
//   generalLiHeadOfTheImperialArmy,
//   jumbaJookibaCriticalScientist,
//   khanWarHorse,
//   lightTheFuse,
// } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Light The Fuse", () => {
//   it("Deal 1 damage to chosen character for each exerted character you have in play.", async () => {
//     const exertedChars = [
//       khanWarHorse,
//       generalLiHeadOfTheImperialArmy,
//       jumbaJookibaCriticalScientist,
//     ];
//
//     const testEngine = new TestEngine(
//       {
//         inkwell: lightTheFuse.cost,
//         hand: [lightTheFuse],
//         play: exertedChars,
//       },
//       {
//         play: [goofyKnightForADay],
//       },
//     );
//
//     for (const exertedChar of exertedChars) {
//       await testEngine.tapCard(exertedChar);
//     }
//
//     await testEngine.playCard(lightTheFuse, { targets: [goofyKnightForADay] });
//
//     expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(
//       exertedChars.length,
//     );
//   });
// });
//
