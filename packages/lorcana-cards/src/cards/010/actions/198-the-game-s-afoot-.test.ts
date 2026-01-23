// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   balooFriendAndGuardian,
//   duckburgFunsosFunzone,
//   mickeyMouseAmberChampion,
//   theGamesAfoot,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("The Game's Afoot!", () => {
//   describe("Move up to 2 of your characters to the same location for free. That location gains Resist +2 until the start of your next turn.", () => {
//     it("Moving two characters to a location and the location gains Resist +2", async () => {
//       const testEngine = new TestEngine({
//         inkwell: theGamesAfoot.cost,
//         hand: [theGamesAfoot],
//         play: [
//           duckburgFunsosFunzone,
//           mickeyMouseAmberChampion,
//           balooFriendAndGuardian,
//         ],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(theGamesAfoot);
//       const location = testEngine.getCardModel(duckburgFunsosFunzone);
//       const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//       const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//
//       expect(location.charactersAtLocation).toHaveLength(0);
//       expect(location.damageReduction()).toBe(0);
//
//       // Play the action card - this puts effects on stack in reverse order
//       await testEngine.playCard(cardUnderTest);
//
//       // Stack now has (top to bottom):
//       // 1. ability effect (apply Resist to location)
//       // 2. move-to-location (select characters)
//       // 3. character-moving-to-location (select destination)
//
//       // Resolve move-to-location: select 2 characters to move (more layers will be created)
//       await testEngine.resolveTopOfStack(
//         { targets: [mickey, baloo] },
//         true, // skipAssertion - there are more layers on the stack
//       );
//       // Resolve character-moving-to-location: select the location for characters to move to
//       await testEngine.resolveTopOfStack(
//         { targets: [location] },
//         true, // skipAssertion - ability layer still on the stack
//       );
//       // Resolve ability effect: select the location to apply Resist to
//       await testEngine.resolveTopOfStack({
//         targets: [location],
//       });
//
//       expect(location.charactersAtLocation).toHaveLength(2);
//       expect(location.damageReduction()).toBe(2);
//     });
//
//     it("Moving one character to a location (upTo: true)", async () => {
//       const testEngine = new TestEngine({
//         inkwell: theGamesAfoot.cost,
//         hand: [theGamesAfoot],
//         play: [
//           duckburgFunsosFunzone,
//           mickeyMouseAmberChampion,
//           balooFriendAndGuardian,
//         ],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(theGamesAfoot);
//       const location = testEngine.getCardModel(duckburgFunsosFunzone);
//       const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       expect(location.charactersAtLocation).toHaveLength(0);
//
//       // Play the action card
//       await testEngine.playCard(cardUnderTest);
//
//       // Resolve move-to-location: select only 1 character to move
//       await testEngine.resolveTopOfStack(
//         { targets: [mickey] },
//         true, // skipAssertion
//       );
//       // Resolve character-moving-to-location: select the location
//       await testEngine.resolveTopOfStack(
//         { targets: [location] },
//         true, // skipAssertion
//       );
//       // Resolve ability effect: select the location to apply Resist to
//       await testEngine.resolveTopOfStack({
//         targets: [location],
//       });
//
//       expect(location.charactersAtLocation).toHaveLength(1);
//       expect(location.damageReduction()).toBe(2);
//     });
//
//     it("Resist effect lasts until the start of your next turn", async () => {
//       const testEngine = new TestEngine({
//         inkwell: theGamesAfoot.cost,
//         hand: [theGamesAfoot],
//         play: [duckburgFunsosFunzone, mickeyMouseAmberChampion],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(theGamesAfoot);
//       const location = testEngine.getCardModel(duckburgFunsosFunzone);
//       const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Play the action card
//       await testEngine.playCard(cardUnderTest);
//
//       // Resolve move-to-location: select character
//       await testEngine.resolveTopOfStack(
//         { targets: [mickey] },
//         true, // skipAssertion
//       );
//       // Resolve character-moving-to-location: select location
//       await testEngine.resolveTopOfStack(
//         { targets: [location] },
//         true, // skipAssertion
//       );
//       // Resolve ability effect: apply Resist to location
//       await testEngine.resolveTopOfStack({
//         targets: [location],
//       });
//
//       expect(location.damageReduction()).toBe(2);
//
//       // End turn - opponent's turn starts
//       await testEngine.passTurn();
//
//       // During opponent's turn, the effect should still be active
//       expect(location.damageReduction()).toBe(2);
//
//       // End opponent's turn - your turn starts again
//       await testEngine.passTurn();
//
//       // At the start of your next turn, the effect should expire
//       expect(location.damageReduction()).toBe(0);
//     });
//
//     it("Resist effect reduces damage to location", async () => {
//       const testEngine = new TestEngine({
//         inkwell: theGamesAfoot.cost + mickeyMouseAmberChampion.cost,
//         hand: [theGamesAfoot, mickeyMouseAmberChampion],
//         play: [duckburgFunsosFunzone],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(theGamesAfoot);
//       const location = testEngine.getCardModel(duckburgFunsosFunzone);
//
//       // Play the action card
//       await testEngine.playCard(cardUnderTest);
//
//       // Resolve move-to-location: select no characters (upTo allows 0)
//       await testEngine.resolveTopOfStack(
//         { targets: [] },
//         true, // skipAssertion - ability layer still on stack
//       );
//       // The character-moving-to-location layer is skipped since no characters selected
//       // Resolve ability effect: apply Resist to location
//       await testEngine.resolveTopOfStack({
//         targets: [location],
//       });
//
//       expect(location.damageReduction()).toBe(2);
//       expect(location.damage).toBe(0);
//
//       // The Resist effect should be active until the start of your next turn
//       // So it's active during your turn (turn 0) and the opponent's turn
//       // But expires at the start of your next turn (turn 1)
//
//       // To test damage reduction, we need to damage the location while Resist is active
//       // Let's manually add damage while the effect is still active
//       location.updateCardDamage(4, "add");
//
//       // With Resist +2, only 2 damage should be applied (4 - 2 = 2)
//       expect(location.damage).toBe(2);
//     });
//   });
// });
//
