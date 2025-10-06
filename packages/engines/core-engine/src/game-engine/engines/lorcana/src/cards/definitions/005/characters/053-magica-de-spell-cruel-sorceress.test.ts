/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  mickeyMouseDetective,
  moanaOfMotunui,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import {
  aWholeNewWorld,
  hakunaMatata,
  suddenChill,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/songs";
import { theBareNecessities } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import {
  annaDiplomaticQueen,
  magicaDeSpellCruelSorceress,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Magica De Spell - Cruel Sorceress", () => {
  it("**PLAYING WITH POWER** During opponents' turns, if an effect would cause you to discard one or more cards from your hand, you don't discard.", () => {
    const testStore = new TestStore(
      {
        inkwell: suddenChill.cost,
        hand: [suddenChill],
      },
      {
        hand: [moanaOfMotunui],
        play: [magicaDeSpellCruelSorceress],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", suddenChill.id);
    const target = testStore.getByZoneAndId(
      "hand",
      moanaOfMotunui.id,
      "player_two",
    );

    cardUnderTest.playFromHand();
    testStore.changePlayer().resolveTopOfStack({
      targets: [target],
    });

    expect(target.zone).toEqual("hand");
  });
});

describe("Regression", () => {
  it("'A whole new world' interaction.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: aWholeNewWorld.cost,
        hand: [aWholeNewWorld],
        deck: 10,
      },
      {
        deck: 10,
        hand: [moanaOfMotunui, mickeyMouseDetective],
        play: [magicaDeSpellCruelSorceress],
      },
    );

    await testEngine.playCard(aWholeNewWorld);

    expect(testEngine.getCardModel(moanaOfMotunui).zone).toEqual("hand");
    expect(testEngine.getCardModel(mickeyMouseDetective).zone).toEqual("hand");
    expect(testEngine.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({
        hand: 9, // The card is still in hand
        deck: 3,
      }),
    );
  });

  it("'The Bare Necessities' interaction.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: theBareNecessities.cost,
        hand: [theBareNecessities],
        play: [magicaDeSpellCruelSorceress],
      },
      {
        hand: [hakunaMatata],
      },
    );

    await testEngine.playCard(theBareNecessities, { targets: [hakunaMatata] });

    expect(testEngine.getCardModel(hakunaMatata).zone).toEqual("discard");
  });

  it("Anna Diplomatic Queen Interaction", () => {
    const testStore = new TestEngine(
      {
        inkwell: annaDiplomaticQueen.cost + 2,
        hand: [annaDiplomaticQueen],
      },
      {
        hand: [moanaOfMotunui],
        play: [magicaDeSpellCruelSorceress],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      annaDiplomaticQueen.id,
    );
    const target = testStore.getByZoneAndId(
      "hand",
      moanaOfMotunui.id,
      "player_two",
    );

    cardUnderTest.playFromHand();

    // testStore.stackLayers.map(x => console.log("------- " + x.description));
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ mode: "1" }, true);
    console.log("----------1---------");
    testStore.changeActivePlayer();

    testStore.resolveTopOfStack({
      targets: [target],
    });
    console.log("----------2---------");

    expect(target.zone).toEqual("hand");
  });
});
