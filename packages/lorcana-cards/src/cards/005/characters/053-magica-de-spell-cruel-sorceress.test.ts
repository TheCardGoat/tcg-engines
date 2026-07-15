// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MickeyMouseDetective,
//   MoanaOfMotunui,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   AWholeNewWorld,
//   HakunaMatata,
//   SuddenChill,
// } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { theBareNecessities } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import {
//   AnnaDiplomaticQueen,
//   MagicaDeSpellCruelSorceress,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Magica De Spell - Cruel Sorceress", () => {
//   It("**PLAYING WITH POWER** During opponents' turns, if an effect would cause you to discard one or more cards from your hand, you don't discard.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: suddenChill.cost,
//         Hand: [suddenChill],
//       },
//       {
//         Hand: [moanaOfMotunui],
//         Play: [magicaDeSpellCruelSorceress],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", suddenChill.id);
//     Const target = testStore.getByZoneAndId(
//       "hand",
//       MoanaOfMotunui.id,
//       "player_two",
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.changePlayer().resolveTopOfStack({
//       Targets: [target],
//     });
//
//     Expect(target.zone).toEqual("hand");
//   });
// });
//
// Describe("Regression", () => {
//   It("'A whole new world' interaction.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: aWholeNewWorld.cost,
//         Hand: [aWholeNewWorld],
//         Deck: 10,
//       },
//       {
//         Deck: 10,
//         Hand: [moanaOfMotunui, mickeyMouseDetective],
//         Play: [magicaDeSpellCruelSorceress],
//       },
//     );
//
//     Await testEngine.playCard(aWholeNewWorld);
//
//     Expect(testEngine.getCardModel(moanaOfMotunui).zone).toEqual("hand");
//     Expect(testEngine.getCardModel(mickeyMouseDetective).zone).toEqual("hand");
//     Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({
//         Hand: 9, // The card is still in hand
//         Deck: 3,
//       }),
//     );
//   });
//
//   It("'The Bare Necessities' interaction.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: theBareNecessities.cost,
//         Hand: [theBareNecessities],
//         Play: [magicaDeSpellCruelSorceress],
//       },
//       {
//         Hand: [hakunaMatata],
//       },
//     );
//
//     Await testEngine.playCard(theBareNecessities, { targets: [hakunaMatata] });
//
//     Expect(testEngine.getCardModel(hakunaMatata).zone).toEqual("discard");
//   });
//
//   It("Anna Diplomatic Queen Interaction", () => {
//     Const testStore = new TestEngine(
//       {
//         Inkwell: annaDiplomaticQueen.cost + 2,
//         Hand: [annaDiplomaticQueen],
//       },
//       {
//         Hand: [moanaOfMotunui],
//         Play: [magicaDeSpellCruelSorceress],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       AnnaDiplomaticQueen.id,
//     );
//     Const target = testStore.getByZoneAndId(
//       "hand",
//       MoanaOfMotunui.id,
//       "player_two",
//     );
//
//     CardUnderTest.playFromHand();
//
//     // testStore.stackLayers.map(x => console.log("------- " + x.description));
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ mode: "1" }, true);
//     Console.log("----------1---------");
//     TestStore.changeActivePlayer();
//
//     TestStore.resolveTopOfStack({
//       Targets: [target],
//     });
//     Console.log("----------2---------");
//
//     Expect(target.zone).toEqual("hand");
//   });
// });
//
