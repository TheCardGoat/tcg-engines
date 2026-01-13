// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { trampStreetSmartDog } from "@lorcanito/lorcana-engine/cards/007";
// import { trampDapperRascal } from "@lorcanito/lorcana-engine/cards/008";
// import {
//   kristoffMiningTheRuins,
//   theBlackCauldron,
//   vladimirCeramicUnicornFan,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("The Black Cauldron", () => {
//   it("THE CAULDRON CALLS - {E}, 1 {I} — Put a character card from your discard under this item faceup.", async () => {
//     const testEngine = new TestEngine({
//       play: [theBlackCauldron],
//       discard: [kristoffMiningTheRuins, vladimirCeramicUnicornFan],
//       inkwell: 5,
//     });
//
//     const cardUnderTest = testEngine.getCardModel(theBlackCauldron);
//     const targetCard = testEngine.getCardModel(kristoffMiningTheRuins);
//
//     await testEngine.activateCard(cardUnderTest, {
//       ability: "THE CAULDRON CALLS",
//       targets: [targetCard],
//     });
//
//     expect(targetCard.isUnder(cardUnderTest)).toBe(true);
//     expect(targetCard.isFaceUp).toBe(true);
//     expect(cardUnderTest.cardsUnder).toHaveLength(1);
//     expect(cardUnderTest.exerted).toBe(true);
//     expect(testEngine.getAvailableInkwellCardCount()).toBe(5 - 1);
//
//     await testEngine.tapCard(cardUnderTest, true);
//
//     const secondTarget = testEngine.getCardModel(vladimirCeramicUnicornFan);
//     await testEngine.activateCard(cardUnderTest, {
//       ability: "THE CAULDRON CALLS",
//       targets: [secondTarget],
//     });
//
//     expect(secondTarget.isUnder(cardUnderTest)).toBe(true);
//     expect(secondTarget.isFaceUp).toBe(true);
//     expect(cardUnderTest.cardsUnder).toHaveLength(2);
//     expect(cardUnderTest.exerted).toBe(true);
//     expect(testEngine.getAvailableInkwellCardCount()).toBe(5 - 2);
//   });
//
//   it("RISE AND JOIN ME! - {E}, 1 {I} — This turn, you may play characters from under this item.", async () => {
//     const testEngine = new TestEngine({
//       play: [theBlackCauldron],
//       discard: [kristoffMiningTheRuins, vladimirCeramicUnicornFan],
//       inkwell: 2 + vladimirCeramicUnicornFan.cost,
//     });
//
//     const cardUnderTest = testEngine.getCardModel(theBlackCauldron);
//     const targetCard = testEngine.getCardModel(vladimirCeramicUnicornFan);
//
//     await testEngine.activateCard(cardUnderTest, {
//       ability: "THE CAULDRON CALLS",
//       targets: [targetCard],
//     });
//
//     expect(targetCard.isUnder(cardUnderTest)).toBe(true);
//
//     await testEngine.tapCard(cardUnderTest, true);
//     expect(cardUnderTest.exerted).toBe(false);
//
//     expect(cardUnderTest.cardsUnder).toHaveLength(1);
//
//     // Activate RISE AND JOIN ME to grant permission to play from under cauldron this turn
//     await testEngine.activateCard(cardUnderTest, {
//       ability: "RISE AND JOIN ME!",
//     });
//
//     // Now actually play the card from under the cauldron using PLAY CARDS UNDER ability
//     await testEngine.activateCard(cardUnderTest, {
//       ability: "PLAY CARDS UNDER",
//     });
//     // The play layer is optional and requires manual target selection
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({ targets: [targetCard] });
//
//     expect(cardUnderTest.cardsUnder).toHaveLength(0);
//
//     expect(targetCard.zone).not.toBe("under-card");
//     expect(targetCard.isUnder(cardUnderTest)).toBe(false);
//     expect(targetCard.zone).toBe("play");
//   });
//
//   it("RISE AND JOIN ME! - Should only be able to play characters from under the specific cauldron", async () => {
//     const testEngine = new TestEngine({
//       play: [theBlackCauldron, theBlackCauldron],
//       discard: [kristoffMiningTheRuins, vladimirCeramicUnicornFan],
//       inkwell: 3 + kristoffMiningTheRuins.cost, // 3 for abilities (2x THE CAULDRON CALLS + 1x RISE AND JOIN ME) + 3 for Kristoff
//     });
//
//     const cauldronOne = testEngine.getCardModel(theBlackCauldron, 0);
//     const cauldronTwo = testEngine.getCardModel(theBlackCauldron, 1);
//     const kristoff = testEngine.getCardModel(kristoffMiningTheRuins);
//     const vladimir = testEngine.getCardModel(vladimirCeramicUnicornFan);
//
//     // Put Kristoff under cauldron one
//     await testEngine.activateCard(cauldronOne, {
//       ability: "THE CAULDRON CALLS",
//       targets: [kristoff],
//     });
//
//     // Put Vladimir under cauldron two
//     await testEngine.activateCard(cauldronTwo, {
//       ability: "THE CAULDRON CALLS",
//       targets: [vladimir],
//     });
//
//     expect(kristoff.isUnder(cauldronOne)).toBe(true);
//     expect(vladimir.isUnder(cauldronTwo)).toBe(true);
//
//     // Activate cauldron one's RISE AND JOIN ME! to grant permission
//     await testEngine.tapCard(cauldronOne, true);
//     await testEngine.activateCard(cauldronOne, {
//       ability: "RISE AND JOIN ME!",
//     });
//
//     // Play Kristoff from under cauldron one using PLAY CARDS UNDER
//     await testEngine.activateCard(cauldronOne, {
//       ability: "PLAY CARDS UNDER",
//     });
//     // The play layer is optional and requires manual target selection
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({ targets: [kristoff] });
//
//     // Kristoff should be played
//     expect(kristoff.zone).toBe("play");
//     expect(kristoff.isUnder(cauldronOne)).toBe(false);
//
//     // Vladimir should still be under cauldron two (not accessible by cauldron one)
//     expect(vladimir.isUnder(cauldronTwo)).toBe(true);
//     expect(vladimir.zone).toBe("under-card"); // Cards under other cards are in under-card zone
//
//     // Try to play Vladimir using PLAY CARDS UNDER from cauldron one - should fail because
//     // Vladimir is under cauldron two, not cauldron one
//     // Since there are no valid cards under cauldron one anymore, the activation will fail gracefully
//     await testEngine.activateCard(cauldronOne, {
//       ability: "PLAY CARDS UNDER",
//     });
//     // The optional layer auto-fails when there are no valid cards (shows "No cards available" warning)
//     expect(vladimir.zone).toBe("under-card"); // Still under cauldron two
//     expect(vladimir.isUnder(cauldronTwo)).toBe(true);
//   });
//
//   it("RISE AND JOIN ME! - Should allow shift when card is under cauldron", async () => {
//     const testEngine = new TestEngine({
//       play: [theBlackCauldron, trampStreetSmartDog],
//       discard: [trampDapperRascal],
//       inkwell: 2 + 4, // 2 for cauldron abilities + 4 for shift cost
//     });
//
//     const cauldron = testEngine.getCardModel(theBlackCauldron);
//     const trampBase = testEngine.getCardModel(trampStreetSmartDog);
//
//     // Put Tramp Dapper Rascal under cauldron
//     await testEngine.activateCard(cauldron, {
//       ability: "THE CAULDRON CALLS",
//       targets: [trampDapperRascal],
//     });
//
//     const trampShift = testEngine.getCardModel(trampDapperRascal);
//     expect(trampShift.isUnder(cauldron)).toBe(true);
//
//     // Activate RISE AND JOIN ME! to grant permission
//     await testEngine.tapCard(cauldron, true);
//     await testEngine.activateCard(cauldron, {
//       ability: "RISE AND JOIN ME!",
//     });
//
//     // Verify we can shift the card even though it's under the cauldron
//     // Shift should work because the card has play-permission from the cauldron
//     const { shifter } = await testEngine.shiftCard({
//       shifted: trampStreetSmartDog,
//       shifter: trampDapperRascal,
//     });
//
//     expect(shifter.zone).toBe("play");
//     expect(trampBase.zone).toBe("play"); // Shifted card remains in play zone
//     expect(trampBase.meta.shifter).toBe(shifter.instanceId); // Shifted card is linked to shifter
//     expect(testEngine.getAvailableInkwellCardCount()).toBe(0); // 6 - 1 (cauldron calls) - 1 (rise and join me) - 4 (shift cost) = 0
//   });
//
//   it("RISE AND JOIN ME! - Should apply cost reduction effects when playing from under cauldron", async () => {
//     const testEngine = new TestEngine({
//       play: [
//         theBlackCauldron,
//         kristoffMiningTheRuins,
//         vladimirCeramicUnicornFan,
//       ],
//       discard: [trampStreetSmartDog],
//       inkwell: 2 + 5, // 2 for cauldron abilities + 5 for Tramp (base cost 7 minus 2 for 2 characters in play)
//     });
//
//     const cauldron = testEngine.getCardModel(theBlackCauldron);
//     const tramp = testEngine.getCardModel(trampStreetSmartDog);
//
//     // Put Tramp Street-Smart Dog under cauldron
//     await testEngine.activateCard(cauldron, {
//       ability: "THE CAULDRON CALLS",
//       targets: [tramp],
//     });
//
//     expect(tramp.isUnder(cauldron)).toBe(true);
//
//     // Activate RISE AND JOIN ME! to grant permission
//     await testEngine.tapCard(cauldron, true);
//     await testEngine.activateCard(cauldron, {
//       ability: "RISE AND JOIN ME!",
//     });
//
//     // Play Tramp using PLAY CARDS UNDER - should benefit from cost reduction
//     // Tramp has "NOW IT'S A PARTY" - For each character you have in play, you pay {I} less
//     // With 2 characters in play (Kristoff and Vladimir), the cost should be 7 - 2 = 5
//     await testEngine.activateCard(cauldron, {
//       ability: "PLAY CARDS UNDER",
//     });
//     // The play layer is optional and requires manual target selection
//     // Skip assertion because Tramp's play trigger will add another layer to stack
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({ targets: [tramp] }, true);
//
//     expect(tramp.zone).toBe("play");
//     expect(testEngine.getAvailableInkwellCardCount()).toBe(0); // 7 - 2 - 5 = 0
//
//     // Tramp's "HOW'S PICKINGS?" trigger should also work
//     await testEngine.resolveOptionalAbility();
//     // Should draw 2 cards (for 2 other characters) and discard 2
//     expect(testEngine.getZonesCardCount().hand).toBeGreaterThan(0);
//   });
//
//   it("RISE AND JOIN ME! - Should not persist between turns", async () => {
//     const testEngine = new TestEngine({
//       play: [theBlackCauldron],
//       discard: [kristoffMiningTheRuins, vladimirCeramicUnicornFan],
//       inkwell: 4 + kristoffMiningTheRuins.cost + vladimirCeramicUnicornFan.cost, // 4 for abilities + character costs
//     });
//
//     const cauldron = testEngine.getCardModel(theBlackCauldron);
//     const kristoff = testEngine.getCardModel(kristoffMiningTheRuins);
//     const vladimir = testEngine.getCardModel(vladimirCeramicUnicornFan);
//
//     // Put both characters under cauldron
//     await testEngine.activateCard(cauldron, {
//       ability: "THE CAULDRON CALLS",
//       targets: [kristoff],
//     });
//
//     await testEngine.tapCard(cauldron, true);
//     await testEngine.activateCard(cauldron, {
//       ability: "THE CAULDRON CALLS",
//       targets: [vladimir],
//     });
//
//     expect(kristoff.isUnder(cauldron)).toBe(true);
//     expect(vladimir.isUnder(cauldron)).toBe(true);
//
//     // Activate RISE AND JOIN ME! to grant play-permission this turn
//     await testEngine.tapCard(cauldron, true);
//     await testEngine.activateCard(cauldron, {
//       ability: "RISE AND JOIN ME!",
//     });
//
//     // Verify we can play Kristoff this turn using PLAY CARDS UNDER
//     await testEngine.activateCard(cauldron, {
//       ability: "PLAY CARDS UNDER",
//     });
//     // There are 2 cards under the cauldron, so we need to select which one to play
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({ targets: [kristoff] });
//
//     expect(kristoff.zone).toBe("play");
//     expect(kristoff.isUnder(cauldron)).toBe(false);
//     expect(vladimir.isUnder(cauldron)).toBe(true);
//
//     // Pass turn to opponent and back - this should expire the permission
//     await testEngine.passTurn();
//     await testEngine.passTurn();
//
//     // Try to play Vladimir using VIEW CARDS UNDER without activating RISE AND JOIN ME! again
//     // Should fail because the permission expired at end of turn
//     await testEngine.activateCard(cauldron, {
//       ability: "PLAY CARDS UNDER",
//     });
//
//     // Vladimir should still be under the cauldron (play was rejected)
//     expect(vladimir.zone).toBe("under-card");
//     expect(vladimir.isUnder(cauldron)).toBe(true);
//   });
//
//   it("PLAY CARDS UNDER - Should allow viewing cards even when play-permission is not active", async () => {
//     const testEngine = new TestEngine({
//       play: [theBlackCauldron],
//       discard: [kristoffMiningTheRuins, vladimirCeramicUnicornFan],
//       inkwell: 2, // Only enough for THE CAULDRON CALLS, not enough for playing characters
//     });
//
//     const cauldron = testEngine.getCardModel(theBlackCauldron);
//     const kristoff = testEngine.getCardModel(kristoffMiningTheRuins);
//     const vladimir = testEngine.getCardModel(vladimirCeramicUnicornFan);
//
//     // Put both characters under cauldron
//     await testEngine.activateCard(cauldron, {
//       ability: "THE CAULDRON CALLS",
//       targets: [kristoff],
//     });
//
//     await testEngine.tapCard(cauldron, true);
//     await testEngine.activateCard(cauldron, {
//       ability: "THE CAULDRON CALLS",
//       targets: [vladimir],
//     });
//
//     expect(kristoff.isUnder(cauldron)).toBe(true);
//     expect(vladimir.isUnder(cauldron)).toBe(true);
//
//     // Activate PLAY CARDS UNDER WITHOUT activating RISE AND JOIN ME! first
//     // This should create a layer on the stack that allows viewing the cards
//     await testEngine.activateCard(cauldron, {
//       ability: "PLAY CARDS UNDER",
//     });
//
//     // The play-from-under effect should create a play layer on the stack
//     // even though we don't have play-permission active
//     expect(testEngine.store.stackLayerStore.layers.length).toBeGreaterThan(0);
//
//     // The top layer should be the play layer showing the cards under cauldron
//     const topLayer = testEngine.store.stackLayerStore.layers[0];
//     expect(topLayer).toBeDefined();
//     expect(topLayer?.ability.type).toBe("resolution");
//
//     // Now try to resolve by selecting Kristoff
//     // This should fail during the play effect resolution (not before)
//     // because play-permission is not active
//     await testEngine.resolveTopOfStack(
//       {
//         targets: [kristoff],
//       },
//       true,
//     ); // skipAssertion = true: Layer remains on stack when permission check fails
//
//     // The play should fail, so Kristoff should still be under the cauldron
//     expect(kristoff.zone).toBe("under-card");
//     expect(kristoff.isUnder(cauldron)).toBe(true);
//
//     // Layer should still be on stack (player can cancel or try another card)
//     expect(testEngine.store.stackLayerStore.layers.length).toBeGreaterThan(0);
//
//     // But we should have been able to see the cards and make a selection
//     // (The test passing means the PLAY CARDS UNDER ability was activated successfully)
//   });
// });
//
