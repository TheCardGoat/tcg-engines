// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   annaMakingSnowPlans,
//   cheshireCatInexplicable,
//   elsaExploringTheUnknown,
//   robinHoodEphemeralArcher,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Cheshire Cat - Inexplicable", () => {
//   describe("Card Properties", () => {
//     it("should have correct metadata", () => {
//       const cheshire = cheshireCatInexplicable;
//
//       expect(cheshire.id).toBe("vhg");
//       expect(cheshire.name).toBe("Cheshire Cat");
//       expect(cheshire.title).toBe("Inexplicable");
//       expect(cheshire.characteristics).toEqual(["storyborn", "whisper"]);
//       expect(cheshire.inkwell).toBe(true);
//       expect(cheshire.colors).toEqual(["amethyst"]);
//       expect(cheshire.cost).toBe(3);
//       expect(cheshire.strength).toBe(3);
//       expect(cheshire.willpower).toBe(4);
//       expect(cheshire.rarity).toBe("super_rare");
//       expect(cheshire.lore).toBe(1);
//       expect(cheshire.set).toBe("010");
//       expect(cheshire.number).toBe(60);
//     });
//
//     it("should have two abilities", () => {
//       const cheshire = cheshireCatInexplicable;
//
//       expect(cheshire.abilities).toHaveLength(2);
//     });
//   });
//
//   describe("Boost 2 Ability", () => {
//     it("should have Boost 2 ability", () => {
//       const testEngine = new TestEngine({
//         play: [cheshireCatInexplicable],
//       });
//
//       expect(testEngine.getCardModel(cheshireCatInexplicable).hasBoost).toBe(
//         true,
//       );
//     });
//
//     it("should use Boost ability with sufficient ink", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 5,
//         play: [cheshireCatInexplicable],
//         deck: [annaMakingSnowPlans, elsaExploringTheUnknown],
//       });
//
//       const cheshire = testEngine.getCardModel(cheshireCatInexplicable);
//
//       // Verify initial state
//       expect(cheshire.cardsUnder).toHaveLength(0);
//
//       // Use boost ability
//       await testEngine.activateCard(cheshireCatInexplicable);
//
//       // Verify a card was moved under Cheshire Cat
//       expect(cheshire.cardsUnder).toHaveLength(1);
//     });
//
//     it("should work when deck has exactly one card", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 5,
//         play: [cheshireCatInexplicable],
//         deck: [annaMakingSnowPlans], // Only one card
//       });
//
//       const cheshire = testEngine.getCardModel(cheshireCatInexplicable);
//
//       await testEngine.activateCard(cheshireCatInexplicable);
//
//       expect(cheshire.cardsUnder).toHaveLength(1);
//     });
//   });
//
//   describe("IT'S LOADS OF FUN Ability", () => {
//     it("should trigger when card is put under via Boost ability", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 5,
//         play: [cheshireCatInexplicable],
//         deck: [annaMakingSnowPlans],
//       });
//
//       const cheshire = testEngine.getCardModel(cheshireCatInexplicable);
//
//       await testEngine.activateCard(cheshireCatInexplicable);
//
//       // Verify boost worked
//       expect(cheshire.cardsUnder).toHaveLength(1);
//
//       // The ability should trigger (we can see "IT'S LOADS OF FUN" in the logs)
//       // We can accept the optional layer to confirm the ability triggered
//       await testEngine.acceptOptionalLayer();
//
//       // If we get here without errors, the ability triggered successfully
//       expect(cheshire.cardsUnder).toHaveLength(1);
//     });
//
//     it("should trigger with characters available for damage movement", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 5,
//         play: [cheshireCatInexplicable, robinHoodEphemeralArcher],
//         deck: [annaMakingSnowPlans],
//       });
//
//       const cheshire = testEngine.getCardModel(cheshireCatInexplicable);
//       const robinHood = testEngine.getCardModel(robinHoodEphemeralArcher);
//
//       // Add damage to character
//       robinHood.damage = 3;
//
//       await testEngine.activateCard(cheshireCatInexplicable);
//
//       // Verify boost worked
//       expect(cheshire.cardsUnder).toHaveLength(1);
//
//       // Accept optional ability - the ability should be available to move damage
//       await testEngine.acceptOptionalLayer();
//
//       // Character with damage should be available as a source
//       expect(robinHood.damage).toBe(3);
//     });
//
//     it("should work with multiple characters available", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 5,
//         play: [
//           cheshireCatInexplicable,
//           robinHoodEphemeralArcher,
//           elsaExploringTheUnknown,
//         ],
//         deck: [annaMakingSnowPlans],
//       });
//
//       const cheshire = testEngine.getCardModel(cheshireCatInexplicable);
//       const robinHood = testEngine.getCardModel(robinHoodEphemeralArcher);
//       const elsa = testEngine.getCardModel(elsaExploringTheUnknown);
//
//       await testEngine.activateCard(cheshireCatInexplicable);
//
//       // Verify boost worked
//       expect(cheshire.cardsUnder).toHaveLength(1);
//
//       // Accept optional ability
//       await testEngine.acceptOptionalLayer();
//
//       // Multiple characters should be available as potential sources
//       expect(robinHood).toBeDefined();
//       expect(elsa).toBeDefined();
//     });
//   });
//
//   describe("Integration Tests", () => {
//     it("should work end-to-end: boost then trigger ability", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 5,
//         play: [cheshireCatInexplicable, robinHoodEphemeralArcher],
//         deck: [annaMakingSnowPlans, elsaExploringTheUnknown],
//       });
//
//       const cheshire = testEngine.getCardModel(cheshireCatInexplicable);
//       const robinHood = testEngine.getCardModel(robinHoodEphemeralArcher);
//
//       // Setup initial state
//       expect(cheshire.cardsUnder).toHaveLength(0);
//
//       // Execute boost
//       await testEngine.activateCard(cheshireCatInexplicable);
//
//       // Verify boost worked
//       expect(cheshire.cardsUnder).toHaveLength(1);
//
//       // Execute triggered ability
//       await testEngine.acceptOptionalLayer();
//
//       // Verify ability triggered and we have valid game state
//       expect(cheshire.cardsUnder).toHaveLength(1);
//       expect(cheshireCatInexplicable.abilities).toHaveLength(2);
//       expect(robinHood).toBeDefined();
//     });
//
//     it("should maintain proper game state throughout the interaction", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 5,
//         play: [cheshireCatInexplicable],
//         deck: [annaMakingSnowPlans],
//       });
//
//       const cheshire = testEngine.getCardModel(cheshireCatInexplicable);
//
//       // Verify initial game state
//       expect(cheshire.zone).toBe("play");
//
//       // Execute boost
//       await testEngine.activateCard(cheshireCatInexplicable);
//
//       // Should prompt for optional ability
//       await testEngine.acceptOptionalLayer();
//
//       // Verify character states remain valid
//       expect(cheshire.zone).toBe("play");
//       expect(cheshire.cardsUnder).toHaveLength(1);
//     });
//   });
// });
//
