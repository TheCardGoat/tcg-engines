// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DeweyLovableShowoff,
//   KhanWarHorse,
//   TheCoachmanGreedyDeceiver,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Coachman - Greedy Deceiver", () => {
//   It("RECKLESS RUN While you have 2 or more characters exerted, this character gets +2 {S} and Evasive.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [theCoachmanGreedyDeceiver, deweyLovableShowoff, khanWarHorse],
//     });
//
//     Await testEngine.tapCard(deweyLovableShowoff);
//
//     Expect(
//       TestEngine.getCardModel(theCoachmanGreedyDeceiver).hasEvasive,
//     ).toEqual(false);
//     Expect(testEngine.getCardModel(theCoachmanGreedyDeceiver).strength).toEqual(
//       TheCoachmanGreedyDeceiver.strength,
//     );
//
//     Await testEngine.tapCard(khanWarHorse);
//
//     Expect(
//       TestEngine.getCardModel(theCoachmanGreedyDeceiver).hasEvasive,
//     ).toEqual(true);
//     Expect(testEngine.getCardModel(theCoachmanGreedyDeceiver).strength).toEqual(
//       TheCoachmanGreedyDeceiver.strength + 2,
//     );
//   });
// });
//
