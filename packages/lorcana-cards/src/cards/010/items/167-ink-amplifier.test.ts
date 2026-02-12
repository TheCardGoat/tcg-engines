// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { friendsOnTheOtherSide } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { inkAmplifier } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ink Amplifier", () => {
//   It("ENERGY CAPTURE - Triggers when opponent draws their second card during their turn", () => {
//     Const testStore = new TestStore(
//       {
//         Deck: 5,
//         Hand: [friendsOnTheOtherSide],
//         Inkwell: friendsOnTheOtherSide.cost,
//       },
//       {
//         Play: [inkAmplifier],
//         Deck: 5,
//       },
//     );
//
//     Const initialInkwellSize =
//       TestStore.store.tableStore.getPlayerZone("player_two", "inkwell")?.cards
//         .length || 0;
//
//     // Play Friends on the Other Side which draws 2 cards for the player
//     // First draw = beginning of turn (not trigger)
//     // Second draw from the song effect should trigger Ink Amplifier
//     Const songCard = testStore.getByZoneAndId("hand", friendsOnTheOtherSide.id);
//     SongCard.playFromHand();
//
//     // Change to player_two (who owns Ink Amplifier) so they can resolve their optional ability
//     TestStore.changePlayer("player_two");
//
//     // Player two should be prompted to use optional ability
//     Expect(testStore.stackLayers.length).toBeGreaterThan(0);
//
//     TestStore.resolveOptionalAbility();
//
//     // Verify: Top card of player two's deck moved to inkwell
//     Const newInkwellSize =
//       TestStore.store.tableStore.getPlayerZone("player_two", "inkwell")?.cards
//         .length || 0;
//     Expect(newInkwellSize).toBe(initialInkwellSize + 1);
//
//     // Verify: The inkwell card is exerted (ready = false)
//     Const inkwellCardModels = testStore.getZonesCards("player_two").inkwell;
//     Const topInkwellCard = inkwellCardModels[inkwellCardModels.length - 1];
//     Expect(topInkwellCard).toBeDefined();
//     Expect(topInkwellCard?.ready).toBe(false);
//   });
//
//   It("ENERGY CAPTURE - Does NOT trigger when opponent draws their first card", () => {
//     Const testStore = new TestStore(
//       {
//         Deck: 5,
//       },
//       {
//         Play: [inkAmplifier],
//         Deck: 5,
//       },
//     );
//
//     Const initialInkwellSize =
//       TestStore.store.tableStore.getPlayerZone("player_two", "inkwell")?.cards
//         .length || 0;
//
//     // Beginning of turn draw - first card drawn
//     // This should NOT trigger Ink Amplifier
//     TestStore.passTurn();
//
//     // Should NOT have any triggers on the stack
//     Expect(testStore.stackLayers.length).toBe(0);
//
//     // Inkwell size should remain unchanged
//     Const newInkwellSize =
//       TestStore.store.tableStore.getPlayerZone("player_two", "inkwell")?.cards
//         .length || 0;
//     Expect(newInkwellSize).toBe(initialInkwellSize);
//   });
//
//   It("ENERGY CAPTURE - Does NOT trigger during your own turn", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [inkAmplifier],
//         Deck: 5,
//         Hand: [friendsOnTheOtherSide],
//         Inkwell: friendsOnTheOtherSide.cost,
//       },
//       {
//         Deck: 5,
//       },
//     );
//
//     Const initialInkwellSize =
//       TestStore.store.tableStore.getPlayerZone("player_one", "inkwell")?.cards
//         .length || 0;
//
//     // Player one (who owns Ink Amplifier) plays Friends on the Other Side
//     // which draws 2 cards during their own turn
//     Const songCard = testStore.getByZoneAndId("hand", friendsOnTheOtherSide.id);
//     SongCard.playFromHand();
//
//     // Should NOT trigger (only triggers during opponent's turn)
//     Expect(testStore.stackLayers.length).toBe(0);
//
//     // Inkwell size should remain unchanged
//     Const newInkwellSize =
//       TestStore.store.tableStore.getPlayerZone("player_one", "inkwell")?.cards
//         .length || 0;
//     Expect(newInkwellSize).toBe(initialInkwellSize);
//   });
// });
//
