// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { clarabelleLightOnHerHooves } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import {
//   BasilTenaciousMouse,
//   Begone,
//   ButImMuchFaster,
//   CantHoldItBackAnymore,
//   Chomp,
//   DonaldGhostHunter,
//   GoliathClanLeader,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Goliath - Clan Leader", () => {
//   Describe("DUSK TO DAWN - Player One (active player)", () => {
//     It("When player has more than 2 cards in hand should discard down to 2 cards at end of turn", async () => {
//       Const targets = [begone, butImMuchFaster];
//       Const testEngine = new TestEngine({
//         Inkwell: goliathClanLeader.cost,
//         Play: [goliathClanLeader],
//         Hand: [...targets, cantHoldItBackAnymore, chomp],
//         Deck: 10,
//       });
//
//       Const initialHandSize = testEngine.getZonesCardCount("player_one").hand;
//       Expect(initialHandSize).toBe(4);
//
//       // Pass turn to trigger end of turn
//       Await testEngine.passTurn();
//       Expect(testEngine.stackLayers).toHaveLength(1);
//
//       TestEngine.changeActivePlayer("player_one");
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack({
//         Targets: targets,
//       });
//
//       // At end of turn, player should be forced to discard down to 2 cards
//       Const finalHandSize = testEngine.getZonesCardCount("player_one").hand;
//       Expect(finalHandSize).toBe(2);
//
//       For (const target of targets) {
//         Expect(testEngine.getCardModel(target).zone).toBe("discard");
//       }
//
//       Expect(testEngine.stackLayers).toHaveLength(0);
//     });
//
//     It("When player has fewer than 2 cards in hand should draw up to 2 cards at end of turn", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: goliathClanLeader.cost,
//         Play: [goliathClanLeader],
//         Hand: [basilTenaciousMouse], // 1 card
//         Deck: 10,
//       });
//
//       Const initialHandSize = testEngine.getZonesCardCount("player_one").hand;
//       Expect(initialHandSize).toBe(1);
//
//       // Pass turn to trigger end of turn
//       Await testEngine.passTurn();
//       Expect(testEngine.stackLayers).toHaveLength(1);
//
//       TestEngine.changeActivePlayer("player_one");
//       Await testEngine.resolveTopOfStack({});
//
//       // At end of turn, player should draw up to 2 cards
//       Const finalHandSize = testEngine.getZonesCardCount("player_one").hand;
//       Expect(finalHandSize).toBe(2);
//     });
//
//     It("should draw up to 2 cards when player has 0 cards", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: goliathClanLeader.cost,
//         Play: [goliathClanLeader],
//         Hand: [], // 0 cards
//         Deck: 10,
//       });
//
//       Const initialHandSize = testEngine.getZonesCardCount("player_one").hand;
//       Expect(initialHandSize).toBe(0);
//
//       // Pass turn to trigger end of turn
//       Await testEngine.passTurn();
//       Expect(testEngine.stackLayers).toHaveLength(1);
//
//       TestEngine.changeActivePlayer("player_one");
//       Await testEngine.resolveTopOfStack({});
//
//       // At end of turn, player should draw up to 2 cards
//       Const finalHandSize = testEngine.getZonesCardCount("player_one").hand;
//       Expect(finalHandSize).toBe(2);
//     });
//
//     It("When player has exactly 2 cards in hand should not change hand size", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: goliathClanLeader.cost,
//         Play: [goliathClanLeader],
//         Hand: [basilTenaciousMouse, donaldGhostHunter], // 2 cards
//         Deck: 10,
//       });
//
//       Const initialHandSize = testEngine.getZonesCardCount("player_one").hand;
//       Expect(initialHandSize).toBe(2);
//
//       // Pass turn to trigger end of turn
//       Await testEngine.passTurn();
//       Expect(testEngine.stackLayers).toHaveLength(0);
//
//       // Hand size should remain 2
//       Const finalHandSize = testEngine.getZonesCardCount("player_one").hand;
//       Expect(finalHandSize).toBe(2);
//     });
//   });
//
//   Describe("DUSK TO DAWN - Player Two (opponent)", () => {
//     It("When player has more than 2 cards in hand should discard down to 2 cards at end of turn", async () => {
//       // Discard three because the player will draw when passing turns
//       Const targets = [begone, butImMuchFaster, cantHoldItBackAnymore];
//       Const testEngine = new TestEngine(
//         {
//           Play: [goliathClanLeader],
//           Hand: 2,
//         },
//         {
//           Hand: [...targets, chomp],
//           Deck: 10,
//         },
//       );
//
//       // Passing his turn shouldn't trigger anything
//       Await testEngine.passTurn();
//       Expect(testEngine.stackLayers).toHaveLength(0);
//
//       // Pass turn to trigger end of turn
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.passTurn();
//       Expect(testEngine.stackLayers).toHaveLength(1);
//
//       Const initialHandSize = testEngine.getZonesCardCount("player_two").hand;
//       Expect(initialHandSize).toBe(5);
//
//       Const layer = testEngine.stackLayers[0];
//       If (layer) {
//         // This is the variable the UI uses to determine how many cards to select
//         Expect(layer.targetAmount()).toBe(targets.length);
//       }
//
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.resolveTopOfStack({
//         Targets: targets,
//       });
//
//       // At end of turn, player should be forced to discard down to 2 cards
//       Const finalHandSize = testEngine.getZonesCardCount("player_two").hand;
//       Expect(finalHandSize).toBe(2);
//
//       For (const target of targets) {
//         Expect(testEngine.getCardModel(target).zone).toBe("discard");
//       }
//     });
//
//     It("should draw up to 2 cards when player has 0 cards", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [goliathClanLeader],
//           Hand: 2,
//         },
//         {
//           Hand: [], // 0 cards
//           Deck: 10,
//         },
//       );
//
//       Await testEngine.passTurn();
//       Expect(testEngine.stackLayers).toHaveLength(0);
//
//       Const initialHandSize = testEngine.getZonesCardCount("player_two").hand;
//       Expect(initialHandSize).toBe(1);
//
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.passTurn();
//
//       // At end of turn, player should draw up to 2 cards
//       Expect(testEngine.getZonesCardCount("player_two").hand).toBe(2);
//       // The first player initially had 2 cards, after receiving back the turn, should have 3 cards
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(3);
//     });
//
//     It("When player has fewer than 2 cards in hand should draw up to 2 cards at end of turn", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [goliathClanLeader],
//           Hand: 2,
//         },
//         {
//           Deck: [begone, butImMuchFaster, basilTenaciousMouse],
//         },
//       );
//
//       Await testEngine.passTurn();
//       Expect(testEngine.stackLayers).toHaveLength(0);
//
//       // After receiving the turn, player two should have 1 card in hand
//       Expect(testEngine.getZonesCardCount("player_two").hand).toBe(1);
//
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.passTurn();
//
//       // At end of turn, player should draw up to 2 cards
//       Expect(testEngine.getZonesCardCount("player_two").hand).toBe(2);
//       // The first player initially had 2 cards, after receiving back the turn, should have 3 cards
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(3);
//     });
//
//     It("When player has exactly 2 cards in hand should not change hand size", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [goliathClanLeader],
//           Hand: 2,
//         },
//         {
//           Inkwell: goliathClanLeader.cost,
//           Hand: 1, //After passing the turn, player two will have 2 cards
//           Deck: 10,
//         },
//       );
//
//       TestEngine.changeActivePlayer("player_one");
//       Await testEngine.passTurn();
//
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.passTurn();
//
//       Expect(testEngine.getZonesCardCount("player_two").hand).toBe(2);
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(3);
//     });
//   });
//
//   Describe("Edge cases - multiple Goliaths in play", () => {
//     It("When player one controls 2 Goliaths and opponent has >2 cards should discard down to 2 only once", async () => {
//       // Opponent has 4 cards; two Goliaths controlled by player one should NOT force them to discard twice
//       Const targets = [begone, butImMuchFaster, cantHoldItBackAnymore, chomp];
//       Const testEngine = new TestEngine(
//         {
//           Hand: [...targets],
//           Deck: 10,
//         },
//         {
//           Play: [goliathClanLeader, goliathClanLeader],
//           Hand: 2,
//         },
//       );
//
//       // Ensure initial opponent hand is 4
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(4);
//
//       // Pass turn for player one to trigger end-of-turn
//       Await testEngine.passTurn();
//
//       //
//       Expect(testEngine.stackLayers.length).toEqual(2);
//
//       // Resolve the layer choosing the three cards to discard down to 2
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.resolveTopOfStack({}, true);
//
//       TestEngine.changeActivePlayer("player_one");
//       Await testEngine.resolveTopOfStack(
//         { targets: targets.slice(0, 2) },
//         True,
//       );
//
//       // Final hand should be 2
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(2);
//
//       // Resolve the next ability with no targets (because DynamicAmount should now be 0)
//       Expect(testEngine.stackLayers.length).toEqual(1);
//
//       // player two still owns 1 discard effect to resolve
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.resolveTopOfStack({});
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(2);
//
//       // There shouldn't be any more stack layers
//       Expect(testEngine.stackLayers.length).toEqual(0);
//     });
//
//     It("When player one controls two Goliaths and opponent has <2 cards should draw up to 2 only once", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Hand: 0,
//           Deck: 10,
//         },
//         {
//           Play: [goliathClanLeader, goliathClanLeader],
//           Hand: 2,
//         },
//       );
//
//       // Ensure opponent starts with 0
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//
//       // Pass turn for player one to trigger end-of-turn
//       Await testEngine.passTurn();
//
//       // After resolving, player one should have exactly 2 cards
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.resolveTopOfStack({}, true);
//       Await testEngine.resolveTopOfStack({}, true);
//
//       // Accept draw trigger
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(2);
//
//       // There shouldn't be any more stack layers
//       Expect(testEngine.stackLayers.length).toEqual(0);
//     });
//
//     It("When each player controls one Goliath and opponent has >2 cards should discard down to 2", async () => {
//       // One Goliath each — ensure no duplicated discard for opponent
//       Const targets = [begone, butImMuchFaster, cantHoldItBackAnymore];
//       Const testEngine = new TestEngine(
//         {
//           Play: [goliathClanLeader],
//           Hand: [...targets, chomp],
//           Deck: 10,
//         },
//         {
//           Play: [goliathClanLeader],
//           Hand: 2,
//         },
//       );
//
//       // End player_two's turn to trigger both Goliath interactions
//       Await testEngine.passTurn();
//
//       // both goliath effects
//       Expect(testEngine.stackLayers.length).toEqual(2);
//
//       // Resolve top of stack selecting discard targets (should discard down to 2 total)
//       TestEngine.changeActivePlayer("player_one");
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack(
//         { targets: targets.slice(0, 2) },
//         True,
//       );
//
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(2);
//
//       // There is an extra layer for opponent's Goliath, which should now have 0 to draw
//       Expect(testEngine.stackLayers.length).toEqual(1);
//
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.resolveTopOfStack({});
//
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(2);
//
//       // There shouldn't be any more stack layers
//       Expect(testEngine.stackLayers.length).toEqual(0);
//     });
//
//     It("When each player controls one Goliath and opponent has <2 cards should draw up to 2 (single resolution)", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [goliathClanLeader],
//           Hand: 0,
//           Deck: 10,
//         },
//         {
//           Play: [goliathClanLeader],
//           Hand: 2,
//         },
//       );
//
//       Await testEngine.passTurn();
//
//       TestEngine.changeActivePlayer("player_one");
//       Await testEngine.acceptOptionalLayer();
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(2);
//
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.acceptOptionalLayer();
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(2);
//
//       // There shouldn't be any more stack layers
//       Expect(testEngine.stackLayers.length).toEqual(0);
//     });
//   }); // Edge cases - multiple Goliaths in play
//
//   Describe("Edge cases - multiple Goliaths and Clarabelle ordering", () => {
//     It("Clarabelle ordering: active player's Clarabelle effects must resolve before opponent's Goliath effects", async () => {
//       // Setup: player_one has Goliath and 3 cards in hand; player_two has Clarabelle and 1 card.
//       // At the end of player_two's turn, Clarabelle (player_two's own ability) should resolve first
//       // drawing up to match player_one (3). Then Goliath should resolve and discard down to 2.
//       Const testEngine = new TestEngine(
//         {
//           Play: [clarabelleLightOnHerHooves],
//           Hand: [basilTenaciousMouse], // 1 card
//           Deck: 10,
//         },
//         {
//           Play: [goliathClanLeader],
//           Hand: [begone, butImMuchFaster, cantHoldItBackAnymore], // 3 cards
//           Deck: 10,
//         },
//       );
//
//       // End player_two's turn to trigger both Clarabelle (owner: player_one) and Goliath (owner: player_two)
//       Await testEngine.passTurn();
//
//       // both clarabelle and goliath effects
//       Expect(testEngine.stackLayers.length).toEqual(2);
//
//       // First Clarabelle should be applied (player_two draws up to match player_one's 3)
//       // No Goliath layer(s) should be present.
//       TestEngine.changeActivePlayer("player_one");
//
//       // Resolve Clarabelle draw
//       Await testEngine.acceptOptionalAbility();
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(3);
//
//       // Goliath trigger is now present for player two
//       Expect(testEngine.stackLayers.length).toEqual(1);
//
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.acceptOptionalLayer();
//
//       TestEngine.changeActivePlayer("player_one");
//       Await testEngine.resolveTopOfStack({ targets: [basilTenaciousMouse] });
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(2);
//
//       Expect(testEngine.stackLayers.length).toEqual(0);
//     });
//     It("Clarabelle ordering: active player's Clarabelle effects must resolve before opponent's Goliath's effects", async () => {
//       // Setup: player_one has Goliath and 3 cards in hand; player_two has Clarabelle and 1 card.
//       // At the end of player_two's turn, Clarabelle (player_two's own ability) should resolve first
//       // drawing up to match player_one (3). Then Goliath should resolve and discard down to 2.
//       Const testEngine = new TestEngine(
//         {
//           Play: [clarabelleLightOnHerHooves],
//           Hand: [basilTenaciousMouse, donaldGhostHunter],
//           Deck: 10,
//         },
//         {
//           Play: [goliathClanLeader, goliathClanLeader],
//           Hand: [begone, butImMuchFaster, cantHoldItBackAnymore, chomp],
//           Deck: 10,
//         },
//       );
//
//       Await testEngine.passTurn();
//
//       // There should be one selection layer for clarabelle
//       Expect(testEngine.stackLayers.length).toEqual(1);
//       TestEngine.changeActivePlayer("player_one");
//
//       // Accept clarabelle's draw effect
//       Await testEngine.acceptOptionalAbility();
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(4);
//
//       // Goliath triggers never resolve because the player had 2 cards at end-of-turn,
//       // before the clarabelle draw.
//       Expect(testEngine.stackLayers.length).toEqual(0);
//     });
//   }); // Edge cases - multiple Goliaths and Clarabelle ordering
// });
//
