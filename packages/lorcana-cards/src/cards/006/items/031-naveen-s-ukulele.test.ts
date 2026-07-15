// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { arielSpectacularSinger } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   MrSmeeBumblingMate,
//   PigletPoohPirateCaptain,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { underTheSea } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { daisyDuckDonaldsDate } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { naveensUkulele } from "@lorcanito/lorcana-engine/cards/006/items/items";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Naveen's Ukulele", () => {
//   It("MAKE IT SING 1 {I}, Banish this item - Chosen character counts as having +3 cost to sing songs this turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: naveensUkulele.cost + 1,
//         Play: [arielSpectacularSinger],
//         Hand: [naveensUkulele, underTheSea],
//       },
//       {
//         Play: [
//           DaisyDuckDonaldsDate,
//           PigletPoohPirateCaptain,
//           MrSmeeBumblingMate,
//         ],
//       },
//     );
//
//     Await testEngine.playCard(naveensUkulele);
//     Await testEngine.activateCard(naveensUkulele);
//     Await testEngine.resolveTopOfStack({ targets: [arielSpectacularSinger] });
//
//     Expect(testEngine.getCardModel(arielSpectacularSinger).singerCost).toBe(8);
//
//     Await testEngine.singSong({
//       Singer: arielSpectacularSinger,
//       Song: underTheSea,
//     });
//
//     Expect(testEngine.getCardModel(daisyDuckDonaldsDate).zone).toBe("deck");
//     Expect(testEngine.getCardModel(pigletPoohPirateCaptain).zone).toBe("deck");
//     Expect(testEngine.getCardModel(mrSmeeBumblingMate).zone).toBe("play");
//   });
// });
//
