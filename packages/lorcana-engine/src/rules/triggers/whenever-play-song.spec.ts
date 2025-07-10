/**
 * @jest-environment node
 */

import { describe, expect, it, test } from "@jest/globals";
import {
  allCardsById,
  type LorcanitoCharacterCard,
} from "@lorcanito/lorcana-engine";
import { characterCardMock } from "@lorcanito/lorcana-engine/__mocks__/mockCards";
import { singerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { wheneverOneOfYourCharactersSings } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import { arielSpectacularSinger } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

const testCard: LorcanitoCharacterCard = {
  ...characterCardMock,
  abilities: [
    singerAbility(10),
    wheneverOneOfYourCharactersSings({
      name: "TEST",
      effects: [drawACard],
    }),
  ],
};

allCardsById[testCard.id] = testCard;

describe("Whenever this character sings", () => {
  it("Should create resolution effects when the character sings", () => {
    const testStore = new TestStore({
      play: [testCard],
      hand: [hakunaMatata],
      deck: 1,
    });

    const cardUnderTest = testStore.getCard(testCard);
    const target = testStore.getCard(hakunaMatata);

    cardUnderTest.sing(target);

    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 1,
        deck: 0,
      }),
    );
  });

  it("Should create resolution effects when the another character you own sings", () => {
    const testStore = new TestStore({
      play: [testCard, arielSpectacularSinger],
      hand: [hakunaMatata],
      deck: 1,
    });

    const singer = testStore.getCard(arielSpectacularSinger);
    const song = testStore.getCard(hakunaMatata);

    singer.sing(song);

    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 1,
        deck: 0,
      }),
    );
  });

  it("Should NOT create resolution effects when another character you DON'T own sings", () => {
    const testStore = new TestStore(
      {
        play: [testCard],
        deck: 1,
      },
      {
        hand: [hakunaMatata],
        play: [arielSpectacularSinger],
      },
    );

    const singer = testStore.getCard(arielSpectacularSinger);
    const song = testStore.getCard(hakunaMatata);

    singer.sing(song);

    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 0,
        deck: 1,
      }),
    );
  });
});
