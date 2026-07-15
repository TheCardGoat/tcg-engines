// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liShangNewlyPromoted } from "@lorcanito/lorcana-engine/cards/007/characters/characters";
// Import { mulanChargingAhead } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mulan - Charging Ahead", () => {
//   It("Reckless (This character can’t quest and must challenge each turn if able.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [mulanChargingAhead],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mulanChargingAhead);
//     Expect(cardUnderTest.hasReckless).toBe(true);
//   });
//
//   It("BURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [mulanChargingAhead],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mulanChargingAhead);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//
//     Await testEngine.passTurn();
//
//     Expect(cardUnderTest.hasEvasive).toBe(false);
//   });
//
//   It("LONG RANGE This character can challenge ready characters.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [mulanChargingAhead],
//       },
//       {
//         Play: [liShangNewlyPromoted],
//       },
//     );
//
//     Expect(
//       TestEngine.getCardModel(mulanChargingAhead).canChallengeReadyCharacters,
//     ).toBe(true);
//   });
// });
//
