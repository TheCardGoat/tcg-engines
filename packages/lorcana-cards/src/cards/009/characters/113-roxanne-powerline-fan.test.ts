// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   powerlineWorldsGreatestRockStar,
//   roxannePowerlineFan,
// } from "@lorcanito/lorcana-engine/cards/009";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Roxanne - Powerline Fan", () => {
//   it("CONCERT LOVER While you have a character with Singer in play, this character gets +1 {S} and +1 {L}.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: powerlineWorldsGreatestRockStar.cost,
//       play: [roxannePowerlineFan],
//       hand: [powerlineWorldsGreatestRockStar],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(roxannePowerlineFan);
//     expect(cardUnderTest.strength).toBe(roxannePowerlineFan.strength);
//     expect(cardUnderTest.lore).toBe(roxannePowerlineFan.lore);
//
//     await testEngine.playCard(powerlineWorldsGreatestRockStar);
//
//     expect(cardUnderTest.strength).toBe(roxannePowerlineFan.strength + 1);
//     expect(cardUnderTest.lore).toBe(roxannePowerlineFan.lore + 1);
//   });
// });
//
