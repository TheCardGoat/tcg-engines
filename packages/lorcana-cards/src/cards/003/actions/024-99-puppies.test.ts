// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CruellaDeVilMiserableAsUsual,
//   DukeOfWeselton,
//   GenieTheEverImpressive,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { NnPuppies } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("99 Puppies", () => {
//   It("Whenever one of your characters quests this turn, gain 1 lore.", () => {
//     Const cardsInPlay = [
//       GenieTheEverImpressive,
//       DukeOfWeselton,
//       CruellaDeVilMiserableAsUsual,
//     ];
//     Const testStore = new TestStore({
//       Inkwell: NnPuppies.cost,
//       Hand: [NnPuppies],
//       Play: cardsInPlay,
//     });
//
//     Const cardUnderTest = testStore.getCard(NnPuppies);
//
//     CardUnderTest.playFromHand();
//
//     Expect(cardUnderTest.zone).toEqual("discard");
//
//     CardsInPlay.forEach((card, index) => {
//       Const target = testStore.getCard(card);
//       Target.quest();
//
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toBe(
//         (index + 1) * 2,
//       );
//     });
//   });
// });
//
