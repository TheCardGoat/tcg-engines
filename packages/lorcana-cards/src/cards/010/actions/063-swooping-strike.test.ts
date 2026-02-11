// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CinderellaGentleAndKind,
//   MickeyMouseTrueFriend,
//   MoanaOfMotunui,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { iagoGiantSpectralParrot } from "@lorcanito/lorcana-engine/cards/007";
// Import { swoopingStrike } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Swooping Strike", () => {
//   Describe("Basic functionality", () => {
//     It("exerts one ready character from opponent when they have multiple characters", async () => {
//       // Arrange: Set up game with action in hand and opponent with multiple ready characters
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: swoopingStrike.cost,
//           Hand: [swoopingStrike],
//         },
//         {
//           Play: [mickeyMouseTrueFriend, moanaOfMotunui], // Both ready characters
//         },
//       );
//
//       // Act: Play the action
//       Await testEngine.playCard(swoopingStrike);
//
//       // Switch to opponent's perspective to resolve their choice
//       TestEngine.testStore.changePlayer("player_two");
//       Await testEngine.resolveTopOfStack({ targets: [mickeyMouseTrueFriend] });
//
//       // Switch back to original player
//       TestEngine.testStore.changePlayer("player_one");
//
//       // Assert: The chosen character should be exerted
//       Const opponentMickey = testEngine.getByZoneAndId(
//         "play",
//         MickeyMouseTrueFriend.id,
//         "player_two",
//       );
//       Expect(opponentMickey.exerted).toBe(true);
//     });
//
//     It("exerts the single character when opponent has only one ready character", async () => {
//       // Arrange: Set up game with opponent having exactly one ready character
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: swoopingStrike.cost,
//           Hand: [swoopingStrike],
//         },
//         {
//           Play: [mickeyMouseTrueFriend], // Only one character
//         },
//       );
//
//       // Act: Play the action
//       Await testEngine.playCard(swoopingStrike);
//
//       // Switch to opponent's perspective to resolve their choice
//       TestEngine.testStore.changePlayer("player_two");
//       Await testEngine.resolveTopOfStack({ targets: [mickeyMouseTrueFriend] });
//
//       // Switch back to original player
//       TestEngine.testStore.changePlayer("player_one");
//
//       // Assert: The single character should be exerted
//       Const opponentCharacter = testEngine.getByZoneAndId(
//         "play",
//         MickeyMouseTrueFriend.id,
//         "player_two",
//       );
//       Expect(opponentCharacter.exerted).toBe(true);
//     });
//
//     It("consumes ink when played normally", async () => {
//       // Arrange: Set up game with sufficient ink
//       Const testEngine = new TestEngine({
//         Inkwell: swoopingStrike.cost,
//         Hand: [swoopingStrike],
//       });
//
//       Const initialInk = testEngine.getAvailableInkwellCardCount();
//
//       // Act: Play the action (no opponents to resolve)
//       Await testEngine.playCard(swoopingStrike);
//
//       // Assert: Ink should be consumed
//       Const finalInk = testEngine.getAvailableInkwellCardCount();
//       Expect(finalInk).toEqual(initialInk - swoopingStrike.cost);
//     });
//   });
//
//   Describe("Edge cases", () => {
//     It("handles the case when opponent has no ready characters", async () => {
//       // Arrange: Set up game with opponent having only exerted characters
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: swoopingStrike.cost,
//           Hand: [swoopingStrike],
//         },
//         {
//           Play: [mickeyMouseTrueFriend],
//         },
//       );
//
//       // Exert the opponent's character initially
//       Await testEngine.exertCard(mickeyMouseTrueFriend, true);
//
//       Const opponentCharacter = testEngine.getByZoneAndId(
//         "play",
//         MickeyMouseTrueFriend.id,
//         "player_two",
//       );
//       Expect(opponentCharacter.exerted).toBe(true);
//
//       // Act: Play the action
//       Await testEngine.playCard(swoopingStrike);
//
//       // Switch to opponent's perspective - they should have no valid targets
//       TestEngine.testStore.changePlayer("player_two");
//
//       // The game should handle this gracefully - either no stack layer or successful resolution
//       If (testEngine.stackLayers.length > 0) {
//         Try {
//           Await testEngine.resolveTopOfStack({});
//         } catch (error) {
//           // Expected when no valid targets
//         }
//       }
//
//       // Switch back to original player
//       TestEngine.testStore.changePlayer("player_one");
//
//       // Assert: Character should remain exerted (no change possible)
//       Expect(opponentCharacter.exerted).toBe(true);
//     });
//
//     It("works when opponent has no characters at all", async () => {
//       // Arrange: Set up game with no opposing characters
//       Const testEngine = new TestEngine({
//         Inkwell: swoopingStrike.cost,
//         Hand: [swoopingStrike],
//       });
//
//       // Act: Playing the action should resolve without error
//       Await testEngine.playCard(swoopingStrike);
//
//       // Assert: Card should be in discard after playing
//       Const card = testEngine.testStore.getByZoneAndId(
//         "discard",
//         SwoopingStrike.id,
//         "player_one",
//       );
//       Expect(card).toBeTruthy();
//     });
//
//     It("does not affect your own characters", async () => {
//       // Arrange: Set up game with your own ready characters
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: swoopingStrike.cost,
//           Hand: [swoopingStrike],
//           Play: [cinderellaGentleAndKind], // Your ready character
//         },
//         {
//           Play: [mickeyMouseTrueFriend], // Opponent's ready character
//         },
//       );
//
//       // Act: Play the action
//       Await testEngine.playCard(swoopingStrike);
//
//       // Switch to opponent's perspective to resolve their choice
//       TestEngine.testStore.changePlayer("player_two");
//       Await testEngine.resolveTopOfStack({ targets: [mickeyMouseTrueFriend] });
//
//       // Switch back to original player
//       TestEngine.testStore.changePlayer("player_one");
//
//       // Assert: Your character should not be exerted
//       Const yourCharacter = testEngine.getByZoneAndId(
//         "play",
//         CinderellaGentleAndKind.id,
//         "player_one",
//       );
//       Expect(yourCharacter.exerted).toBe(false);
//
//       // Opponent's character should be exerted
//       Const opponentCharacter = testEngine.getByZoneAndId(
//         "play",
//         MickeyMouseTrueFriend.id,
//         "player_two",
//       );
//       Expect(opponentCharacter.exerted).toBe(true);
//     });
//
//     It("does not banish Vanish character when opponent chooses their own character", async () => {
//       // Arrange: Set up game where opponent has a Vanish character
//       // When opponent chooses their own Vanish character, it should NOT trigger Vanish
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: swoopingStrike.cost,
//           Hand: [swoopingStrike],
//         },
//         {
//           Play: [iagoGiantSpectralParrot], // Opponent's Vanish character
//         },
//       );
//
//       Const opponentIago = testEngine.getByZoneAndId(
//         "play",
//         IagoGiantSpectralParrot.id,
//         "player_two",
//       );
//       Expect(opponentIago.hasVanish).toBe(true);
//       Expect(opponentIago.zone).toBe("play");
//
//       // Act: Play the action
//       Await testEngine.playCard(swoopingStrike);
//
//       // Switch to opponent's perspective to resolve their choice
//       // They choose their own Iago
//       TestEngine.testStore.changePlayer("player_two");
//       Await testEngine.resolveTopOfStack({
//         Targets: [iagoGiantSpectralParrot],
//       });
//
//       // Switch back to original player
//       TestEngine.testStore.changePlayer("player_one");
//
//       // Assert: Iago should be exerted but NOT banished
//       // Vanish should not trigger because the opponent chose their own character
//       Const iagoAfter = testEngine.getByZoneAndId(
//         "play",
//         IagoGiantSpectralParrot.id,
//         "player_two",
//       );
//       Expect(iagoAfter.exerted).toBe(true);
//       Expect(iagoAfter.zone).toBe("play"); // Should still be in play, not banished
//     });
//
//     It.skip("works correctly in multiplayer games", async () => {
//       // NOTE: TestEngine doesn't support more than 2 players. This test needs refactoring.
//       // Arrange: Set up 2-player game
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: swoopingStrike.cost,
//           Hand: [swoopingStrike],
//         },
//         {
//           Play: [mickeyMouseTrueFriend], // Player 2: single character
//         },
//         True, // debug mode
//       );
//
//       // Act: Play the action
//       Await testEngine.playCard(swoopingStrike);
//
//       // Resolve player 2's choice (if they need to choose)
//       TestEngine.testStore.changePlayer("player_two");
//       If (testEngine.stackLayers.length > 0) {
//         Await testEngine.resolveTopOfStack({
//           Targets: [mickeyMouseTrueFriend],
//         });
//       }
//
//       // Resolve player 3's choice (if they need to choose)
//       TestEngine.testStore.changePlayer("player_three");
//       If (testEngine.stackLayers.length > 0) {
//         Await testEngine.resolveTopOfStack({
//           Targets: [cinderellaGentleAndKind],
//         });
//       }
//
//       // Switch back to original player
//       TestEngine.testStore.changePlayer("player_one");
//
//       // Assert: At least one opponent's character should be exerted
//       // The exact behavior depends on the game engine's implementation of "each opponent"
//       Const player2Character = testEngine.getByZoneAndId(
//         "play",
//         MickeyMouseTrueFriend.id,
//         "player_two",
//       );
//
//       // Verify that the card was played and some effect occurred
//       Expect(player2Character).toBeTruthy();
//
//       // The important thing is that the action doesn't crash in multiplayer
//       // and that opponents are prompted to make choices when appropriate
//       Expect(
//         TestEngine.testStore.getByZoneAndId(
//           "discard",
//           SwoopingStrike.id,
//           "player_one",
//         ),
//       ).toBeTruthy();
//     });
//   });
//
//   Describe("Card properties", () => {
//     It("has correct card properties", () => {
//       Expect(swoopingStrike.id).toBe("r3n");
//       Expect(swoopingStrike.name).toBe("Swooping Strike");
//       Expect(swoopingStrike.type).toBe("action");
//       Expect(swoopingStrike.cost).toBe(1);
//       Expect(swoopingStrike.colors).toContain("amethyst");
//       Expect(swoopingStrike.inkwell).toBe(true);
//       Expect(swoopingStrike.characteristics).toContain("action");
//       Expect(swoopingStrike.set).toBe("010");
//       Expect(swoopingStrike.number).toBe(63);
//       Expect(swoopingStrike.rarity).toBe("common");
//       Expect(swoopingStrike.text).toBe(
//         "Each opponent chooses and exerts one of their ready characters.",
//       );
//     });
//
//     It("has correct ability configuration", () => {
//       Expect(swoopingStrike.abilities).toHaveLength(1);
//       Const ability = swoopingStrike.abilities![0]!;
//
//       Expect(ability.type).toBe("resolution");
//       Expect(ability.responder).toBe("opponent");
//       Expect(ability.effects).toHaveLength(1);
//
//       Const effect = ability.effects![0]!;
//       Expect(effect.type).toBe("exert");
//
//       Expect(effect.target.type).toBe("card");
//       Expect(effect.target.value).toBe(1);
//
//       // Check that the target has proper filters for ready characters
//       Expect(effect.target).toBeDefined();
//     });
//   });
// });
//
