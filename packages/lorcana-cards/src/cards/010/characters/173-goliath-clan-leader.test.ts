// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { clarabelleLightOnHerHooves } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import {
//   basilTenaciousMouse,
//   begone,
//   butImMuchFaster,
//   cantHoldItBackAnymore,
//   chomp,
//   donaldGhostHunter,
//   goliathClanLeader,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Goliath - Clan Leader", () => {
//   describe("DUSK TO DAWN - Player One (active player)", () => {
//     it("When player has more than 2 cards in hand should discard down to 2 cards at end of turn", async () => {
//       const targets = [begone, butImMuchFaster];
//       const testEngine = new TestEngine({
//         inkwell: goliathClanLeader.cost,
//         play: [goliathClanLeader],
//         hand: [...targets, cantHoldItBackAnymore, chomp],
//         deck: 10,
//       });
//
//       const initialHandSize = testEngine.getZonesCardCount("player_one").hand;
//       expect(initialHandSize).toBe(4);
//
//       // Pass turn to trigger end of turn
//       await testEngine.passTurn();
//       expect(testEngine.stackLayers).toHaveLength(1);
//
//       testEngine.changeActivePlayer("player_one");
//       await testEngine.acceptOptionalLayer();
//       await testEngine.resolveTopOfStack({
//         targets: targets,
//       });
//
//       // At end of turn, player should be forced to discard down to 2 cards
//       const finalHandSize = testEngine.getZonesCardCount("player_one").hand;
//       expect(finalHandSize).toBe(2);
//
//       for (const target of targets) {
//         expect(testEngine.getCardModel(target).zone).toBe("discard");
//       }
//
//       expect(testEngine.stackLayers).toHaveLength(0);
//     });
//
//     it("When player has fewer than 2 cards in hand should draw up to 2 cards at end of turn", async () => {
//       const testEngine = new TestEngine({
//         inkwell: goliathClanLeader.cost,
//         play: [goliathClanLeader],
//         hand: [basilTenaciousMouse], // 1 card
//         deck: 10,
//       });
//
//       const initialHandSize = testEngine.getZonesCardCount("player_one").hand;
//       expect(initialHandSize).toBe(1);
//
//       // Pass turn to trigger end of turn
//       await testEngine.passTurn();
//       expect(testEngine.stackLayers).toHaveLength(1);
//
//       testEngine.changeActivePlayer("player_one");
//       await testEngine.resolveTopOfStack({});
//
//       // At end of turn, player should draw up to 2 cards
//       const finalHandSize = testEngine.getZonesCardCount("player_one").hand;
//       expect(finalHandSize).toBe(2);
//     });
//
//     it("should draw up to 2 cards when player has 0 cards", async () => {
//       const testEngine = new TestEngine({
//         inkwell: goliathClanLeader.cost,
//         play: [goliathClanLeader],
//         hand: [], // 0 cards
//         deck: 10,
//       });
//
//       const initialHandSize = testEngine.getZonesCardCount("player_one").hand;
//       expect(initialHandSize).toBe(0);
//
//       // Pass turn to trigger end of turn
//       await testEngine.passTurn();
//       expect(testEngine.stackLayers).toHaveLength(1);
//
//       testEngine.changeActivePlayer("player_one");
//       await testEngine.resolveTopOfStack({});
//
//       // At end of turn, player should draw up to 2 cards
//       const finalHandSize = testEngine.getZonesCardCount("player_one").hand;
//       expect(finalHandSize).toBe(2);
//     });
//
//     it("When player has exactly 2 cards in hand should not change hand size", async () => {
//       const testEngine = new TestEngine({
//         inkwell: goliathClanLeader.cost,
//         play: [goliathClanLeader],
//         hand: [basilTenaciousMouse, donaldGhostHunter], // 2 cards
//         deck: 10,
//       });
//
//       const initialHandSize = testEngine.getZonesCardCount("player_one").hand;
//       expect(initialHandSize).toBe(2);
//
//       // Pass turn to trigger end of turn
//       await testEngine.passTurn();
//       expect(testEngine.stackLayers).toHaveLength(0);
//
//       // Hand size should remain 2
//       const finalHandSize = testEngine.getZonesCardCount("player_one").hand;
//       expect(finalHandSize).toBe(2);
//     });
//   });
//
//   describe("DUSK TO DAWN - Player Two (opponent)", () => {
//     it("When player has more than 2 cards in hand should discard down to 2 cards at end of turn", async () => {
//       // Discard three because the player will draw when passing turns
//       const targets = [begone, butImMuchFaster, cantHoldItBackAnymore];
//       const testEngine = new TestEngine(
//         {
//           play: [goliathClanLeader],
//           hand: 2,
//         },
//         {
//           hand: [...targets, chomp],
//           deck: 10,
//         },
//       );
//
//       // Passing his turn shouldn't trigger anything
//       await testEngine.passTurn();
//       expect(testEngine.stackLayers).toHaveLength(0);
//
//       // Pass turn to trigger end of turn
//       testEngine.changeActivePlayer("player_two");
//       await testEngine.passTurn();
//       expect(testEngine.stackLayers).toHaveLength(1);
//
//       const initialHandSize = testEngine.getZonesCardCount("player_two").hand;
//       expect(initialHandSize).toBe(5);
//
//       const layer = testEngine.stackLayers[0];
//       if (layer) {
//         // This is the variable the UI uses to determine how many cards to select
//         expect(layer.targetAmount()).toBe(targets.length);
//       }
//
//       testEngine.changeActivePlayer("player_two");
//       await testEngine.resolveTopOfStack({
//         targets: targets,
//       });
//
//       // At end of turn, player should be forced to discard down to 2 cards
//       const finalHandSize = testEngine.getZonesCardCount("player_two").hand;
//       expect(finalHandSize).toBe(2);
//
//       for (const target of targets) {
//         expect(testEngine.getCardModel(target).zone).toBe("discard");
//       }
//     });
//
//     it("should draw up to 2 cards when player has 0 cards", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [goliathClanLeader],
//           hand: 2,
//         },
//         {
//           hand: [], // 0 cards
//           deck: 10,
//         },
//       );
//
//       await testEngine.passTurn();
//       expect(testEngine.stackLayers).toHaveLength(0);
//
//       const initialHandSize = testEngine.getZonesCardCount("player_two").hand;
//       expect(initialHandSize).toBe(1);
//
//       testEngine.changeActivePlayer("player_two");
//       await testEngine.passTurn();
//
//       // At end of turn, player should draw up to 2 cards
//       expect(testEngine.getZonesCardCount("player_two").hand).toBe(2);
//       // The first player initially had 2 cards, after receiving back the turn, should have 3 cards
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(3);
//     });
//
//     it("When player has fewer than 2 cards in hand should draw up to 2 cards at end of turn", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [goliathClanLeader],
//           hand: 2,
//         },
//         {
//           deck: [begone, butImMuchFaster, basilTenaciousMouse],
//         },
//       );
//
//       await testEngine.passTurn();
//       expect(testEngine.stackLayers).toHaveLength(0);
//
//       // After receiving the turn, player two should have 1 card in hand
//       expect(testEngine.getZonesCardCount("player_two").hand).toBe(1);
//
//       testEngine.changeActivePlayer("player_two");
//       await testEngine.passTurn();
//
//       // At end of turn, player should draw up to 2 cards
//       expect(testEngine.getZonesCardCount("player_two").hand).toBe(2);
//       // The first player initially had 2 cards, after receiving back the turn, should have 3 cards
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(3);
//     });
//
//     it("When player has exactly 2 cards in hand should not change hand size", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [goliathClanLeader],
//           hand: 2,
//         },
//         {
//           inkwell: goliathClanLeader.cost,
//           hand: 1, //After passing the turn, player two will have 2 cards
//           deck: 10,
//         },
//       );
//
//       testEngine.changeActivePlayer("player_one");
//       await testEngine.passTurn();
//
//       testEngine.changeActivePlayer("player_two");
//       await testEngine.passTurn();
//
//       expect(testEngine.getZonesCardCount("player_two").hand).toBe(2);
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(3);
//     });
//   });
//
//   describe("Edge cases - multiple Goliaths in play", () => {
//     it("When player one controls 2 Goliaths and opponent has >2 cards should discard down to 2 only once", async () => {
//       // Opponent has 4 cards; two Goliaths controlled by player one should NOT force them to discard twice
//       const targets = [begone, butImMuchFaster, cantHoldItBackAnymore, chomp];
//       const testEngine = new TestEngine(
//         {
//           hand: [...targets],
//           deck: 10,
//         },
//         {
//           play: [goliathClanLeader, goliathClanLeader],
//           hand: 2,
//         },
//       );
//
//       // Ensure initial opponent hand is 4
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(4);
//
//       // Pass turn for player one to trigger end-of-turn
//       await testEngine.passTurn();
//
//       //
//       expect(testEngine.stackLayers.length).toEqual(2);
//
//       // Resolve the layer choosing the three cards to discard down to 2
//       testEngine.changeActivePlayer("player_two");
//       await testEngine.resolveTopOfStack({}, true);
//
//       testEngine.changeActivePlayer("player_one");
//       await testEngine.resolveTopOfStack(
//         { targets: targets.slice(0, 2) },
//         true,
//       );
//
//       // Final hand should be 2
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(2);
//
//       // Resolve the next ability with no targets (because DynamicAmount should now be 0)
//       expect(testEngine.stackLayers.length).toEqual(1);
//
//       // player two still owns 1 discard effect to resolve
//       testEngine.changeActivePlayer("player_two");
//       await testEngine.resolveTopOfStack({});
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(2);
//
//       // There shouldn't be any more stack layers
//       expect(testEngine.stackLayers.length).toEqual(0);
//     });
//
//     it("When player one controls two Goliaths and opponent has <2 cards should draw up to 2 only once", async () => {
//       const testEngine = new TestEngine(
//         {
//           hand: 0,
//           deck: 10,
//         },
//         {
//           play: [goliathClanLeader, goliathClanLeader],
//           hand: 2,
//         },
//       );
//
//       // Ensure opponent starts with 0
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//
//       // Pass turn for player one to trigger end-of-turn
//       await testEngine.passTurn();
//
//       // After resolving, player one should have exactly 2 cards
//       testEngine.changeActivePlayer("player_two");
//       await testEngine.resolveTopOfStack({}, true);
//       await testEngine.resolveTopOfStack({}, true);
//
//       // Accept draw trigger
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(2);
//
//       // There shouldn't be any more stack layers
//       expect(testEngine.stackLayers.length).toEqual(0);
//     });
//
//     it("When each player controls one Goliath and opponent has >2 cards should discard down to 2", async () => {
//       // One Goliath each — ensure no duplicated discard for opponent
//       const targets = [begone, butImMuchFaster, cantHoldItBackAnymore];
//       const testEngine = new TestEngine(
//         {
//           play: [goliathClanLeader],
//           hand: [...targets, chomp],
//           deck: 10,
//         },
//         {
//           play: [goliathClanLeader],
//           hand: 2,
//         },
//       );
//
//       // End player_two's turn to trigger both Goliath interactions
//       await testEngine.passTurn();
//
//       // both goliath effects
//       expect(testEngine.stackLayers.length).toEqual(2);
//
//       // Resolve top of stack selecting discard targets (should discard down to 2 total)
//       testEngine.changeActivePlayer("player_one");
//       await testEngine.acceptOptionalLayer();
//       await testEngine.resolveTopOfStack(
//         { targets: targets.slice(0, 2) },
//         true,
//       );
//
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(2);
//
//       // There is an extra layer for opponent's Goliath, which should now have 0 to draw
//       expect(testEngine.stackLayers.length).toEqual(1);
//
//       testEngine.changeActivePlayer("player_two");
//       await testEngine.resolveTopOfStack({});
//
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(2);
//
//       // There shouldn't be any more stack layers
//       expect(testEngine.stackLayers.length).toEqual(0);
//     });
//
//     it("When each player controls one Goliath and opponent has <2 cards should draw up to 2 (single resolution)", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [goliathClanLeader],
//           hand: 0,
//           deck: 10,
//         },
//         {
//           play: [goliathClanLeader],
//           hand: 2,
//         },
//       );
//
//       await testEngine.passTurn();
//
//       testEngine.changeActivePlayer("player_one");
//       await testEngine.acceptOptionalLayer();
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(2);
//
//       testEngine.changeActivePlayer("player_two");
//       await testEngine.acceptOptionalLayer();
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(2);
//
//       // There shouldn't be any more stack layers
//       expect(testEngine.stackLayers.length).toEqual(0);
//     });
//   }); // Edge cases - multiple Goliaths in play
//
//   describe("Edge cases - multiple Goliaths and Clarabelle ordering", () => {
//     it("Clarabelle ordering: active player's Clarabelle effects must resolve before opponent's Goliath effects", async () => {
//       // Setup: player_one has Goliath and 3 cards in hand; player_two has Clarabelle and 1 card.
//       // At the end of player_two's turn, Clarabelle (player_two's own ability) should resolve first
//       // drawing up to match player_one (3). Then Goliath should resolve and discard down to 2.
//       const testEngine = new TestEngine(
//         {
//           play: [clarabelleLightOnHerHooves],
//           hand: [basilTenaciousMouse], // 1 card
//           deck: 10,
//         },
//         {
//           play: [goliathClanLeader],
//           hand: [begone, butImMuchFaster, cantHoldItBackAnymore], // 3 cards
//           deck: 10,
//         },
//       );
//
//       // End player_two's turn to trigger both Clarabelle (owner: player_one) and Goliath (owner: player_two)
//       await testEngine.passTurn();
//
//       // both clarabelle and goliath effects
//       expect(testEngine.stackLayers.length).toEqual(2);
//
//       // First Clarabelle should be applied (player_two draws up to match player_one's 3)
//       // No Goliath layer(s) should be present.
//       testEngine.changeActivePlayer("player_one");
//
//       // Resolve Clarabelle draw
//       await testEngine.acceptOptionalAbility();
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(3);
//
//       // Goliath trigger is now present for player two
//       expect(testEngine.stackLayers.length).toEqual(1);
//
//       testEngine.changeActivePlayer("player_two");
//       await testEngine.acceptOptionalLayer();
//
//       testEngine.changeActivePlayer("player_one");
//       await testEngine.resolveTopOfStack({ targets: [basilTenaciousMouse] });
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(2);
//
//       expect(testEngine.stackLayers.length).toEqual(0);
//     });
//     it("Clarabelle ordering: active player's Clarabelle effects must resolve before opponent's Goliath's effects", async () => {
//       // Setup: player_one has Goliath and 3 cards in hand; player_two has Clarabelle and 1 card.
//       // At the end of player_two's turn, Clarabelle (player_two's own ability) should resolve first
//       // drawing up to match player_one (3). Then Goliath should resolve and discard down to 2.
//       const testEngine = new TestEngine(
//         {
//           play: [clarabelleLightOnHerHooves],
//           hand: [basilTenaciousMouse, donaldGhostHunter],
//           deck: 10,
//         },
//         {
//           play: [goliathClanLeader, goliathClanLeader],
//           hand: [begone, butImMuchFaster, cantHoldItBackAnymore, chomp],
//           deck: 10,
//         },
//       );
//
//       await testEngine.passTurn();
//
//       // There should be one selection layer for clarabelle
//       expect(testEngine.stackLayers.length).toEqual(1);
//       testEngine.changeActivePlayer("player_one");
//
//       // Accept clarabelle's draw effect
//       await testEngine.acceptOptionalAbility();
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(4);
//
//       // Goliath triggers never resolve because the player had 2 cards at end-of-turn,
//       // before the clarabelle draw.
//       expect(testEngine.stackLayers.length).toEqual(0);
//     });
//   }); // Edge cases - multiple Goliaths and Clarabelle ordering
// });
//
