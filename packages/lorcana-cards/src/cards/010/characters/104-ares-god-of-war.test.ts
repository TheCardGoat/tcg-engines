// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/180-goofy-knight-for-a-day";
// Import {
//   AresGodOfWar,
//   BeastAggressiveLord,
//   SimbaKingInTheMaking,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Ares - God of War", () => {
//   Describe("Reckless", () => {
//     It("should have Reckless ability", () => {
//       Const testEngine = new TestEngine({
//         Play: [aresGodOfWar],
//       });
//
//       Const ares = testEngine.getCardModel(aresGodOfWar);
//       Expect(ares.hasReckless).toBe(true);
//     });
//
//     It("cannot quest due to Reckless", () => {
//       Const testEngine = new TestEngine({
//         Play: [aresGodOfWar],
//       });
//
//       Const ares = testEngine.getCardModel(aresGodOfWar);
//       Expect(ares.canQuest).toBe(false);
//     });
//   });
//
//   Describe("CALL TO BATTLE - Once during your turn, whenever you put a card under one of your characters or locations, you may ready chosen character. If you do, that character can't quest for the rest of this turn.", () => {
//     It("should trigger when a card is put under a character via Boost", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 3 + simbaKingInTheMaking.cost,
//         Hand: [simbaKingInTheMaking],
//         Play: [aresGodOfWar, beastAggressiveLord],
//         Deck: [goofyKnightForADay],
//       });
//
//       Const ares = testEngine.getCardModel(aresGodOfWar);
//       Const beast = testEngine.getCardModel(beastAggressiveLord);
//
//       // Exert Ares first
//       Ares.updateCardMeta({ exerted: true });
//       Expect(ares.ready).toBe(false);
//
//       // Activate Beast's Boost ability (puts a card under Beast)
//       Await testEngine.activateCard(beastAggressiveLord);
//
//       // Verify card was put under Beast
//       Expect(beast.cardsUnder).toHaveLength(1);
//
//       // CALL TO BATTLE should trigger
//       Expect(testEngine.stackLayers.length).toBeGreaterThan(0);
//
//       // Accept the optional trigger
//       Await testEngine.acceptOptionalLayer();
//
//       // Target Ares to ready him
//       Await testEngine.resolveTopOfStack({ targets: [ares] }, true);
//
//       // Ares should be ready now but can't quest
//       Expect(ares.ready).toBe(true);
//       Expect(ares.hasQuestRestriction).toBe(true);
//     });
//
//     It("should trigger when a card is put under a character when playing a character", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: simbaKingInTheMaking.cost + 3,
//         Hand: [simbaKingInTheMaking],
//         Play: [aresGodOfWar, beastAggressiveLord],
//         Deck: [goofyKnightForADay, goofyKnightForADay],
//       });
//
//       Const ares = testEngine.getCardModel(aresGodOfWar);
//       Const beast = testEngine.getCardModel(beastAggressiveLord);
//
//       // Exert Beast
//       Beast.updateCardMeta({ exerted: true });
//       Expect(beast.ready).toBe(false);
//
//       // Activate Beast's Boost ability to trigger CALL TO BATTLE
//       Await testEngine.activateCard(beastAggressiveLord);
//
//       // Verify card was put under Beast
//       Expect(beast.cardsUnder).toHaveLength(1);
//
//       // Accept CALL TO BATTLE
//       Await testEngine.acceptOptionalLayer();
//
//       // Target Beast to ready him
//       Await testEngine.resolveTopOfStack({ targets: [beast] }, true);
//
//       // Beast should be ready but can't quest
//       Expect(beast.ready).toBe(true);
//       Expect(beast.hasQuestRestriction).toBe(true);
//     });
//
//     It("should be optional - can decline the trigger", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 3,
//         Play: [aresGodOfWar, beastAggressiveLord],
//         Deck: [goofyKnightForADay],
//       });
//
//       Const ares = testEngine.getCardModel(aresGodOfWar);
//       Const beast = testEngine.getCardModel(beastAggressiveLord);
//
//       // Exert Beast (not Ares) to test we decline
//       Beast.updateCardMeta({ exerted: true });
//       Expect(beast.ready).toBe(false);
//
//       // Activate Beast's Boost ability
//       Await testEngine.activateCard(beastAggressiveLord);
//
//       // Verify card was put under Beast
//       Expect(beast.cardsUnder).toHaveLength(1);
//
//       // Decline CALL TO BATTLE trigger
//       Await testEngine.skipTopOfStack();
//
//       // Beast should remain exerted (since we didn't choose to ready it)
//       Expect(beast.ready).toBe(false);
//       // Beast should not have quest restriction (ability was declined)
//       Expect(beast.hasQuestRestriction).toBe(false);
//     });
//
//     It("should only trigger once per turn", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 6,
//         Play: [aresGodOfWar, beastAggressiveLord],
//         Deck: 3,
//       });
//
//       Const ares = testEngine.getCardModel(aresGodOfWar);
//       Const beast = testEngine.getCardModel(beastAggressiveLord);
//
//       // Exert Ares
//       Ares.updateCardMeta({ exerted: true });
//
//       // Activate Beast's Boost ability (first time)
//       Await testEngine.activateCard(beastAggressiveLord);
//       Expect(beast.cardsUnder).toHaveLength(1);
//
//       // Accept CALL TO BATTLE
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack({ targets: [ares] }, true);
//
//       Expect(ares.ready).toBe(true);
//
//       // Exert Ares again
//       Ares.updateCardMeta({ exerted: true });
//
//       // Try to activate Beast's Boost ability again (should fail - once per turn)
//       Await testEngine.activateCard(beastAggressiveLord);
//
//       // Beast should still only have 1 card under (Boost is once per turn)
//       Expect(beast.cardsUnder).toHaveLength(1);
//
//       // No new CALL TO BATTLE trigger should be on the stack
//       Expect(testEngine.stackLayers.length).toBe(0);
//     });
//
//     It("should allow the readied character to challenge but not quest", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 3,
//         Play: [aresGodOfWar, beastAggressiveLord],
//         Deck: [goofyKnightForADay],
//       });
//
//       Const ares = testEngine.getCardModel(aresGodOfWar);
//
//       // Exert Ares
//       Ares.updateCardMeta({ exerted: true });
//
//       // Activate Beast's Boost ability
//       Await testEngine.activateCard(beastAggressiveLord);
//
//       // Accept CALL TO BATTLE and target Ares
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack({ targets: [ares] }, true);
//
//       // Ares should be ready
//       Expect(ares.ready).toBe(true);
//
//       // Ares can't quest (from CALL TO BATTLE restriction)
//       Expect(ares.canQuest).toBe(false);
//
//       // Verify Ares has quest restriction from CALL TO BATTLE
//       Expect(ares.hasQuestRestriction).toBe(true);
//
//       // But Ares CAN challenge (Reckless requires challenge if able, and CALL TO BATTLE only restricts questing)
//       Expect(ares.hasReckless).toBe(true);
//     });
//
//     It("should not trigger from opponent's cards", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [aresGodOfWar],
//         },
//         {
//           Inkwell: 3,
//           Play: [beastAggressiveLord],
//           Deck: [goofyKnightForADay],
//         },
//       );
//
//       Const ares = testEngine.getCardModel(aresGodOfWar);
//
//       // Exert Ares
//       Ares.updateCardMeta({ exerted: true });
//
//       // Switch to opponent's turn
//       TestEngine.passTurn();
//
//       // Opponent activates Beast's Boost ability
//       Await testEngine.activateCard(beastAggressiveLord);
//
//       // CALL TO BATTLE should NOT trigger (opponent's character)
//       Expect(testEngine.stackLayers.length).toBe(0);
//
//       // Ares should remain exerted
//       Expect(ares.ready).toBe(false);
//     });
//
//     It("readied character can quest on next turn", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 3,
//         Play: [aresGodOfWar, beastAggressiveLord],
//         Deck: [goofyKnightForADay],
//       });
//
//       Const beast = testEngine.getCardModel(beastAggressiveLord);
//
//       // Activate Beast's Boost ability
//       Await testEngine.activateCard(beastAggressiveLord);
//
//       // Accept CALL TO BATTLE and target Beast
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack({ targets: [beast] }, true);
//
//       // Beast can't quest this turn
//       Expect(beast.hasQuestRestriction).toBe(true);
//
//       // Pass turn and come back
//       TestEngine.passTurn();
//       TestEngine.passTurn();
//
//       // Beast should be able to quest next turn
//       Expect(beast.hasQuestRestriction).toBe(false);
//       Expect(beast.canQuest).toBe(true);
//     });
//   });
// });
//
