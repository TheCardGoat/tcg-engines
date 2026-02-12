// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyDaredevil } from "@lorcanito/lorcana-engine/cards/001/characters/111-goofy-daredevil";
// Import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/027-hakuna-matata";
// Import {
//   I2i,
//   MaxGoofRockinTeen,
//   PowerlineWorldsGreatestRockStar,
//   RapunzelSunshine,
//   RoxannePowerlineFan,
//   StitchRockStar,
//   TheQueenRegalMonarch,
// } from "@lorcanito/lorcana-engine/cards/009";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("I2I", () => {
//   It("Sing Together 9 (Any number of your or your teammates’ characters with total cost 9 or more may {E} to sing this song for free.)", async () => {
//     Const testEngine = new TestEngine({
//       Hand: [i2i],
//     });
//
//     Expect(testEngine.getCardModel(i2i).hasSingTogether).toBe(true);
//   });
//
//   It("Each player draws 2 cards and gains 2 lore. If 2 or more characters sang this song, ready them. They can’t quest for the rest of this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: i2i.cost,
//       Hand: [i2i],
//     });
//
//     Await testEngine.playCard(i2i);
//
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
//     Expect(testEngine.getLoreForPlayer("player_two")).toBe(2);
//
//     Expect(testEngine.getCardsByZone("hand", "player_one")).toHaveLength(2);
//     Expect(testEngine.getCardsByZone("hand", "player_two")).toHaveLength(2);
//   });
//
//   It("If 2 or more characters sang this song, ready them. They can’t quest for the rest of this turn.", async () => {
//     Const singers = [roxannePowerlineFan, maxGoofRockinTeen, goofyDaredevil];
//     Const testEngine = new TestEngine({
//       Hand: [i2i],
//       Play: singers,
//     });
//
//     Await testEngine.singSongTogether({
//       Song: i2i,
//       Singers: singers,
//     });
//
//     Expect(testEngine.getCardModel(i2i).zone).toBe("discard");
//
//     For (const singer of singers) {
//       Const cardModel = testEngine.getCardModel(singer);
//       Expect(cardModel.zone).toBe("play");
//       Expect(cardModel.ready).toBe(true);
//       Expect(cardModel.canQuest).toBe(false);
//     }
//   });
//
//   Describe("Regression tests", () => {
//     It("Doesn't trigger if only one character sings.", async () => {
//       Const singers = [powerlineWorldsGreatestRockStar];
//       Const testEngine = new TestEngine({
//         Deck: [
//           StitchRockStar,
//           HakunaMatata,
//           TheQueenRegalMonarch,
//           RapunzelSunshine,
//         ],
//         Hand: [i2i],
//         Play: singers,
//       });
//
//       Await testEngine.singSong({
//         Singer: powerlineWorldsGreatestRockStar,
//         Song: i2i,
//       });
//
//       Expect(testEngine.getCardModel(i2i).zone).toBe("discard");
//
//       For (const singer of singers) {
//         Const cardModel = testEngine.getCardModel(singer);
//         Expect(cardModel.zone).toBe("play");
//         Expect(cardModel.hasQuestRestriction).toBe(false);
//         Expect(cardModel.ready).toBe(false);
//       }
//     });
//
//     It.skip("Doesn't trigger if sang by only one character. Powerline - World's Greatest Rock Star interaction", async () => {
//       Const singers = [powerlineWorldsGreatestRockStar];
//       Const testEngine = new TestEngine({
//         Deck: [stitchRockStar, i2i, theQueenRegalMonarch, rapunzelSunshine],
//         Hand: [hakunaMatata],
//         Play: singers,
//       });
//
//       Await testEngine.singSong({
//         Singer: powerlineWorldsGreatestRockStar,
//         Song: hakunaMatata,
//       });
//
//       Await testEngine.resolveTopOfStack({
//         Scry: {
//           Play: [i2i],
//           Bottom: [stitchRockStar, theQueenRegalMonarch, rapunzelSunshine],
//         },
//       });
//
//       Expect(testEngine.getCardModel(hakunaMatata).zone).toEqual("discard");
//       Expect(testEngine.getCardModel(i2i).zone).toBe("discard");
//
//       For (const singer of singers) {
//         Const cardModel = testEngine.getCardModel(singer);
//         Expect(cardModel.zone).toBe("play");
//         Expect(cardModel.ready).toBe(false);
//       }
//     });
//   });
// });
//
