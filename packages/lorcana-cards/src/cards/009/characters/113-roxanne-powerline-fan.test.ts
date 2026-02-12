// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   PowerlineWorldsGreatestRockStar,
//   RoxannePowerlineFan,
// } from "@lorcanito/lorcana-engine/cards/009";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Roxanne - Powerline Fan", () => {
//   It("CONCERT LOVER While you have a character with Singer in play, this character gets +1 {S} and +1 {L}.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: powerlineWorldsGreatestRockStar.cost,
//       Play: [roxannePowerlineFan],
//       Hand: [powerlineWorldsGreatestRockStar],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(roxannePowerlineFan);
//     Expect(cardUnderTest.strength).toBe(roxannePowerlineFan.strength);
//     Expect(cardUnderTest.lore).toBe(roxannePowerlineFan.lore);
//
//     Await testEngine.playCard(powerlineWorldsGreatestRockStar);
//
//     Expect(cardUnderTest.strength).toBe(roxannePowerlineFan.strength + 1);
//     Expect(cardUnderTest.lore).toBe(roxannePowerlineFan.lore + 1);
//   });
// });
//
