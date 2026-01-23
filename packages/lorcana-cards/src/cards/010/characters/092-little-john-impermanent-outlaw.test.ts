// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/180-goofy-knight-for-a-day";
// import {
//   emilyQuackfasterLevelheadedLibrarian,
//   littleJohnImpermanentOutlaw,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Little John - Impermanent Outlaw", () => {
//   describe("Boost 3", () => {
//     it("has Boost 3 ability", async () => {
//       const testEngine = new TestEngine({
//         play: [littleJohnImpermanentOutlaw],
//       });
//
//       expect(
//         testEngine.getCardModel(littleJohnImpermanentOutlaw).hasBoost,
//       ).toBe(true);
//     });
//
//     it("can activate Boost ability with 3 ink to put top card under character", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 3,
//         play: [littleJohnImpermanentOutlaw],
//         deck: [goofyKnightForADay],
//       });
//
//       const littleJohn = testEngine.getCardModel(littleJohnImpermanentOutlaw);
//       expect(littleJohn.cardsUnder).toHaveLength(0);
//
//       await testEngine.activateCard(littleJohnImpermanentOutlaw);
//
//       const boostedCard = testEngine.getCardModel(goofyKnightForADay);
//       expect(littleJohn.cardsUnder).toHaveLength(1);
//       expect(boostedCard.isUnder(littleJohn)).toBe(true);
//     });
//
//     it("can only use Boost once per turn", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 6,
//         play: [littleJohnImpermanentOutlaw],
//         deck: 5,
//       });
//
//       const littleJohn = testEngine.getCardModel(littleJohnImpermanentOutlaw);
//
//       // First use
//       await testEngine.activateCard(littleJohnImpermanentOutlaw);
//       expect(littleJohn.cardsUnder).toHaveLength(1);
//
//       // Second attempt - should not activate again (once per turn)
//       await testEngine.activateCard(littleJohnImpermanentOutlaw);
//       expect(littleJohn.cardsUnder).toHaveLength(1); // Still just 1 card
//     });
//   });
//
//   describe("READY TO RASSLE - Whenever you put a card under this character, ready him", () => {
//     it("readies Little John when a card is put under him via Boost", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 3,
//         play: [littleJohnImpermanentOutlaw],
//         deck: [goofyKnightForADay],
//       });
//
//       const littleJohn = testEngine.getCardModel(littleJohnImpermanentOutlaw);
//
//       // Exert Little John first
//       littleJohn.updateCardMeta({ exerted: true });
//       expect(littleJohn.ready).toBe(false);
//       expect(littleJohn.cardsUnder).toHaveLength(0);
//
//       // Use Boost ability to put a card under him
//       await testEngine.activateCard(littleJohnImpermanentOutlaw);
//
//       // Verify card was placed under
//       const boostedCard = testEngine.getCardModel(goofyKnightForADay);
//       expect(littleJohn.cardsUnder).toHaveLength(1);
//       expect(boostedCard.isUnder(littleJohn)).toBe(true);
//
//       // Little John should be readied by READY TO RASSLE trigger
//       expect(littleJohn.ready).toBe(true);
//     });
//
//     it("Little John is able to quest multiple times via Boost", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 3 + emilyQuackfasterLevelheadedLibrarian.cost,
//         hand: [emilyQuackfasterLevelheadedLibrarian],
//         play: [littleJohnImpermanentOutlaw],
//         deck: [goofyKnightForADay, goofyKnightForADay],
//       });
//
//       const littleJohn = testEngine.getCardModel(littleJohnImpermanentOutlaw);
//
//       // Quest and verify player gained 3 lore
//       littleJohn.quest();
//       expect(
//         testEngine.testStore.store.tableStore.getTable("player_one").lore,
//       ).toBe(3);
//
//       // Use Boost ability to put a card under him
//       await testEngine.activateCard(littleJohnImpermanentOutlaw);
//
//       // Verify that there is 1 card under Little John
//       expect(littleJohn.cardsUnder).toHaveLength(1);
//
//       // Quest and verify player gained 3 more lore (6 total)
//       littleJohn.quest();
//       expect(
//         testEngine.testStore.store.tableStore.getTable("player_one").lore,
//       ).toBe(6);
//
//       // Play Emily to ready Little John again
//       await testEngine.playCard(emilyQuackfasterLevelheadedLibrarian);
//
//       // Resolve top of stack targeting Little John
//       await testEngine.acceptOptionalLayer();
//       await testEngine.resolveTopOfStack({ targets: [littleJohn] });
//
//       // Quest and verify player gained 3 more lore (9 total)
//       littleJohn.quest();
//       expect(
//         testEngine.testStore.store.tableStore.getTable("player_one").lore,
//       ).toBe(9);
//
//       // Verify that there is 2 cards under Little John
//       expect(littleJohn.cardsUnder).toHaveLength(2);
//     });
//
//     it("readies Little John even when he was not exerted", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 3,
//         play: [littleJohnImpermanentOutlaw],
//         deck: [goofyKnightForADay],
//       });
//
//       const littleJohn = testEngine.getCardModel(littleJohnImpermanentOutlaw);
//
//       // Little John starts ready
//       expect(littleJohn.ready).toBe(true);
//       expect(littleJohn.cardsUnder).toHaveLength(0);
//
//       // Use Boost ability
//       await testEngine.activateCard(littleJohnImpermanentOutlaw);
//
//       // Verify card was placed under
//       expect(littleJohn.cardsUnder).toHaveLength(1);
//
//       // Little John should still be ready (effect still triggers)
//       expect(littleJohn.ready).toBe(true);
//     });
//   });
//
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [littleJohnImpermanentOutlaw],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         littleJohnImpermanentOutlaw,
//       );
//
//       expect(cardUnderTest.strength).toBe(4);
//       expect(cardUnderTest.willpower).toBe(5);
//       expect(cardUnderTest.lore).toBe(3);
//       expect(cardUnderTest.cost).toBe(6);
//     });
//
//     it("should not be an inkwell card", () => {
//       expect(littleJohnImpermanentOutlaw.inkwell).toBe(false);
//     });
//
//     it("should have correct characteristics", () => {
//       expect(littleJohnImpermanentOutlaw.characteristics).toEqual([
//         "storyborn",
//         "ally",
//         "whisper",
//       ]);
//     });
//
//     it("should be emerald color", () => {
//       expect(littleJohnImpermanentOutlaw.colors).toEqual(["emerald"]);
//     });
//
//     it("should be super rare rarity", () => {
//       expect(littleJohnImpermanentOutlaw.rarity).toBe("super_rare");
//     });
//   });
// });
//
