// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   cinderellaGentleAndKind,
//   mickeyMouseTrueFriend,
//   moanaOfMotunui,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { iagoGiantSpectralParrot } from "@lorcanito/lorcana-engine/cards/007";
// import { swoopingStrike } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Swooping Strike", () => {
//   describe("Basic functionality", () => {
//     it("exerts one ready character from opponent when they have multiple characters", async () => {
//       // Arrange: Set up game with action in hand and opponent with multiple ready characters
//       const testEngine = new TestEngine(
//         {
//           inkwell: swoopingStrike.cost,
//           hand: [swoopingStrike],
//         },
//         {
//           play: [mickeyMouseTrueFriend, moanaOfMotunui], // Both ready characters
//         },
//       );
//
//       // Act: Play the action
//       await testEngine.playCard(swoopingStrike);
//
//       // Switch to opponent's perspective to resolve their choice
//       testEngine.testStore.changePlayer("player_two");
//       await testEngine.resolveTopOfStack({ targets: [mickeyMouseTrueFriend] });
//
//       // Switch back to original player
//       testEngine.testStore.changePlayer("player_one");
//
//       // Assert: The chosen character should be exerted
//       const opponentMickey = testEngine.getByZoneAndId(
//         "play",
//         mickeyMouseTrueFriend.id,
//         "player_two",
//       );
//       expect(opponentMickey.exerted).toBe(true);
//     });
//
//     it("exerts the single character when opponent has only one ready character", async () => {
//       // Arrange: Set up game with opponent having exactly one ready character
//       const testEngine = new TestEngine(
//         {
//           inkwell: swoopingStrike.cost,
//           hand: [swoopingStrike],
//         },
//         {
//           play: [mickeyMouseTrueFriend], // Only one character
//         },
//       );
//
//       // Act: Play the action
//       await testEngine.playCard(swoopingStrike);
//
//       // Switch to opponent's perspective to resolve their choice
//       testEngine.testStore.changePlayer("player_two");
//       await testEngine.resolveTopOfStack({ targets: [mickeyMouseTrueFriend] });
//
//       // Switch back to original player
//       testEngine.testStore.changePlayer("player_one");
//
//       // Assert: The single character should be exerted
//       const opponentCharacter = testEngine.getByZoneAndId(
//         "play",
//         mickeyMouseTrueFriend.id,
//         "player_two",
//       );
//       expect(opponentCharacter.exerted).toBe(true);
//     });
//
//     it("consumes ink when played normally", async () => {
//       // Arrange: Set up game with sufficient ink
//       const testEngine = new TestEngine({
//         inkwell: swoopingStrike.cost,
//         hand: [swoopingStrike],
//       });
//
//       const initialInk = testEngine.getAvailableInkwellCardCount();
//
//       // Act: Play the action (no opponents to resolve)
//       await testEngine.playCard(swoopingStrike);
//
//       // Assert: Ink should be consumed
//       const finalInk = testEngine.getAvailableInkwellCardCount();
//       expect(finalInk).toEqual(initialInk - swoopingStrike.cost);
//     });
//   });
//
//   describe("Edge cases", () => {
//     it("handles the case when opponent has no ready characters", async () => {
//       // Arrange: Set up game with opponent having only exerted characters
//       const testEngine = new TestEngine(
//         {
//           inkwell: swoopingStrike.cost,
//           hand: [swoopingStrike],
//         },
//         {
//           play: [mickeyMouseTrueFriend],
//         },
//       );
//
//       // Exert the opponent's character initially
//       await testEngine.exertCard(mickeyMouseTrueFriend, true);
//
//       const opponentCharacter = testEngine.getByZoneAndId(
//         "play",
//         mickeyMouseTrueFriend.id,
//         "player_two",
//       );
//       expect(opponentCharacter.exerted).toBe(true);
//
//       // Act: Play the action
//       await testEngine.playCard(swoopingStrike);
//
//       // Switch to opponent's perspective - they should have no valid targets
//       testEngine.testStore.changePlayer("player_two");
//
//       // The game should handle this gracefully - either no stack layer or successful resolution
//       if (testEngine.stackLayers.length > 0) {
//         try {
//           await testEngine.resolveTopOfStack({});
//         } catch (error) {
//           // Expected when no valid targets
//         }
//       }
//
//       // Switch back to original player
//       testEngine.testStore.changePlayer("player_one");
//
//       // Assert: Character should remain exerted (no change possible)
//       expect(opponentCharacter.exerted).toBe(true);
//     });
//
//     it("works when opponent has no characters at all", async () => {
//       // Arrange: Set up game with no opposing characters
//       const testEngine = new TestEngine({
//         inkwell: swoopingStrike.cost,
//         hand: [swoopingStrike],
//       });
//
//       // Act: Playing the action should resolve without error
//       await testEngine.playCard(swoopingStrike);
//
//       // Assert: Card should be in discard after playing
//       const card = testEngine.testStore.getByZoneAndId(
//         "discard",
//         swoopingStrike.id,
//         "player_one",
//       );
//       expect(card).toBeTruthy();
//     });
//
//     it("does not affect your own characters", async () => {
//       // Arrange: Set up game with your own ready characters
//       const testEngine = new TestEngine(
//         {
//           inkwell: swoopingStrike.cost,
//           hand: [swoopingStrike],
//           play: [cinderellaGentleAndKind], // Your ready character
//         },
//         {
//           play: [mickeyMouseTrueFriend], // Opponent's ready character
//         },
//       );
//
//       // Act: Play the action
//       await testEngine.playCard(swoopingStrike);
//
//       // Switch to opponent's perspective to resolve their choice
//       testEngine.testStore.changePlayer("player_two");
//       await testEngine.resolveTopOfStack({ targets: [mickeyMouseTrueFriend] });
//
//       // Switch back to original player
//       testEngine.testStore.changePlayer("player_one");
//
//       // Assert: Your character should not be exerted
//       const yourCharacter = testEngine.getByZoneAndId(
//         "play",
//         cinderellaGentleAndKind.id,
//         "player_one",
//       );
//       expect(yourCharacter.exerted).toBe(false);
//
//       // Opponent's character should be exerted
//       const opponentCharacter = testEngine.getByZoneAndId(
//         "play",
//         mickeyMouseTrueFriend.id,
//         "player_two",
//       );
//       expect(opponentCharacter.exerted).toBe(true);
//     });
//
//     it("does not banish Vanish character when opponent chooses their own character", async () => {
//       // Arrange: Set up game where opponent has a Vanish character
//       // When opponent chooses their own Vanish character, it should NOT trigger Vanish
//       const testEngine = new TestEngine(
//         {
//           inkwell: swoopingStrike.cost,
//           hand: [swoopingStrike],
//         },
//         {
//           play: [iagoGiantSpectralParrot], // Opponent's Vanish character
//         },
//       );
//
//       const opponentIago = testEngine.getByZoneAndId(
//         "play",
//         iagoGiantSpectralParrot.id,
//         "player_two",
//       );
//       expect(opponentIago.hasVanish).toBe(true);
//       expect(opponentIago.zone).toBe("play");
//
//       // Act: Play the action
//       await testEngine.playCard(swoopingStrike);
//
//       // Switch to opponent's perspective to resolve their choice
//       // They choose their own Iago
//       testEngine.testStore.changePlayer("player_two");
//       await testEngine.resolveTopOfStack({
//         targets: [iagoGiantSpectralParrot],
//       });
//
//       // Switch back to original player
//       testEngine.testStore.changePlayer("player_one");
//
//       // Assert: Iago should be exerted but NOT banished
//       // Vanish should not trigger because the opponent chose their own character
//       const iagoAfter = testEngine.getByZoneAndId(
//         "play",
//         iagoGiantSpectralParrot.id,
//         "player_two",
//       );
//       expect(iagoAfter.exerted).toBe(true);
//       expect(iagoAfter.zone).toBe("play"); // Should still be in play, not banished
//     });
//
//     it.skip("works correctly in multiplayer games", async () => {
//       // NOTE: TestEngine doesn't support more than 2 players. This test needs refactoring.
//       // Arrange: Set up 2-player game
//       const testEngine = new TestEngine(
//         {
//           inkwell: swoopingStrike.cost,
//           hand: [swoopingStrike],
//         },
//         {
//           play: [mickeyMouseTrueFriend], // Player 2: single character
//         },
//         true, // debug mode
//       );
//
//       // Act: Play the action
//       await testEngine.playCard(swoopingStrike);
//
//       // Resolve player 2's choice (if they need to choose)
//       testEngine.testStore.changePlayer("player_two");
//       if (testEngine.stackLayers.length > 0) {
//         await testEngine.resolveTopOfStack({
//           targets: [mickeyMouseTrueFriend],
//         });
//       }
//
//       // Resolve player 3's choice (if they need to choose)
//       testEngine.testStore.changePlayer("player_three");
//       if (testEngine.stackLayers.length > 0) {
//         await testEngine.resolveTopOfStack({
//           targets: [cinderellaGentleAndKind],
//         });
//       }
//
//       // Switch back to original player
//       testEngine.testStore.changePlayer("player_one");
//
//       // Assert: At least one opponent's character should be exerted
//       // The exact behavior depends on the game engine's implementation of "each opponent"
//       const player2Character = testEngine.getByZoneAndId(
//         "play",
//         mickeyMouseTrueFriend.id,
//         "player_two",
//       );
//
//       // Verify that the card was played and some effect occurred
//       expect(player2Character).toBeTruthy();
//
//       // The important thing is that the action doesn't crash in multiplayer
//       // and that opponents are prompted to make choices when appropriate
//       expect(
//         testEngine.testStore.getByZoneAndId(
//           "discard",
//           swoopingStrike.id,
//           "player_one",
//         ),
//       ).toBeTruthy();
//     });
//   });
//
//   describe("Card properties", () => {
//     it("has correct card properties", () => {
//       expect(swoopingStrike.id).toBe("r3n");
//       expect(swoopingStrike.name).toBe("Swooping Strike");
//       expect(swoopingStrike.type).toBe("action");
//       expect(swoopingStrike.cost).toBe(1);
//       expect(swoopingStrike.colors).toContain("amethyst");
//       expect(swoopingStrike.inkwell).toBe(true);
//       expect(swoopingStrike.characteristics).toContain("action");
//       expect(swoopingStrike.set).toBe("010");
//       expect(swoopingStrike.number).toBe(63);
//       expect(swoopingStrike.rarity).toBe("common");
//       expect(swoopingStrike.text).toBe(
//         "Each opponent chooses and exerts one of their ready characters.",
//       );
//     });
//
//     it("has correct ability configuration", () => {
//       expect(swoopingStrike.abilities).toHaveLength(1);
//       const ability = swoopingStrike.abilities![0]!;
//
//       expect(ability.type).toBe("resolution");
//       expect(ability.responder).toBe("opponent");
//       expect(ability.effects).toHaveLength(1);
//
//       const effect = ability.effects![0]!;
//       expect(effect.type).toBe("exert");
//
//       expect(effect.target.type).toBe("card");
//       expect(effect.target.value).toBe(1);
//
//       // Check that the target has proper filters for ready characters
//       expect(effect.target).toBeDefined();
//     });
//   });
// });
//
