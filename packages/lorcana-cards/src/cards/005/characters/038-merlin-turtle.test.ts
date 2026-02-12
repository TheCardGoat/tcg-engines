// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { merlinTurtle } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Merlin - Turtle", () => {
//   It.skip("**GIVE ME TIME TO THINK** When you play this character and when he leaves play, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.", () => {
//     Const testStore = new TestStore({
//       Inkwell: merlinTurtle.cost,
//       Hand: [merlinTurtle],
//     });
//
//     Const cardUnderTest = testStore.getCard(merlinTurtle);
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
