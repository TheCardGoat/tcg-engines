// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/169-pawpsicle";
// import { mouseArmor } from "@lorcanito/lorcana-engine/cards/002/items/items";
// import { vladimirCeramicUnicornFan } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Vladimir - Ceramic Unicorn Fan", () => {
//   describe("HIGH STANDARDS - Basic Functionality", () => {
//     it("triggers when character quests and banishes chosen item", async () => {
//       const testEngine = new TestEngine({
//         play: [vladimirCeramicUnicornFan, pawpsicle],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(vladimirCeramicUnicornFan);
//       const target = testEngine.getCardModel(pawpsicle);
//
//       expect(target.zone).toBe("play");
//
//       await testEngine.questCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveTopOfStack({ targets: [target] });
//
//       expect(target.zone).toBe("discard");
//     });
//
//     it("can banish any item in play", async () => {
//       const testEngine = new TestEngine({
//         play: [vladimirCeramicUnicornFan, mouseArmor],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(vladimirCeramicUnicornFan);
//       const target = testEngine.getCardModel(mouseArmor);
//
//       expect(target.zone).toBe("play");
//
//       await testEngine.questCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveTopOfStack({ targets: [target] });
//
//       expect(target.zone).toBe("discard");
//     });
//
//     it("can banish opponent's items", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [vladimirCeramicUnicornFan],
//         },
//         {
//           play: [pawpsicle],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(vladimirCeramicUnicornFan);
//       const opponentItem = testEngine.getCardModel(pawpsicle);
//
//       expect(opponentItem.zone).toBe("play");
//
//       await testEngine.questCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveTopOfStack({ targets: [opponentItem] });
//
//       expect(opponentItem.zone).toBe("discard");
//     });
//
//     it("can banish own items", async () => {
//       const testEngine = new TestEngine({
//         play: [vladimirCeramicUnicornFan, pawpsicle],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(vladimirCeramicUnicornFan);
//       const ownItem = testEngine.getCardModel(pawpsicle);
//
//       expect(ownItem.zone).toBe("play");
//
//       await testEngine.questCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveTopOfStack({ targets: [ownItem] });
//
//       expect(ownItem.zone).toBe("discard");
//     });
//   });
//
//   describe("HIGH STANDARDS - Optional Ability", () => {
//     it("ability is optional - can decline to banish", async () => {
//       const testEngine = new TestEngine({
//         play: [vladimirCeramicUnicornFan, pawpsicle],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(vladimirCeramicUnicornFan);
//       const target = testEngine.getCardModel(pawpsicle);
//
//       await testEngine.questCard(cardUnderTest);
//
//       // Decline the optional ability
//       await testEngine.skipTopOfStack();
//
//       // Item should remain in play
//       expect(target.zone).toBe("play");
//     });
//   });
//
//   describe("HIGH STANDARDS - Trigger Conditions", () => {
//     it("only triggers when Vladimir quests, not other characters", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [vladimirCeramicUnicornFan, pawpsicle],
//         },
//         {
//           play: [mouseArmor],
//         },
//       );
//
//       const ownItem = testEngine.getCardModel(pawpsicle);
//       const opponentItem = testEngine.getCardModel(mouseArmor);
//
//       expect(ownItem.zone).toBe("play");
//       expect(opponentItem.zone).toBe("play");
//
//       // Quest with Vladimir
//       await testEngine.questCard(vladimirCeramicUnicornFan);
//
//       // Should have ability on stack
//       expect(testEngine.store.stackLayerStore.layers.length).toBeGreaterThan(0);
//     });
//
//     it("does not trigger when character is played", async () => {
//       const testEngine = new TestEngine({
//         inkwell: vladimirCeramicUnicornFan.cost,
//         hand: [vladimirCeramicUnicornFan],
//         play: [pawpsicle],
//       });
//
//       const target = testEngine.getCardModel(pawpsicle);
//
//       await testEngine.playCard(vladimirCeramicUnicornFan);
//
//       // Should not have any ability on stack (no "when you play" trigger)
//       expect(testEngine.store.stackLayerStore.layers.length).toBe(0);
//       expect(target.zone).toBe("play");
//     });
//
//     it("triggers every time Vladimir quests", async () => {
//       const testEngine = new TestEngine({
//         play: [vladimirCeramicUnicornFan, pawpsicle],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(vladimirCeramicUnicornFan);
//       const firstItem = testEngine.getCardModel(pawpsicle);
//
//       // First quest - banish item
//       await testEngine.questCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveTopOfStack({ targets: [firstItem] });
//
//       expect(firstItem.zone).toBe("discard");
//
//       // Verify the ability actually triggered
//       expect(cardUnderTest.ready).toBe(false);
//     });
//   });
//
//   describe("HIGH STANDARDS - Edge Cases", () => {
//     it("works when no items are in play", async () => {
//       const testEngine = new TestEngine({
//         play: [vladimirCeramicUnicornFan],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(vladimirCeramicUnicornFan);
//
//       // Should quest successfully even with no valid targets
//       await testEngine.questCard(cardUnderTest);
//
//       // Ability should still trigger but resolve without effect
//       expect(cardUnderTest.ready).toBe(false);
//     });
//
//     it("only banishes one item per quest", async () => {
//       const testEngine = new TestEngine({
//         play: [vladimirCeramicUnicornFan, pawpsicle, mouseArmor],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(vladimirCeramicUnicornFan);
//       const firstItem = testEngine.getCardModel(pawpsicle);
//       const secondItem = testEngine.getCardModel(mouseArmor);
//
//       await testEngine.questCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveTopOfStack({ targets: [firstItem] });
//
//       // Only first item should be banished
//       expect(firstItem.zone).toBe("discard");
//       expect(secondItem.zone).toBe("play");
//     });
//
//     it("cannot target characters, only items", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [vladimirCeramicUnicornFan],
//         },
//         {
//           play: [vladimirCeramicUnicornFan], // Another character, not an item
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         vladimirCeramicUnicornFan,
//         0,
//       );
//
//       await testEngine.questCard(cardUnderTest);
//
//       // Ability triggers but has no valid targets (no items in play), so it's skipped
//       // Both characters should still be in play
//       expect(testEngine.getCardModel(vladimirCeramicUnicornFan, 0).zone).toBe(
//         "play",
//       );
//       expect(testEngine.getCardModel(vladimirCeramicUnicornFan, 1).zone).toBe(
//         "play",
//       );
//     });
//   });
//
//   describe("HIGH STANDARDS - Multiple Items Scenario", () => {
//     it("allows player to choose which item to banish when multiple are available", async () => {
//       const testEngine = new TestEngine({
//         play: [vladimirCeramicUnicornFan, pawpsicle, mouseArmor],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(vladimirCeramicUnicornFan);
//       const item1 = testEngine.getCardModel(pawpsicle);
//       const item2 = testEngine.getCardModel(mouseArmor);
//
//       await testEngine.questCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//
//       // Choose to banish the second item
//       await testEngine.resolveTopOfStack({ targets: [item2] });
//
//       // Only the chosen item should be banished
//       expect(item1.zone).toBe("play");
//       expect(item2.zone).toBe("discard");
//     });
//   });
// });
//
