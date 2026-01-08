// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/180-goofy-knight-for-a-day";
// import {
//   aresGodOfWar,
//   beastAggressiveLord,
//   simbaKingInTheMaking,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Ares - God of War", () => {
//   describe("Reckless", () => {
//     it("should have Reckless ability", () => {
//       const testEngine = new TestEngine({
//         play: [aresGodOfWar],
//       });
//
//       const ares = testEngine.getCardModel(aresGodOfWar);
//       expect(ares.hasReckless).toBe(true);
//     });
//
//     it("cannot quest due to Reckless", () => {
//       const testEngine = new TestEngine({
//         play: [aresGodOfWar],
//       });
//
//       const ares = testEngine.getCardModel(aresGodOfWar);
//       expect(ares.canQuest).toBe(false);
//     });
//   });
//
//   describe("CALL TO BATTLE - Once during your turn, whenever you put a card under one of your characters or locations, you may ready chosen character. If you do, that character can't quest for the rest of this turn.", () => {
//     it("should trigger when a card is put under a character via Boost", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 3 + simbaKingInTheMaking.cost,
//         hand: [simbaKingInTheMaking],
//         play: [aresGodOfWar, beastAggressiveLord],
//         deck: [goofyKnightForADay],
//       });
//
//       const ares = testEngine.getCardModel(aresGodOfWar);
//       const beast = testEngine.getCardModel(beastAggressiveLord);
//
//       // Exert Ares first
//       ares.updateCardMeta({ exerted: true });
//       expect(ares.ready).toBe(false);
//
//       // Activate Beast's Boost ability (puts a card under Beast)
//       await testEngine.activateCard(beastAggressiveLord);
//
//       // Verify card was put under Beast
//       expect(beast.cardsUnder).toHaveLength(1);
//
//       // CALL TO BATTLE should trigger
//       expect(testEngine.stackLayers.length).toBeGreaterThan(0);
//
//       // Accept the optional trigger
//       await testEngine.acceptOptionalLayer();
//
//       // Target Ares to ready him
//       await testEngine.resolveTopOfStack({ targets: [ares] }, true);
//
//       // Ares should be ready now but can't quest
//       expect(ares.ready).toBe(true);
//       expect(ares.hasQuestRestriction).toBe(true);
//     });
//
//     it("should trigger when a card is put under a character when playing a character", async () => {
//       const testEngine = new TestEngine({
//         inkwell: simbaKingInTheMaking.cost + 3,
//         hand: [simbaKingInTheMaking],
//         play: [aresGodOfWar, beastAggressiveLord],
//         deck: [goofyKnightForADay, goofyKnightForADay],
//       });
//
//       const ares = testEngine.getCardModel(aresGodOfWar);
//       const beast = testEngine.getCardModel(beastAggressiveLord);
//
//       // Exert Beast
//       beast.updateCardMeta({ exerted: true });
//       expect(beast.ready).toBe(false);
//
//       // Activate Beast's Boost ability to trigger CALL TO BATTLE
//       await testEngine.activateCard(beastAggressiveLord);
//
//       // Verify card was put under Beast
//       expect(beast.cardsUnder).toHaveLength(1);
//
//       // Accept CALL TO BATTLE
//       await testEngine.acceptOptionalLayer();
//
//       // Target Beast to ready him
//       await testEngine.resolveTopOfStack({ targets: [beast] }, true);
//
//       // Beast should be ready but can't quest
//       expect(beast.ready).toBe(true);
//       expect(beast.hasQuestRestriction).toBe(true);
//     });
//
//     it("should be optional - can decline the trigger", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 3,
//         play: [aresGodOfWar, beastAggressiveLord],
//         deck: [goofyKnightForADay],
//       });
//
//       const ares = testEngine.getCardModel(aresGodOfWar);
//       const beast = testEngine.getCardModel(beastAggressiveLord);
//
//       // Exert Beast (not Ares) to test we decline
//       beast.updateCardMeta({ exerted: true });
//       expect(beast.ready).toBe(false);
//
//       // Activate Beast's Boost ability
//       await testEngine.activateCard(beastAggressiveLord);
//
//       // Verify card was put under Beast
//       expect(beast.cardsUnder).toHaveLength(1);
//
//       // Decline CALL TO BATTLE trigger
//       await testEngine.skipTopOfStack();
//
//       // Beast should remain exerted (since we didn't choose to ready it)
//       expect(beast.ready).toBe(false);
//       // Beast should not have quest restriction (ability was declined)
//       expect(beast.hasQuestRestriction).toBe(false);
//     });
//
//     it("should only trigger once per turn", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 6,
//         play: [aresGodOfWar, beastAggressiveLord],
//         deck: 3,
//       });
//
//       const ares = testEngine.getCardModel(aresGodOfWar);
//       const beast = testEngine.getCardModel(beastAggressiveLord);
//
//       // Exert Ares
//       ares.updateCardMeta({ exerted: true });
//
//       // Activate Beast's Boost ability (first time)
//       await testEngine.activateCard(beastAggressiveLord);
//       expect(beast.cardsUnder).toHaveLength(1);
//
//       // Accept CALL TO BATTLE
//       await testEngine.acceptOptionalLayer();
//       await testEngine.resolveTopOfStack({ targets: [ares] }, true);
//
//       expect(ares.ready).toBe(true);
//
//       // Exert Ares again
//       ares.updateCardMeta({ exerted: true });
//
//       // Try to activate Beast's Boost ability again (should fail - once per turn)
//       await testEngine.activateCard(beastAggressiveLord);
//
//       // Beast should still only have 1 card under (Boost is once per turn)
//       expect(beast.cardsUnder).toHaveLength(1);
//
//       // No new CALL TO BATTLE trigger should be on the stack
//       expect(testEngine.stackLayers.length).toBe(0);
//     });
//
//     it("should allow the readied character to challenge but not quest", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 3,
//         play: [aresGodOfWar, beastAggressiveLord],
//         deck: [goofyKnightForADay],
//       });
//
//       const ares = testEngine.getCardModel(aresGodOfWar);
//
//       // Exert Ares
//       ares.updateCardMeta({ exerted: true });
//
//       // Activate Beast's Boost ability
//       await testEngine.activateCard(beastAggressiveLord);
//
//       // Accept CALL TO BATTLE and target Ares
//       await testEngine.acceptOptionalLayer();
//       await testEngine.resolveTopOfStack({ targets: [ares] }, true);
//
//       // Ares should be ready
//       expect(ares.ready).toBe(true);
//
//       // Ares can't quest (from CALL TO BATTLE restriction)
//       expect(ares.canQuest).toBe(false);
//
//       // Verify Ares has quest restriction from CALL TO BATTLE
//       expect(ares.hasQuestRestriction).toBe(true);
//
//       // But Ares CAN challenge (Reckless requires challenge if able, and CALL TO BATTLE only restricts questing)
//       expect(ares.hasReckless).toBe(true);
//     });
//
//     it("should not trigger from opponent's cards", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [aresGodOfWar],
//         },
//         {
//           inkwell: 3,
//           play: [beastAggressiveLord],
//           deck: [goofyKnightForADay],
//         },
//       );
//
//       const ares = testEngine.getCardModel(aresGodOfWar);
//
//       // Exert Ares
//       ares.updateCardMeta({ exerted: true });
//
//       // Switch to opponent's turn
//       testEngine.passTurn();
//
//       // Opponent activates Beast's Boost ability
//       await testEngine.activateCard(beastAggressiveLord);
//
//       // CALL TO BATTLE should NOT trigger (opponent's character)
//       expect(testEngine.stackLayers.length).toBe(0);
//
//       // Ares should remain exerted
//       expect(ares.ready).toBe(false);
//     });
//
//     it("readied character can quest on next turn", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 3,
//         play: [aresGodOfWar, beastAggressiveLord],
//         deck: [goofyKnightForADay],
//       });
//
//       const beast = testEngine.getCardModel(beastAggressiveLord);
//
//       // Activate Beast's Boost ability
//       await testEngine.activateCard(beastAggressiveLord);
//
//       // Accept CALL TO BATTLE and target Beast
//       await testEngine.acceptOptionalLayer();
//       await testEngine.resolveTopOfStack({ targets: [beast] }, true);
//
//       // Beast can't quest this turn
//       expect(beast.hasQuestRestriction).toBe(true);
//
//       // Pass turn and come back
//       testEngine.passTurn();
//       testEngine.passTurn();
//
//       // Beast should be able to quest next turn
//       expect(beast.hasQuestRestriction).toBe(false);
//       expect(beast.canQuest).toBe(true);
//     });
//   });
// });
//
