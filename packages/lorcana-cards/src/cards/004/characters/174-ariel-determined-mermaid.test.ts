// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { youHaveForgottenMe } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   AWholeNewWorld,
//   GrabYourSword,
// } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { arielDeterminedMermaid } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ariel - Determined Mermaid", () => {
//   It("**I WANT MORE** Whenever you play a song, you may draw a card, then choose and discard a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: grabYourSword.cost,
//       Play: [arielDeterminedMermaid],
//       Hand: [grabYourSword, aWholeNewWorld, youHaveForgottenMe],
//       Deck: [aWholeNewWorld],
//     });
//
//     Const song = testStore.getCard(grabYourSword);
//     Const cardToDiscard = testStore.getCard(youHaveForgottenMe);
//
//     Song.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targets: [cardToDiscard] });
//
//     Expect(testStore.getZonesCardCount().hand).toEqual(2);
//     Expect(testStore.getZonesCardCount().discard).toEqual(2);
//     Expect(cardToDiscard.zone).toEqual("discard");
//   });
// });
//
