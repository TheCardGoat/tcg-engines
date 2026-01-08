// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   heiheiBoatSnack,
//   minnieMouseBelovedPrincess,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { underTheSea } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// import {
//   agustinMadrigalClumsyDad,
//   arielSingingMermaid,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
// import { liloBestExplorerEver } from "../../009";
//
// describe("Under The Sea", () => {
//   it("Put all opposing characters with 2 {S} or less on the bottom of their players' decks in any order.", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: underTheSea.cost,
//         hand: [underTheSea],
//       },
//       {
//         play: [
//           minnieMouseBelovedPrincess,
//           heiheiBoatSnack,
//           agustinMadrigalClumsyDad,
//           arielSingingMermaid,
//         ],
//       },
//     );
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", underTheSea.id);
//
//     cardUnderTest.playFromHand();
//
//     expect(testStore.getCard(heiheiBoatSnack).zone).toEqual("deck");
//     expect(testStore.getCard(agustinMadrigalClumsyDad).zone).toEqual("deck");
//     expect(testStore.getCard(minnieMouseBelovedPrincess).zone).toEqual("deck");
//
//     expect(testStore.getCard(arielSingingMermaid).zone).toEqual("play");
//   });
//
//   it("When oppo plays lilo that give 2 {S} all char only for this turn", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: liloBestExplorerEver.cost,
//         hand: [liloBestExplorerEver],
//         play: [
//           minnieMouseBelovedPrincess,
//           heiheiBoatSnack,
//           agustinMadrigalClumsyDad,
//           arielSingingMermaid,
//         ],
//       },
//       {
//         inkwell: underTheSea.cost,
//         hand: [underTheSea],
//       },
//     );
//
//     const cardLilo = testEngine.getCardModel(liloBestExplorerEver);
//     const cardHeihei = testEngine.getCardModel(heiheiBoatSnack);
//     const cardAriel = testEngine.getCardModel(arielSingingMermaid);
//     const cardAgustin = testEngine.getCardModel(agustinMadrigalClumsyDad);
//     const cardMinnie = testEngine.getCardModel(minnieMouseBelovedPrincess);
//
//     await testEngine.playCard(cardLilo);
//
//     expect(cardLilo.zone).toEqual("play");
//     // Lilo itself should NOT have challenger (effect is "your OTHER characters")
//     expect(cardLilo.hasChallenger).toEqual(false);
//     expect(cardHeihei.hasChallenger).toEqual(true);
//     expect(cardAriel.hasChallenger).toEqual(true);
//     expect(cardAgustin.hasChallenger).toEqual(true);
//     expect(cardMinnie.hasChallenger).toEqual(true);
//
//     testEngine.passTurn();
//
//     expect(cardLilo.hasChallenger).toEqual(false);
//     expect(cardHeihei.hasChallenger).toEqual(false);
//     expect(cardAriel.hasChallenger).toEqual(false);
//     expect(cardAgustin.hasChallenger).toEqual(false);
//     expect(cardMinnie.hasChallenger).toEqual(false);
//
//     const cardUnderTest = testEngine.getCardModel(underTheSea);
//
//     await testEngine.playCard(cardUnderTest);
//
//     expect(cardHeihei.zone).toEqual("deck");
//     expect(cardAgustin.zone).toEqual("deck");
//     expect(cardMinnie.zone).toEqual("deck");
//
//     expect(cardAriel.zone).toEqual("play");
//   });
// });
//
