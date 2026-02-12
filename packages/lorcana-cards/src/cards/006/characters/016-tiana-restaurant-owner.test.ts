// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArielSpectacularSinger,
//   MickeyBraveLittleTailor,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { friendsOnTheOtherSide } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import {
//   MadamMimFox,
//   MadamMimSnake,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { tianaRestaurantOwner } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Tiana - Restaurant Owner", () => {
//   Describe("SPECIAL RESERVATION - Whenever a character of yours is challenged while this character is exerted, the challenging character gets -3 {S} this turn unless their player pays 3 {I}.", () => {
//     It("should apply the strength penalty if the player does not pay 3 {I}", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 1,
//           Play: [tianaRestaurantOwner, arielSpectacularSinger],
//           Hand: [mickeyBraveLittleTailor],
//         },
//         {
//           Inkwell: 3,
//           Play: [madamMimFox],
//           Hand: [],
//           Deck: [madamMimSnake, friendsOnTheOtherSide],
//         },
//       );
//
//       Await testEngine.tapCard(tianaRestaurantOwner);
//       Await testEngine.tapCard(arielSpectacularSinger);
//
//       Await testEngine.passTurn();
//
//       Await testEngine.challenge({
//         Attacker: madamMimFox,
//         Defender: arielSpectacularSinger,
//       });
//
//       Await testEngine.skipTopOfStack();
//
//       Expect(testEngine.getCardModel(madamMimFox).strength).toBe(1);
//     });
//     It("should NOT apply the strength penalty if the player pays 3 {I}", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 1,
//           Play: [tianaRestaurantOwner, arielSpectacularSinger],
//           Hand: [mickeyBraveLittleTailor],
//         },
//         {
//           Inkwell: 3,
//           Play: [madamMimFox],
//           Hand: [],
//           Deck: [madamMimSnake, friendsOnTheOtherSide],
//         },
//       );
//
//       Await testEngine.tapCard(tianaRestaurantOwner);
//       Await testEngine.tapCard(arielSpectacularSinger);
//
//       Await testEngine.passTurn();
//
//       Await testEngine.challenge({
//         Attacker: madamMimFox,
//         Defender: arielSpectacularSinger,
//       });
//
//       Await testEngine.acceptOptionalLayer();
//
//       Expect(testEngine.getCardModel(madamMimFox).strength).toBe(4);
//       Expect(testEngine.getAvailableInkwellCardCount("player_two")).toBe(0);
//     });
//
//     It("should apply the strength penalty if the player cannot pay the cost", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 1,
//           Play: [tianaRestaurantOwner, arielSpectacularSinger],
//           Hand: [mickeyBraveLittleTailor],
//         },
//         {
//           Inkwell: 1,
//           Play: [madamMimFox],
//           Hand: [],
//           Deck: [madamMimSnake, friendsOnTheOtherSide],
//         },
//       );
//
//       Await testEngine.tapCard(tianaRestaurantOwner);
//       Await testEngine.tapCard(arielSpectacularSinger);
//
//       Await testEngine.passTurn();
//
//       Await testEngine.challenge({
//         Attacker: madamMimFox,
//         Defender: arielSpectacularSinger,
//       });
//
//       Await testEngine.acceptOptionalLayer();
//
//       Expect(testEngine.getCardModel(madamMimFox).strength).toBe(1);
//       Expect(testEngine.getAvailableInkwellCardCount("player_two")).toBe(1);
//     });
//
//     It("should not trigger if tiana is not exerted", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 1,
//           Play: [tianaRestaurantOwner, arielSpectacularSinger],
//           Hand: [mickeyBraveLittleTailor],
//         },
//         {
//           Inkwell: 1,
//           Play: [madamMimFox],
//           Hand: [],
//           Deck: [madamMimSnake, friendsOnTheOtherSide],
//         },
//       );
//
//       Await testEngine.tapCard(arielSpectacularSinger);
//
//       Await testEngine.passTurn();
//
//       Await testEngine.challenge({
//         Attacker: madamMimFox,
//         Defender: arielSpectacularSinger,
//       });
//
//       Expect(testEngine.getCardModel(madamMimFox).strength).toBe(4);
//       Expect(testEngine.getAvailableInkwellCardCount("player_two")).toBe(1);
//     });
//   });
// });
//
