// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LiloGalacticHero,
//   LiloMakingAWish,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { liloEscapeArtist } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Lilo - Escape Artist", () => {
//   Describe("NO PLACE I’D RATHER BE At the start of your turn, if this card is in your discard, you may play her and she enters play exerted.", () => {
//     It("On discard", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: liloEscapeArtist.cost,
//           Discard: [liloEscapeArtist],
//           Deck: 2,
//         },
//         {
//           Deck: 2,
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(liloEscapeArtist);
//
//       Await testEngine.passTurn();
//       Await testEngine.passTurn();
//
//       Await testEngine.resolveOptionalAbility();
//
//       Expect(cardUnderTest.zone).toBe("play");
//       Expect(cardUnderTest.exerted).toBe(true);
//       Expect(testEngine.getAvailableInkwellCardCount()).toEqual(0);
//     });
//
//     It("More than one lilo in discard", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 2,
//           Discard: [
//             LiloEscapeArtist,
//             LiloEscapeArtist,
//             LiloGalacticHero,
//             LiloMakingAWish,
//           ],
//           Deck: 2,
//         },
//         {
//           Deck: 2,
//         },
//       );
//
//       Await testEngine.passTurn();
//       Await testEngine.passTurn();
//
//       Expect(testEngine.stackLayers.length).toEqual(2);
//     });
//
//     It("On play", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: liloEscapeArtist.cost,
//           Play: [liloEscapeArtist],
//           Deck: 2,
//         },
//         {
//           Deck: 2,
//         },
//       );
//
//       Await testEngine.passTurn();
//       Expect(testEngine.stackLayers).toHaveLength(0);
//       Await testEngine.passTurn();
//       Expect(testEngine.stackLayers).toHaveLength(0);
//     });
//   });
// });
//
