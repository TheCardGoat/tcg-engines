// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { theQueenDiviner } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import {
//   TheQueenCrownOfTheCouncil,
//   TheQueenCruelestOfAll,
//   TheQueenFairestOfAll,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("The Queen - Crown of the Council", () => {
//   It("When you play this character, look at the top 3 cards of your deck. You may reveal any number of character cards named The Queen and put them into your hand. Put the rest on the bottom of your deck in any order.", () => {
//     Const testStore = new TestStore({
//       Inkwell: theQueenCrownOfTheCouncil.cost,
//       Hand: [theQueenCrownOfTheCouncil],
//       Deck: [theQueenFairestOfAll, theQueenCruelestOfAll, theQueenDiviner],
//     });
//
//     Const cardUnderTest = testStore.getCard(theQueenCrownOfTheCouncil);
//     Const hand = [
//       TestStore.getCard(theQueenFairestOfAll),
//       TestStore.getCard(theQueenCruelestOfAll),
//       TestStore.getCard(theQueenDiviner),
//     ];
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ scry: { bottom: [], hand } });
//     Expect(hand.every((card) => card.zone === "hand")).toBe(true);
//   });
// });
//
