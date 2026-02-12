// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GurgiAppleLover,
//   SleepyHollowTheBridge,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Sleepy Hollow - The Bridge", () => {
//   Describe("HEAD FOR THE BRIDGE! Whenever a character quests while here, you may banish this location to gain 2 lore and give them Evasive until the start of your next turn.", () => {
//     It("should gain 2 lore, give Evasive, and banish the location when a character quests here", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: sleepyHollowTheBridge.moveCost,
//         Play: [sleepyHollowTheBridge, gurgiAppleLover],
//       });
//
//       Const location = testEngine.getCardModel(sleepyHollowTheBridge);
//       Const character = testEngine.getCardModel(gurgiAppleLover);
//
//       // Move character to location
//       Await testEngine.moveToLocation({
//         Location: location,
//         Character: character,
//       });
//
//       Expect(location.zone).toBe("play");
//       Expect(character.hasEvasive).toBe(false);
//
//       Const loreBeforeQuest = testEngine.getLoreForPlayer("player_one");
//
//       // Character quests at the location
//       Await testEngine.questCard(character);
//
//       // Accept the optional HEAD FOR THE BRIDGE! ability (it resolves automatically)
//       Await testEngine.acceptOptionalAbility();
//
//       // Get fresh references after ability resolved
//       Const locationAfter = testEngine.getCardModel(sleepyHollowTheBridge);
//       Const characterAfter = testEngine.getCardModel(gurgiAppleLover);
//
//       // Location should be banished
//       Expect(locationAfter.zone).toBe("discard");
//
//       // Should have gained 2 lore from ability + lore value from character questing
//       Expect(testEngine.getLoreForPlayer("player_one")).toBe(
//         LoreBeforeQuest + 2 + gurgiAppleLover.lore,
//       );
//
//       // Character should still be in play
//       Expect(characterAfter.zone).toBe("play");
//
//       // Character should have Evasive immediately after ability resolves
//       Expect(characterAfter.hasEvasive).toBe(true);
//
//       // Pass turn to opponent
//       TestEngine.passTurn();
//
//       // Get reference during opponent's turn
//       Const charDuringOpponentTurn = testEngine.getCardModel(gurgiAppleLover);
//
//       // Evasive should still be active during opponent's turn (duration: "next_turn", until: true)
//       Expect(charDuringOpponentTurn.hasEvasive).toBe(true);
//
//       // Pass turn back to player_one (start of next turn)
//       TestEngine.passTurn();
//
//       // Get reference at start of player_one's next turn
//       Const charAtStartOfNextTurn = testEngine.getCardModel(gurgiAppleLover);
//
//       // Evasive should be removed at the start of player_one's next turn
//       Expect(charAtStartOfNextTurn.hasEvasive).toBe(false);
//     });
//
//     It("should not trigger if character quests elsewhere", async () => {
//       Const testEngine = new TestEngine({
//         Play: [sleepyHollowTheBridge, gurgiAppleLover],
//       });
//
//       Const location = testEngine.getCardModel(sleepyHollowTheBridge);
//       Const character = testEngine.getCardModel(gurgiAppleLover);
//
//       Const loreBeforeQuest = testEngine.getLoreForPlayer("player_one");
//
//       // Character quests NOT at the location
//       Await testEngine.questCard(character);
//
//       // Location should still be in play
//       Expect(location.zone).toBe("play");
//
//       // Should only gain lore from character, not from ability
//       Expect(testEngine.getLoreForPlayer("player_one")).toBe(
//         LoreBeforeQuest + gurgiAppleLover.lore,
//       );
//
//       // Character should not have Evasive
//       Expect(character.hasEvasive).toBe(false);
//     });
//
//     It("should allow declining the optional ability", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: sleepyHollowTheBridge.moveCost,
//         Play: [sleepyHollowTheBridge, gurgiAppleLover],
//       });
//
//       Const location = testEngine.getCardModel(sleepyHollowTheBridge);
//       Const character = testEngine.getCardModel(gurgiAppleLover);
//
//       // Move character to location
//       Await testEngine.moveToLocation({
//         Location: location,
//         Character: character,
//       });
//
//       Const loreBeforeQuest = testEngine.getLoreForPlayer("player_one");
//
//       // Character quests at the location
//       Await testEngine.questCard(character);
//
//       // Decline the optional HEAD FOR THE BRIDGE! ability
//       Await testEngine.skipTopOfStack();
//
//       // Location should still be in play
//       Expect(location.zone).toBe("play");
//
//       // Character should not have Evasive
//       Expect(character.hasEvasive).toBe(false);
//
//       // Should only gain lore from character questing
//       Expect(testEngine.getLoreForPlayer("player_one")).toBe(
//         LoreBeforeQuest + gurgiAppleLover.lore,
//       );
//     });
//   });
// });
//
