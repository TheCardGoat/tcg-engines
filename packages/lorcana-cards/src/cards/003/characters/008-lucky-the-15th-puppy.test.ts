// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { luckyThe_15thPuppy } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Lucky - The 15th Puppy", () => {
//   It.skip("**GOOD AS NEW** {E} – Reveal the top 3 cards of your deck. You may put each character card with cost 2 or less into your hand. Put the rest on the bottom of your deck in any order.**PUPPY LOVE** Whenever this character quests, if you have 4 or more other characters in play, your other characters get +1 {L} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: luckyThe_15thPuppy.cost,
//       Play: [luckyThe_15thPuppy],
//     });
//
//     Const cardUnderTest = testStore.getCard(luckyThe_15thPuppy);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
