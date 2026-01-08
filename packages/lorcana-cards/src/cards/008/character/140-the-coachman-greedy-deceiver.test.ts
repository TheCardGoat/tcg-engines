// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   deweyLovableShowoff,
//   khanWarHorse,
//   theCoachmanGreedyDeceiver,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("The Coachman - Greedy Deceiver", () => {
//   it("RECKLESS RUN While you have 2 or more characters exerted, this character gets +2 {S} and Evasive.", async () => {
//     const testEngine = new TestEngine({
//       play: [theCoachmanGreedyDeceiver, deweyLovableShowoff, khanWarHorse],
//     });
//
//     await testEngine.tapCard(deweyLovableShowoff);
//
//     expect(
//       testEngine.getCardModel(theCoachmanGreedyDeceiver).hasEvasive,
//     ).toEqual(false);
//     expect(testEngine.getCardModel(theCoachmanGreedyDeceiver).strength).toEqual(
//       theCoachmanGreedyDeceiver.strength,
//     );
//
//     await testEngine.tapCard(khanWarHorse);
//
//     expect(
//       testEngine.getCardModel(theCoachmanGreedyDeceiver).hasEvasive,
//     ).toEqual(true);
//     expect(testEngine.getCardModel(theCoachmanGreedyDeceiver).strength).toEqual(
//       theCoachmanGreedyDeceiver.strength + 2,
//     );
//   });
// });
//
