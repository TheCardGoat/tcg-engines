// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   KingCandySugarRushNightmare,
//   LouieOneCoolDuck,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Louie - One Cool Duck", () => {
//   It("SPRING THE TRAP While this character is being challenged, the challenging character gets -1 {S}.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [kingCandySugarRushNightmare],
//       },
//       {
//         Play: [louieOneCoolDuck],
//       },
//     );
//
//     Await testEngine.challenge({
//       Attacker: kingCandySugarRushNightmare,
//       Defender: louieOneCoolDuck,
//       ExertDefender: true,
//     });
//
//     Expect(testEngine.getCardModel(louieOneCoolDuck).damage).toBe(
//       KingCandySugarRushNightmare.strength - 1,
//     );
//   });
// });
//
