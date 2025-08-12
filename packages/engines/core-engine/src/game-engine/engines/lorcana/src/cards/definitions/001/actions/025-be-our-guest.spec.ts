import { describe, expect, it } from "bun:test";
import {
  beOurGuest,
  friendsOnTheOtherSide,
  oneJumpAhead,
  reflection,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import {
  chiefTui,
  heiheiBoatSnack,
  liloMakingAWish,
  moanaOfMotunui,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Be Our Guest", () => {
  it("Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order", async () => {
    const testEngine = new TestEngine({
      deck: [liloMakingAWish, moanaOfMotunui, chiefTui, heiheiBoatSnack],
      hand: [beOurGuest],
      inkwell: beOurGuest.cost,
    });

    await testEngine.playCard(beOurGuest, {
      scry: { bottom: [heiheiBoatSnack, moanaOfMotunui], hand: [chiefTui] },
    });

    const deck = testEngine.store.tableStore
      .getPlayerZoneCards("player_one", "deck")
      .map((card) => card.lorcanitoCard?.name);

    expect(testEngine.getCardModel(chiefTui).zone).toEqual("hand");
    expect(deck).toEqual([
      testEngine.getCardModel(heiheiBoatSnack).name,
      testEngine.getCardModel(moanaOfMotunui).name,
      liloMakingAWish.name,
    ]);
  });

  it("Tutoring an invalid target card", () => {
    const testStore = new TestStore({
      deck: [liloMakingAWish, reflection, friendsOnTheOtherSide, oneJumpAhead],
      hand: [beOurGuest],
      inkwell: beOurGuest.cost,
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", beOurGuest.id);
    const one = testStore.getByZoneAndId("deck", reflection.id);
    const two = testStore.getByZoneAndId("deck", friendsOnTheOtherSide.id);
    const three = testStore.getByZoneAndId("deck", oneJumpAhead.id);

    cardUnderTest.playFromHand();

    const bottom: any[] = [one, three];

    testStore.resolveTopOfStack({ scry: { bottom, hand: [two] } });

    const deck = testStore.store.tableStore
      .getPlayerZoneCards("player_one", "deck")
      .map((card) => card.lorcanitoCard?.name);

    expect(deck).toEqual([
      ...bottom.reverse().map((card) => card.lorcanitoCard?.name),
      liloMakingAWish.name,
      // Be our guest only takes characters, so the card should stay on top of the deck
      friendsOnTheOtherSide.name,
    ]);
  });
});
