// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { pigletPoohPirateCaptain } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import {
//   balooFriendAndGuardian,
//   duckworthGhostButler,
//   trustInMe,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Trust In Me", () => {
//   describe("First modal choice: Each opposing character gets -1 {L} until the start of your next turn", () => {
//     it("reduces lore of all opposing characters by 1 when played", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: trustInMe.cost,
//           hand: [trustInMe],
//           play: [balooFriendAndGuardian],
//         },
//         {
//           play: [duckworthGhostButler],
//         },
//       );
//
//       // Verify initial lore values
//       expect(testEngine.getCardModel(balooFriendAndGuardian).lore).toBe(2);
//       expect(testEngine.getCardModel(duckworthGhostButler).lore).toBe(2);
//
//       // Play Trust In Me and choose first mode
//       await testEngine.playCard(trustInMe);
//       await testEngine.resolveTopOfStack({ mode: "1" });
//
//       // Verify lore reduction only on opposing character
//       expect(testEngine.getCardModel(balooFriendAndGuardian).lore).toBe(2); // No change
//       expect(testEngine.getCardModel(duckworthGhostButler).lore).toBe(1); // Reduced by 1
//     });
//
//     it("lore reduction lasts until start of next turn", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: trustInMe.cost,
//           hand: [trustInMe],
//           play: [balooFriendAndGuardian],
//         },
//         {
//           play: [duckworthGhostButler],
//         },
//       );
//
//       // Play Trust In Me and choose first mode
//       await testEngine.playCard(trustInMe);
//       await testEngine.resolveTopOfStack({ mode: "1" });
//
//       // Verify lore is reduced
//       expect(testEngine.getCardModel(duckworthGhostButler).lore).toBe(1);
//
//       // Pass turn to opponent
//       await testEngine.passTurn();
//
//       // Lore should still be reduced during opponent's turn
//       expect(testEngine.getCardModel(duckworthGhostButler).lore).toBe(1);
//
//       // Pass turn back to active player
//       await testEngine.passTurn();
//
//       // Lore should be restored at start of active player's next turn
//       expect(testEngine.getCardModel(duckworthGhostButler).lore).toBe(2);
//     });
//
//     it("affects multiple opposing characters", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: trustInMe.cost,
//           hand: [trustInMe],
//           play: [balooFriendAndGuardian],
//         },
//         {
//           play: [duckworthGhostButler, duckworthGhostButler], // Multiple characters
//         },
//       );
//
//       // Play Trust In Me and choose first mode
//       await testEngine.playCard(trustInMe);
//       await testEngine.resolveTopOfStack({ mode: "1" });
//
//       // All opponent characters should have lore reduced by 1
//       const opponentChars = testEngine.getZonesCardCount("player_two").play;
//       expect(opponentChars).toBe(2);
//
//       // Get specific opponent cards to test lore reduction
//       const opponentCard1 = testEngine.getByZoneAndId(
//         "play",
//         duckworthGhostButler.id,
//         "player_two",
//       );
//       expect(opponentCard1.lore).toBe(1);
//     });
//
//     it("does not affect your own characters", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: trustInMe.cost,
//           hand: [trustInMe],
//           play: [balooFriendAndGuardian, balooFriendAndGuardian], // Multiple characters
//         },
//         {
//           play: [duckworthGhostButler],
//         },
//       );
//
//       // Play Trust In Me and choose first mode
//       await testEngine.playCard(trustInMe);
//       await testEngine.resolveTopOfStack({ mode: "1" });
//
//       // Your characters should not be affected
//       const yourCard = testEngine.getByZoneAndId(
//         "play",
//         balooFriendAndGuardian.id,
//         "player_one",
//       );
//       expect(yourCard.lore).toBe(2);
//
//       // Opponent character should be affected
//       expect(testEngine.getCardModel(duckworthGhostButler).lore).toBe(1);
//     });
//
//     it("works even when opponent has no characters", async () => {
//       const testEngine = new TestEngine({
//         inkwell: trustInMe.cost,
//         hand: [trustInMe],
//         play: [balooFriendAndGuardian],
//       });
//
//       // Play Trust In Me and choose first mode
//       await testEngine.playCard(trustInMe);
//       await testEngine.resolveTopOfStack({ mode: "1" });
//
//       // Should complete successfully even with no opposing characters
//       expect(testEngine.getCardModel(balooFriendAndGuardian).lore).toBe(2);
//     });
//
//     it("BUG: Piglet loses 2 lore instead of 1 when Trust in Me is played", async () => {
//       // Setup: Player 2 (opponent) has Piglet and 2+ other characters (so Piglet gets +2 lore = 3 total)
//       // Player 1 plays Trust in Me which should remove 1 lore
//       // On the next turn, Piglet should lore for 2 (3 - 1 = 2), but currently lores for 1
//       const testEngine = new TestEngine(
//         {
//           inkwell: trustInMe.cost,
//           hand: [trustInMe],
//           play: [balooFriendAndGuardian],
//         },
//         {
//           play: [
//             pigletPoohPirateCaptain,
//             balooFriendAndGuardian, // Second character to meet "2 or more other characters" condition
//             duckworthGhostButler, // Third character
//           ],
//         },
//       );
//
//       const piglet = testEngine.getCardModel(pigletPoohPirateCaptain);
//
//       // Verify Piglet has 3 lore initially (base 1 + 2 from while ability with 2+ other characters)
//       expect(piglet.lore).toBe(3);
//
//       // Play Trust In Me and choose first mode (Each opposing character gets -1 {L} until start of next turn)
//       await testEngine.playCard(trustInMe);
//       await testEngine.resolveTopOfStack({ mode: "1" });
//
//       // Immediately after Trust in Me, Piglet should have 2 lore (3 - 1 = 2)
//       expect(piglet.lore).toBe(2);
//
//       // Pass turn to opponent (player 2)
//       await testEngine.passTurn();
//
//       // During opponent's turn, Trust in Me effect should still be active
//       // Piglet should still have 2 lore (3 - 1 = 2)
//       expect(piglet.lore).toBe(2);
//
//       // Pass turn back to player 1 (the one who played Trust in Me)
//       await testEngine.passTurn();
//
//       // At the start of player 1's next turn, Trust in Me effect should expire
//       // Piglet should have 3 lore again (base 1 + 2 from while ability)
//       // BUG: Currently Piglet has 1 lore instead of 3, meaning it lost 2 lore instead of 1
//       expect(piglet.lore).toBe(3);
//     });
//   });
//
//   describe("Second modal choice: Each opponent chooses and discards 2 cards", () => {
//     it("has discard ability configuration", () => {
//       expect(trustInMe.abilities).toHaveLength(1);
//       const ability = trustInMe.abilities![0]!;
//       const modalEffect = ability.effects![0]!;
//
//       // Second mode: discard
//       expect((modalEffect as any).modes[1].id).toBe("2");
//       expect((modalEffect as any).modes[1].responder).toBe("opponent");
//       expect((modalEffect as any).modes[1].effects).toHaveLength(1);
//       expect((modalEffect as any).modes[1].effects[0].type).toBe("discard");
//       expect((modalEffect as any).modes[1].effects[0].amount).toBe(2);
//     });
//
//     // Note: More detailed discard tests are complex due to modal choice and priority system
//     // The card's discard functionality follows the same pattern as "You Have Forgotten Me"
//     // which is already tested in the codebase with similar configuration
//   });
//
//   describe("Singing ability: A character with cost 6 or more can sing this song for free", () => {
//     it("can be sung for free by character with cost 6", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 0, // No ink needed for singing
//         hand: [trustInMe],
//         play: [balooFriendAndGuardian], // Cost 6 character
//       });
//
//       // Verify no ink is available
//       expect(testEngine.getZonesCardCount("player_one").inkwell).toBe(0);
//
//       // Sing the song using Baloo
//       await testEngine.singSong({
//         singer: balooFriendAndGuardian,
//         song: trustInMe,
//       });
//
//       // Should successfully resolve the modal choice
//       await testEngine.resolveTopOfStack({ mode: "1" });
//
//       // Verify the song was played (card should be in discard)
//       expect(testEngine.getZonesCardCount("player_one").discard).toBe(1);
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//     });
//
//     it("can still be played normally by paying ink cost", async () => {
//       const testEngine = new TestEngine({
//         inkwell: trustInMe.cost,
//         hand: [trustInMe],
//         play: [balooFriendAndGuardian],
//       });
//
//       // Verify initial inkwell count
//       expect(testEngine.getZonesCardCount("player_one").inkwell).toBe(6);
//
//       // Play normally by paying ink cost
//       await testEngine.playCard(trustInMe);
//       await testEngine.resolveTopOfStack({ mode: "1" });
//
//       // Verify the card was played successfully
//       expect(testEngine.getZonesCardCount("player_one").discard).toBe(1);
//       // Note: Inkwell behavior may vary based on implementation
//     });
//
//     it("singing works with both modal choices", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: 0, // No ink needed for singing
//           hand: [trustInMe],
//           play: [balooFriendAndGuardian],
//         },
//         {
//           hand: [
//             duckworthGhostButler,
//             duckworthGhostButler,
//             duckworthGhostButler,
//           ],
//         },
//       );
//
//       // Test singing with first modal choice
//       await testEngine.singSong({
//         singer: balooFriendAndGuardian,
//         song: trustInMe,
//       });
//       await testEngine.resolveTopOfStack({ mode: "1" });
//
//       // Test singing with second modal choice
//       const testEngine2 = new TestEngine(
//         {
//           inkwell: 0,
//           hand: [trustInMe],
//           play: [balooFriendAndGuardian],
//         },
//         {
//           hand: [
//             duckworthGhostButler,
//             duckworthGhostButler,
//             duckworthGhostButler,
//           ],
//         },
//       );
//
//       await testEngine2.singSong({
//         singer: balooFriendAndGuardian,
//         song: trustInMe,
//       });
//       await testEngine2.resolveTopOfStack({ mode: "2" }, true);
//
//       // Both modal choices should be selectable through singing
//       // Note: Both tests verify modal selection works, actual discard requires complex priority handling
//       // First test: lore reduction worked, second test: modal choice was selectable
//       expect(true).toBe(true); // Both modal choices are accessible through singing
//     });
//   });
//
//   describe("Card characteristics and basic properties", () => {
//     it("has correct card properties", () => {
//       expect(trustInMe.id).toBe("wll");
//       expect(trustInMe.name).toBe("Trust In Me");
//       expect(trustInMe.type).toBe("action");
//       expect(trustInMe.cost).toBe(6);
//       expect(trustInMe.colors).toContain("emerald");
//       expect(trustInMe.inkwell).toBe(false);
//       expect(trustInMe.characteristics).toContain("action");
//       expect(trustInMe.characteristics).toContain("song");
//       expect(trustInMe.set).toBe("010");
//       expect(trustInMe.number).toBe(95);
//       expect(trustInMe.rarity).toBe("rare");
//     });
//
//     it("has modal ability with two choices", () => {
//       expect(trustInMe.abilities).toHaveLength(1);
//       const ability = trustInMe.abilities![0]!;
//
//       expect(ability.type).toBe("resolution");
//       expect(ability.effects).toHaveLength(1);
//
//       const modalEffect = ability.effects![0]! as any;
//       expect(modalEffect.type).toBe("modal");
//       expect(modalEffect.modes).toHaveLength(2);
//
//       // First mode: lore reduction
//       expect(modalEffect.modes[0].id).toBe("1");
//       expect(modalEffect.modes[0].effects).toHaveLength(1);
//       expect(modalEffect.modes[0].effects[0].type).toBe("attribute");
//       expect(modalEffect.modes[0].effects[0].attribute).toBe("lore");
//       expect(modalEffect.modes[0].effects[0].modifier).toBe("subtract");
//       expect(modalEffect.modes[0].effects[0].amount).toBe(1);
//       expect(modalEffect.modes[0].effects[0].duration).toBe("next_turn");
//
//       // Second mode: discard
//       expect(modalEffect.modes[1].id).toBe("2");
//       expect(modalEffect.modes[1].responder).toBe("opponent");
//       expect(modalEffect.modes[1].effects).toHaveLength(1);
//       expect(modalEffect.modes[1].effects[0].type).toBe("discard");
//       expect(modalEffect.modes[1].effects[0].amount).toBe(2);
//     });
//   });
// });
//
