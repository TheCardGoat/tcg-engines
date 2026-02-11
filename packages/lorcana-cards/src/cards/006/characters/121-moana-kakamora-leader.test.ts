// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   FlotillaCoconutArmada,
//   KakamoraBoardingParty,
//   KakamoraLongrangeSpecialist,
//   KakamoraPiratePitcher,
//   MoanaKakamoraLeader,
// } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Moana - Kakamora Leader", () => {
//   It("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Moana.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [moanaKakamoraLeader],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(moanaKakamoraLeader);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("GATHERING FORCES When you play this character, you may move any number of your characters to the same location for free. Gain 1 lore for each character you moved.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: moanaKakamoraLeader.cost,
//       Hand: [moanaKakamoraLeader],
//       Play: [
//         KakamoraLongrangeSpecialist,
//         KakamoraPiratePitcher,
//         KakamoraBoardingParty,
//         FlotillaCoconutArmada,
//       ],
//     });
//
//     Await testEngine.playCard(moanaKakamoraLeader);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack(
//       {
//         Targets: [
//           KakamoraLongrangeSpecialist,
//           KakamoraPiratePitcher,
//           KakamoraBoardingParty,
//           MoanaKakamoraLeader,
//         ],
//       },
//       True,
//     );
//     Await testEngine.resolveTopOfStack({ targets: [flotillaCoconutArmada] });
//
//     Expect(
//       TestEngine.getCardModel(flotillaCoconutArmada).charactersAtLocation,
//     ).toHaveLength(4);
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(4);
//   });
// });
//
