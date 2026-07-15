// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BeastGraciousPrince,
//   LiloBestExplorerEver,
//   StitchRockStar,
// } from "@lorcanito/lorcana-engine/cards/009";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Lilo - Best Explorer Ever", () => {
//   It("COME ON, PEOPLE, LET'S MOVE When you play this character, your other characters gain Challenger +2 this turn. (They get +2 {S} while challenging.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: liloBestExplorerEver.cost,
//       Hand: [liloBestExplorerEver],
//       Play: [beastGraciousPrince],
//     });
//
//     Expect(testEngine.getCardModel(beastGraciousPrince).hasChallenger).toBe(
//       False,
//     );
//     Await testEngine.playCard(liloBestExplorerEver);
//     Expect(testEngine.getCardModel(beastGraciousPrince).hasChallenger).toBe(
//       True,
//     );
//   });
//
//   It("GO GET 'EM Whenever this character quests, chosen Alien character gains Challenger +2 and 'This character can challenge ready characters' this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [liloBestExplorerEver, stitchRockStar],
//     });
//
//     Await testEngine.questCard(liloBestExplorerEver);
//
//     Expect(testEngine.getCardModel(stitchRockStar).hasChallenger).toBe(false);
//     Await testEngine.resolveTopOfStack({ targets: [stitchRockStar] });
//     Expect(testEngine.getCardModel(stitchRockStar).hasChallenger).toBe(true);
//     Expect(
//       TestEngine.getCardModel(stitchRockStar).canChallengeReadyCharacters,
//     ).toBe(true);
//   });
// });
//
