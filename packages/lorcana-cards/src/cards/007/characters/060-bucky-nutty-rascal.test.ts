// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BuckyNuttyRascal,
//   WreckitRalphHerosDuty,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Bucky - Nutty Rascal", () => {
//   It("POP! When this character is banished in a challenge, you may draw a card.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Deck: 10,
//         Play: [buckyNuttyRascal],
//       },
//       {
//         Play: [wreckitRalphHerosDuty],
//       },
//     );
//
//     Await testEngine.challenge({
//       Attacker: buckyNuttyRascal,
//       Defender: wreckitRalphHerosDuty,
//       ExertDefender: true,
//     });
//
//     Await testEngine.resolveOptionalAbility();
//     Expect(testEngine.getZonesCardCount().hand).toBe(1);
//   });
// });
//
