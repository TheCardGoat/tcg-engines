// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BreakFree,
//   EvilComesPrepared,
//   GatheringKnowledgeAndWisdom,
//   HypnoticDeduction,
//   YoureWelcome,
// } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Hypnotic Deduction", () => {
//   It("Draw 3 cards, then put 2 cards from your hand on the top of your deck in any order.", () => {
//     Const testStore = new TestStore({
//       Inkwell: hypnoticDeduction.cost,
//       Hand: [hypnoticDeduction],
//       Deck: [
//         GatheringKnowledgeAndWisdom,
//         YoureWelcome,
//         EvilComesPrepared,
//         BreakFree,
//       ],
//     });
//
//     Const cardUnderTest = testStore.getCard(hypnoticDeduction);
//
//     CardUnderTest.playFromHand();
//
//     Expect(testStore.getZonesCardCount().hand).toBe(3);
//     Expect(testStore.getZonesCardCount().deck).toBe(1);
//     Expect(testStore.getZonesCardCount().discard).toBe(1);
//
//     Const secondCard = testStore.getCard(youreWelcome);
//     Const firstCard = testStore.getCard(breakFree);
//
//     TestStore.resolveTopOfStack({ targets: [secondCard] }, true);
//     Expect(secondCard.zone).toBe("deck");
//
//     TestStore.resolveTopOfStack({ targets: [firstCard] });
//     Expect(firstCard.zone).toBe("deck");
//
//     Expect(
//       TestStore.getZonesCards().deck.map((card) => card.lorcanitoCard.id),
//     ).toEqual([gatheringKnowledgeAndWisdom.id, youreWelcome.id, breakFree.id]);
//   });
// });
//
