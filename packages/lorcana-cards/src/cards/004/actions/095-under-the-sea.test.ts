// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HeiheiBoatSnack,
//   MinnieMouseBelovedPrincess,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { underTheSea } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import {
//   AgustinMadrigalClumsyDad,
//   ArielSingingMermaid,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
// Import { liloBestExplorerEver } from "../../009";
//
// Describe("Under The Sea", () => {
//   It("Put all opposing characters with 2 {S} or less on the bottom of their players' decks in any order.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: underTheSea.cost,
//         Hand: [underTheSea],
//       },
//       {
//         Play: [
//           MinnieMouseBelovedPrincess,
//           HeiheiBoatSnack,
//           AgustinMadrigalClumsyDad,
//           ArielSingingMermaid,
//         ],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", underTheSea.id);
//
//     CardUnderTest.playFromHand();
//
//     Expect(testStore.getCard(heiheiBoatSnack).zone).toEqual("deck");
//     Expect(testStore.getCard(agustinMadrigalClumsyDad).zone).toEqual("deck");
//     Expect(testStore.getCard(minnieMouseBelovedPrincess).zone).toEqual("deck");
//
//     Expect(testStore.getCard(arielSingingMermaid).zone).toEqual("play");
//   });
//
//   It("When oppo plays lilo that give 2 {S} all char only for this turn", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: liloBestExplorerEver.cost,
//         Hand: [liloBestExplorerEver],
//         Play: [
//           MinnieMouseBelovedPrincess,
//           HeiheiBoatSnack,
//           AgustinMadrigalClumsyDad,
//           ArielSingingMermaid,
//         ],
//       },
//       {
//         Inkwell: underTheSea.cost,
//         Hand: [underTheSea],
//       },
//     );
//
//     Const cardLilo = testEngine.getCardModel(liloBestExplorerEver);
//     Const cardHeihei = testEngine.getCardModel(heiheiBoatSnack);
//     Const cardAriel = testEngine.getCardModel(arielSingingMermaid);
//     Const cardAgustin = testEngine.getCardModel(agustinMadrigalClumsyDad);
//     Const cardMinnie = testEngine.getCardModel(minnieMouseBelovedPrincess);
//
//     Await testEngine.playCard(cardLilo);
//
//     Expect(cardLilo.zone).toEqual("play");
//     // Lilo itself should NOT have challenger (effect is "your OTHER characters")
//     Expect(cardLilo.hasChallenger).toEqual(false);
//     Expect(cardHeihei.hasChallenger).toEqual(true);
//     Expect(cardAriel.hasChallenger).toEqual(true);
//     Expect(cardAgustin.hasChallenger).toEqual(true);
//     Expect(cardMinnie.hasChallenger).toEqual(true);
//
//     TestEngine.passTurn();
//
//     Expect(cardLilo.hasChallenger).toEqual(false);
//     Expect(cardHeihei.hasChallenger).toEqual(false);
//     Expect(cardAriel.hasChallenger).toEqual(false);
//     Expect(cardAgustin.hasChallenger).toEqual(false);
//     Expect(cardMinnie.hasChallenger).toEqual(false);
//
//     Const cardUnderTest = testEngine.getCardModel(underTheSea);
//
//     Await testEngine.playCard(cardUnderTest);
//
//     Expect(cardHeihei.zone).toEqual("deck");
//     Expect(cardAgustin.zone).toEqual("deck");
//     Expect(cardMinnie.zone).toEqual("deck");
//
//     Expect(cardAriel.zone).toEqual("play");
//   });
// });
//
