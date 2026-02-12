// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   TheQueenCommandingPresence,
//   TheQueenRegalMonarch,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { yokaiScientificSupervillain } from "@lorcanito/lorcana-engine/cards/006";
// Import { yokaiIntellectualSchemer } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("INNOVATE You pay 1{I} less to play characters using their Shift ability.", () => {
//   It("should reduce shift cost", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 10,
//       Play: [yokaiIntellectualSchemer],
//       Hand: [yokaiScientificSupervillain],
//     });
//
//     Const { shifter } = await testEngine.shiftCard({
//       Shifted: yokaiIntellectualSchemer,
//       Shifter: yokaiScientificSupervillain,
//     });
//
//     Expect(shifter.zone).toEqual("play");
//     Expect(
//       TestEngine.store.continuousEffectStore.continuousEffects,
//     ).toHaveLength(0);
//
//     Expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(5);
//   });
//
//   It("should not reduce cost", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 10,
//       Play: [yokaiIntellectualSchemer],
//       Hand: [yokaiScientificSupervillain],
//     });
//
//     Await testEngine.playCard(yokaiScientificSupervillain);
//
//     Expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(1);
//   });
//
//   It("should not reduce shift cost for opponent", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [yokaiIntellectualSchemer],
//       },
//       {
//         Inkwell: 1,
//         Play: [theQueenRegalMonarch],
//         Hand: [theQueenCommandingPresence],
//         Deck: 2,
//       },
//     );
//
//     Await testEngine.passTurn();
//
//     Const { shifter } = await testEngine.shiftCard({
//       Shifted: theQueenRegalMonarch,
//       Shifter: theQueenCommandingPresence,
//     });
//
//     Expect(shifter.zone).toEqual("hand");
//     Expect(
//       TestEngine.store.continuousEffectStore.continuousEffects,
//     ).toHaveLength(0);
//
//     Expect(testEngine.getAvailableInkwellCardCount("player_two")).toBe(1);
//   });
// });
//
