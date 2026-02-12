// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hadesInfernalSchemer } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { andThenAlongCameZeus } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { underTheSea } from "@lorcanito/lorcana-engine/cards/004/actions/095-under-the-sea";
// Import {
//   GeneNicelandResident,
//   LouieOneCoolDuck,
//   MickeyMouseGiantMouse,
//   TheColonelOldSheepdog,
//   TianaNaturalTalent,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Tiana - Natural Talent", () => {
//   It("Singer 6 (This character counts as cost 6 to sing songs.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [tianaNaturalTalent],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(tianaNaturalTalent);
//     Expect(cardUnderTest.hasSinger).toBe(true);
//   });
//
//   It("CAPTIVATING MELODY Whenever you play a song, each opposing character gets -1 {S} until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: tianaNaturalTalent.cost,
//         Play: [tianaNaturalTalent],
//         Hand: [andThenAlongCameZeus],
//       },
//       {
//         Play: [hadesInfernalSchemer, geneNicelandResident],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(tianaNaturalTalent);
//
//     Await testEngine.singSong({
//       Singer: cardUnderTest,
//       Song: andThenAlongCameZeus,
//     });
//
//     Await testEngine.resolveTopOfStack({ targets: [hadesInfernalSchemer] });
//
//     Const target = testEngine.getCardModel(hadesInfernalSchemer);
//
//     Expect(target.damage).toBe(5);
//
//     Expect(target.strength).toBe(hadesInfernalSchemer.strength - 1);
//
//     // State of the card when the song is sung or played
//     Expect(testEngine.getCardModel(geneNicelandResident).strength).toBe(
//       GeneNicelandResident.strength - 1,
//     );
//
//     TestEngine.passTurn();
//
//     // State of the card when the turn passes to the opponent
//     Expect(testEngine.getCardModel(geneNicelandResident).strength).toBe(
//       GeneNicelandResident.strength - 1,
//     );
//
//     TestEngine.passTurn();
//
//     // State of the card when the effect disappears
//     Expect(testEngine.getCardModel(geneNicelandResident).strength).toBe(
//       GeneNicelandResident.strength,
//     );
//   });
// });
//
// Describe("Regression tests for Tiana - Natural Talent", () => {
//   It("should NOT apply the str reduction before resolving the action cards (Under the sea interaction)", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: underTheSea.cost,
//         Play: [tianaNaturalTalent],
//         Hand: [underTheSea],
//       },
//       {
//         Play: [theColonelOldSheepdog, louieOneCoolDuck],
//       },
//     );
//
//     Await testEngine.playCard(underTheSea);
//
//     // Char with 2 strength be sent to the bottom
//     Expect(testEngine.getCardModel(louieOneCoolDuck).zone).toBe("deck");
//     // Char with 3 strength stay in play, as the -1 str is applied after the action is fully resolved
//     Expect(testEngine.getCardModel(theColonelOldSheepdog).zone).toBe("play");
//     Expect(testEngine.getCardModel(theColonelOldSheepdog).strength).toBe(
//       TheColonelOldSheepdog.strength - 1,
//     );
//   });
//
//   It("should not apply -1 {S} to characters that are not in play", async () => {
//     Const play = [
//       HadesInfernalSchemer,
//       GoofyKnightForADay,
//       MickeyMouseGiantMouse,
//     ];
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: hakunaMatata.cost,
//         Play: [tianaNaturalTalent, tianaNaturalTalent, tianaNaturalTalent],
//         Hand: [hakunaMatata],
//       },
//       {
//         Play: play,
//       },
//     );
//
//     Await testEngine.playCard(hakunaMatata);
//
//     Await testEngine.resolveTopOfStack({}, true);
//     For (const card of play) {
//       Const cardModel = testEngine.getCardModel(card);
//       Expect(cardModel.strength).toBe(card.strength - 1);
//     }
//
//     // THe last effect is auto resolved, so we jump from -2 straight to -3
//     // await testEngine.resolveTopOfStack({}, true);
//     // for (const card of play) {
//     //   const cardModel = testEngine.getCardModel(card);
//     //   expect(cardModel.strength).toBe(card.strength - 2);
//     // }
//
//     Await testEngine.resolveTopOfStack({}, true);
//     For (const card of play) {
//       Const cardModel = testEngine.getCardModel(card);
//       Expect(cardModel.strength).toBe(card.strength - 3);
//     }
//   });
// });
//
