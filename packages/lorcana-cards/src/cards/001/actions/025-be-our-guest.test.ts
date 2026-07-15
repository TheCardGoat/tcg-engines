import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { beOurGuest } from "./025-be-our-guest";

describe("Be Our Guest", () => {
  // TODO: Add tests for abilities
});

// Describe("Be Our Guest", () => {
//   It("Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order", async () => {
//     Const testEngine = new TestEngine({
//       Deck: [liloMakingAWish, moanaOfMotunui, chiefTui, heiheiBoatSnack],
//       Hand: [beOurGuest],
//       Inkwell: beOurGuest.cost,
//     });

//     Await testEngine.playCard(beOurGuest, {
//       Scry: { bottom: [heiheiBoatSnack, moanaOfMotunui], hand: [chiefTui] },
//     });

//     Const deck = testEngine.store.tableStore
//       .getPlayerZoneCards("player_one", "deck")
//       .map((card) => card.lorcanitoCard?.name);

//     Expect(testEngine.getCardModel(chiefTui).zone).toEqual("hand");
//     Expect(deck).toEqual([
//       TestEngine.getCardModel(heiheiBoatSnack).name,
//       TestEngine.getCardModel(moanaOfMotunui).name,
//       LiloMakingAWish.name,
//     ]);
//   });

//   It("Tutoring an invalid target card", () => {
//     Const testStore = new TestStore({
//       Deck: [liloMakingAWish, reflection, friendsOnTheOtherSide, oneJumpAhead],
//       Hand: [beOurGuest],
//       Inkwell: beOurGuest.cost,
//     });

//     Const cardUnderTest = testStore.getByZoneAndId("hand", beOurGuest.id);
//     Const one = testStore.getByZoneAndId("deck", reflection.id);
//     Const two = testStore.getByZoneAndId("deck", friendsOnTheOtherSide.id);
//     Const three = testStore.getByZoneAndId("deck", oneJumpAhead.id);

//     CardUnderTest.playFromHand();

//     Const bottom: CardModel[] = [one, three];

//     TestStore.resolveTopOfStack({ scry: { bottom, hand: [two] } });

//     Const deck = testStore.store.tableStore
//       .getPlayerZoneCards("player_one", "deck")
//       .map((card) => card.lorcanitoCard?.name);

//     Expect(deck).toEqual([
//       ...bottom.reverse().map((card) => card.lorcanitoCard?.name),
//       LiloMakingAWish.name,
//       // Be our guest only takes characters, so the card should stay on top of the deck
//       FriendsOnTheOtherSide.name,
//     ]);
//   });
// });
