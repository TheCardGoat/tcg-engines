// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   APiratesLife,
//   SecondStarToTheRight,
// } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import {
//   AlmaMadrigalAcceptingGrandmother,
//   FriendOwlCantankerousNeighbor,
//   MulanChargingAhead,
//   ThumperYoungBunny,
//   VanellopeVonSchweetzSpunkySpeedster,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { mickeyBraveLittleTailor } from "../../001/characters/115-mickey-mouse-brave-little-tailor";
// Import { hakunaMatata } from "../../001/songs/027-hakuna-matata";
//
// Describe("Alma Madrigal - Accepting Grandmother", () => {
//   It("THE MIRACLE IS YOU Once during your turn, whenever one or more of your characters sings a song, you may ready those characters.", async () => {
//     Const singers = [
//       VanellopeVonSchweetzSpunkySpeedster,
//       ThumperYoungBunny,
//       MulanChargingAhead,
//       FriendOwlCantankerousNeighbor,
//     ];
//
//     Const testEngine = new TestEngine({
//       Inkwell: almaMadrigalAcceptingGrandmother.cost,
//       Play: [almaMadrigalAcceptingGrandmother, ...singers],
//       Hand: [secondStarToTheRight, aPiratesLife],
//     });
//
//     Await testEngine.singSongTogether({
//       Song: secondStarToTheRight,
//       Singers,
//     });
//
//     Await testEngine.resolveTopOfStack({ targetPlayer: "player_two" }, true);
//     Await testEngine.acceptOptionalLayer();
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//     For (const singer of singers) {
//       Expect(testEngine.getCardModel(singer).ready).toBe(true);
//     }
//
//     // Only triggers once
//     Await testEngine.singSongTogether({
//       Song: aPiratesLife,
//       Singers,
//     });
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//     For (const singer of singers) {
//       Expect(testEngine.getCardModel(singer).ready).toBe(false);
//     }
//   });
// });
//
// Describe("Regression Test", () => {
//   It("Should trigger when it's only one character singing a song", async () => {
//     Const testEngine = new TestEngine({
//       Play: [almaMadrigalAcceptingGrandmother, mickeyBraveLittleTailor],
//       Hand: [hakunaMatata],
//     });
//
//     Await testEngine.singSong({
//       Singer: mickeyBraveLittleTailor,
//       Song: hakunaMatata,
//     });
//
//     Await testEngine.acceptOptionalLayer();
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//     Expect(testEngine.getCardModel(mickeyBraveLittleTailor).ready).toBe(true);
//   });
// });
//
