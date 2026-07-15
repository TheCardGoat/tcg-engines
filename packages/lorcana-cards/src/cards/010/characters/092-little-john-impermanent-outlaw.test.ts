// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/180-goofy-knight-for-a-day";
// Import {
//   EmilyQuackfasterLevelheadedLibrarian,
//   LittleJohnImpermanentOutlaw,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Little John - Impermanent Outlaw", () => {
//   Describe("Boost 3", () => {
//     It("has Boost 3 ability", async () => {
//       Const testEngine = new TestEngine({
//         Play: [littleJohnImpermanentOutlaw],
//       });
//
//       Expect(
//         TestEngine.getCardModel(littleJohnImpermanentOutlaw).hasBoost,
//       ).toBe(true);
//     });
//
//     It("can activate Boost ability with 3 ink to put top card under character", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 3,
//         Play: [littleJohnImpermanentOutlaw],
//         Deck: [goofyKnightForADay],
//       });
//
//       Const littleJohn = testEngine.getCardModel(littleJohnImpermanentOutlaw);
//       Expect(littleJohn.cardsUnder).toHaveLength(0);
//
//       Await testEngine.activateCard(littleJohnImpermanentOutlaw);
//
//       Const boostedCard = testEngine.getCardModel(goofyKnightForADay);
//       Expect(littleJohn.cardsUnder).toHaveLength(1);
//       Expect(boostedCard.isUnder(littleJohn)).toBe(true);
//     });
//
//     It("can only use Boost once per turn", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 6,
//         Play: [littleJohnImpermanentOutlaw],
//         Deck: 5,
//       });
//
//       Const littleJohn = testEngine.getCardModel(littleJohnImpermanentOutlaw);
//
//       // First use
//       Await testEngine.activateCard(littleJohnImpermanentOutlaw);
//       Expect(littleJohn.cardsUnder).toHaveLength(1);
//
//       // Second attempt - should not activate again (once per turn)
//       Await testEngine.activateCard(littleJohnImpermanentOutlaw);
//       Expect(littleJohn.cardsUnder).toHaveLength(1); // Still just 1 card
//     });
//   });
//
//   Describe("READY TO RASSLE - Whenever you put a card under this character, ready him", () => {
//     It("readies Little John when a card is put under him via Boost", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 3,
//         Play: [littleJohnImpermanentOutlaw],
//         Deck: [goofyKnightForADay],
//       });
//
//       Const littleJohn = testEngine.getCardModel(littleJohnImpermanentOutlaw);
//
//       // Exert Little John first
//       LittleJohn.updateCardMeta({ exerted: true });
//       Expect(littleJohn.ready).toBe(false);
//       Expect(littleJohn.cardsUnder).toHaveLength(0);
//
//       // Use Boost ability to put a card under him
//       Await testEngine.activateCard(littleJohnImpermanentOutlaw);
//
//       // Verify card was placed under
//       Const boostedCard = testEngine.getCardModel(goofyKnightForADay);
//       Expect(littleJohn.cardsUnder).toHaveLength(1);
//       Expect(boostedCard.isUnder(littleJohn)).toBe(true);
//
//       // Little John should be readied by READY TO RASSLE trigger
//       Expect(littleJohn.ready).toBe(true);
//     });
//
//     It("Little John is able to quest multiple times via Boost", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 3 + emilyQuackfasterLevelheadedLibrarian.cost,
//         Hand: [emilyQuackfasterLevelheadedLibrarian],
//         Play: [littleJohnImpermanentOutlaw],
//         Deck: [goofyKnightForADay, goofyKnightForADay],
//       });
//
//       Const littleJohn = testEngine.getCardModel(littleJohnImpermanentOutlaw);
//
//       // Quest and verify player gained 3 lore
//       LittleJohn.quest();
//       Expect(
//         TestEngine.testStore.store.tableStore.getTable("player_one").lore,
//       ).toBe(3);
//
//       // Use Boost ability to put a card under him
//       Await testEngine.activateCard(littleJohnImpermanentOutlaw);
//
//       // Verify that there is 1 card under Little John
//       Expect(littleJohn.cardsUnder).toHaveLength(1);
//
//       // Quest and verify player gained 3 more lore (6 total)
//       LittleJohn.quest();
//       Expect(
//         TestEngine.testStore.store.tableStore.getTable("player_one").lore,
//       ).toBe(6);
//
//       // Play Emily to ready Little John again
//       Await testEngine.playCard(emilyQuackfasterLevelheadedLibrarian);
//
//       // Resolve top of stack targeting Little John
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack({ targets: [littleJohn] });
//
//       // Quest and verify player gained 3 more lore (9 total)
//       LittleJohn.quest();
//       Expect(
//         TestEngine.testStore.store.tableStore.getTable("player_one").lore,
//       ).toBe(9);
//
//       // Verify that there is 2 cards under Little John
//       Expect(littleJohn.cardsUnder).toHaveLength(2);
//     });
//
//     It("readies Little John even when he was not exerted", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 3,
//         Play: [littleJohnImpermanentOutlaw],
//         Deck: [goofyKnightForADay],
//       });
//
//       Const littleJohn = testEngine.getCardModel(littleJohnImpermanentOutlaw);
//
//       // Little John starts ready
//       Expect(littleJohn.ready).toBe(true);
//       Expect(littleJohn.cardsUnder).toHaveLength(0);
//
//       // Use Boost ability
//       Await testEngine.activateCard(littleJohnImpermanentOutlaw);
//
//       // Verify card was placed under
//       Expect(littleJohn.cardsUnder).toHaveLength(1);
//
//       // Little John should still be ready (effect still triggers)
//       Expect(littleJohn.ready).toBe(true);
//     });
//   });
//
//   Describe("Stats and basic properties", () => {
//     It("should have correct stats", () => {
//       Const testEngine = new TestEngine({
//         Play: [littleJohnImpermanentOutlaw],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         LittleJohnImpermanentOutlaw,
//       );
//
//       Expect(cardUnderTest.strength).toBe(4);
//       Expect(cardUnderTest.willpower).toBe(5);
//       Expect(cardUnderTest.lore).toBe(3);
//       Expect(cardUnderTest.cost).toBe(6);
//     });
//
//     It("should not be an inkwell card", () => {
//       Expect(littleJohnImpermanentOutlaw.inkwell).toBe(false);
//     });
//
//     It("should have correct characteristics", () => {
//       Expect(littleJohnImpermanentOutlaw.characteristics).toEqual([
//         "storyborn",
//         "ally",
//         "whisper",
//       ]);
//     });
//
//     It("should be emerald color", () => {
//       Expect(littleJohnImpermanentOutlaw.colors).toEqual(["emerald"]);
//     });
//
//     It("should be super rare rarity", () => {
//       Expect(littleJohnImpermanentOutlaw.rarity).toBe("super_rare");
//     });
//   });
// });
//
