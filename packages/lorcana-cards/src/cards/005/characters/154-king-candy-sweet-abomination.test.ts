// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   KingCandySweetAbomination,
//   KronkUnlicensedInvestigator,
//   NalaMischievousCub,
//   RudyGrooveDisrupter,
//   RuttNorthernMoose,
//   SleepySluggishKnight,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("King Candy - Sweet Abomination", () => {
//   It("Shift", () => {
//     Const testStore = new TestStore({
//       Play: [kingCandySweetAbomination],
//     });
//
//     Const cardUnderTest = testStore.getCard(kingCandySweetAbomination);
//
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("**CHANGING THE CODE** When you play this character, you may draw 2 cards, then put a card from your hand on the bottom of your deck.", () => {
//     Const testStore = new TestStore({
//       Inkwell: kingCandySweetAbomination.cost,
//       Hand: [kingCandySweetAbomination],
//       Deck: [
//         RudyGrooveDisrupter,
//         SleepySluggishKnight,
//         KronkUnlicensedInvestigator,
//         NalaMischievousCub,
//         RuttNorthernMoose,
//       ],
//     });
//
//     Const cardUnderTest = testStore.getCard(kingCandySweetAbomination);
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveOptionalAbility();
//     Expect(testStore.getZonesCardCount().hand).toBe(2);
//
//     Const target = testStore.getCard(nalaMischievousCub);
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toBe("deck");
//
//     // Checking if the card was not put on top
//     TestStore.store.drawCard("player_one");
//     Expect(target.zone).toBe("deck");
//   });
// });
//
