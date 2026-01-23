// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/027-hakuna-matata";
// import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/180-goofy-knight-for-a-day";
// import { minnieMouseSweetheartPrincess } from "@lorcanito/lorcana-engine/cards/009";
// import { fairyGodmotherMagicalBenefactor } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Fairy Godmother - Magical Benefactor", () => {
//   it("Boost 3 {I} (Once during your turn, you may pay 3 {I} to put the top card of your deck facedown under this character.) ", async () => {
//     const testEngine = new TestEngine({
//       play: [fairyGodmotherMagicalBenefactor],
//     });
//
//     expect(
//       testEngine.getCardModel(fairyGodmotherMagicalBenefactor).hasBoost,
//     ).toBe(true);
//   });
//
//   describe("STUNNING TRANSFORMATION Whenever you put a card under this character, you may banish chosen opposing character. If you do, their player may reveal the top card of their deck. If that card is a character or item card, they may play it for free. Otherwise, they put it on the bottom of their deck.", () => {
//     it("Top card is a character", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: 3,
//           play: [fairyGodmotherMagicalBenefactor],
//         },
//         {
//           deck: [minnieMouseSweetheartPrincess],
//           play: [goofyKnightForADay],
//         },
//       );
//
//       await testEngine.activateCard(fairyGodmotherMagicalBenefactor);
//       await testEngine.resolveTopOfStack(
//         {
//           targets: [goofyKnightForADay],
//         },
//         true,
//       );
//
//       testEngine.changeActivePlayer("player_two");
//       await testEngine.acceptOptionalLayer();
//
//       await testEngine.acceptOptionalLayer();
//
//       expect(testEngine.getCardModel(minnieMouseSweetheartPrincess).zone).toBe(
//         "play",
//       );
//
//       expect(testEngine.getCardModel(minnieMouseSweetheartPrincess).ready).toBe(
//         true,
//       );
//     });
//
//     it("Top card is an action", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: 3,
//           play: [fairyGodmotherMagicalBenefactor],
//         },
//         {
//           deck: [hakunaMatata],
//           play: [goofyKnightForADay],
//         },
//       );
//
//       await testEngine.activateCard(fairyGodmotherMagicalBenefactor);
//       await testEngine.resolveTopOfStack(
//         {
//           targets: [goofyKnightForADay],
//         },
//         true,
//       );
//
//       testEngine.changeActivePlayer("player_two");
//       await testEngine.acceptOptionalLayer();
//
//       expect(testEngine.getCardModel(hakunaMatata).zone).toBe("deck");
//       expect(testEngine.getCardModel(hakunaMatata).isRevealed).toBe(true);
//     });
//   });
// });
//
