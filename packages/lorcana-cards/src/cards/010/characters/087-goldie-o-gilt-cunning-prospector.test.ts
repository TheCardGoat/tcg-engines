// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GalacticCouncilChamber,
//   SkullRockIsolatedFortress,
//   TreasureMountainAzuriteSeaIsland,
// } from "@lorcanito/lorcana-engine/cards/006/index";
// Import {
//   GoldieOgiltCunningProspector,
//   MickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Goldie O'gilt - Cunning Prospector", () => {
//   Describe("CLAIM JUMPER - When you play this character, chosen opponent reveals their hand and discards a location card of your choice", () => {
//     It("should reveal opponent's hand and allow choosing a location to discard", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: goldieOgiltCunningProspector.cost,
//           Hand: [goldieOgiltCunningProspector],
//         },
//         {
//           Hand: [
//             SkullRockIsolatedFortress,
//             TreasureMountainAzuriteSeaIsland,
//             MickeyMouseDetective,
//           ],
//         },
//       );
//
//       Const opponentsHand = testEngine.getCardsByZone("hand", "player_two");
//       Const locationToDiscard = testEngine.getCardModel(
//         SkullRockIsolatedFortress,
//       );
//
//       Expect(opponentsHand.length).toBe(3);
//       Expect(opponentsHand.every((card) => card.meta.revealed)).toBe(false);
//
//       Await testEngine.playCard(goldieOgiltCunningProspector);
//       Await testEngine.resolveTopOfStack({ targets: [locationToDiscard] });
//
//       // Verify hand is revealed
//       Expect(opponentsHand.every((card) => card.meta.revealed)).toBe(true);
//
//       // Verify location was discarded
//       Expect(locationToDiscard.zone).toBe("discard");
//
//       // Verify other cards remain in hand
//       Expect(
//         TestEngine.getCardModel(treasureMountainAzuriteSeaIsland).zone,
//       ).toBe("hand");
//       Expect(testEngine.getCardModel(mickeyMouseDetective).zone).toBe("hand");
//     });
//
//     It("should only allow discarding location cards, not characters", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: goldieOgiltCunningProspector.cost,
//           Hand: [goldieOgiltCunningProspector],
//         },
//         {
//           Hand: [skullRockIsolatedFortress, mickeyMouseDetective],
//         },
//       );
//
//       Const location = testEngine.getCardModel(skullRockIsolatedFortress);
//       Const character = testEngine.getCardModel(mickeyMouseDetective);
//
//       Await testEngine.playCard(goldieOgiltCunningProspector);
//
//       // The effect should only target locations
//       Const opponentHand = testEngine.getCardsByZone("hand", "player_two");
//       Expect(opponentHand).toContain(location);
//       Expect(opponentHand).toContain(character);
//
//       // After resolving, only the location should be discardable
//       Await testEngine.resolveTopOfStack({ targets: [location] });
//       Expect(location.zone).toBe("discard");
//       Expect(character.zone).toBe("hand");
//     });
//
//     It("should work when opponent has no locations in hand", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: goldieOgiltCunningProspector.cost,
//           Hand: [goldieOgiltCunningProspector],
//         },
//         {
//           Hand: [mickeyMouseDetective],
//         },
//       );
//
//       Const opponentsHand = testEngine.getCardsByZone("hand", "player_two");
//       Const character = testEngine.getCardModel(mickeyMouseDetective);
//
//       Await testEngine.playCard(goldieOgiltCunningProspector);
//       Await testEngine.resolveTopOfStack({});
//
//       // Hand should still be revealed
//       Expect(opponentsHand.every((card) => card.meta.revealed)).toBe(true);
//
//       // Character should remain in hand
//       Expect(character.zone).toBe("hand");
//     });
//   });
//
//   Describe("STRIKE GOLD - Whenever this character quests, you may put a location card from chosen player's discard on the bottom of their deck to gain 1 lore", () => {
//     It("should allow putting a location from opponent's discard to bottom of their deck and gain 1 lore", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: goldieOgiltCunningProspector.cost,
//           Play: [goldieOgiltCunningProspector],
//         },
//         {
//           Discard: [
//             SkullRockIsolatedFortress,
//             TreasureMountainAzuriteSeaIsland,
//           ],
//         },
//       );
//
//       Const goldie = testEngine.getCardModel(goldieOgiltCunningProspector);
//       Const location = testEngine.getCardModel(skullRockIsolatedFortress);
//       Const initialLore = testEngine.getPlayerLore("player_one");
//
//       Goldie.updateCardMeta({ exerted: false });
//       Expect(location.zone).toBe("discard");
//
//       Await testEngine.questCard(goldieOgiltCunningProspector);
//
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack({ targets: [location] });
//
//       // Verify location moved to bottom of deck
//       Expect(location.zone).toBe("deck");
//
//       // Verify player gained 1 lore (base 1 from quest + 1 from ability)
//       Expect(testEngine.getPlayerLore("player_one")).toBe(initialLore + 2);
//     });
//
//     It("should allow putting a location from own discard to bottom of own deck and gain 1 lore", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: goldieOgiltCunningProspector.cost,
//         Play: [goldieOgiltCunningProspector],
//         Discard: [skullRockIsolatedFortress],
//       });
//
//       Const goldie = testEngine.getCardModel(goldieOgiltCunningProspector);
//       Const location = testEngine.getCardModel(skullRockIsolatedFortress);
//       Const initialLore = testEngine.getPlayerLore("player_one");
//
//       Goldie.updateCardMeta({ exerted: false });
//       Expect(location.zone).toBe("discard");
//
//       Await testEngine.questCard(goldieOgiltCunningProspector);
//
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack({ targets: [location] });
//
//       // Verify location moved to bottom of deck
//       Expect(location.zone).toBe("deck");
//
//       // Verify player gained 1 lore (base 1 from quest + 1 from ability)
//       Expect(testEngine.getPlayerLore("player_one")).toBe(initialLore + 2);
//     });
//
//     It("should be optional - can decline to use the ability", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: goldieOgiltCunningProspector.cost,
//           Play: [goldieOgiltCunningProspector],
//         },
//         {
//           Discard: [skullRockIsolatedFortress],
//         },
//       );
//
//       Const goldie = testEngine.getCardModel(goldieOgiltCunningProspector);
//       Const location = testEngine.getCardModel(skullRockIsolatedFortress);
//       Const initialLore = testEngine.getPlayerLore("player_one");
//
//       Goldie.updateCardMeta({ exerted: false });
//
//       Await testEngine.questCard(goldieOgiltCunningProspector);
//       Await testEngine.skipTopOfStack();
//
//       // Verify location stayed in discard
//       Expect(location.zone).toBe("discard");
//
//       // Verify only the base lore from questing was gained (1 lore)
//       Expect(testEngine.getPlayerLore("player_one")).toBe(initialLore + 1);
//     });
//
//     It("should only target location cards from discard, not other card types", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: goldieOgiltCunningProspector.cost,
//           Play: [goldieOgiltCunningProspector],
//         },
//         {
//           Discard: [skullRockIsolatedFortress, mickeyMouseDetective],
//         },
//       );
//
//       Const goldie = testEngine.getCardModel(goldieOgiltCunningProspector);
//       Const location = testEngine.getCardModel(skullRockIsolatedFortress);
//       Const character = testEngine.getCardModel(mickeyMouseDetective);
//       Const initialLore = testEngine.getPlayerLore("player_one");
//
//       Goldie.updateCardMeta({ exerted: false });
//
//       Await testEngine.questCard(goldieOgiltCunningProspector);
//
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack({ targets: [location] });
//
//       // Only location should move
//       Expect(location.zone).toBe("deck");
//       Expect(character.zone).toBe("discard");
//
//       // Verify player gained 1 lore (base 1 from quest + 1 from ability)
//       Expect(testEngine.getPlayerLore("player_one")).toBe(initialLore + 2);
//     });
//
//     It("should work when there are no locations in any discard", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: goldieOgiltCunningProspector.cost,
//         Play: [goldieOgiltCunningProspector],
//         Discard: [mickeyMouseDetective],
//       });
//
//       Const goldie = testEngine.getCardModel(goldieOgiltCunningProspector);
//       Const initialLore = testEngine.getPlayerLore("player_one");
//
//       Goldie.updateCardMeta({ exerted: false });
//
//       Await testEngine.questCard(goldieOgiltCunningProspector);
//
//       // Since there are no valid targets, the ability should auto-skip or we manually skip it
//       If (testEngine.store.stackLayerStore.layers.length > 0) {
//         Await testEngine.skipTopOfStack();
//       }
//
//       // Only gained lore from questing (1 lore), not from ability
//       Expect(testEngine.getPlayerLore("player_one")).toBe(initialLore + 1);
//     });
//   });
// });
//
