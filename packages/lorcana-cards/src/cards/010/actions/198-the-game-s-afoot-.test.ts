// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BalooFriendAndGuardian,
//   DuckburgFunsosFunzone,
//   MickeyMouseAmberChampion,
//   TheGamesAfoot,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Game's Afoot!", () => {
//   Describe("Move up to 2 of your characters to the same location for free. That location gains Resist +2 until the start of your next turn.", () => {
//     It("Moving two characters to a location and the location gains Resist +2", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: theGamesAfoot.cost,
//         Hand: [theGamesAfoot],
//         Play: [
//           DuckburgFunsosFunzone,
//           MickeyMouseAmberChampion,
//           BalooFriendAndGuardian,
//         ],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(theGamesAfoot);
//       Const location = testEngine.getCardModel(duckburgFunsosFunzone);
//       Const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//       Const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//
//       Expect(location.charactersAtLocation).toHaveLength(0);
//       Expect(location.damageReduction()).toBe(0);
//
//       // Play the action card - this puts effects on stack in reverse order
//       Await testEngine.playCard(cardUnderTest);
//
//       // Stack now has (top to bottom):
//       // 1. ability effect (apply Resist to location)
//       // 2. move-to-location (select characters)
//       // 3. character-moving-to-location (select destination)
//
//       // Resolve move-to-location: select 2 characters to move (more layers will be created)
//       Await testEngine.resolveTopOfStack(
//         { targets: [mickey, baloo] },
//         True, // skipAssertion - there are more layers on the stack
//       );
//       // Resolve character-moving-to-location: select the location for characters to move to
//       Await testEngine.resolveTopOfStack(
//         { targets: [location] },
//         True, // skipAssertion - ability layer still on the stack
//       );
//       // Resolve ability effect: select the location to apply Resist to
//       Await testEngine.resolveTopOfStack({
//         Targets: [location],
//       });
//
//       Expect(location.charactersAtLocation).toHaveLength(2);
//       Expect(location.damageReduction()).toBe(2);
//     });
//
//     It("Moving one character to a location (upTo: true)", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: theGamesAfoot.cost,
//         Hand: [theGamesAfoot],
//         Play: [
//           DuckburgFunsosFunzone,
//           MickeyMouseAmberChampion,
//           BalooFriendAndGuardian,
//         ],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(theGamesAfoot);
//       Const location = testEngine.getCardModel(duckburgFunsosFunzone);
//       Const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       Expect(location.charactersAtLocation).toHaveLength(0);
//
//       // Play the action card
//       Await testEngine.playCard(cardUnderTest);
//
//       // Resolve move-to-location: select only 1 character to move
//       Await testEngine.resolveTopOfStack(
//         { targets: [mickey] },
//         True, // skipAssertion
//       );
//       // Resolve character-moving-to-location: select the location
//       Await testEngine.resolveTopOfStack(
//         { targets: [location] },
//         True, // skipAssertion
//       );
//       // Resolve ability effect: select the location to apply Resist to
//       Await testEngine.resolveTopOfStack({
//         Targets: [location],
//       });
//
//       Expect(location.charactersAtLocation).toHaveLength(1);
//       Expect(location.damageReduction()).toBe(2);
//     });
//
//     It("Resist effect lasts until the start of your next turn", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: theGamesAfoot.cost,
//         Hand: [theGamesAfoot],
//         Play: [duckburgFunsosFunzone, mickeyMouseAmberChampion],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(theGamesAfoot);
//       Const location = testEngine.getCardModel(duckburgFunsosFunzone);
//       Const mickey = testEngine.getCardModel(mickeyMouseAmberChampion);
//
//       // Play the action card
//       Await testEngine.playCard(cardUnderTest);
//
//       // Resolve move-to-location: select character
//       Await testEngine.resolveTopOfStack(
//         { targets: [mickey] },
//         True, // skipAssertion
//       );
//       // Resolve character-moving-to-location: select location
//       Await testEngine.resolveTopOfStack(
//         { targets: [location] },
//         True, // skipAssertion
//       );
//       // Resolve ability effect: apply Resist to location
//       Await testEngine.resolveTopOfStack({
//         Targets: [location],
//       });
//
//       Expect(location.damageReduction()).toBe(2);
//
//       // End turn - opponent's turn starts
//       Await testEngine.passTurn();
//
//       // During opponent's turn, the effect should still be active
//       Expect(location.damageReduction()).toBe(2);
//
//       // End opponent's turn - your turn starts again
//       Await testEngine.passTurn();
//
//       // At the start of your next turn, the effect should expire
//       Expect(location.damageReduction()).toBe(0);
//     });
//
//     It("Resist effect reduces damage to location", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: theGamesAfoot.cost + mickeyMouseAmberChampion.cost,
//         Hand: [theGamesAfoot, mickeyMouseAmberChampion],
//         Play: [duckburgFunsosFunzone],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(theGamesAfoot);
//       Const location = testEngine.getCardModel(duckburgFunsosFunzone);
//
//       // Play the action card
//       Await testEngine.playCard(cardUnderTest);
//
//       // Resolve move-to-location: select no characters (upTo allows 0)
//       Await testEngine.resolveTopOfStack(
//         { targets: [] },
//         True, // skipAssertion - ability layer still on stack
//       );
//       // The character-moving-to-location layer is skipped since no characters selected
//       // Resolve ability effect: apply Resist to location
//       Await testEngine.resolveTopOfStack({
//         Targets: [location],
//       });
//
//       Expect(location.damageReduction()).toBe(2);
//       Expect(location.damage).toBe(0);
//
//       // The Resist effect should be active until the start of your next turn
//       // So it's active during your turn (turn 0) and the opponent's turn
//       // But expires at the start of your next turn (turn 1)
//
//       // To test damage reduction, we need to damage the location while Resist is active
//       // Let's manually add damage while the effect is still active
//       Location.updateCardDamage(4, "add");
//
//       // With Resist +2, only 2 damage should be applied (4 - 2 = 2)
//       Expect(location.damage).toBe(2);
//     });
//   });
// });
//
