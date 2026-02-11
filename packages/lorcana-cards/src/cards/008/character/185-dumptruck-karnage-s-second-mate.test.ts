// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DonKarnageAirPirateLeader,
//   DumptruckKarnagesSecondMate,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Dumptruck - Karnage's Second Mate", () => {
//   It("LET ME AT 'EM When you play this character, you may deal 1 damage to chosen character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: dumptruckKarnagesSecondMate.cost,
//       Hand: [dumptruckKarnagesSecondMate],
//       Play: [donKarnageAirPirateLeader],
//     });
//
//     Await testEngine.playCard(dumptruckKarnagesSecondMate);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({
//       Targets: [donKarnageAirPirateLeader],
//     });
//     Expect(testEngine.getCardModel(donKarnageAirPirateLeader).damage).toEqual(
//       1,
//     );
//   });
// });
//
