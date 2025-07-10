/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  allCardsById,
  type LorcanitoCharacterCard,
} from "@lorcanito/lorcana-engine";
import { characterCardMock } from "@lorcanito/lorcana-engine/__mocks__/mockCards";
import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import {
  chiefTui,
  heiheiBoatSnack,
  liloMakingAWish,
  moanaOfMotunui,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { ursulaCaldron } from "@lorcanito/lorcana-engine/cards/001/items/items";
import {
  beOurGuest,
  friendsOnTheOtherSide,
  oneJumpAhead,
  reflection,
} from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { scuttleExpertOnHumans } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";

const scryBottomTestCard: LorcanitoCharacterCard = {
  ...characterCardMock,
  id: "scryBottomTestCard",
  abilities: [
    {
      type: "resolution",
      name: "",
      text: "",
      effects: [
        {
          type: "scry",
          amount: 1,
          mode: "bottom",
          shouldRevealTutored: true,
          target: self,
          limits: {
            bottom: 1,
            top: 0,
            inkwell: 0,
            hand: 0,
          },
          tutorFilters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "deck" },
          ],
        },
      ],
    },
  ],
};

allCardsById[scryBottomTestCard.id] = scryBottomTestCard;

describe("Scry effect", () => {
  it("[Ursula's Cauldron] can't put both cards at the BOTTOM", () => {
    const testStore = new TestStore({
      deck: [liloMakingAWish, moanaOfMotunui, chiefTui, heiheiBoatSnack],
      play: [ursulaCaldron],
      inkwell: ursulaCaldron.cost,
    });

    const cardUnderTest = testStore.getByZoneAndId("play", ursulaCaldron.id);
    const lilo = testStore.getByZoneAndId("deck", liloMakingAWish.id);
    const moana = testStore.getByZoneAndId("deck", moanaOfMotunui.id);

    cardUnderTest.activate();

    testStore.resolveTopOfStack({ scry: { bottom: [moana, lilo] } });

    expect(
      testStore.store.tableStore
        .getPlayerZoneCards("player_one", "deck")
        .map((card) => card.lorcanitoCard?.name),
    ).toEqual([
      liloMakingAWish.name,
      moanaOfMotunui.name,
      chiefTui.name,
      heiheiBoatSnack.name,
    ]);
  });

  it("[Ursula's Cauldron] can't put both cards at the TOP", () => {
    const testStore = new TestStore({
      deck: [liloMakingAWish, moanaOfMotunui, chiefTui, heiheiBoatSnack],
      play: [ursulaCaldron],
      inkwell: ursulaCaldron.cost,
    });

    const cardUnderTest = testStore.getByZoneAndId("play", ursulaCaldron.id);
    const heihei = testStore.getByZoneAndId("deck", heiheiBoatSnack.id);
    const tui = testStore.getByZoneAndId("deck", chiefTui.id);

    cardUnderTest.activate();
    testStore.resolveTopOfStack({ scry: { top: [heihei, tui] } });

    expect(
      testStore.store.tableStore
        .getPlayerZoneCards("player_one", "deck")
        .map((card) => card.lorcanitoCard?.name),
    ).toEqual([
      liloMakingAWish.name,
      moanaOfMotunui.name,
      chiefTui.name,
      heiheiBoatSnack.name,
    ]);
  });

  it("[Be our Guest] Tutoring an invalid target card", () => {
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

    const bottom: CardModel[] = [one, three];

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

  it("Scry asks to put a specific card in the hand, but none available at the top", () => {
    const testStore = new TestStore({
      deck: [liloMakingAWish, reflection, friendsOnTheOtherSide, oneJumpAhead],
      hand: [scuttleExpertOnHumans],
      inkwell: scuttleExpertOnHumans.cost,
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      scuttleExpertOnHumans.id,
    );
    const bottom1 = testStore.getByZoneAndId("deck", reflection.id);
    const bottom2 = testStore.getByZoneAndId("deck", friendsOnTheOtherSide.id);
    const bottom3 = testStore.getByZoneAndId("deck", oneJumpAhead.id);
    const bottom4 = testStore.getByZoneAndId("deck", liloMakingAWish.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({
      scry: { bottom: [bottom1, bottom2, bottom3, bottom4] },
    });

    expect(testStore.stackLayers).toHaveLength(0);
  });

  it("Scry bottom puts the card at the bottom as it should.", async () => {
    const testEngine = new TestEngine({
      deck: [liloMakingAWish, reflection, friendsOnTheOtherSide, oneJumpAhead],
      hand: [scryBottomTestCard],
      inkwell: scryBottomTestCard.cost,
    });

    await testEngine.playCard(scryBottomTestCard);
    await testEngine.resolveTopOfStack({ scry: { bottom: [oneJumpAhead] } });

    await testEngine.drawCard();

    expect(testEngine.getCardModel(oneJumpAhead).zone).toEqual("deck");
    expect(testEngine.getCardModel(friendsOnTheOtherSide).zone).toEqual("hand");
  });
});
