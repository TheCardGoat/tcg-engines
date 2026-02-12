// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { princeJohnGreediestOfAll } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { breakFree } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import {
//   DaisyDuckDonaldsDate,
//   PetePastryChomper,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Daisy Duck - Donald's Date", () => {
//   Describe("**BIG PRIZE** Whenever this character quests, each opponent reveals the top card of their deck. If it’s a character card, they may put it into their hand. Otherwise, they put it on the bottom of their deck.", () => {
//     It("reveals a character card and puts it into the hand", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [daisyDuckDonaldsDate],
//         },
//         {
//           Deck: [petePastryChomper],
//         },
//       );
//
//       Await testEngine.questCard(daisyDuckDonaldsDate);
//
//       Await testEngine.changeActivePlayer("player_two");
//       Await testEngine.resolveTopOfStack({
//         Scry: { hand: [petePastryChomper], bottom: [] },
//       });
//
//       Const target = testEngine.getCardModel(petePastryChomper);
//       Expect(target.zone).toBe("hand");
//       Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({ deck: 0 }),
//       );
//     });
//
//     It("reveals a NON character card and puts it into the hand", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [daisyDuckDonaldsDate],
//         },
//         {
//           Deck: [breakFree],
//         },
//       );
//
//       Await testEngine.questCard(daisyDuckDonaldsDate);
//       Const target = testEngine.getCardModel(breakFree);
//
//       Await testEngine.changeActivePlayer("player_two");
//       Await testEngine.resolveTopOfStack(
//         {
//           Scry: { hand: [breakFree], bottom: [] },
//         },
//         True,
//       ); // This effect will fails because the card is not a character card
//       Expect(target.zone).toBe("deck");
//
//       Await testEngine.resolveTopOfStack({
//         Scry: { hand: [], bottom: [breakFree] },
//       });
//
//       Expect(target.zone).toBe("deck");
//       Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({ deck: 1, hand: 0 }),
//       );
//     });
//   });
// });
//
// Describe("Regression", () => {
//   It("targets characters with ward from top of the deck", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [daisyDuckDonaldsDate],
//       },
//       {
//         Deck: [princeJohnGreediestOfAll],
//       },
//     );
//
//     Await testEngine.questCard(daisyDuckDonaldsDate);
//
//     TestEngine.changeActivePlayer("player_two");
//     Await testEngine.resolveTopOfStack({
//       Scry: { hand: [princeJohnGreediestOfAll], bottom: [] },
//     });
//
//     Expect(testEngine.getCardModel(princeJohnGreediestOfAll).zone).toBe("hand");
//     Expect(testEngine.getCardModel(princeJohnGreediestOfAll).isRevealed).toBe(
//       True,
//     );
//     Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({ deck: 0 }),
//     );
//   });
// });
//
