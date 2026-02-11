// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { theSorcerersHat } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import {
//   BrunoMadrigalUndetectedUncle,
//   LuisaMadrigalMagicallyStrongOne,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Sorcerer's Hat", () => {
//   Describe("**INCREDIBLE ENERGY** {E}, 1 {I} − Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand. Otherwise, put it on the top of your deck.", () => {
//     It("Hit", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 1,
//         Play: [theSorcerersHat],
//         Deck: [
//           LuisaMadrigalMagicallyStrongOne,
//           LiloMakingAWish,
//           BrunoMadrigalUndetectedUncle,
//         ],
//       });
//
//       Const bottomCard = testEngine.getCardModel(
//         LuisaMadrigalMagicallyStrongOne,
//       );
//       Const topCard = testEngine.getCardModel(brunoMadrigalUndetectedUncle);
//
//       Await testEngine.activateCard(theSorcerersHat);
//       Await testEngine.resolveTopOfStack({
//         NameACard: topCard.name,
//       });
//
//       Expect(topCard.zone).toBe("hand");
//       Expect(bottomCard.zone).toBe("deck");
//     });
//
//     It("Miss", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 1,
//         Play: [theSorcerersHat],
//         Deck: [
//           LuisaMadrigalMagicallyStrongOne,
//           LiloMakingAWish,
//           BrunoMadrigalUndetectedUncle,
//         ],
//       });
//
//       Const bottomCard = testEngine.getCardModel(
//         LuisaMadrigalMagicallyStrongOne,
//       );
//       Const topCard = testEngine.getCardModel(brunoMadrigalUndetectedUncle);
//
//       Await testEngine.activateCard(theSorcerersHat);
//       Await testEngine.resolveTopOfStack({
//         NameACard: bottomCard.name,
//       });
//
//       Expect(topCard.isRevealed).toBe(true);
//       Expect(topCard.zone).toBe("deck");
//       Expect(bottomCard.zone).toBe("deck");
//     });
//   });
// });
//
