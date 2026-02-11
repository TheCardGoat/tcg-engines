// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CastleWyvernAboveTheClouds,
//   IlluminaryTunnelsLinkedCaverns,
//   TheHeadlessHorsemanRelentlessSpirit,
//   ZootopiaPoliceHeadquarters,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Illuminary Tunnels - Linked Caverns", () => {
//   It("SUBTERRANEAN NETWORK While you have a character here, this location gets +1 {L} for each other location you have in play.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell:
//         IlluminaryTunnelsLinkedCaverns.moveCost +
//         CastleWyvernAboveTheClouds.cost +
//         ZootopiaPoliceHeadquarters.cost,
//       Play: [
//         IlluminaryTunnelsLinkedCaverns,
//         TheHeadlessHorsemanRelentlessSpirit,
//       ],
//       Hand: [castleWyvernAboveTheClouds, zootopiaPoliceHeadquarters],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       IlluminaryTunnelsLinkedCaverns,
//     );
//
//     Expect(cardUnderTest.lore).toBe(1);
//
//     Await testEngine.playCard(castleWyvernAboveTheClouds);
//
//     // Still no character at Illuminary Tunnels, so no boost
//     Expect(cardUnderTest.lore).toBe(1);
//
//     Await testEngine.moveToLocation({
//       Location: illuminaryTunnelsLinkedCaverns,
//       Character: theHeadlessHorsemanRelentlessSpirit,
//     });
//
//     Expect(cardUnderTest.lore).toBe(2);
//
//     Await testEngine.playCard(zootopiaPoliceHeadquarters);
//
//     Expect(cardUnderTest.lore).toBe(3);
//   });
//
//   It("LOCUS While you have a character here, you pay 1 {I} less to play locations.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell:
//         IlluminaryTunnelsLinkedCaverns.moveCost +
//         CastleWyvernAboveTheClouds.cost +
//         ZootopiaPoliceHeadquarters.cost,
//       Play: [
//         IlluminaryTunnelsLinkedCaverns,
//         TheHeadlessHorsemanRelentlessSpirit,
//       ],
//       Hand: [castleWyvernAboveTheClouds, zootopiaPoliceHeadquarters],
//     });
//
//     Expect(testEngine.getCardModel(zootopiaPoliceHeadquarters).cost).toBe(
//       ZootopiaPoliceHeadquarters.cost,
//     );
//     Expect(testEngine.getCardModel(castleWyvernAboveTheClouds).cost).toBe(
//       CastleWyvernAboveTheClouds.cost,
//     );
//
//     Await testEngine.moveToLocation({
//       Location: illuminaryTunnelsLinkedCaverns,
//       Character: theHeadlessHorsemanRelentlessSpirit,
//     });
//
//     Expect(testEngine.getCardModel(zootopiaPoliceHeadquarters).cost).toBe(
//       ZootopiaPoliceHeadquarters.cost - 1,
//     );
//     Expect(testEngine.getCardModel(castleWyvernAboveTheClouds).cost).toBe(
//       CastleWyvernAboveTheClouds.cost - 1,
//     );
//   });
// });
//
