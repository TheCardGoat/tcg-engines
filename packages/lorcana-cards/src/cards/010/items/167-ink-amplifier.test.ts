// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { friendsOnTheOtherSide } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// import { inkAmplifier } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Ink Amplifier", () => {
//   it("ENERGY CAPTURE - Triggers when opponent draws their second card during their turn", () => {
//     const testStore = new TestStore(
//       {
//         deck: 5,
//         hand: [friendsOnTheOtherSide],
//         inkwell: friendsOnTheOtherSide.cost,
//       },
//       {
//         play: [inkAmplifier],
//         deck: 5,
//       },
//     );
//
//     const initialInkwellSize =
//       testStore.store.tableStore.getPlayerZone("player_two", "inkwell")?.cards
//         .length || 0;
//
//     // Play Friends on the Other Side which draws 2 cards for the player
//     // First draw = beginning of turn (not trigger)
//     // Second draw from the song effect should trigger Ink Amplifier
//     const songCard = testStore.getByZoneAndId("hand", friendsOnTheOtherSide.id);
//     songCard.playFromHand();
//
//     // Change to player_two (who owns Ink Amplifier) so they can resolve their optional ability
//     testStore.changePlayer("player_two");
//
//     // Player two should be prompted to use optional ability
//     expect(testStore.stackLayers.length).toBeGreaterThan(0);
//
//     testStore.resolveOptionalAbility();
//
//     // Verify: Top card of player two's deck moved to inkwell
//     const newInkwellSize =
//       testStore.store.tableStore.getPlayerZone("player_two", "inkwell")?.cards
//         .length || 0;
//     expect(newInkwellSize).toBe(initialInkwellSize + 1);
//
//     // Verify: The inkwell card is exerted (ready = false)
//     const inkwellCardModels = testStore.getZonesCards("player_two").inkwell;
//     const topInkwellCard = inkwellCardModels[inkwellCardModels.length - 1];
//     expect(topInkwellCard).toBeDefined();
//     expect(topInkwellCard?.ready).toBe(false);
//   });
//
//   it("ENERGY CAPTURE - Does NOT trigger when opponent draws their first card", () => {
//     const testStore = new TestStore(
//       {
//         deck: 5,
//       },
//       {
//         play: [inkAmplifier],
//         deck: 5,
//       },
//     );
//
//     const initialInkwellSize =
//       testStore.store.tableStore.getPlayerZone("player_two", "inkwell")?.cards
//         .length || 0;
//
//     // Beginning of turn draw - first card drawn
//     // This should NOT trigger Ink Amplifier
//     testStore.passTurn();
//
//     // Should NOT have any triggers on the stack
//     expect(testStore.stackLayers.length).toBe(0);
//
//     // Inkwell size should remain unchanged
//     const newInkwellSize =
//       testStore.store.tableStore.getPlayerZone("player_two", "inkwell")?.cards
//         .length || 0;
//     expect(newInkwellSize).toBe(initialInkwellSize);
//   });
//
//   it("ENERGY CAPTURE - Does NOT trigger during your own turn", () => {
//     const testStore = new TestStore(
//       {
//         play: [inkAmplifier],
//         deck: 5,
//         hand: [friendsOnTheOtherSide],
//         inkwell: friendsOnTheOtherSide.cost,
//       },
//       {
//         deck: 5,
//       },
//     );
//
//     const initialInkwellSize =
//       testStore.store.tableStore.getPlayerZone("player_one", "inkwell")?.cards
//         .length || 0;
//
//     // Player one (who owns Ink Amplifier) plays Friends on the Other Side
//     // which draws 2 cards during their own turn
//     const songCard = testStore.getByZoneAndId("hand", friendsOnTheOtherSide.id);
//     songCard.playFromHand();
//
//     // Should NOT trigger (only triggers during opponent's turn)
//     expect(testStore.stackLayers.length).toBe(0);
//
//     // Inkwell size should remain unchanged
//     const newInkwellSize =
//       testStore.store.tableStore.getPlayerZone("player_one", "inkwell")?.cards
//         .length || 0;
//     expect(newInkwellSize).toBe(initialInkwellSize);
//   });
// });
//
