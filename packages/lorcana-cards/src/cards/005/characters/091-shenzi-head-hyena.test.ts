// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   BanzaiVoraciousPredator,
//   EdLaughingHyena,
//   ShenziHeadHyena,
//   ShenziScarsAccomplice,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Shenzi - Head Hyena", () => {
//   It("**STICK AROUND FOR DINNER** This character gets +1 {S} for each other Hyena character you have in play.", () => {
//     Const testStore = new TestStore({
//       Inkwell: shenziScarsAccomplice.cost + edLaughingHyena.cost,
//       Hand: [shenziScarsAccomplice, edLaughingHyena],
//       Play: [shenziHeadHyena],
//     });
//
//     Const cardUnderTest = testStore.getCard(shenziHeadHyena);
//
//     Expect(cardUnderTest.strength).toBe(shenziHeadHyena.strength);
//
//     TestStore.getCard(shenziScarsAccomplice).playFromHand();
//
//     Expect(cardUnderTest.strength).toBe(shenziHeadHyena.strength + 1);
//
//     TestStore.getCard(edLaughingHyena).playFromHand();
//
//     Expect(cardUnderTest.strength).toBe(shenziHeadHyena.strength + 2);
//   });
//
//   Describe("**WHAT HAVE WE GOT HERE?** Whenever one of your Hyena characters challenges a damaged character, gain 2 lore.", () => {
//     It("Should gain 2 lore when Shenzi challenges a damaged character", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [
//             ShenziHeadHyena,
//             ShenziScarsAccomplice,
//             BanzaiVoraciousPredator,
//           ],
//         },
//         {
//           Play: [goofyKnightForADay],
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(shenziHeadHyena);
//       Const attacker = testStore.getCard(shenziScarsAccomplice);
//       Const anotherAttacker = testStore.getCard(banzaiVoraciousPredator);
//       Const defender = testStore.getCard(goofyKnightForADay);
//
//       Defender.updateCardMeta({ exerted: true });
//
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toBe(0);
//
//       Attacker.challenge(defender); // No lore gain as defender is not damaged
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toBe(0);
//
//       AnotherAttacker.challenge(defender);
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toBe(2);
//
//       CardUnderTest.challenge(defender);
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toBe(4);
//     });
//   });
// });
//
