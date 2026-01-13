// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   gurgiAppleLover,
//   sleepyHollowTheBridge,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Sleepy Hollow - The Bridge", () => {
//   describe("HEAD FOR THE BRIDGE! Whenever a character quests while here, you may banish this location to gain 2 lore and give them Evasive until the start of your next turn.", () => {
//     it("should gain 2 lore, give Evasive, and banish the location when a character quests here", async () => {
//       const testEngine = new TestEngine({
//         inkwell: sleepyHollowTheBridge.moveCost,
//         play: [sleepyHollowTheBridge, gurgiAppleLover],
//       });
//
//       const location = testEngine.getCardModel(sleepyHollowTheBridge);
//       const character = testEngine.getCardModel(gurgiAppleLover);
//
//       // Move character to location
//       await testEngine.moveToLocation({
//         location: location,
//         character: character,
//       });
//
//       expect(location.zone).toBe("play");
//       expect(character.hasEvasive).toBe(false);
//
//       const loreBeforeQuest = testEngine.getLoreForPlayer("player_one");
//
//       // Character quests at the location
//       await testEngine.questCard(character);
//
//       // Accept the optional HEAD FOR THE BRIDGE! ability (it resolves automatically)
//       await testEngine.acceptOptionalAbility();
//
//       // Get fresh references after ability resolved
//       const locationAfter = testEngine.getCardModel(sleepyHollowTheBridge);
//       const characterAfter = testEngine.getCardModel(gurgiAppleLover);
//
//       // Location should be banished
//       expect(locationAfter.zone).toBe("discard");
//
//       // Should have gained 2 lore from ability + lore value from character questing
//       expect(testEngine.getLoreForPlayer("player_one")).toBe(
//         loreBeforeQuest + 2 + gurgiAppleLover.lore,
//       );
//
//       // Character should still be in play
//       expect(characterAfter.zone).toBe("play");
//
//       // Character should have Evasive immediately after ability resolves
//       expect(characterAfter.hasEvasive).toBe(true);
//
//       // Pass turn to opponent
//       testEngine.passTurn();
//
//       // Get reference during opponent's turn
//       const charDuringOpponentTurn = testEngine.getCardModel(gurgiAppleLover);
//
//       // Evasive should still be active during opponent's turn (duration: "next_turn", until: true)
//       expect(charDuringOpponentTurn.hasEvasive).toBe(true);
//
//       // Pass turn back to player_one (start of next turn)
//       testEngine.passTurn();
//
//       // Get reference at start of player_one's next turn
//       const charAtStartOfNextTurn = testEngine.getCardModel(gurgiAppleLover);
//
//       // Evasive should be removed at the start of player_one's next turn
//       expect(charAtStartOfNextTurn.hasEvasive).toBe(false);
//     });
//
//     it("should not trigger if character quests elsewhere", async () => {
//       const testEngine = new TestEngine({
//         play: [sleepyHollowTheBridge, gurgiAppleLover],
//       });
//
//       const location = testEngine.getCardModel(sleepyHollowTheBridge);
//       const character = testEngine.getCardModel(gurgiAppleLover);
//
//       const loreBeforeQuest = testEngine.getLoreForPlayer("player_one");
//
//       // Character quests NOT at the location
//       await testEngine.questCard(character);
//
//       // Location should still be in play
//       expect(location.zone).toBe("play");
//
//       // Should only gain lore from character, not from ability
//       expect(testEngine.getLoreForPlayer("player_one")).toBe(
//         loreBeforeQuest + gurgiAppleLover.lore,
//       );
//
//       // Character should not have Evasive
//       expect(character.hasEvasive).toBe(false);
//     });
//
//     it("should allow declining the optional ability", async () => {
//       const testEngine = new TestEngine({
//         inkwell: sleepyHollowTheBridge.moveCost,
//         play: [sleepyHollowTheBridge, gurgiAppleLover],
//       });
//
//       const location = testEngine.getCardModel(sleepyHollowTheBridge);
//       const character = testEngine.getCardModel(gurgiAppleLover);
//
//       // Move character to location
//       await testEngine.moveToLocation({
//         location: location,
//         character: character,
//       });
//
//       const loreBeforeQuest = testEngine.getLoreForPlayer("player_one");
//
//       // Character quests at the location
//       await testEngine.questCard(character);
//
//       // Decline the optional HEAD FOR THE BRIDGE! ability
//       await testEngine.skipTopOfStack();
//
//       // Location should still be in play
//       expect(location.zone).toBe("play");
//
//       // Character should not have Evasive
//       expect(character.hasEvasive).toBe(false);
//
//       // Should only gain lore from character questing
//       expect(testEngine.getLoreForPlayer("player_one")).toBe(
//         loreBeforeQuest + gurgiAppleLover.lore,
//       );
//     });
//   });
// });
//
