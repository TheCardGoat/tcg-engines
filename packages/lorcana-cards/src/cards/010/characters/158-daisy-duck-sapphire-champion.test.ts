// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ChefLouisInOverHisHead,
//   CrikeeGoodLuckCharm,
//   DaisyDuckGhostFinder,
//   DaisyDuckSapphireChampion,
//   MowgliManCub,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Daisy Duck - Sapphire Champion", () => {
//   Describe("STAND FAST - Your other Sapphire characters gain Resist +1", () => {
//     It("should grant Resist +1 to other Sapphire characters while Daisy is in play", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: daisyDuckSapphireChampion.cost + daisyDuckGhostFinder.cost,
//         Play: [daisyDuckSapphireChampion, daisyDuckGhostFinder],
//       });
//
//       Const daisy = testEngine.getCardModel(daisyDuckSapphireChampion);
//       Const ghostFinder = testEngine.getCardModel(daisyDuckGhostFinder);
//
//       // Other Sapphire character should have Resist +1
//       Expect(ghostFinder.hasResist).toBe(true);
//       Expect(ghostFinder.damageReduction()).toBe(1);
//
//       // Daisy herself should not have Resist from her own ability
//       Expect(daisy.hasResist).toBe(false);
//     });
//
//     It("should grant Resist +1 to multiple other Sapphire characters", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell:
//           DaisyDuckSapphireChampion.cost +
//           DaisyDuckGhostFinder.cost +
//           CrikeeGoodLuckCharm.cost,
//         Play: [
//           DaisyDuckSapphireChampion,
//           DaisyDuckGhostFinder,
//           CrikeeGoodLuckCharm,
//         ],
//       });
//
//       Const daisy = testEngine.getCardModel(daisyDuckSapphireChampion);
//       Const ghostFinder = testEngine.getCardModel(daisyDuckGhostFinder);
//       Const crikee = testEngine.getCardModel(crikeeGoodLuckCharm);
//
//       // Both other Sapphire characters should have Resist +1
//       Expect(ghostFinder.hasResist).toBe(true);
//       Expect(ghostFinder.damageReduction()).toBe(1);
//       Expect(crikee.hasResist).toBe(true);
//       Expect(crikee.damageReduction()).toBe(1);
//
//       // Daisy herself should not have Resist from her own ability
//       Expect(daisy.hasResist).toBe(false);
//     });
//
//     It("should not grant Resist to non-Sapphire characters", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: daisyDuckSapphireChampion.cost + mowgliManCub.cost,
//         Play: [daisyDuckSapphireChampion, mowgliManCub],
//       });
//
//       Const daisy = testEngine.getCardModel(daisyDuckSapphireChampion);
//       Const mowgli = testEngine.getCardModel(mowgliManCub);
//
//       // Non-Sapphire character (Amber) should not have Resist
//       Expect(mowgli.hasResist).toBe(false);
//
//       // Daisy herself should not have Resist
//       Expect(daisy.hasResist).toBe(false);
//     });
//
//     It("should remove Resist when Daisy leaves play", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: daisyDuckSapphireChampion.cost,
//           Play: [daisyDuckSapphireChampion, daisyDuckGhostFinder],
//         },
//         {
//           Play: [chefLouisInOverHisHead],
//         },
//       );
//
//       Const daisy = testEngine.getCardModel(daisyDuckSapphireChampion);
//       Const ghostFinder = testEngine.getCardModel(daisyDuckGhostFinder);
//       Const opponentChef = testEngine.getCardModel(chefLouisInOverHisHead);
//
//       // Ghost Finder should have Resist while Daisy is in play
//       Expect(ghostFinder.hasResist).toBe(true);
//
//       // Exert Daisy so she can be challenged
//       Await testEngine.tapCard(daisy);
//
//       // Pass turn to opponent
//       Await testEngine.passTurn();
//
//       // Opponent challenges and banishes Daisy (Chef Louis has 6 strength vs Daisy's 6 willpower)
//       Await testEngine.challenge({
//         Attacker: opponentChef,
//         Defender: daisy,
//       });
//
//       // Daisy should be banished
//       Expect(daisy.zone).toBe("discard");
//
//       // Ghost Finder should no longer have Resist
//       Expect(ghostFinder.hasResist).toBe(false);
//     });
//   });
//
//   Describe("LOOK AHEAD - Whenever one of your other Sapphire characters quests, you may look at the top card of your deck", () => {
//     It("should allow putting the top card on the top of the deck", async () => {
//       Const testEngine = new TestEngine({
//         Play: [daisyDuckSapphireChampion, daisyDuckGhostFinder],
//         Deck: [crikeeGoodLuckCharm, chefLouisInOverHisHead],
//       });
//
//       Const ghostFinder = testEngine.getCardModel(daisyDuckGhostFinder);
//       Const topCard = testEngine.getCardModel(crikeeGoodLuckCharm);
//
//       // Quest with Ghost Finder
//       Await testEngine.questCard(ghostFinder);
//
//       // Resolve Support ability first (Ghost Finder has Support)
//       Await testEngine.resolveOptionalAbility();
//
//       // Now resolve LOOK AHEAD ability - accept optional trigger and put card on top
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack(
//         {
//           Scry: {
//             Top: [crikeeGoodLuckCharm],
//           },
//         },
//         True,
//       ); // skipAssertion because there might be other layers
//
//       // Card should still be in the deck
//       Expect(topCard.zone).toBe("deck");
//
//       // Verify that the deck still has cards (scry worked)
//       Const deck = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "deck",
//       );
//       Expect(deck.length).toBe(2);
//     });
//
//     It("should allow putting the top card on the bottom of the deck", async () => {
//       Const testEngine = new TestEngine({
//         Play: [daisyDuckSapphireChampion, daisyDuckGhostFinder],
//         Deck: [crikeeGoodLuckCharm, chefLouisInOverHisHead],
//       });
//
//       Const ghostFinder = testEngine.getCardModel(daisyDuckGhostFinder);
//       Const topCard = testEngine.getCardModel(crikeeGoodLuckCharm);
//       Const secondCard = testEngine.getCardModel(chefLouisInOverHisHead);
//
//       // Quest with Ghost Finder
//       Await testEngine.questCard(ghostFinder);
//
//       // Resolve Support ability first (Ghost Finder has Support)
//       Await testEngine.resolveOptionalAbility();
//
//       // Now resolve LOOK AHEAD ability - accept optional trigger and put card on bottom
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack(
//         {
//           Scry: {
//             Bottom: [crikeeGoodLuckCharm],
//           },
//         },
//         True,
//       ); // skipAssertion because there might be other layers
//
//       // Original top card should now be at the bottom
//       Expect(topCard.zone).toBe("deck");
//
//       // Second card should now be on top
//       Const newTopCard =
//         TestEngine.store.tableStore.getTopDeckCard("player_one");
//       Expect(newTopCard?.instanceId).toBe(secondCard.instanceId);
//     });
//
//     It("should not trigger when Daisy herself quests", async () => {
//       Const testEngine = new TestEngine({
//         Play: [daisyDuckSapphireChampion],
//         Deck: [crikeeGoodLuckCharm, chefLouisInOverHisHead],
//       });
//
//       Const daisy = testEngine.getCardModel(daisyDuckSapphireChampion);
//
//       // Quest with Daisy herself
//       Await testEngine.questCard(daisy);
//
//       // LOOK AHEAD should NOT trigger because it only triggers for OTHER Sapphire characters
//       Expect(testEngine.store.stackLayerStore.layers.length).toBe(0);
//     });
//
//     It("should not trigger when non-Sapphire character quests", async () => {
//       Const testEngine = new TestEngine({
//         Play: [daisyDuckSapphireChampion, mowgliManCub],
//         Deck: [crikeeGoodLuckCharm, chefLouisInOverHisHead],
//       });
//
//       Const mowgli = testEngine.getCardModel(mowgliManCub);
//
//       // Quest with Mowgli (Amber character)
//       Await testEngine.questCard(mowgli);
//
//       // LOOK AHEAD should NOT trigger because Mowgli is not Sapphire
//       Expect(testEngine.store.stackLayerStore.layers.length).toBe(0);
//     });
//
//     It("should trigger multiple times for multiple Sapphire characters questing", async () => {
//       Const testEngine = new TestEngine({
//         Play: [
//           DaisyDuckSapphireChampion,
//           DaisyDuckGhostFinder,
//           CrikeeGoodLuckCharm,
//         ],
//         Deck: [chefLouisInOverHisHead, mowgliManCub],
//       });
//
//       Const ghostFinder = testEngine.getCardModel(daisyDuckGhostFinder);
//       Const crikee = testEngine.getCardModel(crikeeGoodLuckCharm);
//
//       // Quest with Ghost Finder
//       Await testEngine.questCard(ghostFinder);
//
//       // Support ability triggers first
//       Await testEngine.resolveOptionalAbility();
//
//       // LOOK AHEAD should trigger
//       Expect(testEngine.store.stackLayerStore.layers.length).toBeGreaterThan(0);
//
//       // Resolve the ability
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack(
//         {
//           Scry: {
//             Top: [chefLouisInOverHisHead],
//           },
//         },
//         True,
//       ); // skipAssertion
//
//       // Quest with Cri-Kee (no Support ability)
//       Await testEngine.questCard(crikee);
//
//       // LOOK AHEAD should trigger again
//       Expect(testEngine.store.stackLayerStore.layers.length).toBeGreaterThan(0);
//     });
//   });
// });
//
