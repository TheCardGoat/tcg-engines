// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { maleficentMistressOfEvil } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Maleficent - Mistress of Evil", () => {
//   It.skip("**DARK KNOWLEDGE** Whenever this character quests, you may draw a card.**DIVINATION** During your turn, whenever you draw a card, you may move 1 damage counter from a chosen character to a chosen opposing character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: maleficentMistressOfEvil.cost,
//       Play: [maleficentMistressOfEvil],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MaleficentMistressOfEvil.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
