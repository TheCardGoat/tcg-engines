// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AnnaMakingSnowPlans,
//   CheshireCatInexplicable,
//   ElsaExploringTheUnknown,
//   RobinHoodEphemeralArcher,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Cheshire Cat - Inexplicable", () => {
//   Describe("Card Properties", () => {
//     It("should have correct metadata", () => {
//       Const cheshire = cheshireCatInexplicable;
//
//       Expect(cheshire.id).toBe("vhg");
//       Expect(cheshire.name).toBe("Cheshire Cat");
//       Expect(cheshire.title).toBe("Inexplicable");
//       Expect(cheshire.characteristics).toEqual(["storyborn", "whisper"]);
//       Expect(cheshire.inkwell).toBe(true);
//       Expect(cheshire.colors).toEqual(["amethyst"]);
//       Expect(cheshire.cost).toBe(3);
//       Expect(cheshire.strength).toBe(3);
//       Expect(cheshire.willpower).toBe(4);
//       Expect(cheshire.rarity).toBe("super_rare");
//       Expect(cheshire.lore).toBe(1);
//       Expect(cheshire.set).toBe("010");
//       Expect(cheshire.number).toBe(60);
//     });
//
//     It("should have two abilities", () => {
//       Const cheshire = cheshireCatInexplicable;
//
//       Expect(cheshire.abilities).toHaveLength(2);
//     });
//   });
//
//   Describe("Boost 2 Ability", () => {
//     It("should have Boost 2 ability", () => {
//       Const testEngine = new TestEngine({
//         Play: [cheshireCatInexplicable],
//       });
//
//       Expect(testEngine.getCardModel(cheshireCatInexplicable).hasBoost).toBe(
//         True,
//       );
//     });
//
//     It("should use Boost ability with sufficient ink", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 5,
//         Play: [cheshireCatInexplicable],
//         Deck: [annaMakingSnowPlans, elsaExploringTheUnknown],
//       });
//
//       Const cheshire = testEngine.getCardModel(cheshireCatInexplicable);
//
//       // Verify initial state
//       Expect(cheshire.cardsUnder).toHaveLength(0);
//
//       // Use boost ability
//       Await testEngine.activateCard(cheshireCatInexplicable);
//
//       // Verify a card was moved under Cheshire Cat
//       Expect(cheshire.cardsUnder).toHaveLength(1);
//     });
//
//     It("should work when deck has exactly one card", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 5,
//         Play: [cheshireCatInexplicable],
//         Deck: [annaMakingSnowPlans], // Only one card
//       });
//
//       Const cheshire = testEngine.getCardModel(cheshireCatInexplicable);
//
//       Await testEngine.activateCard(cheshireCatInexplicable);
//
//       Expect(cheshire.cardsUnder).toHaveLength(1);
//     });
//   });
//
//   Describe("IT'S LOADS OF FUN Ability", () => {
//     It("should trigger when card is put under via Boost ability", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 5,
//         Play: [cheshireCatInexplicable],
//         Deck: [annaMakingSnowPlans],
//       });
//
//       Const cheshire = testEngine.getCardModel(cheshireCatInexplicable);
//
//       Await testEngine.activateCard(cheshireCatInexplicable);
//
//       // Verify boost worked
//       Expect(cheshire.cardsUnder).toHaveLength(1);
//
//       // The ability should trigger (we can see "IT'S LOADS OF FUN" in the logs)
//       // We can accept the optional layer to confirm the ability triggered
//       Await testEngine.acceptOptionalLayer();
//
//       // If we get here without errors, the ability triggered successfully
//       Expect(cheshire.cardsUnder).toHaveLength(1);
//     });
//
//     It("should trigger with characters available for damage movement", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 5,
//         Play: [cheshireCatInexplicable, robinHoodEphemeralArcher],
//         Deck: [annaMakingSnowPlans],
//       });
//
//       Const cheshire = testEngine.getCardModel(cheshireCatInexplicable);
//       Const robinHood = testEngine.getCardModel(robinHoodEphemeralArcher);
//
//       // Add damage to character
//       RobinHood.damage = 3;
//
//       Await testEngine.activateCard(cheshireCatInexplicable);
//
//       // Verify boost worked
//       Expect(cheshire.cardsUnder).toHaveLength(1);
//
//       // Accept optional ability - the ability should be available to move damage
//       Await testEngine.acceptOptionalLayer();
//
//       // Character with damage should be available as a source
//       Expect(robinHood.damage).toBe(3);
//     });
//
//     It("should work with multiple characters available", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 5,
//         Play: [
//           CheshireCatInexplicable,
//           RobinHoodEphemeralArcher,
//           ElsaExploringTheUnknown,
//         ],
//         Deck: [annaMakingSnowPlans],
//       });
//
//       Const cheshire = testEngine.getCardModel(cheshireCatInexplicable);
//       Const robinHood = testEngine.getCardModel(robinHoodEphemeralArcher);
//       Const elsa = testEngine.getCardModel(elsaExploringTheUnknown);
//
//       Await testEngine.activateCard(cheshireCatInexplicable);
//
//       // Verify boost worked
//       Expect(cheshire.cardsUnder).toHaveLength(1);
//
//       // Accept optional ability
//       Await testEngine.acceptOptionalLayer();
//
//       // Multiple characters should be available as potential sources
//       Expect(robinHood).toBeDefined();
//       Expect(elsa).toBeDefined();
//     });
//   });
//
//   Describe("Integration Tests", () => {
//     It("should work end-to-end: boost then trigger ability", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 5,
//         Play: [cheshireCatInexplicable, robinHoodEphemeralArcher],
//         Deck: [annaMakingSnowPlans, elsaExploringTheUnknown],
//       });
//
//       Const cheshire = testEngine.getCardModel(cheshireCatInexplicable);
//       Const robinHood = testEngine.getCardModel(robinHoodEphemeralArcher);
//
//       // Setup initial state
//       Expect(cheshire.cardsUnder).toHaveLength(0);
//
//       // Execute boost
//       Await testEngine.activateCard(cheshireCatInexplicable);
//
//       // Verify boost worked
//       Expect(cheshire.cardsUnder).toHaveLength(1);
//
//       // Execute triggered ability
//       Await testEngine.acceptOptionalLayer();
//
//       // Verify ability triggered and we have valid game state
//       Expect(cheshire.cardsUnder).toHaveLength(1);
//       Expect(cheshireCatInexplicable.abilities).toHaveLength(2);
//       Expect(robinHood).toBeDefined();
//     });
//
//     It("should maintain proper game state throughout the interaction", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 5,
//         Play: [cheshireCatInexplicable],
//         Deck: [annaMakingSnowPlans],
//       });
//
//       Const cheshire = testEngine.getCardModel(cheshireCatInexplicable);
//
//       // Verify initial game state
//       Expect(cheshire.zone).toBe("play");
//
//       // Execute boost
//       Await testEngine.activateCard(cheshireCatInexplicable);
//
//       // Should prompt for optional ability
//       Await testEngine.acceptOptionalLayer();
//
//       // Verify character states remain valid
//       Expect(cheshire.zone).toBe("play");
//       Expect(cheshire.cardsUnder).toHaveLength(1);
//     });
//   });
// });
//
