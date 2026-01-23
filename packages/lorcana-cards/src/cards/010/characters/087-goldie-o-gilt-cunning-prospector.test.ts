// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   galacticCouncilChamber,
//   skullRockIsolatedFortress,
//   treasureMountainAzuriteSeaIsland,
// } from "@lorcanito/lorcana-engine/cards/006/index";
// import {
//   goldieOgiltCunningProspector,
//   mickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Goldie O'gilt - Cunning Prospector", () => {
//   describe("CLAIM JUMPER - When you play this character, chosen opponent reveals their hand and discards a location card of your choice", () => {
//     it("should reveal opponent's hand and allow choosing a location to discard", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: goldieOgiltCunningProspector.cost,
//           hand: [goldieOgiltCunningProspector],
//         },
//         {
//           hand: [
//             skullRockIsolatedFortress,
//             treasureMountainAzuriteSeaIsland,
//             mickeyMouseDetective,
//           ],
//         },
//       );
//
//       const opponentsHand = testEngine.getCardsByZone("hand", "player_two");
//       const locationToDiscard = testEngine.getCardModel(
//         skullRockIsolatedFortress,
//       );
//
//       expect(opponentsHand.length).toBe(3);
//       expect(opponentsHand.every((card) => card.meta.revealed)).toBe(false);
//
//       await testEngine.playCard(goldieOgiltCunningProspector);
//       await testEngine.resolveTopOfStack({ targets: [locationToDiscard] });
//
//       // Verify hand is revealed
//       expect(opponentsHand.every((card) => card.meta.revealed)).toBe(true);
//
//       // Verify location was discarded
//       expect(locationToDiscard.zone).toBe("discard");
//
//       // Verify other cards remain in hand
//       expect(
//         testEngine.getCardModel(treasureMountainAzuriteSeaIsland).zone,
//       ).toBe("hand");
//       expect(testEngine.getCardModel(mickeyMouseDetective).zone).toBe("hand");
//     });
//
//     it("should only allow discarding location cards, not characters", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: goldieOgiltCunningProspector.cost,
//           hand: [goldieOgiltCunningProspector],
//         },
//         {
//           hand: [skullRockIsolatedFortress, mickeyMouseDetective],
//         },
//       );
//
//       const location = testEngine.getCardModel(skullRockIsolatedFortress);
//       const character = testEngine.getCardModel(mickeyMouseDetective);
//
//       await testEngine.playCard(goldieOgiltCunningProspector);
//
//       // The effect should only target locations
//       const opponentHand = testEngine.getCardsByZone("hand", "player_two");
//       expect(opponentHand).toContain(location);
//       expect(opponentHand).toContain(character);
//
//       // After resolving, only the location should be discardable
//       await testEngine.resolveTopOfStack({ targets: [location] });
//       expect(location.zone).toBe("discard");
//       expect(character.zone).toBe("hand");
//     });
//
//     it("should work when opponent has no locations in hand", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: goldieOgiltCunningProspector.cost,
//           hand: [goldieOgiltCunningProspector],
//         },
//         {
//           hand: [mickeyMouseDetective],
//         },
//       );
//
//       const opponentsHand = testEngine.getCardsByZone("hand", "player_two");
//       const character = testEngine.getCardModel(mickeyMouseDetective);
//
//       await testEngine.playCard(goldieOgiltCunningProspector);
//       await testEngine.resolveTopOfStack({});
//
//       // Hand should still be revealed
//       expect(opponentsHand.every((card) => card.meta.revealed)).toBe(true);
//
//       // Character should remain in hand
//       expect(character.zone).toBe("hand");
//     });
//   });
//
//   describe("STRIKE GOLD - Whenever this character quests, you may put a location card from chosen player's discard on the bottom of their deck to gain 1 lore", () => {
//     it("should allow putting a location from opponent's discard to bottom of their deck and gain 1 lore", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: goldieOgiltCunningProspector.cost,
//           play: [goldieOgiltCunningProspector],
//         },
//         {
//           discard: [
//             skullRockIsolatedFortress,
//             treasureMountainAzuriteSeaIsland,
//           ],
//         },
//       );
//
//       const goldie = testEngine.getCardModel(goldieOgiltCunningProspector);
//       const location = testEngine.getCardModel(skullRockIsolatedFortress);
//       const initialLore = testEngine.getPlayerLore("player_one");
//
//       goldie.updateCardMeta({ exerted: false });
//       expect(location.zone).toBe("discard");
//
//       await testEngine.questCard(goldieOgiltCunningProspector);
//
//       await testEngine.acceptOptionalLayer();
//       await testEngine.resolveTopOfStack({ targets: [location] });
//
//       // Verify location moved to bottom of deck
//       expect(location.zone).toBe("deck");
//
//       // Verify player gained 1 lore (base 1 from quest + 1 from ability)
//       expect(testEngine.getPlayerLore("player_one")).toBe(initialLore + 2);
//     });
//
//     it("should allow putting a location from own discard to bottom of own deck and gain 1 lore", async () => {
//       const testEngine = new TestEngine({
//         inkwell: goldieOgiltCunningProspector.cost,
//         play: [goldieOgiltCunningProspector],
//         discard: [skullRockIsolatedFortress],
//       });
//
//       const goldie = testEngine.getCardModel(goldieOgiltCunningProspector);
//       const location = testEngine.getCardModel(skullRockIsolatedFortress);
//       const initialLore = testEngine.getPlayerLore("player_one");
//
//       goldie.updateCardMeta({ exerted: false });
//       expect(location.zone).toBe("discard");
//
//       await testEngine.questCard(goldieOgiltCunningProspector);
//
//       await testEngine.acceptOptionalLayer();
//       await testEngine.resolveTopOfStack({ targets: [location] });
//
//       // Verify location moved to bottom of deck
//       expect(location.zone).toBe("deck");
//
//       // Verify player gained 1 lore (base 1 from quest + 1 from ability)
//       expect(testEngine.getPlayerLore("player_one")).toBe(initialLore + 2);
//     });
//
//     it("should be optional - can decline to use the ability", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: goldieOgiltCunningProspector.cost,
//           play: [goldieOgiltCunningProspector],
//         },
//         {
//           discard: [skullRockIsolatedFortress],
//         },
//       );
//
//       const goldie = testEngine.getCardModel(goldieOgiltCunningProspector);
//       const location = testEngine.getCardModel(skullRockIsolatedFortress);
//       const initialLore = testEngine.getPlayerLore("player_one");
//
//       goldie.updateCardMeta({ exerted: false });
//
//       await testEngine.questCard(goldieOgiltCunningProspector);
//       await testEngine.skipTopOfStack();
//
//       // Verify location stayed in discard
//       expect(location.zone).toBe("discard");
//
//       // Verify only the base lore from questing was gained (1 lore)
//       expect(testEngine.getPlayerLore("player_one")).toBe(initialLore + 1);
//     });
//
//     it("should only target location cards from discard, not other card types", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: goldieOgiltCunningProspector.cost,
//           play: [goldieOgiltCunningProspector],
//         },
//         {
//           discard: [skullRockIsolatedFortress, mickeyMouseDetective],
//         },
//       );
//
//       const goldie = testEngine.getCardModel(goldieOgiltCunningProspector);
//       const location = testEngine.getCardModel(skullRockIsolatedFortress);
//       const character = testEngine.getCardModel(mickeyMouseDetective);
//       const initialLore = testEngine.getPlayerLore("player_one");
//
//       goldie.updateCardMeta({ exerted: false });
//
//       await testEngine.questCard(goldieOgiltCunningProspector);
//
//       await testEngine.acceptOptionalLayer();
//       await testEngine.resolveTopOfStack({ targets: [location] });
//
//       // Only location should move
//       expect(location.zone).toBe("deck");
//       expect(character.zone).toBe("discard");
//
//       // Verify player gained 1 lore (base 1 from quest + 1 from ability)
//       expect(testEngine.getPlayerLore("player_one")).toBe(initialLore + 2);
//     });
//
//     it("should work when there are no locations in any discard", async () => {
//       const testEngine = new TestEngine({
//         inkwell: goldieOgiltCunningProspector.cost,
//         play: [goldieOgiltCunningProspector],
//         discard: [mickeyMouseDetective],
//       });
//
//       const goldie = testEngine.getCardModel(goldieOgiltCunningProspector);
//       const initialLore = testEngine.getPlayerLore("player_one");
//
//       goldie.updateCardMeta({ exerted: false });
//
//       await testEngine.questCard(goldieOgiltCunningProspector);
//
//       // Since there are no valid targets, the ability should auto-skip or we manually skip it
//       if (testEngine.store.stackLayerStore.layers.length > 0) {
//         await testEngine.skipTopOfStack();
//       }
//
//       // Only gained lore from questing (1 lore), not from ability
//       expect(testEngine.getPlayerLore("player_one")).toBe(initialLore + 1);
//     });
//   });
// });
//
