// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CaptainHookForcefulDuelist,
//   MickeyMouseArtfulRogue,
//   MrSmee,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   StitchCovertAgent,
//   WendyDarlingAuthorityOnPeterPan,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { trampStreetSmartDog } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Tramp - Street-Smart Dog", () => {
//   Describe("NOW IT'S A PARTY", () => {
//     It("For each of your characters in play you pay 1 {} less to play this character.", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 5,
//         Play: [mrSmee, captainHookForcefulDuelist],
//         Hand: [trampStreetSmartDog],
//       });
//
//       Await testEngine.playCard(trampStreetSmartDog);
//
//       Expect(testEngine.getCardZone(trampStreetSmartDog)).toEqual("play");
//     });
//
//     It("Can't play for cheaper if no characters in play", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 5,
//         Play: [],
//         Hand: [trampStreetSmartDog],
//       });
//
//       Await testEngine.playCard(trampStreetSmartDog);
//
//       Expect(testEngine.getCardZone(trampStreetSmartDog)).toEqual("hand");
//     });
//   });
//
//   Describe("TURTLING AGAIN?", () => {
//     It("When you play this character, you may draw a card for each of your other characters in play. Then choose the same number of cards from your hand and discard them.", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 5,
//         Play: [mrSmee, captainHookForcefulDuelist],
//         Hand: [trampStreetSmartDog, wendyDarlingAuthorityOnPeterPan],
//         Deck: [mickeyMouseArtfulRogue, stitchCovertAgent],
//       });
//
//       Await testEngine.playCard(trampStreetSmartDog);
//
//       Await testEngine.resolveOptionalAbility();
//
//       Await testEngine.resolveTopOfStack({
//         Targets: [wendyDarlingAuthorityOnPeterPan, stitchCovertAgent],
//       });
//
//       Expect(testEngine.getCardZone(trampStreetSmartDog)).toEqual("play");
//
//       Const zones = testEngine.getZonesCardCount();
//
//       Expect(zones.play).toEqual(3);
//       Expect(zones.hand).toEqual(1);
//       Expect(zones.deck).toEqual(0);
//     });
//   });
// });
//
// Describe("Regression", () => {
//   It("We're able to play Tramp even when we don't have enough ink", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 3, // We have three
//       Play: [
//         MrSmee,
//         CaptainHookForcefulDuelist,
//         WendyDarlingAuthorityOnPeterPan,
//       ], // Three characters in play should reduce Tramp's cost by 3.
//       Hand: [trampStreetSmartDog], // Tramp Costs 7
//       Deck: [mickeyMouseArtfulRogue, stitchCovertAgent],
//     });
//
//     // Tramp should cost 4, and we only have 3.
//     Await testEngine.playCard(trampStreetSmartDog);
//
//     Expect(testEngine.getCardZone(trampStreetSmartDog)).toEqual("hand");
//   });
// });
//
