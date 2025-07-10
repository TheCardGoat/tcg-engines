/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  arielSpectacularSinger,
  chiefTui,
  heiheiBoatSnack,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { shieldOfVirtue } from "@lorcanito/lorcana-engine/cards/001/items/items";
import { friendsOnTheOtherSide } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";

describe("Ariel - Spectacular Singer", () => {
  it("MUSICAL DEBUT effect - Song Tutored", async () => {
    const testEngine = new TestEngine({
      inkwell: arielSpectacularSinger.cost,
      hand: [arielSpectacularSinger],
      deck: [
        shieldOfVirtue,
        chiefTui,
        heiheiBoatSnack,
        friendsOnTheOtherSide,
        tipoGrowingSon,
        hiramFlavershamToymaker,
      ],
    });

    await testEngine.playCard(arielSpectacularSinger);

    await testEngine.resolveTopOfStack({
      scry: {
        bottom: [hiramFlavershamToymaker, tipoGrowingSon, heiheiBoatSnack],
        hand: [friendsOnTheOtherSide],
      },
    });

    expect(testEngine.getCardZone(friendsOnTheOtherSide)).toEqual("hand");

    const bottomCard = testEngine.testStore.getZonesCards().deck[0];
    const secondBottomCard = testEngine.testStore.getZonesCards().deck[1];
    const thirdBottomCard = testEngine.testStore.getZonesCards().deck[2];

    expect(bottomCard?.lorcanitoCard?.name).toEqual(
      hiramFlavershamToymaker.name,
    );
    expect(secondBottomCard?.lorcanitoCard?.name).toEqual(tipoGrowingSon.name);
    expect(thirdBottomCard?.lorcanitoCard?.name).toEqual(heiheiBoatSnack.name);
  });
  it("MUSICAL DEBUT effect - Missed song", async () => {
    const testEngine = new TestEngine({
      inkwell: arielSpectacularSinger.cost,
      hand: [arielSpectacularSinger],
      deck: [
        shieldOfVirtue,
        friendsOnTheOtherSide,
        chiefTui,
        heiheiBoatSnack,
        tipoGrowingSon,
        hiramFlavershamToymaker,
      ],
    });

    await testEngine.playCard(arielSpectacularSinger);

    await testEngine.resolveTopOfStack({
      scry: {
        bottom: [
          hiramFlavershamToymaker,
          tipoGrowingSon,
          heiheiBoatSnack,
          chiefTui,
        ],
        hand: [],
      },
    });

    const bottomCard = testEngine.testStore.getZonesCards().deck[0];
    const secondBottomCard = testEngine.testStore.getZonesCards().deck[1];
    const thirdBottomCard = testEngine.testStore.getZonesCards().deck[2];
    const fourthBottomCard = testEngine.testStore.getZonesCards().deck[3];

    expect(bottomCard?.lorcanitoCard?.name).toEqual(
      hiramFlavershamToymaker.name,
    );
    expect(secondBottomCard?.lorcanitoCard?.name).toEqual(tipoGrowingSon.name);
    expect(thirdBottomCard?.lorcanitoCard?.name).toEqual(heiheiBoatSnack.name);
    expect(fourthBottomCard?.lorcanitoCard?.name).toEqual(chiefTui.name);
  });
});
