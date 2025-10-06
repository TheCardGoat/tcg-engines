/**
 * @jest-environment node
 */

import { describe, expect, it, test } from "@jest/globals";
import { developYourBrain } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import {
  chiefTui,
  magicBroomBucketBrigade,
  moanaOfMotunui,
  teKaTheBurningOne,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { dingleHopper } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items";
import {
  aWholeNewWorld,
  friendsOnTheOtherSide,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs";
import { letTheStormRageOn } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { hiramFlavershamToymaker } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items";
import { brawl } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import {
  diabloDevotedHerald,
  diabloMaleficentsSpy,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Diablo - Devoted Herald", () => {
  it("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
    const testStore = new TestStore({
      play: [diabloDevotedHerald],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      diabloDevotedHerald.id,
    );
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("**Shift: Discard an action card** _(You may discard an action card to play this on top of one of your characters named Diablo.)", () => {
    const testStore = new TestStore({
      inkwell: diabloDevotedHerald.cost,
      play: [diabloMaleficentsSpy],
      hand: [brawl, diabloDevotedHerald],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      diabloDevotedHerald.id,
    );
    const cardToDiscard = testStore.getByZoneAndId("hand", brawl.id);
    const shiftTarget = testStore.getByZoneAndId(
      "play",
      diabloMaleficentsSpy.id,
    );

    cardUnderTest.shift(shiftTarget, [cardToDiscard]);

    expect(cardUnderTest.zone).toBe("play");
    expect(cardToDiscard.zone).toBe("discard");
  });

  describe("**CIRCLE FAR AND WIDE** During each opponent's turn, whenever they draw a card while this character is exerted, you may draw a card.", () => {
    it("Should trigger when opponent draws a card", () => {
      const testStore = new TestStore(
        {
          deck: 2,
          hand: [friendsOnTheOtherSide],
          inkwell: friendsOnTheOtherSide.cost,
        },
        {
          play: [diabloDevotedHerald],
          deck: 7,
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        diabloDevotedHerald.id,
        "player_two",
      );
      cardUnderTest.updateCardMeta({ exerted: true });
      expect(cardUnderTest.meta.exerted).toBe(true);

      const cardDraw = testStore.getByZoneAndId(
        "hand",
        friendsOnTheOtherSide.id,
      );

      cardDraw.playFromHand();
      testStore.changePlayer("player_two");

      testStore.resolveOptionalAbility();
      expect(testStore.getZonesCardCount("player_two")).toEqual(
        expect.objectContaining({ deck: 6, hand: 1 }),
      );

      testStore.resolveOptionalAbility();
      expect(testStore.getZonesCardCount("player_two")).toEqual(
        expect.objectContaining({ deck: 5, hand: 2 }),
      );

      expect(testStore.stackLayers).toHaveLength(0);
    });

    it("Should not trigger when Diablo is not exerted", () => {
      const testStore = new TestStore(
        {
          deck: 2,
          hand: [friendsOnTheOtherSide],
          inkwell: friendsOnTheOtherSide.cost,
        },
        {
          play: [diabloDevotedHerald],
          deck: 7,
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        diabloDevotedHerald.id,
        "player_two",
      );

      cardUnderTest.updateCardMeta({ exerted: false });
      expect(cardUnderTest.meta.exerted).toBe(false);

      const cardDraw = testStore.getByZoneAndId(
        "hand",
        friendsOnTheOtherSide.id,
      );

      cardDraw.playFromHand();

      expect(testStore.stackLayers).toHaveLength(0);
      expect(testStore.getZonesCardCount("player_two")).toEqual(
        expect.objectContaining({ deck: 7, hand: 0 }),
      );
    });

    it("Should not trigger on player's turn", () => {
      const testStore = new TestStore(
        {
          inkwell: aWholeNewWorld.cost,
          hand: [dingleHopper, aWholeNewWorld],
          play: [diabloDevotedHerald],
          deck: 7,
        },
        {
          hand: [magicBroomBucketBrigade, teKaTheBurningOne, moanaOfMotunui],
          deck: 7,
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        diabloDevotedHerald.id,
        "player_one",
      );

      cardUnderTest.updateCardMeta({ exerted: true });
      expect(cardUnderTest.meta.exerted).toBe(true);

      testStore.store.playCardFromHand(
        testStore.getByZoneAndId("hand", aWholeNewWorld.id).instanceId,
      );

      // At the end of aWholeNewWorld, the player should have drawn 7 cards thus creating 7 layers to resolve
      expect(testStore.stackLayers).toHaveLength(0);
    });

    it("Whole new world test case", () => {
      const testStore = new TestStore(
        {
          inkwell: aWholeNewWorld.cost,
          hand: [dingleHopper, aWholeNewWorld],
          deck: 7,
        },
        {
          hand: [magicBroomBucketBrigade, teKaTheBurningOne, moanaOfMotunui],
          play: [diabloDevotedHerald],
          deck: 7,
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        diabloDevotedHerald.id,
        "player_two",
      );

      cardUnderTest.updateCardMeta({ exerted: true });
      expect(cardUnderTest.meta.exerted).toBe(true);

      testStore.store.playCardFromHand(
        testStore.getByZoneAndId("hand", aWholeNewWorld.id).instanceId,
      );

      // At the end of aWholeNewWorld, the player should have drawn 7 cards thus creating 7 layers to resolve
      expect(testStore.stackLayers).toHaveLength(7);
    });
  });
});

describe("Regression", () => {
  test("Let the Storm Rage On, Interaction", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: letTheStormRageOn.cost,
        hand: [letTheStormRageOn],
        deck: 2,
      },
      {
        play: [diabloDevotedHerald],
        deck: 7,
      },
    );

    await testEngine.tapCard(diabloDevotedHerald);
    await testEngine.playCard(
      letTheStormRageOn,
      {
        targets: [diabloDevotedHerald],
      },
      true,
    );

    expect(testEngine.getCardModel(diabloDevotedHerald).zone).toEqual(
      "discard",
    );
    expect(testEngine.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({ deck: 1, hand: 1, discard: 1 }),
    );
    expect(testEngine.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({ deck: 7, hand: 0 }),
    );
    expect(testEngine.stackLayers).toHaveLength(1);

    testEngine.changeActivePlayer("player_two");
    await testEngine.resolveOptionalAbility();
    expect(testEngine.stackLayers).toHaveLength(0);

    expect(testEngine.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({ deck: 1, hand: 1, discard: 1 }),
    );
    expect(testEngine.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({ deck: 6, hand: 1, discard: 1 }),
    );
  });

  it("Should NOT draw a card when player puts a card in card (instead of drawing)", () => {
    const testStore = new TestStore(
      {
        inkwell: developYourBrain.cost,
        hand: [developYourBrain],
        deck: [chiefTui, moanaOfMotunui],
      },
      {
        play: [diabloDevotedHerald],
        deck: 7,
      },
    );

    const cardUnderTest = testStore.getCard(diabloDevotedHerald);
    cardUnderTest.updateCardMeta({ exerted: true });
    expect(cardUnderTest.meta.exerted).toBe(true);

    const cardToPutInHand = testStore.getCard(developYourBrain);
    cardToPutInHand.playFromHand();

    const first = testStore.getCard(moanaOfMotunui);
    const second = testStore.getCard(chiefTui);
    testStore.resolveTopOfStack({ scry: { bottom: [first], hand: [second] } });

    expect(testStore.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({ deck: 1, hand: 1, discard: 1 }),
    );

    expect(testStore.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({ deck: 7, hand: 0 }),
    );

    expect(testStore.stackLayers).toHaveLength(0);
  });

  it("Should draw multiple cards, when opponent draws multiple", async () => {
    const testEngine = new TestEngine(
      {
        play: [hiramFlavershamToymaker, pawpsicle],
        deck: 5,
      },
      {
        play: [diabloDevotedHerald],
        deck: 5,
      },
    );

    await testEngine.tapCard(diabloDevotedHerald);

    await testEngine.questCard(
      hiramFlavershamToymaker,
      {
        targets: [pawpsicle],
      },
      true,
    );

    expect(testEngine.stackLayers).toHaveLength(2);
  });
});
