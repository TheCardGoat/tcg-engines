// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { aPiratesLife } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import {
//   PowerlineWorldsGreatestRockStar,
//   RapunzelSunshine,
//   StitchRockStar,
//   TheQueenRegalMonarch,
// } from "@lorcanito/lorcana-engine/cards/009";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Powerline - World's Greatest Rock Star", () => {
//   It("Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Powerline.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [powerlineWorldsGreatestRockStar],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       PowerlineWorldsGreatestRockStar,
//     );
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("Singer 9", async () => {
//     Const testEngine = new TestEngine({
//       Play: [powerlineWorldsGreatestRockStar],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       PowerlineWorldsGreatestRockStar,
//     );
//     Expect(cardUnderTest.hasSinger).toBe(true);
//   });
//
//   It("MASH-UP Once during your turn, whenever this character sings a song, look at the top 4 cards of your deck. You may reveal a song card with cost 9 or less and play it for free. Put the rest on the bottom of your deck in any order.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [powerlineWorldsGreatestRockStar],
//       Hand: [hakunaMatata],
//       Deck: [
//         APiratesLife,
//         StitchRockStar,
//         TheQueenRegalMonarch,
//         RapunzelSunshine,
//       ],
//     });
//
//     Await testEngine.singSong({
//       Singer: powerlineWorldsGreatestRockStar,
//       Song: hakunaMatata,
//     });
//
//     Await testEngine.resolveTopOfStack({
//       Scry: {
//         Play: [aPiratesLife],
//         Bottom: [stitchRockStar, theQueenRegalMonarch, rapunzelSunshine],
//       },
//     });
//
//     Expect(testEngine.getCardModel(aPiratesLife).zone).toEqual("discard");
//   });
// });
//
