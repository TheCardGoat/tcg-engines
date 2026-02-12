// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArielSpectacularSinger,
//   GoofyDaredevil,
//   HerculesTrueHero,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { henWenPropheticPig } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Hen Wen - Prophetic Pig", () => {
//   Describe("FUTURE SIGHT Whenever this character quests, look at the top card of your deck. Put it on either the top or the bottom of your deck.", () => {
//     It("allows putting the card on top of the deck", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: henWenPropheticPig.cost,
//         Play: [henWenPropheticPig],
//         Deck: [herculesTrueHero, goofyDaredevil, arielSpectacularSinger],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(henWenPropheticPig);
//       Const topCard = testEngine.getCardModel(herculesTrueHero);
//
//       Expect(testEngine.getLoreForPlayer("player_one")).toEqual(0);
//
//       Await testEngine.questCard(cardUnderTest);
//
//       Expect(testEngine.getLoreForPlayer("player_one")).toEqual(1);
//
//       // Resolve scry: put 1 card on top
//       Await testEngine.resolveTopOfStack({
//         Scry: {
//           Top: [herculesTrueHero],
//         },
//       });
//
//       Expect(topCard.zone).toBe("deck");
//     });
//
//     It("allows putting the card on bottom of the deck", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: henWenPropheticPig.cost,
//         Play: [henWenPropheticPig],
//         Deck: [herculesTrueHero, goofyDaredevil, arielSpectacularSinger],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(henWenPropheticPig);
//       Const topCard = testEngine.getCardModel(herculesTrueHero);
//
//       Expect(testEngine.getLoreForPlayer("player_one")).toEqual(0);
//
//       Await testEngine.questCard(cardUnderTest);
//
//       Expect(testEngine.getLoreForPlayer("player_one")).toEqual(1);
//
//       // Resolve scry: put 1 card on bottom
//       Await testEngine.resolveTopOfStack({
//         Scry: {
//           Bottom: [herculesTrueHero],
//         },
//       });
//
//       Expect(topCard.zone).toBe("deck");
//     });
//   });
// });
//
