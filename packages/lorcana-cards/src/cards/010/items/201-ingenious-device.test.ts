// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mickeyMouseWaywardSorcerer } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { motunuiIslandParadise } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// import { ingeniousDevice } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Ingenious Device", () => {
//   describe("SOUVENIR - Activated ability", () => {
//     it("should exert, pay 2 ink, banish item, draw a card, then choose and discard a card", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: ingeniousDevice.cost + 2,
//           play: [ingeniousDevice],
//           deck: 5,
//           hand: [mickeyMouseWaywardSorcerer],
//         },
//         {
//           play: [motunuiIslandParadise], // Need a valid target for TIME FLIES trigger
//         },
//       );
//
//       const item = testEngine.getCardModel(ingeniousDevice);
//       const cardInHand = testEngine.getCardModel(mickeyMouseWaywardSorcerer);
//       const opponentLocation = testEngine.getCardModel(
//         motunuiIslandParadise,
//         1,
//       );
//
//       expect(item.zone).toBe("play");
//       expect(item.ready).toBe(true);
//       expect(cardInHand.zone).toBe("hand");
//
//       // Activate the SOUVENIR ability
//       // This will auto-resolve draw and then prompt for discard target
//       await testEngine.activateCard(item, {
//         ability: "Souvenir",
//       });
//
//       // Item should be banished (cost paid)
//       expect(item.zone).toBe("discard");
//
//       // Should have drawn 1 card (1 original + 1 drawn)
//       const handCards = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       );
//       expect(handCards.length).toBe(2);
//
//       // Choose and discard a card (TIME FLIES is still on stack after this)
//       const cardToDiscard = handCards[0];
//       if (!cardToDiscard) throw new Error("No card in hand");
//       await testEngine.resolveTopOfStack({ targets: [cardToDiscard] }, true);
//
//       // After discarding, should have 1 card left in hand
//       const remainingHand = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       );
//       expect(remainingHand.length).toBe(1);
//
//       // TIME FLIES should trigger - resolve with location as target
//       await testEngine.resolveTopOfStack({
//         targets: [opponentLocation],
//       });
//
//       // Location should have 3 damage
//       expect(opponentLocation.damage).toBe(3);
//     });
//   });
//
//   describe("TIME FLIES - When-banished trigger", () => {
//     it("should deal 3 damage to chosen character when item is banished during your turn", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: ingeniousDevice.cost + 2,
//           play: [ingeniousDevice],
//           deck: 2,
//         },
//         {
//           play: [mickeyMouseWaywardSorcerer],
//         },
//       );
//
//       const item = testEngine.getCardModel(ingeniousDevice);
//       const opponentCharacter = testEngine.getCardModel(
//         mickeyMouseWaywardSorcerer,
//         1,
//       );
//
//       expect(opponentCharacter.zone).toBe("play");
//       expect(opponentCharacter.damage).toBe(0);
//
//       // Activate SOUVENIR to banish the item during our turn
//       await testEngine.activateCard(item, {
//         ability: "Souvenir",
//       });
//
//       // Item should be banished
//       expect(item.zone).toBe("discard");
//
//       // Resolve discard effect - choose a card from hand
//       const handCards = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       );
//       const cardToDiscard = handCards[0];
//       if (!cardToDiscard) throw new Error("No card in hand");
//       await testEngine.resolveTopOfStack({ targets: [cardToDiscard] }, true);
//
//       // TIME FLIES ability should trigger - choose the opponent's character
//       await testEngine.resolveTopOfStack({
//         targets: [opponentCharacter],
//       });
//
//       // Character should have 3 damage
//       expect(opponentCharacter.damage).toBe(3);
//     });
//
//     it("should deal 3 damage to chosen location when item is banished during your turn", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: ingeniousDevice.cost + 2,
//           play: [ingeniousDevice],
//           deck: 2,
//         },
//         {
//           play: [motunuiIslandParadise],
//         },
//       );
//
//       const item = testEngine.getCardModel(ingeniousDevice);
//       const opponentLocation = testEngine.getCardModel(
//         motunuiIslandParadise,
//         1,
//       );
//
//       expect(opponentLocation.zone).toBe("play");
//       expect(opponentLocation.damage).toBe(0);
//
//       // Activate SOUVENIR to banish the item
//       await testEngine.activateCard(item, {
//         ability: "Souvenir",
//       });
//
//       // Item should be banished
//       expect(item.zone).toBe("discard");
//
//       // Resolve discard effect - choose a card from hand
//       const handCards = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       );
//       const cardToDiscard = handCards[0];
//       if (!cardToDiscard) throw new Error("No card in hand");
//       await testEngine.resolveTopOfStack({ targets: [cardToDiscard] }, true);
//
//       // Resolve TIME FLIES trigger, targeting the location
//       await testEngine.resolveTopOfStack({
//         targets: [opponentLocation],
//       });
//
//       // Location should have 3 damage
//       expect(opponentLocation.damage).toBe(3);
//     });
//
//     // Note: Testing "during your turn" condition is covered by the trigger's condition filter
//     // which is validated by the passing tests above. The condition prevents TIME FLIES from
//     // triggering during opponent's turn.
//   });
// });
//
