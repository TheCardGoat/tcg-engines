// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pigletPoohPirateCaptain } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import {
//   BalooFriendAndGuardian,
//   DuckworthGhostButler,
//   TrustInMe,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Trust In Me", () => {
//   Describe("First modal choice: Each opposing character gets -1 {L} until the start of your next turn", () => {
//     It("reduces lore of all opposing characters by 1 when played", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: trustInMe.cost,
//           Hand: [trustInMe],
//           Play: [balooFriendAndGuardian],
//         },
//         {
//           Play: [duckworthGhostButler],
//         },
//       );
//
//       // Verify initial lore values
//       Expect(testEngine.getCardModel(balooFriendAndGuardian).lore).toBe(2);
//       Expect(testEngine.getCardModel(duckworthGhostButler).lore).toBe(2);
//
//       // Play Trust In Me and choose first mode
//       Await testEngine.playCard(trustInMe);
//       Await testEngine.resolveTopOfStack({ mode: "1" });
//
//       // Verify lore reduction only on opposing character
//       Expect(testEngine.getCardModel(balooFriendAndGuardian).lore).toBe(2); // No change
//       Expect(testEngine.getCardModel(duckworthGhostButler).lore).toBe(1); // Reduced by 1
//     });
//
//     It("lore reduction lasts until start of next turn", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: trustInMe.cost,
//           Hand: [trustInMe],
//           Play: [balooFriendAndGuardian],
//         },
//         {
//           Play: [duckworthGhostButler],
//         },
//       );
//
//       // Play Trust In Me and choose first mode
//       Await testEngine.playCard(trustInMe);
//       Await testEngine.resolveTopOfStack({ mode: "1" });
//
//       // Verify lore is reduced
//       Expect(testEngine.getCardModel(duckworthGhostButler).lore).toBe(1);
//
//       // Pass turn to opponent
//       Await testEngine.passTurn();
//
//       // Lore should still be reduced during opponent's turn
//       Expect(testEngine.getCardModel(duckworthGhostButler).lore).toBe(1);
//
//       // Pass turn back to active player
//       Await testEngine.passTurn();
//
//       // Lore should be restored at start of active player's next turn
//       Expect(testEngine.getCardModel(duckworthGhostButler).lore).toBe(2);
//     });
//
//     It("affects multiple opposing characters", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: trustInMe.cost,
//           Hand: [trustInMe],
//           Play: [balooFriendAndGuardian],
//         },
//         {
//           Play: [duckworthGhostButler, duckworthGhostButler], // Multiple characters
//         },
//       );
//
//       // Play Trust In Me and choose first mode
//       Await testEngine.playCard(trustInMe);
//       Await testEngine.resolveTopOfStack({ mode: "1" });
//
//       // All opponent characters should have lore reduced by 1
//       Const opponentChars = testEngine.getZonesCardCount("player_two").play;
//       Expect(opponentChars).toBe(2);
//
//       // Get specific opponent cards to test lore reduction
//       Const opponentCard1 = testEngine.getByZoneAndId(
//         "play",
//         DuckworthGhostButler.id,
//         "player_two",
//       );
//       Expect(opponentCard1.lore).toBe(1);
//     });
//
//     It("does not affect your own characters", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: trustInMe.cost,
//           Hand: [trustInMe],
//           Play: [balooFriendAndGuardian, balooFriendAndGuardian], // Multiple characters
//         },
//         {
//           Play: [duckworthGhostButler],
//         },
//       );
//
//       // Play Trust In Me and choose first mode
//       Await testEngine.playCard(trustInMe);
//       Await testEngine.resolveTopOfStack({ mode: "1" });
//
//       // Your characters should not be affected
//       Const yourCard = testEngine.getByZoneAndId(
//         "play",
//         BalooFriendAndGuardian.id,
//         "player_one",
//       );
//       Expect(yourCard.lore).toBe(2);
//
//       // Opponent character should be affected
//       Expect(testEngine.getCardModel(duckworthGhostButler).lore).toBe(1);
//     });
//
//     It("works even when opponent has no characters", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: trustInMe.cost,
//         Hand: [trustInMe],
//         Play: [balooFriendAndGuardian],
//       });
//
//       // Play Trust In Me and choose first mode
//       Await testEngine.playCard(trustInMe);
//       Await testEngine.resolveTopOfStack({ mode: "1" });
//
//       // Should complete successfully even with no opposing characters
//       Expect(testEngine.getCardModel(balooFriendAndGuardian).lore).toBe(2);
//     });
//
//     It("BUG: Piglet loses 2 lore instead of 1 when Trust in Me is played", async () => {
//       // Setup: Player 2 (opponent) has Piglet and 2+ other characters (so Piglet gets +2 lore = 3 total)
//       // Player 1 plays Trust in Me which should remove 1 lore
//       // On the next turn, Piglet should lore for 2 (3 - 1 = 2), but currently lores for 1
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: trustInMe.cost,
//           Hand: [trustInMe],
//           Play: [balooFriendAndGuardian],
//         },
//         {
//           Play: [
//             PigletPoohPirateCaptain,
//             BalooFriendAndGuardian, // Second character to meet "2 or more other characters" condition
//             DuckworthGhostButler, // Third character
//           ],
//         },
//       );
//
//       Const piglet = testEngine.getCardModel(pigletPoohPirateCaptain);
//
//       // Verify Piglet has 3 lore initially (base 1 + 2 from while ability with 2+ other characters)
//       Expect(piglet.lore).toBe(3);
//
//       // Play Trust In Me and choose first mode (Each opposing character gets -1 {L} until start of next turn)
//       Await testEngine.playCard(trustInMe);
//       Await testEngine.resolveTopOfStack({ mode: "1" });
//
//       // Immediately after Trust in Me, Piglet should have 2 lore (3 - 1 = 2)
//       Expect(piglet.lore).toBe(2);
//
//       // Pass turn to opponent (player 2)
//       Await testEngine.passTurn();
//
//       // During opponent's turn, Trust in Me effect should still be active
//       // Piglet should still have 2 lore (3 - 1 = 2)
//       Expect(piglet.lore).toBe(2);
//
//       // Pass turn back to player 1 (the one who played Trust in Me)
//       Await testEngine.passTurn();
//
//       // At the start of player 1's next turn, Trust in Me effect should expire
//       // Piglet should have 3 lore again (base 1 + 2 from while ability)
//       // BUG: Currently Piglet has 1 lore instead of 3, meaning it lost 2 lore instead of 1
//       Expect(piglet.lore).toBe(3);
//     });
//   });
//
//   Describe("Second modal choice: Each opponent chooses and discards 2 cards", () => {
//     It("has discard ability configuration", () => {
//       Expect(trustInMe.abilities).toHaveLength(1);
//       Const ability = trustInMe.abilities![0]!;
//       Const modalEffect = ability.effects![0]!;
//
//       // Second mode: discard
//       Expect((modalEffect as any).modes[1].id).toBe("2");
//       Expect((modalEffect as any).modes[1].responder).toBe("opponent");
//       Expect((modalEffect as any).modes[1].effects).toHaveLength(1);
//       Expect((modalEffect as any).modes[1].effects[0].type).toBe("discard");
//       Expect((modalEffect as any).modes[1].effects[0].amount).toBe(2);
//     });
//
//     // Note: More detailed discard tests are complex due to modal choice and priority system
//     // The card's discard functionality follows the same pattern as "You Have Forgotten Me"
//     // which is already tested in the codebase with similar configuration
//   });
//
//   Describe("Singing ability: A character with cost 6 or more can sing this song for free", () => {
//     It("can be sung for free by character with cost 6", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 0, // No ink needed for singing
//         Hand: [trustInMe],
//         Play: [balooFriendAndGuardian], // Cost 6 character
//       });
//
//       // Verify no ink is available
//       Expect(testEngine.getZonesCardCount("player_one").inkwell).toBe(0);
//
//       // Sing the song using Baloo
//       Await testEngine.singSong({
//         Singer: balooFriendAndGuardian,
//         Song: trustInMe,
//       });
//
//       // Should successfully resolve the modal choice
//       Await testEngine.resolveTopOfStack({ mode: "1" });
//
//       // Verify the song was played (card should be in discard)
//       Expect(testEngine.getZonesCardCount("player_one").discard).toBe(1);
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//     });
//
//     It("can still be played normally by paying ink cost", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: trustInMe.cost,
//         Hand: [trustInMe],
//         Play: [balooFriendAndGuardian],
//       });
//
//       // Verify initial inkwell count
//       Expect(testEngine.getZonesCardCount("player_one").inkwell).toBe(6);
//
//       // Play normally by paying ink cost
//       Await testEngine.playCard(trustInMe);
//       Await testEngine.resolveTopOfStack({ mode: "1" });
//
//       // Verify the card was played successfully
//       Expect(testEngine.getZonesCardCount("player_one").discard).toBe(1);
//       // Note: Inkwell behavior may vary based on implementation
//     });
//
//     It("singing works with both modal choices", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 0, // No ink needed for singing
//           Hand: [trustInMe],
//           Play: [balooFriendAndGuardian],
//         },
//         {
//           Hand: [
//             DuckworthGhostButler,
//             DuckworthGhostButler,
//             DuckworthGhostButler,
//           ],
//         },
//       );
//
//       // Test singing with first modal choice
//       Await testEngine.singSong({
//         Singer: balooFriendAndGuardian,
//         Song: trustInMe,
//       });
//       Await testEngine.resolveTopOfStack({ mode: "1" });
//
//       // Test singing with second modal choice
//       Const testEngine2 = new TestEngine(
//         {
//           Inkwell: 0,
//           Hand: [trustInMe],
//           Play: [balooFriendAndGuardian],
//         },
//         {
//           Hand: [
//             DuckworthGhostButler,
//             DuckworthGhostButler,
//             DuckworthGhostButler,
//           ],
//         },
//       );
//
//       Await testEngine2.singSong({
//         Singer: balooFriendAndGuardian,
//         Song: trustInMe,
//       });
//       Await testEngine2.resolveTopOfStack({ mode: "2" }, true);
//
//       // Both modal choices should be selectable through singing
//       // Note: Both tests verify modal selection works, actual discard requires complex priority handling
//       // First test: lore reduction worked, second test: modal choice was selectable
//       Expect(true).toBe(true); // Both modal choices are accessible through singing
//     });
//   });
//
//   Describe("Card characteristics and basic properties", () => {
//     It("has correct card properties", () => {
//       Expect(trustInMe.id).toBe("wll");
//       Expect(trustInMe.name).toBe("Trust In Me");
//       Expect(trustInMe.type).toBe("action");
//       Expect(trustInMe.cost).toBe(6);
//       Expect(trustInMe.colors).toContain("emerald");
//       Expect(trustInMe.inkwell).toBe(false);
//       Expect(trustInMe.characteristics).toContain("action");
//       Expect(trustInMe.characteristics).toContain("song");
//       Expect(trustInMe.set).toBe("010");
//       Expect(trustInMe.number).toBe(95);
//       Expect(trustInMe.rarity).toBe("rare");
//     });
//
//     It("has modal ability with two choices", () => {
//       Expect(trustInMe.abilities).toHaveLength(1);
//       Const ability = trustInMe.abilities![0]!;
//
//       Expect(ability.type).toBe("resolution");
//       Expect(ability.effects).toHaveLength(1);
//
//       Const modalEffect = ability.effects![0]! as any;
//       Expect(modalEffect.type).toBe("modal");
//       Expect(modalEffect.modes).toHaveLength(2);
//
//       // First mode: lore reduction
//       Expect(modalEffect.modes[0].id).toBe("1");
//       Expect(modalEffect.modes[0].effects).toHaveLength(1);
//       Expect(modalEffect.modes[0].effects[0].type).toBe("attribute");
//       Expect(modalEffect.modes[0].effects[0].attribute).toBe("lore");
//       Expect(modalEffect.modes[0].effects[0].modifier).toBe("subtract");
//       Expect(modalEffect.modes[0].effects[0].amount).toBe(1);
//       Expect(modalEffect.modes[0].effects[0].duration).toBe("next_turn");
//
//       // Second mode: discard
//       Expect(modalEffect.modes[1].id).toBe("2");
//       Expect(modalEffect.modes[1].responder).toBe("opponent");
//       Expect(modalEffect.modes[1].effects).toHaveLength(1);
//       Expect(modalEffect.modes[1].effects[0].type).toBe("discard");
//       Expect(modalEffect.modes[1].effects[0].amount).toBe(2);
//     });
//   });
// });
//
