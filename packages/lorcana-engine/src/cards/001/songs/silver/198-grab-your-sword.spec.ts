/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  kuzcoTemperamentalEmperor,
  magicBroomBucketBrigade,
  mickeyMouseTrueFriend,
  moanaOfMotunui,
  teKaTheBurningOne,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { grabYourSword } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Grab Your Sword", () => {
  it("Damages all opponent's characters", () => {
    const opponentsCards = [
      mickeyMouseTrueFriend,
      teKaTheBurningOne,
      moanaOfMotunui,
    ];
    const testStore = new TestStore(
      {
        inkwell: grabYourSword.cost,
        hand: [grabYourSword],
      },
      {
        play: opponentsCards,
      },
    );

    testStore.store.playCardFromHand(
      testStore.getByZoneAndId("hand", grabYourSword.id).instanceId,
    );

    opponentsCards.forEach((card) => {
      const cardModel = testStore.getByZoneAndId("play", card.id, "player_two");
      expect(cardModel.meta.damage).toEqual(2);
    });
  });
});

describe("Regression tests", () => {
  it("Should damage characters with ward", async () => {
    const opponentsCards = [
      mickeyMouseTrueFriend,
      kuzcoTemperamentalEmperor,
      moanaOfMotunui,
    ];
    const testEngine = new TestEngine(
      {
        inkwell: grabYourSword.cost,
        hand: [grabYourSword],
      },
      {
        play: opponentsCards,
      },
    );

    await testEngine.playCard(grabYourSword);

    opponentsCards.forEach((card) => {
      const cardModel = testEngine.testStore.getCard(card);
      expect(cardModel.meta.damage).toEqual(2);
    });
  });
});
