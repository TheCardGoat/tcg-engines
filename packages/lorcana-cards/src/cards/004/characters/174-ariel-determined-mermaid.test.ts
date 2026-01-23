// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { youHaveForgottenMe } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// import {
//   aWholeNewWorld,
//   grabYourSword,
// } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// import { arielDeterminedMermaid } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Ariel - Determined Mermaid", () => {
//   it("**I WANT MORE** Whenever you play a song, you may draw a card, then choose and discard a card.", () => {
//     const testStore = new TestStore({
//       inkwell: grabYourSword.cost,
//       play: [arielDeterminedMermaid],
//       hand: [grabYourSword, aWholeNewWorld, youHaveForgottenMe],
//       deck: [aWholeNewWorld],
//     });
//
//     const song = testStore.getCard(grabYourSword);
//     const cardToDiscard = testStore.getCard(youHaveForgottenMe);
//
//     song.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({ targets: [cardToDiscard] });
//
//     expect(testStore.getZonesCardCount().hand).toEqual(2);
//     expect(testStore.getZonesCardCount().discard).toEqual(2);
//     expect(cardToDiscard.zone).toEqual("discard");
//   });
// });
//
