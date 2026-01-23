// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   aPiratesLife,
//   secondStarToTheRight,
// } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// import {
//   almaMadrigalAcceptingGrandmother,
//   friendOwlCantankerousNeighbor,
//   mulanChargingAhead,
//   thumperYoungBunny,
//   vanellopeVonSchweetzSpunkySpeedster,
// } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { mickeyBraveLittleTailor } from "../../001/characters/115-mickey-mouse-brave-little-tailor";
// import { hakunaMatata } from "../../001/songs/027-hakuna-matata";
//
// describe("Alma Madrigal - Accepting Grandmother", () => {
//   it("THE MIRACLE IS YOU Once during your turn, whenever one or more of your characters sings a song, you may ready those characters.", async () => {
//     const singers = [
//       vanellopeVonSchweetzSpunkySpeedster,
//       thumperYoungBunny,
//       mulanChargingAhead,
//       friendOwlCantankerousNeighbor,
//     ];
//
//     const testEngine = new TestEngine({
//       inkwell: almaMadrigalAcceptingGrandmother.cost,
//       play: [almaMadrigalAcceptingGrandmother, ...singers],
//       hand: [secondStarToTheRight, aPiratesLife],
//     });
//
//     await testEngine.singSongTogether({
//       song: secondStarToTheRight,
//       singers,
//     });
//
//     await testEngine.resolveTopOfStack({ targetPlayer: "player_two" }, true);
//     await testEngine.acceptOptionalLayer();
//
//     expect(testEngine.stackLayers).toHaveLength(0);
//     for (const singer of singers) {
//       expect(testEngine.getCardModel(singer).ready).toBe(true);
//     }
//
//     // Only triggers once
//     await testEngine.singSongTogether({
//       song: aPiratesLife,
//       singers,
//     });
//
//     expect(testEngine.stackLayers).toHaveLength(0);
//     for (const singer of singers) {
//       expect(testEngine.getCardModel(singer).ready).toBe(false);
//     }
//   });
// });
//
// describe("Regression Test", () => {
//   it("Should trigger when it's only one character singing a song", async () => {
//     const testEngine = new TestEngine({
//       play: [almaMadrigalAcceptingGrandmother, mickeyBraveLittleTailor],
//       hand: [hakunaMatata],
//     });
//
//     await testEngine.singSong({
//       singer: mickeyBraveLittleTailor,
//       song: hakunaMatata,
//     });
//
//     await testEngine.acceptOptionalLayer();
//
//     expect(testEngine.stackLayers).toHaveLength(0);
//     expect(testEngine.getCardModel(mickeyBraveLittleTailor).ready).toBe(true);
//   });
// });
//
