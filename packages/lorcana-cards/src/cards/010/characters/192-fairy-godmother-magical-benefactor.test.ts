// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/027-hakuna-matata";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/180-goofy-knight-for-a-day";
// Import { minnieMouseSweetheartPrincess } from "@lorcanito/lorcana-engine/cards/009";
// Import { fairyGodmotherMagicalBenefactor } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Fairy Godmother - Magical Benefactor", () => {
//   It("Boost 3 {I} (Once during your turn, you may pay 3 {I} to put the top card of your deck facedown under this character.) ", async () => {
//     Const testEngine = new TestEngine({
//       Play: [fairyGodmotherMagicalBenefactor],
//     });
//
//     Expect(
//       TestEngine.getCardModel(fairyGodmotherMagicalBenefactor).hasBoost,
//     ).toBe(true);
//   });
//
//   Describe("STUNNING TRANSFORMATION Whenever you put a card under this character, you may banish chosen opposing character. If you do, their player may reveal the top card of their deck. If that card is a character or item card, they may play it for free. Otherwise, they put it on the bottom of their deck.", () => {
//     It("Top card is a character", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 3,
//           Play: [fairyGodmotherMagicalBenefactor],
//         },
//         {
//           Deck: [minnieMouseSweetheartPrincess],
//           Play: [goofyKnightForADay],
//         },
//       );
//
//       Await testEngine.activateCard(fairyGodmotherMagicalBenefactor);
//       Await testEngine.resolveTopOfStack(
//         {
//           Targets: [goofyKnightForADay],
//         },
//         True,
//       );
//
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.acceptOptionalLayer();
//
//       Await testEngine.acceptOptionalLayer();
//
//       Expect(testEngine.getCardModel(minnieMouseSweetheartPrincess).zone).toBe(
//         "play",
//       );
//
//       Expect(testEngine.getCardModel(minnieMouseSweetheartPrincess).ready).toBe(
//         True,
//       );
//     });
//
//     It("Top card is an action", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 3,
//           Play: [fairyGodmotherMagicalBenefactor],
//         },
//         {
//           Deck: [hakunaMatata],
//           Play: [goofyKnightForADay],
//         },
//       );
//
//       Await testEngine.activateCard(fairyGodmotherMagicalBenefactor);
//       Await testEngine.resolveTopOfStack(
//         {
//           Targets: [goofyKnightForADay],
//         },
//         True,
//       );
//
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.acceptOptionalLayer();
//
//       Expect(testEngine.getCardModel(hakunaMatata).zone).toBe("deck");
//       Expect(testEngine.getCardModel(hakunaMatata).isRevealed).toBe(true);
//     });
//   });
// });
//
