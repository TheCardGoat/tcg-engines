// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   captainHookForcefulDuelist,
//   mickeyMouseArtfulRogue,
//   mrSmee,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import {
//   stitchCovertAgent,
//   wendyDarlingAuthorityOnPeterPan,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { trampStreetSmartDog } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Tramp - Street-Smart Dog", () => {
//   describe("NOW IT'S A PARTY", () => {
//     it("For each of your characters in play you pay 1 {} less to play this character.", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 5,
//         play: [mrSmee, captainHookForcefulDuelist],
//         hand: [trampStreetSmartDog],
//       });
//
//       await testEngine.playCard(trampStreetSmartDog);
//
//       expect(testEngine.getCardZone(trampStreetSmartDog)).toEqual("play");
//     });
//
//     it("Can't play for cheaper if no characters in play", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 5,
//         play: [],
//         hand: [trampStreetSmartDog],
//       });
//
//       await testEngine.playCard(trampStreetSmartDog);
//
//       expect(testEngine.getCardZone(trampStreetSmartDog)).toEqual("hand");
//     });
//   });
//
//   describe("TURTLING AGAIN?", () => {
//     it("When you play this character, you may draw a card for each of your other characters in play. Then choose the same number of cards from your hand and discard them.", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 5,
//         play: [mrSmee, captainHookForcefulDuelist],
//         hand: [trampStreetSmartDog, wendyDarlingAuthorityOnPeterPan],
//         deck: [mickeyMouseArtfulRogue, stitchCovertAgent],
//       });
//
//       await testEngine.playCard(trampStreetSmartDog);
//
//       await testEngine.resolveOptionalAbility();
//
//       await testEngine.resolveTopOfStack({
//         targets: [wendyDarlingAuthorityOnPeterPan, stitchCovertAgent],
//       });
//
//       expect(testEngine.getCardZone(trampStreetSmartDog)).toEqual("play");
//
//       const zones = testEngine.getZonesCardCount();
//
//       expect(zones.play).toEqual(3);
//       expect(zones.hand).toEqual(1);
//       expect(zones.deck).toEqual(0);
//     });
//   });
// });
//
// describe("Regression", () => {
//   it("We're able to play Tramp even when we don't have enough ink", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 3, // We have three
//       play: [
//         mrSmee,
//         captainHookForcefulDuelist,
//         wendyDarlingAuthorityOnPeterPan,
//       ], // Three characters in play should reduce Tramp's cost by 3.
//       hand: [trampStreetSmartDog], // Tramp Costs 7
//       deck: [mickeyMouseArtfulRogue, stitchCovertAgent],
//     });
//
//     // Tramp should cost 4, and we only have 3.
//     await testEngine.playCard(trampStreetSmartDog);
//
//     expect(testEngine.getCardZone(trampStreetSmartDog)).toEqual("hand");
//   });
// });
//
