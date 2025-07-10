/**
 * @jest-environment node
 */

import { describe, expect, it, test } from "@jest/globals";
import {
  allCardsById,
  type LorcanitoActionCard,
} from "@lorcanito/lorcana-engine";
import { actionCardMock } from "@lorcanito/lorcana-engine/__mocks__/mockCards";
import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { gastonBaritoneBully } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import {
  denahiAvengingBrother,
  edLaughingHyena,
  gazellePopStar,
  iagoFakeFlamingo,
  kingCandySovereignOfSugar,
  taffytaMuttonfudgeRuthlessRival,
} from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

const testCard: LorcanitoActionCard = {
  ...actionCardMock,
  characteristics: ["action", "song"],
  cost: 10,
  abilities: [
    singerTogetherAbility(10),
    {
      type: "resolution",
      effects: [drawACard],
    },
  ],
};

allCardsById[testCard.id] = testCard;

const cardThatCosts1 = kingCandySovereignOfSugar;
const cardThatCosts2 = taffytaMuttonfudgeRuthlessRival;
const cardThatCosts3 = edLaughingHyena;
const cardThatCosts4 = iagoFakeFlamingo;
const cardThatCosts5 = denahiAvengingBrother;

describe("Sing together", () => {
  it("Cannot sing with fewer characters than needed", () => {
    const cardsInPlay = [cardThatCosts2, cardThatCosts3, cardThatCosts4];
    const testStore = new TestStore({
      inkwell: 0,
      play: cardsInPlay,
      hand: [testCard],
      deck: 1,
    });

    const song = testStore.getCard(testCard);
    const singers = cardsInPlay.map((card) => testStore.getCard(card));

    testStore.store.singTogether(
      song.instanceId,
      singers.map((singer) => singer.instanceId),
    );

    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 1,
        deck: 1,
      }),
    );
    for (const singer of singers) {
      expect(singer.ready).toBe(true);
    }
  });

  it("Can sing with the exact amount of characters needed", () => {
    const cardsInPlay = [
      cardThatCosts1,
      cardThatCosts2,
      cardThatCosts3,
      cardThatCosts4,
    ];
    const testStore = new TestStore({
      inkwell: 0,
      play: cardsInPlay,
      hand: [testCard],
      deck: 1,
    });

    const song = testStore.getCard(testCard);
    const singers = cardsInPlay.map((card) => testStore.getCard(card));

    testStore.store.singTogether(
      song.instanceId,
      singers.map((singer) => singer.instanceId),
    );

    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 1,
        deck: 0,
      }),
    );
    for (const singer of singers) {
      expect(singer.ready).toBe(false);
    }
  });

  it("Can sing with more characters than needed", () => {
    const cardsInPlay = [
      cardThatCosts1,
      cardThatCosts2,
      cardThatCosts3,
      cardThatCosts4,
      cardThatCosts5,
    ];
    const testStore = new TestStore({
      inkwell: 0,
      play: cardsInPlay,
      hand: [testCard],
      deck: 1,
    });

    const song = testStore.getCard(testCard);
    const singers = cardsInPlay.map((card) => testStore.getCard(card));

    testStore.store.singTogether(
      song.instanceId,
      singers.map((singer) => singer.instanceId),
    );
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 1,
        deck: 0,
      }),
    );
    for (const singer of singers) {
      expect(singer.ready).toBe(false);
    }
  });

  it('Considers "singer" ability while singing together', () => {
    {
      const cardsInPlay = [gazellePopStar, gastonBaritoneBully];
      const testStore = new TestStore({
        inkwell: 0,
        play: cardsInPlay,
        hand: [testCard],
        deck: 1,
      });

      const song = testStore.getCard(testCard);
      const singers = cardsInPlay.map((card) => testStore.getCard(card));

      testStore.store.singTogether(
        song.instanceId,
        singers.map((singer) => singer.instanceId),
      );
      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          hand: 1,
          deck: 0,
        }),
      );
      for (const singer of singers) {
        expect(singer.ready).toBe(false);
      }
    }
  });
});
