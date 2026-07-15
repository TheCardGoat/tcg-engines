// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LiloMakingAWish,
//   StichtNewDog,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   AladdinBraveRescuer,
//   AlmaMadrigalFamilyMatriarch,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { luisaMadrigalEntertainingMuscle } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Alma Madrigal - Family Matriarch", () => {
//   It("**ALL AT THE TABLE** When you play this character, look at your deck. You may reveal a Madrigal character card. Shuffle your deck and put that card on top of your deck.", () => {
//     Const testStore = new TestStore({
//       Inkwell: almaMadrigalFamilyMatriarch.cost,
//       Hand: [almaMadrigalFamilyMatriarch],
//       Deck: [
//         LiloMakingAWish,
//         StichtNewDog,
//         LuisaMadrigalEntertainingMuscle,
//         AladdinBraveRescuer,
//       ],
//     });
//
//     Const cardUnderTest = testStore.getCard(almaMadrigalFamilyMatriarch);
//     Const target = testStore.getCard(luisaMadrigalEntertainingMuscle);
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     TestStore.passTurn();
//     TestStore.passTurn();
//
//     Expect(target.zone).toEqual("hand");
//   });
// });
//
