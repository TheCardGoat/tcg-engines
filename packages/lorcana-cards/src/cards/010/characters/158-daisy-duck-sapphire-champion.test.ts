// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   chefLouisInOverHisHead,
//   crikeeGoodLuckCharm,
//   daisyDuckGhostFinder,
//   daisyDuckSapphireChampion,
//   mowgliManCub,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Daisy Duck - Sapphire Champion", () => {
//   describe("STAND FAST - Your other Sapphire characters gain Resist +1", () => {
//     it("should grant Resist +1 to other Sapphire characters while Daisy is in play", async () => {
//       const testEngine = new TestEngine({
//         inkwell: daisyDuckSapphireChampion.cost + daisyDuckGhostFinder.cost,
//         play: [daisyDuckSapphireChampion, daisyDuckGhostFinder],
//       });
//
//       const daisy = testEngine.getCardModel(daisyDuckSapphireChampion);
//       const ghostFinder = testEngine.getCardModel(daisyDuckGhostFinder);
//
//       // Other Sapphire character should have Resist +1
//       expect(ghostFinder.hasResist).toBe(true);
//       expect(ghostFinder.damageReduction()).toBe(1);
//
//       // Daisy herself should not have Resist from her own ability
//       expect(daisy.hasResist).toBe(false);
//     });
//
//     it("should grant Resist +1 to multiple other Sapphire characters", async () => {
//       const testEngine = new TestEngine({
//         inkwell:
//           daisyDuckSapphireChampion.cost +
//           daisyDuckGhostFinder.cost +
//           crikeeGoodLuckCharm.cost,
//         play: [
//           daisyDuckSapphireChampion,
//           daisyDuckGhostFinder,
//           crikeeGoodLuckCharm,
//         ],
//       });
//
//       const daisy = testEngine.getCardModel(daisyDuckSapphireChampion);
//       const ghostFinder = testEngine.getCardModel(daisyDuckGhostFinder);
//       const crikee = testEngine.getCardModel(crikeeGoodLuckCharm);
//
//       // Both other Sapphire characters should have Resist +1
//       expect(ghostFinder.hasResist).toBe(true);
//       expect(ghostFinder.damageReduction()).toBe(1);
//       expect(crikee.hasResist).toBe(true);
//       expect(crikee.damageReduction()).toBe(1);
//
//       // Daisy herself should not have Resist from her own ability
//       expect(daisy.hasResist).toBe(false);
//     });
//
//     it("should not grant Resist to non-Sapphire characters", async () => {
//       const testEngine = new TestEngine({
//         inkwell: daisyDuckSapphireChampion.cost + mowgliManCub.cost,
//         play: [daisyDuckSapphireChampion, mowgliManCub],
//       });
//
//       const daisy = testEngine.getCardModel(daisyDuckSapphireChampion);
//       const mowgli = testEngine.getCardModel(mowgliManCub);
//
//       // Non-Sapphire character (Amber) should not have Resist
//       expect(mowgli.hasResist).toBe(false);
//
//       // Daisy herself should not have Resist
//       expect(daisy.hasResist).toBe(false);
//     });
//
//     it("should remove Resist when Daisy leaves play", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: daisyDuckSapphireChampion.cost,
//           play: [daisyDuckSapphireChampion, daisyDuckGhostFinder],
//         },
//         {
//           play: [chefLouisInOverHisHead],
//         },
//       );
//
//       const daisy = testEngine.getCardModel(daisyDuckSapphireChampion);
//       const ghostFinder = testEngine.getCardModel(daisyDuckGhostFinder);
//       const opponentChef = testEngine.getCardModel(chefLouisInOverHisHead);
//
//       // Ghost Finder should have Resist while Daisy is in play
//       expect(ghostFinder.hasResist).toBe(true);
//
//       // Exert Daisy so she can be challenged
//       await testEngine.tapCard(daisy);
//
//       // Pass turn to opponent
//       await testEngine.passTurn();
//
//       // Opponent challenges and banishes Daisy (Chef Louis has 6 strength vs Daisy's 6 willpower)
//       await testEngine.challenge({
//         attacker: opponentChef,
//         defender: daisy,
//       });
//
//       // Daisy should be banished
//       expect(daisy.zone).toBe("discard");
//
//       // Ghost Finder should no longer have Resist
//       expect(ghostFinder.hasResist).toBe(false);
//     });
//   });
//
//   describe("LOOK AHEAD - Whenever one of your other Sapphire characters quests, you may look at the top card of your deck", () => {
//     it("should allow putting the top card on the top of the deck", async () => {
//       const testEngine = new TestEngine({
//         play: [daisyDuckSapphireChampion, daisyDuckGhostFinder],
//         deck: [crikeeGoodLuckCharm, chefLouisInOverHisHead],
//       });
//
//       const ghostFinder = testEngine.getCardModel(daisyDuckGhostFinder);
//       const topCard = testEngine.getCardModel(crikeeGoodLuckCharm);
//
//       // Quest with Ghost Finder
//       await testEngine.questCard(ghostFinder);
//
//       // Resolve Support ability first (Ghost Finder has Support)
//       await testEngine.resolveOptionalAbility();
//
//       // Now resolve LOOK AHEAD ability - accept optional trigger and put card on top
//       await testEngine.acceptOptionalLayer();
//       await testEngine.resolveTopOfStack(
//         {
//           scry: {
//             top: [crikeeGoodLuckCharm],
//           },
//         },
//         true,
//       ); // skipAssertion because there might be other layers
//
//       // Card should still be in the deck
//       expect(topCard.zone).toBe("deck");
//
//       // Verify that the deck still has cards (scry worked)
//       const deck = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "deck",
//       );
//       expect(deck.length).toBe(2);
//     });
//
//     it("should allow putting the top card on the bottom of the deck", async () => {
//       const testEngine = new TestEngine({
//         play: [daisyDuckSapphireChampion, daisyDuckGhostFinder],
//         deck: [crikeeGoodLuckCharm, chefLouisInOverHisHead],
//       });
//
//       const ghostFinder = testEngine.getCardModel(daisyDuckGhostFinder);
//       const topCard = testEngine.getCardModel(crikeeGoodLuckCharm);
//       const secondCard = testEngine.getCardModel(chefLouisInOverHisHead);
//
//       // Quest with Ghost Finder
//       await testEngine.questCard(ghostFinder);
//
//       // Resolve Support ability first (Ghost Finder has Support)
//       await testEngine.resolveOptionalAbility();
//
//       // Now resolve LOOK AHEAD ability - accept optional trigger and put card on bottom
//       await testEngine.acceptOptionalLayer();
//       await testEngine.resolveTopOfStack(
//         {
//           scry: {
//             bottom: [crikeeGoodLuckCharm],
//           },
//         },
//         true,
//       ); // skipAssertion because there might be other layers
//
//       // Original top card should now be at the bottom
//       expect(topCard.zone).toBe("deck");
//
//       // Second card should now be on top
//       const newTopCard =
//         testEngine.store.tableStore.getTopDeckCard("player_one");
//       expect(newTopCard?.instanceId).toBe(secondCard.instanceId);
//     });
//
//     it("should not trigger when Daisy herself quests", async () => {
//       const testEngine = new TestEngine({
//         play: [daisyDuckSapphireChampion],
//         deck: [crikeeGoodLuckCharm, chefLouisInOverHisHead],
//       });
//
//       const daisy = testEngine.getCardModel(daisyDuckSapphireChampion);
//
//       // Quest with Daisy herself
//       await testEngine.questCard(daisy);
//
//       // LOOK AHEAD should NOT trigger because it only triggers for OTHER Sapphire characters
//       expect(testEngine.store.stackLayerStore.layers.length).toBe(0);
//     });
//
//     it("should not trigger when non-Sapphire character quests", async () => {
//       const testEngine = new TestEngine({
//         play: [daisyDuckSapphireChampion, mowgliManCub],
//         deck: [crikeeGoodLuckCharm, chefLouisInOverHisHead],
//       });
//
//       const mowgli = testEngine.getCardModel(mowgliManCub);
//
//       // Quest with Mowgli (Amber character)
//       await testEngine.questCard(mowgli);
//
//       // LOOK AHEAD should NOT trigger because Mowgli is not Sapphire
//       expect(testEngine.store.stackLayerStore.layers.length).toBe(0);
//     });
//
//     it("should trigger multiple times for multiple Sapphire characters questing", async () => {
//       const testEngine = new TestEngine({
//         play: [
//           daisyDuckSapphireChampion,
//           daisyDuckGhostFinder,
//           crikeeGoodLuckCharm,
//         ],
//         deck: [chefLouisInOverHisHead, mowgliManCub],
//       });
//
//       const ghostFinder = testEngine.getCardModel(daisyDuckGhostFinder);
//       const crikee = testEngine.getCardModel(crikeeGoodLuckCharm);
//
//       // Quest with Ghost Finder
//       await testEngine.questCard(ghostFinder);
//
//       // Support ability triggers first
//       await testEngine.resolveOptionalAbility();
//
//       // LOOK AHEAD should trigger
//       expect(testEngine.store.stackLayerStore.layers.length).toBeGreaterThan(0);
//
//       // Resolve the ability
//       await testEngine.acceptOptionalLayer();
//       await testEngine.resolveTopOfStack(
//         {
//           scry: {
//             top: [chefLouisInOverHisHead],
//           },
//         },
//         true,
//       ); // skipAssertion
//
//       // Quest with Cri-Kee (no Support ability)
//       await testEngine.questCard(crikee);
//
//       // LOOK AHEAD should trigger again
//       expect(testEngine.store.stackLayerStore.layers.length).toBeGreaterThan(0);
//     });
//   });
// });
//
