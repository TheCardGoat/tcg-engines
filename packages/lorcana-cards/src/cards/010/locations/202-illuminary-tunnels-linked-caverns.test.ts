// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   castleWyvernAboveTheClouds,
//   illuminaryTunnelsLinkedCaverns,
//   theHeadlessHorsemanRelentlessSpirit,
//   zootopiaPoliceHeadquarters,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Illuminary Tunnels - Linked Caverns", () => {
//   it("SUBTERRANEAN NETWORK While you have a character here, this location gets +1 {L} for each other location you have in play.", async () => {
//     const testEngine = new TestEngine({
//       inkwell:
//         illuminaryTunnelsLinkedCaverns.moveCost +
//         castleWyvernAboveTheClouds.cost +
//         zootopiaPoliceHeadquarters.cost,
//       play: [
//         illuminaryTunnelsLinkedCaverns,
//         theHeadlessHorsemanRelentlessSpirit,
//       ],
//       hand: [castleWyvernAboveTheClouds, zootopiaPoliceHeadquarters],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(
//       illuminaryTunnelsLinkedCaverns,
//     );
//
//     expect(cardUnderTest.lore).toBe(1);
//
//     await testEngine.playCard(castleWyvernAboveTheClouds);
//
//     // Still no character at Illuminary Tunnels, so no boost
//     expect(cardUnderTest.lore).toBe(1);
//
//     await testEngine.moveToLocation({
//       location: illuminaryTunnelsLinkedCaverns,
//       character: theHeadlessHorsemanRelentlessSpirit,
//     });
//
//     expect(cardUnderTest.lore).toBe(2);
//
//     await testEngine.playCard(zootopiaPoliceHeadquarters);
//
//     expect(cardUnderTest.lore).toBe(3);
//   });
//
//   it("LOCUS While you have a character here, you pay 1 {I} less to play locations.", async () => {
//     const testEngine = new TestEngine({
//       inkwell:
//         illuminaryTunnelsLinkedCaverns.moveCost +
//         castleWyvernAboveTheClouds.cost +
//         zootopiaPoliceHeadquarters.cost,
//       play: [
//         illuminaryTunnelsLinkedCaverns,
//         theHeadlessHorsemanRelentlessSpirit,
//       ],
//       hand: [castleWyvernAboveTheClouds, zootopiaPoliceHeadquarters],
//     });
//
//     expect(testEngine.getCardModel(zootopiaPoliceHeadquarters).cost).toBe(
//       zootopiaPoliceHeadquarters.cost,
//     );
//     expect(testEngine.getCardModel(castleWyvernAboveTheClouds).cost).toBe(
//       castleWyvernAboveTheClouds.cost,
//     );
//
//     await testEngine.moveToLocation({
//       location: illuminaryTunnelsLinkedCaverns,
//       character: theHeadlessHorsemanRelentlessSpirit,
//     });
//
//     expect(testEngine.getCardModel(zootopiaPoliceHeadquarters).cost).toBe(
//       zootopiaPoliceHeadquarters.cost - 1,
//     );
//     expect(testEngine.getCardModel(castleWyvernAboveTheClouds).cost).toBe(
//       castleWyvernAboveTheClouds.cost - 1,
//     );
//   });
// });
//
