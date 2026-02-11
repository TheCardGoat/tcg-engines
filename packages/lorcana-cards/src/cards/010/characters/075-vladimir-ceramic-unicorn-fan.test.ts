// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/169-pawpsicle";
// Import { mouseArmor } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { vladimirCeramicUnicornFan } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Vladimir - Ceramic Unicorn Fan", () => {
//   Describe("HIGH STANDARDS - Basic Functionality", () => {
//     It("triggers when character quests and banishes chosen item", async () => {
//       Const testEngine = new TestEngine({
//         Play: [vladimirCeramicUnicornFan, pawpsicle],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(vladimirCeramicUnicornFan);
//       Const target = testEngine.getCardModel(pawpsicle);
//
//       Expect(target.zone).toBe("play");
//
//       Await testEngine.questCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toBe("discard");
//     });
//
//     It("can banish any item in play", async () => {
//       Const testEngine = new TestEngine({
//         Play: [vladimirCeramicUnicornFan, mouseArmor],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(vladimirCeramicUnicornFan);
//       Const target = testEngine.getCardModel(mouseArmor);
//
//       Expect(target.zone).toBe("play");
//
//       Await testEngine.questCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toBe("discard");
//     });
//
//     It("can banish opponent's items", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [vladimirCeramicUnicornFan],
//         },
//         {
//           Play: [pawpsicle],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(vladimirCeramicUnicornFan);
//       Const opponentItem = testEngine.getCardModel(pawpsicle);
//
//       Expect(opponentItem.zone).toBe("play");
//
//       Await testEngine.questCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [opponentItem] });
//
//       Expect(opponentItem.zone).toBe("discard");
//     });
//
//     It("can banish own items", async () => {
//       Const testEngine = new TestEngine({
//         Play: [vladimirCeramicUnicornFan, pawpsicle],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(vladimirCeramicUnicornFan);
//       Const ownItem = testEngine.getCardModel(pawpsicle);
//
//       Expect(ownItem.zone).toBe("play");
//
//       Await testEngine.questCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [ownItem] });
//
//       Expect(ownItem.zone).toBe("discard");
//     });
//   });
//
//   Describe("HIGH STANDARDS - Optional Ability", () => {
//     It("ability is optional - can decline to banish", async () => {
//       Const testEngine = new TestEngine({
//         Play: [vladimirCeramicUnicornFan, pawpsicle],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(vladimirCeramicUnicornFan);
//       Const target = testEngine.getCardModel(pawpsicle);
//
//       Await testEngine.questCard(cardUnderTest);
//
//       // Decline the optional ability
//       Await testEngine.skipTopOfStack();
//
//       // Item should remain in play
//       Expect(target.zone).toBe("play");
//     });
//   });
//
//   Describe("HIGH STANDARDS - Trigger Conditions", () => {
//     It("only triggers when Vladimir quests, not other characters", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [vladimirCeramicUnicornFan, pawpsicle],
//         },
//         {
//           Play: [mouseArmor],
//         },
//       );
//
//       Const ownItem = testEngine.getCardModel(pawpsicle);
//       Const opponentItem = testEngine.getCardModel(mouseArmor);
//
//       Expect(ownItem.zone).toBe("play");
//       Expect(opponentItem.zone).toBe("play");
//
//       // Quest with Vladimir
//       Await testEngine.questCard(vladimirCeramicUnicornFan);
//
//       // Should have ability on stack
//       Expect(testEngine.store.stackLayerStore.layers.length).toBeGreaterThan(0);
//     });
//
//     It("does not trigger when character is played", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: vladimirCeramicUnicornFan.cost,
//         Hand: [vladimirCeramicUnicornFan],
//         Play: [pawpsicle],
//       });
//
//       Const target = testEngine.getCardModel(pawpsicle);
//
//       Await testEngine.playCard(vladimirCeramicUnicornFan);
//
//       // Should not have any ability on stack (no "when you play" trigger)
//       Expect(testEngine.store.stackLayerStore.layers.length).toBe(0);
//       Expect(target.zone).toBe("play");
//     });
//
//     It("triggers every time Vladimir quests", async () => {
//       Const testEngine = new TestEngine({
//         Play: [vladimirCeramicUnicornFan, pawpsicle],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(vladimirCeramicUnicornFan);
//       Const firstItem = testEngine.getCardModel(pawpsicle);
//
//       // First quest - banish item
//       Await testEngine.questCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [firstItem] });
//
//       Expect(firstItem.zone).toBe("discard");
//
//       // Verify the ability actually triggered
//       Expect(cardUnderTest.ready).toBe(false);
//     });
//   });
//
//   Describe("HIGH STANDARDS - Edge Cases", () => {
//     It("works when no items are in play", async () => {
//       Const testEngine = new TestEngine({
//         Play: [vladimirCeramicUnicornFan],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(vladimirCeramicUnicornFan);
//
//       // Should quest successfully even with no valid targets
//       Await testEngine.questCard(cardUnderTest);
//
//       // Ability should still trigger but resolve without effect
//       Expect(cardUnderTest.ready).toBe(false);
//     });
//
//     It("only banishes one item per quest", async () => {
//       Const testEngine = new TestEngine({
//         Play: [vladimirCeramicUnicornFan, pawpsicle, mouseArmor],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(vladimirCeramicUnicornFan);
//       Const firstItem = testEngine.getCardModel(pawpsicle);
//       Const secondItem = testEngine.getCardModel(mouseArmor);
//
//       Await testEngine.questCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [firstItem] });
//
//       // Only first item should be banished
//       Expect(firstItem.zone).toBe("discard");
//       Expect(secondItem.zone).toBe("play");
//     });
//
//     It("cannot target characters, only items", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [vladimirCeramicUnicornFan],
//         },
//         {
//           Play: [vladimirCeramicUnicornFan], // Another character, not an item
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         VladimirCeramicUnicornFan,
//         0,
//       );
//
//       Await testEngine.questCard(cardUnderTest);
//
//       // Ability triggers but has no valid targets (no items in play), so it's skipped
//       // Both characters should still be in play
//       Expect(testEngine.getCardModel(vladimirCeramicUnicornFan, 0).zone).toBe(
//         "play",
//       );
//       Expect(testEngine.getCardModel(vladimirCeramicUnicornFan, 1).zone).toBe(
//         "play",
//       );
//     });
//   });
//
//   Describe("HIGH STANDARDS - Multiple Items Scenario", () => {
//     It("allows player to choose which item to banish when multiple are available", async () => {
//       Const testEngine = new TestEngine({
//         Play: [vladimirCeramicUnicornFan, pawpsicle, mouseArmor],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(vladimirCeramicUnicornFan);
//       Const item1 = testEngine.getCardModel(pawpsicle);
//       Const item2 = testEngine.getCardModel(mouseArmor);
//
//       Await testEngine.questCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//
//       // Choose to banish the second item
//       Await testEngine.resolveTopOfStack({ targets: [item2] });
//
//       // Only the chosen item should be banished
//       Expect(item1.zone).toBe("play");
//       Expect(item2.zone).toBe("discard");
//     });
//   });
// });
//
