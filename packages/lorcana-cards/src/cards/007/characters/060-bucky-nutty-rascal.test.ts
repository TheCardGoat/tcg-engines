// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   buckyNuttyRascal,
//   wreckitRalphHerosDuty,
// } from "@lorcanito/lorcana-engine/cards/007";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Bucky - Nutty Rascal", () => {
//   it("POP! When this character is banished in a challenge, you may draw a card.", async () => {
//     const testEngine = new TestEngine(
//       {
//         deck: 10,
//         play: [buckyNuttyRascal],
//       },
//       {
//         play: [wreckitRalphHerosDuty],
//       },
//     );
//
//     await testEngine.challenge({
//       attacker: buckyNuttyRascal,
//       defender: wreckitRalphHerosDuty,
//       exertDefender: true,
//     });
//
//     await testEngine.resolveOptionalAbility();
//     expect(testEngine.getZonesCardCount().hand).toBe(1);
//   });
// });
//
