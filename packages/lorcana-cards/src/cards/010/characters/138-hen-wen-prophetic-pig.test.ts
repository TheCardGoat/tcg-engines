// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   arielSpectacularSinger,
//   goofyDaredevil,
//   herculesTrueHero,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { henWenPropheticPig } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Hen Wen - Prophetic Pig", () => {
//   describe("FUTURE SIGHT Whenever this character quests, look at the top card of your deck. Put it on either the top or the bottom of your deck.", () => {
//     it("allows putting the card on top of the deck", async () => {
//       const testEngine = new TestEngine({
//         inkwell: henWenPropheticPig.cost,
//         play: [henWenPropheticPig],
//         deck: [herculesTrueHero, goofyDaredevil, arielSpectacularSinger],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(henWenPropheticPig);
//       const topCard = testEngine.getCardModel(herculesTrueHero);
//
//       expect(testEngine.getLoreForPlayer("player_one")).toEqual(0);
//
//       await testEngine.questCard(cardUnderTest);
//
//       expect(testEngine.getLoreForPlayer("player_one")).toEqual(1);
//
//       // Resolve scry: put 1 card on top
//       await testEngine.resolveTopOfStack({
//         scry: {
//           top: [herculesTrueHero],
//         },
//       });
//
//       expect(topCard.zone).toBe("deck");
//     });
//
//     it("allows putting the card on bottom of the deck", async () => {
//       const testEngine = new TestEngine({
//         inkwell: henWenPropheticPig.cost,
//         play: [henWenPropheticPig],
//         deck: [herculesTrueHero, goofyDaredevil, arielSpectacularSinger],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(henWenPropheticPig);
//       const topCard = testEngine.getCardModel(herculesTrueHero);
//
//       expect(testEngine.getLoreForPlayer("player_one")).toEqual(0);
//
//       await testEngine.questCard(cardUnderTest);
//
//       expect(testEngine.getLoreForPlayer("player_one")).toEqual(1);
//
//       // Resolve scry: put 1 card on bottom
//       await testEngine.resolveTopOfStack({
//         scry: {
//           bottom: [herculesTrueHero],
//         },
//       });
//
//       expect(topCard.zone).toBe("deck");
//     });
//   });
// });
//
