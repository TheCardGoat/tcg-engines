// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   GeneralLiHeadOfTheImperialArmy,
//   JumbaJookibaCriticalScientist,
//   KhanWarHorse,
//   LightTheFuse,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Light The Fuse", () => {
//   It("Deal 1 damage to chosen character for each exerted character you have in play.", async () => {
//     Const exertedChars = [
//       KhanWarHorse,
//       GeneralLiHeadOfTheImperialArmy,
//       JumbaJookibaCriticalScientist,
//     ];
//
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: lightTheFuse.cost,
//         Hand: [lightTheFuse],
//         Play: exertedChars,
//       },
//       {
//         Play: [goofyKnightForADay],
//       },
//     );
//
//     For (const exertedChar of exertedChars) {
//       Await testEngine.tapCard(exertedChar);
//     }
//
//     Await testEngine.playCard(lightTheFuse, { targets: [goofyKnightForADay] });
//
//     Expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(
//       ExertedChars.length,
//     );
//   });
// });
//
