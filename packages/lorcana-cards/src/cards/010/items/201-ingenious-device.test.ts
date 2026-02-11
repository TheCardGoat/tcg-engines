// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyMouseWaywardSorcerer } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { motunuiIslandParadise } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { ingeniousDevice } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Ingenious Device", () => {
//   Describe("SOUVENIR - Activated ability", () => {
//     It("should exert, pay 2 ink, banish item, draw a card, then choose and discard a card", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: ingeniousDevice.cost + 2,
//           Play: [ingeniousDevice],
//           Deck: 5,
//           Hand: [mickeyMouseWaywardSorcerer],
//         },
//         {
//           Play: [motunuiIslandParadise], // Need a valid target for TIME FLIES trigger
//         },
//       );
//
//       Const item = testEngine.getCardModel(ingeniousDevice);
//       Const cardInHand = testEngine.getCardModel(mickeyMouseWaywardSorcerer);
//       Const opponentLocation = testEngine.getCardModel(
//         MotunuiIslandParadise,
//         1,
//       );
//
//       Expect(item.zone).toBe("play");
//       Expect(item.ready).toBe(true);
//       Expect(cardInHand.zone).toBe("hand");
//
//       // Activate the SOUVENIR ability
//       // This will auto-resolve draw and then prompt for discard target
//       Await testEngine.activateCard(item, {
//         Ability: "Souvenir",
//       });
//
//       // Item should be banished (cost paid)
//       Expect(item.zone).toBe("discard");
//
//       // Should have drawn 1 card (1 original + 1 drawn)
//       Const handCards = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       );
//       Expect(handCards.length).toBe(2);
//
//       // Choose and discard a card (TIME FLIES is still on stack after this)
//       Const cardToDiscard = handCards[0];
//       If (!cardToDiscard) throw new Error("No card in hand");
//       Await testEngine.resolveTopOfStack({ targets: [cardToDiscard] }, true);
//
//       // After discarding, should have 1 card left in hand
//       Const remainingHand = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       );
//       Expect(remainingHand.length).toBe(1);
//
//       // TIME FLIES should trigger - resolve with location as target
//       Await testEngine.resolveTopOfStack({
//         Targets: [opponentLocation],
//       });
//
//       // Location should have 3 damage
//       Expect(opponentLocation.damage).toBe(3);
//     });
//   });
//
//   Describe("TIME FLIES - When-banished trigger", () => {
//     It("should deal 3 damage to chosen character when item is banished during your turn", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: ingeniousDevice.cost + 2,
//           Play: [ingeniousDevice],
//           Deck: 2,
//         },
//         {
//           Play: [mickeyMouseWaywardSorcerer],
//         },
//       );
//
//       Const item = testEngine.getCardModel(ingeniousDevice);
//       Const opponentCharacter = testEngine.getCardModel(
//         MickeyMouseWaywardSorcerer,
//         1,
//       );
//
//       Expect(opponentCharacter.zone).toBe("play");
//       Expect(opponentCharacter.damage).toBe(0);
//
//       // Activate SOUVENIR to banish the item during our turn
//       Await testEngine.activateCard(item, {
//         Ability: "Souvenir",
//       });
//
//       // Item should be banished
//       Expect(item.zone).toBe("discard");
//
//       // Resolve discard effect - choose a card from hand
//       Const handCards = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       );
//       Const cardToDiscard = handCards[0];
//       If (!cardToDiscard) throw new Error("No card in hand");
//       Await testEngine.resolveTopOfStack({ targets: [cardToDiscard] }, true);
//
//       // TIME FLIES ability should trigger - choose the opponent's character
//       Await testEngine.resolveTopOfStack({
//         Targets: [opponentCharacter],
//       });
//
//       // Character should have 3 damage
//       Expect(opponentCharacter.damage).toBe(3);
//     });
//
//     It("should deal 3 damage to chosen location when item is banished during your turn", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: ingeniousDevice.cost + 2,
//           Play: [ingeniousDevice],
//           Deck: 2,
//         },
//         {
//           Play: [motunuiIslandParadise],
//         },
//       );
//
//       Const item = testEngine.getCardModel(ingeniousDevice);
//       Const opponentLocation = testEngine.getCardModel(
//         MotunuiIslandParadise,
//         1,
//       );
//
//       Expect(opponentLocation.zone).toBe("play");
//       Expect(opponentLocation.damage).toBe(0);
//
//       // Activate SOUVENIR to banish the item
//       Await testEngine.activateCard(item, {
//         Ability: "Souvenir",
//       });
//
//       // Item should be banished
//       Expect(item.zone).toBe("discard");
//
//       // Resolve discard effect - choose a card from hand
//       Const handCards = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       );
//       Const cardToDiscard = handCards[0];
//       If (!cardToDiscard) throw new Error("No card in hand");
//       Await testEngine.resolveTopOfStack({ targets: [cardToDiscard] }, true);
//
//       // Resolve TIME FLIES trigger, targeting the location
//       Await testEngine.resolveTopOfStack({
//         Targets: [opponentLocation],
//       });
//
//       // Location should have 3 damage
//       Expect(opponentLocation.damage).toBe(3);
//     });
//
//     // Note: Testing "during your turn" condition is covered by the trigger's condition filter
//     // which is validated by the passing tests above. The condition prevents TIME FLIES from
//     // triggering during opponent's turn.
//   });
// });
//
