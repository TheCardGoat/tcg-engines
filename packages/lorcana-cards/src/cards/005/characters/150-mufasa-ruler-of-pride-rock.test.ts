// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mufasaRulerOfPrideRock } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mufasa - Ruler of Pride Rock", () => {
//   // Flaky Test
//   It.skip("**A DELICATE BALANCE** When you play this character, exert all cards in your inkwell, then return 2 cards at random from your inkwell to your hand.", () => {
//     Const testStore = new TestStore({
//       Inkwell: mufasaRulerOfPrideRock.cost,
//       Hand: [mufasaRulerOfPrideRock],
//     });
//
//     Const cardUnderTest = testStore.getCard(mufasaRulerOfPrideRock);
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack();
//
//     Expect(testStore.getZonesCardCount().inkwell).toEqual(
//       MufasaRulerOfPrideRock.cost - 2,
//     );
//     Expect(testStore.getZonesCardCount().hand).toEqual(2);
//   });
//
//   It("**EVERYTHING THE LIGHT TOUCHES** Whenever this character quests, ready all cards in your inkwell.", () => {
//     Const testStore = new TestStore({
//       Inkwell: mufasaRulerOfPrideRock.cost,
//       Play: [mufasaRulerOfPrideRock],
//     });
//
//     Const cardUnderTest = testStore.getCard(mufasaRulerOfPrideRock);
//     TestStore.exertAllInkwell();
//     CardUnderTest.quest();
//     TestStore.resolveTopOfStack({});
//
//     Expect(testStore.getAvailableInkwellCardCount()).toEqual(
//       MufasaRulerOfPrideRock.cost,
//     );
//   });
// });
//
