// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { trampStreetSmartDog } from "@lorcanito/lorcana-engine/cards/007";
// Import { trampDapperRascal } from "@lorcanito/lorcana-engine/cards/008";
// Import {
//   KristoffMiningTheRuins,
//   TheBlackCauldron,
//   VladimirCeramicUnicornFan,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Black Cauldron", () => {
//   It("THE CAULDRON CALLS - {E}, 1 {I} — Put a character card from your discard under this item faceup.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [theBlackCauldron],
//       Discard: [kristoffMiningTheRuins, vladimirCeramicUnicornFan],
//       Inkwell: 5,
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(theBlackCauldron);
//     Const targetCard = testEngine.getCardModel(kristoffMiningTheRuins);
//
//     Await testEngine.activateCard(cardUnderTest, {
//       Ability: "THE CAULDRON CALLS",
//       Targets: [targetCard],
//     });
//
//     Expect(targetCard.isUnder(cardUnderTest)).toBe(true);
//     Expect(targetCard.isFaceUp).toBe(true);
//     Expect(cardUnderTest.cardsUnder).toHaveLength(1);
//     Expect(cardUnderTest.exerted).toBe(true);
//     Expect(testEngine.getAvailableInkwellCardCount()).toBe(5 - 1);
//
//     Await testEngine.tapCard(cardUnderTest, true);
//
//     Const secondTarget = testEngine.getCardModel(vladimirCeramicUnicornFan);
//     Await testEngine.activateCard(cardUnderTest, {
//       Ability: "THE CAULDRON CALLS",
//       Targets: [secondTarget],
//     });
//
//     Expect(secondTarget.isUnder(cardUnderTest)).toBe(true);
//     Expect(secondTarget.isFaceUp).toBe(true);
//     Expect(cardUnderTest.cardsUnder).toHaveLength(2);
//     Expect(cardUnderTest.exerted).toBe(true);
//     Expect(testEngine.getAvailableInkwellCardCount()).toBe(5 - 2);
//   });
//
//   It("RISE AND JOIN ME! - {E}, 1 {I} — This turn, you may play characters from under this item.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [theBlackCauldron],
//       Discard: [kristoffMiningTheRuins, vladimirCeramicUnicornFan],
//       Inkwell: 2 + vladimirCeramicUnicornFan.cost,
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(theBlackCauldron);
//     Const targetCard = testEngine.getCardModel(vladimirCeramicUnicornFan);
//
//     Await testEngine.activateCard(cardUnderTest, {
//       Ability: "THE CAULDRON CALLS",
//       Targets: [targetCard],
//     });
//
//     Expect(targetCard.isUnder(cardUnderTest)).toBe(true);
//
//     Await testEngine.tapCard(cardUnderTest, true);
//     Expect(cardUnderTest.exerted).toBe(false);
//
//     Expect(cardUnderTest.cardsUnder).toHaveLength(1);
//
//     // Activate RISE AND JOIN ME to grant permission to play from under cauldron this turn
//     Await testEngine.activateCard(cardUnderTest, {
//       Ability: "RISE AND JOIN ME!",
//     });
//
//     // Now actually play the card from under the cauldron using PLAY CARDS UNDER ability
//     Await testEngine.activateCard(cardUnderTest, {
//       Ability: "PLAY CARDS UNDER",
//     });
//     // The play layer is optional and requires manual target selection
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [targetCard] });
//
//     Expect(cardUnderTest.cardsUnder).toHaveLength(0);
//
//     Expect(targetCard.zone).not.toBe("under-card");
//     Expect(targetCard.isUnder(cardUnderTest)).toBe(false);
//     Expect(targetCard.zone).toBe("play");
//   });
//
//   It("RISE AND JOIN ME! - Should only be able to play characters from under the specific cauldron", async () => {
//     Const testEngine = new TestEngine({
//       Play: [theBlackCauldron, theBlackCauldron],
//       Discard: [kristoffMiningTheRuins, vladimirCeramicUnicornFan],
//       Inkwell: 3 + kristoffMiningTheRuins.cost, // 3 for abilities (2x THE CAULDRON CALLS + 1x RISE AND JOIN ME) + 3 for Kristoff
//     });
//
//     Const cauldronOne = testEngine.getCardModel(theBlackCauldron, 0);
//     Const cauldronTwo = testEngine.getCardModel(theBlackCauldron, 1);
//     Const kristoff = testEngine.getCardModel(kristoffMiningTheRuins);
//     Const vladimir = testEngine.getCardModel(vladimirCeramicUnicornFan);
//
//     // Put Kristoff under cauldron one
//     Await testEngine.activateCard(cauldronOne, {
//       Ability: "THE CAULDRON CALLS",
//       Targets: [kristoff],
//     });
//
//     // Put Vladimir under cauldron two
//     Await testEngine.activateCard(cauldronTwo, {
//       Ability: "THE CAULDRON CALLS",
//       Targets: [vladimir],
//     });
//
//     Expect(kristoff.isUnder(cauldronOne)).toBe(true);
//     Expect(vladimir.isUnder(cauldronTwo)).toBe(true);
//
//     // Activate cauldron one's RISE AND JOIN ME! to grant permission
//     Await testEngine.tapCard(cauldronOne, true);
//     Await testEngine.activateCard(cauldronOne, {
//       Ability: "RISE AND JOIN ME!",
//     });
//
//     // Play Kristoff from under cauldron one using PLAY CARDS UNDER
//     Await testEngine.activateCard(cauldronOne, {
//       Ability: "PLAY CARDS UNDER",
//     });
//     // The play layer is optional and requires manual target selection
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [kristoff] });
//
//     // Kristoff should be played
//     Expect(kristoff.zone).toBe("play");
//     Expect(kristoff.isUnder(cauldronOne)).toBe(false);
//
//     // Vladimir should still be under cauldron two (not accessible by cauldron one)
//     Expect(vladimir.isUnder(cauldronTwo)).toBe(true);
//     Expect(vladimir.zone).toBe("under-card"); // Cards under other cards are in under-card zone
//
//     // Try to play Vladimir using PLAY CARDS UNDER from cauldron one - should fail because
//     // Vladimir is under cauldron two, not cauldron one
//     // Since there are no valid cards under cauldron one anymore, the activation will fail gracefully
//     Await testEngine.activateCard(cauldronOne, {
//       Ability: "PLAY CARDS UNDER",
//     });
//     // The optional layer auto-fails when there are no valid cards (shows "No cards available" warning)
//     Expect(vladimir.zone).toBe("under-card"); // Still under cauldron two
//     Expect(vladimir.isUnder(cauldronTwo)).toBe(true);
//   });
//
//   It("RISE AND JOIN ME! - Should allow shift when card is under cauldron", async () => {
//     Const testEngine = new TestEngine({
//       Play: [theBlackCauldron, trampStreetSmartDog],
//       Discard: [trampDapperRascal],
//       Inkwell: 2 + 4, // 2 for cauldron abilities + 4 for shift cost
//     });
//
//     Const cauldron = testEngine.getCardModel(theBlackCauldron);
//     Const trampBase = testEngine.getCardModel(trampStreetSmartDog);
//
//     // Put Tramp Dapper Rascal under cauldron
//     Await testEngine.activateCard(cauldron, {
//       Ability: "THE CAULDRON CALLS",
//       Targets: [trampDapperRascal],
//     });
//
//     Const trampShift = testEngine.getCardModel(trampDapperRascal);
//     Expect(trampShift.isUnder(cauldron)).toBe(true);
//
//     // Activate RISE AND JOIN ME! to grant permission
//     Await testEngine.tapCard(cauldron, true);
//     Await testEngine.activateCard(cauldron, {
//       Ability: "RISE AND JOIN ME!",
//     });
//
//     // Verify we can shift the card even though it's under the cauldron
//     // Shift should work because the card has play-permission from the cauldron
//     Const { shifter } = await testEngine.shiftCard({
//       Shifted: trampStreetSmartDog,
//       Shifter: trampDapperRascal,
//     });
//
//     Expect(shifter.zone).toBe("play");
//     Expect(trampBase.zone).toBe("play"); // Shifted card remains in play zone
//     Expect(trampBase.meta.shifter).toBe(shifter.instanceId); // Shifted card is linked to shifter
//     Expect(testEngine.getAvailableInkwellCardCount()).toBe(0); // 6 - 1 (cauldron calls) - 1 (rise and join me) - 4 (shift cost) = 0
//   });
//
//   It("RISE AND JOIN ME! - Should apply cost reduction effects when playing from under cauldron", async () => {
//     Const testEngine = new TestEngine({
//       Play: [
//         TheBlackCauldron,
//         KristoffMiningTheRuins,
//         VladimirCeramicUnicornFan,
//       ],
//       Discard: [trampStreetSmartDog],
//       Inkwell: 2 + 5, // 2 for cauldron abilities + 5 for Tramp (base cost 7 minus 2 for 2 characters in play)
//     });
//
//     Const cauldron = testEngine.getCardModel(theBlackCauldron);
//     Const tramp = testEngine.getCardModel(trampStreetSmartDog);
//
//     // Put Tramp Street-Smart Dog under cauldron
//     Await testEngine.activateCard(cauldron, {
//       Ability: "THE CAULDRON CALLS",
//       Targets: [tramp],
//     });
//
//     Expect(tramp.isUnder(cauldron)).toBe(true);
//
//     // Activate RISE AND JOIN ME! to grant permission
//     Await testEngine.tapCard(cauldron, true);
//     Await testEngine.activateCard(cauldron, {
//       Ability: "RISE AND JOIN ME!",
//     });
//
//     // Play Tramp using PLAY CARDS UNDER - should benefit from cost reduction
//     // Tramp has "NOW IT'S A PARTY" - For each character you have in play, you pay {I} less
//     // With 2 characters in play (Kristoff and Vladimir), the cost should be 7 - 2 = 5
//     Await testEngine.activateCard(cauldron, {
//       Ability: "PLAY CARDS UNDER",
//     });
//     // The play layer is optional and requires manual target selection
//     // Skip assertion because Tramp's play trigger will add another layer to stack
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [tramp] }, true);
//
//     Expect(tramp.zone).toBe("play");
//     Expect(testEngine.getAvailableInkwellCardCount()).toBe(0); // 7 - 2 - 5 = 0
//
//     // Tramp's "HOW'S PICKINGS?" trigger should also work
//     Await testEngine.resolveOptionalAbility();
//     // Should draw 2 cards (for 2 other characters) and discard 2
//     Expect(testEngine.getZonesCardCount().hand).toBeGreaterThan(0);
//   });
//
//   It("RISE AND JOIN ME! - Should not persist between turns", async () => {
//     Const testEngine = new TestEngine({
//       Play: [theBlackCauldron],
//       Discard: [kristoffMiningTheRuins, vladimirCeramicUnicornFan],
//       Inkwell: 4 + kristoffMiningTheRuins.cost + vladimirCeramicUnicornFan.cost, // 4 for abilities + character costs
//     });
//
//     Const cauldron = testEngine.getCardModel(theBlackCauldron);
//     Const kristoff = testEngine.getCardModel(kristoffMiningTheRuins);
//     Const vladimir = testEngine.getCardModel(vladimirCeramicUnicornFan);
//
//     // Put both characters under cauldron
//     Await testEngine.activateCard(cauldron, {
//       Ability: "THE CAULDRON CALLS",
//       Targets: [kristoff],
//     });
//
//     Await testEngine.tapCard(cauldron, true);
//     Await testEngine.activateCard(cauldron, {
//       Ability: "THE CAULDRON CALLS",
//       Targets: [vladimir],
//     });
//
//     Expect(kristoff.isUnder(cauldron)).toBe(true);
//     Expect(vladimir.isUnder(cauldron)).toBe(true);
//
//     // Activate RISE AND JOIN ME! to grant play-permission this turn
//     Await testEngine.tapCard(cauldron, true);
//     Await testEngine.activateCard(cauldron, {
//       Ability: "RISE AND JOIN ME!",
//     });
//
//     // Verify we can play Kristoff this turn using PLAY CARDS UNDER
//     Await testEngine.activateCard(cauldron, {
//       Ability: "PLAY CARDS UNDER",
//     });
//     // There are 2 cards under the cauldron, so we need to select which one to play
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [kristoff] });
//
//     Expect(kristoff.zone).toBe("play");
//     Expect(kristoff.isUnder(cauldron)).toBe(false);
//     Expect(vladimir.isUnder(cauldron)).toBe(true);
//
//     // Pass turn to opponent and back - this should expire the permission
//     Await testEngine.passTurn();
//     Await testEngine.passTurn();
//
//     // Try to play Vladimir using VIEW CARDS UNDER without activating RISE AND JOIN ME! again
//     // Should fail because the permission expired at end of turn
//     Await testEngine.activateCard(cauldron, {
//       Ability: "PLAY CARDS UNDER",
//     });
//
//     // Vladimir should still be under the cauldron (play was rejected)
//     Expect(vladimir.zone).toBe("under-card");
//     Expect(vladimir.isUnder(cauldron)).toBe(true);
//   });
//
//   It("PLAY CARDS UNDER - Should allow viewing cards even when play-permission is not active", async () => {
//     Const testEngine = new TestEngine({
//       Play: [theBlackCauldron],
//       Discard: [kristoffMiningTheRuins, vladimirCeramicUnicornFan],
//       Inkwell: 2, // Only enough for THE CAULDRON CALLS, not enough for playing characters
//     });
//
//     Const cauldron = testEngine.getCardModel(theBlackCauldron);
//     Const kristoff = testEngine.getCardModel(kristoffMiningTheRuins);
//     Const vladimir = testEngine.getCardModel(vladimirCeramicUnicornFan);
//
//     // Put both characters under cauldron
//     Await testEngine.activateCard(cauldron, {
//       Ability: "THE CAULDRON CALLS",
//       Targets: [kristoff],
//     });
//
//     Await testEngine.tapCard(cauldron, true);
//     Await testEngine.activateCard(cauldron, {
//       Ability: "THE CAULDRON CALLS",
//       Targets: [vladimir],
//     });
//
//     Expect(kristoff.isUnder(cauldron)).toBe(true);
//     Expect(vladimir.isUnder(cauldron)).toBe(true);
//
//     // Activate PLAY CARDS UNDER WITHOUT activating RISE AND JOIN ME! first
//     // This should create a layer on the stack that allows viewing the cards
//     Await testEngine.activateCard(cauldron, {
//       Ability: "PLAY CARDS UNDER",
//     });
//
//     // The play-from-under effect should create a play layer on the stack
//     // even though we don't have play-permission active
//     Expect(testEngine.store.stackLayerStore.layers.length).toBeGreaterThan(0);
//
//     // The top layer should be the play layer showing the cards under cauldron
//     Const topLayer = testEngine.store.stackLayerStore.layers[0];
//     Expect(topLayer).toBeDefined();
//     Expect(topLayer?.ability.type).toBe("resolution");
//
//     // Now try to resolve by selecting Kristoff
//     // This should fail during the play effect resolution (not before)
//     // because play-permission is not active
//     Await testEngine.resolveTopOfStack(
//       {
//         Targets: [kristoff],
//       },
//       True,
//     ); // skipAssertion = true: Layer remains on stack when permission check fails
//
//     // The play should fail, so Kristoff should still be under the cauldron
//     Expect(kristoff.zone).toBe("under-card");
//     Expect(kristoff.isUnder(cauldron)).toBe(true);
//
//     // Layer should still be on stack (player can cancel or try another card)
//     Expect(testEngine.store.stackLayerStore.layers.length).toBeGreaterThan(0);
//
//     // But we should have been able to see the cards and make a selection
//     // (The test passing means the PLAY CARDS UNDER ability was activated successfully)
//   });
// });
//
