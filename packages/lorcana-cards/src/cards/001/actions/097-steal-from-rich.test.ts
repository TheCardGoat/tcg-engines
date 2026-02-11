// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { stealFromRich } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   CruellaDeVilMiserableAsUsual,
//   DukeOfWeselton,
//   GenieTheEverImpressive,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Steal from the Rich", () => {
//   It("Whenever one of your characters quests this turn, each opponent loses 1 lore.", () => {
//     Const cardsInPlay = [
//       GenieTheEverImpressive,
//       DukeOfWeselton,
//       CruellaDeVilMiserableAsUsual,
//     ];
//     Const testStore = new TestStore({
//       Inkwell: stealFromRich.cost,
//       Hand: [stealFromRich],
//       Play: cardsInPlay,
//     });
//
//     TestStore.store.tableStore.getTable("player_two").lore = 3;
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", stealFromRich.id);
//
//     CardUnderTest.playFromHand();
//
//     Expect(cardUnderTest.zone).toEqual("discard");
//
//     CardsInPlay.forEach((card, index) => {
//       Const target = testStore.getByZoneAndId("play", card.id);
//       Target.quest();
//
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toBe(
//         Index + 1,
//       );
//       Expect(testStore.store.tableStore.getTable("player_two").lore).toBe(
//         2 - index,
//       );
//     });
//   });
// });
//
