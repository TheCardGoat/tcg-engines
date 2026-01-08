// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { maleficentMistressOfEvil } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Maleficent - Mistress of All Evil", () => {
//   it.skip("**DARK KNOWLEDGE** Whenever this character quests, you may draw a card.**DIVINATION** During your turn, whenever you draw a card, you may move 1 damage counter from a chosen character to a chosen opposing character.", () => {
//     const testStore = new TestStore({
//       inkwell: maleficentMistressOfEvil.cost,
//       play: [maleficentMistressOfEvil],
//     });
//
//     const cardUnderTest = testStore.getCard(maleficentMistressOfEvil);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
