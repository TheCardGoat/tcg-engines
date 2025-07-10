/**
 * @jest-environment node
 */

import { describe, expect, fit, it, test } from "@jest/globals";
import {
  caterpillarCalmAndCollected,
  dukeWeaseltonSmallTimeCrook,
  goofyKnightForADay,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { chernabogsFollowersCreaturesOfEvil } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { forbiddenMountainMaleficentsCastle } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("location cards", () => {
  it("Don't let players play when there's not enough ink", () => {
    const testStore = new TestStore({
      inkwell: forbiddenMountainMaleficentsCastle.cost - 1,
      hand: [forbiddenMountainMaleficentsCastle],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      forbiddenMountainMaleficentsCastle.id,
    );

    expect(cardUnderTest.playingCardRestrictions()).toBeTruthy();

    cardUnderTest.playFromHand();

    expect(cardUnderTest.zone).toEqual("hand");
  });

  it("Playing a location card should cost ink", () => {
    const testStore = new TestStore({
      inkwell: forbiddenMountainMaleficentsCastle.cost,
      hand: [forbiddenMountainMaleficentsCastle],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      forbiddenMountainMaleficentsCastle.id,
    );

    cardUnderTest.playFromHand();
    expect(
      testStore.store.tableStore
        .getTable("player_one")
        .zones.inkwell.cards.filter((card) => card.ready),
    ).toHaveLength(0);
  });

  it("Playing a location card should move it to play area", () => {
    const testStore = new TestStore({
      inkwell: forbiddenMountainMaleficentsCastle.cost,
      hand: [forbiddenMountainMaleficentsCastle],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      forbiddenMountainMaleficentsCastle.id,
    );

    expect(cardUnderTest.playingCardRestrictions()).toBeFalsy();

    cardUnderTest.playFromHand();

    expect(cardUnderTest.zone).toEqual("play");
  });

  it("Once receive damage equal to location's willpower, location is moved to discard pile", () => {
    const testStore = new TestStore(
      {
        play: [goofyKnightForADay],
      },
      {
        play: [forbiddenMountainMaleficentsCastle],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      forbiddenMountainMaleficentsCastle.id,
      "player_two",
    );
    const challenger = testStore.getByZoneAndId("play", goofyKnightForADay.id);

    challenger.challenge(cardUnderTest);
    expect(cardUnderTest.zone).toEqual("discard");
    expect(challenger.meta.damage).toBeFalsy();
  });

  it("When a location is moved to discard pile, characters on that location stay in play but no longer are at the location", () => {
    const testStore = new TestStore({
      inkwell: forbiddenMountainMaleficentsCastle.moveCost * 2,
      play: [
        dukeWeaseltonSmallTimeCrook,
        caterpillarCalmAndCollected,
        forbiddenMountainMaleficentsCastle,
      ],
    });

    const location = testStore.getByZoneAndId(
      "play",
      forbiddenMountainMaleficentsCastle.id,
    );
    const aCharacter = testStore.getByZoneAndId(
      "play",
      dukeWeaseltonSmallTimeCrook.id,
    );
    const anotherCharacter = testStore.getByZoneAndId(
      "play",
      caterpillarCalmAndCollected.id,
    );

    [aCharacter, anotherCharacter].forEach((character) => {
      character.enterLocation(location);

      expect(character.isAtLocation(location)).toBeTruthy();
      expect(location.containsCharacter(character)).toBeTruthy();
    });

    expect(location.meta.characters).toHaveLength(2);

    location.banish();

    expect(location.meta.characters || []).toHaveLength(0);
    [aCharacter, anotherCharacter].forEach((character) => {
      expect(character.isAtLocation(location)).toBeFalsy();
      expect(location.containsCharacter(character)).toBeFalsy();
    });
  });

  it("Chars can move to location the turn location is played", () => {
    const testStore = new TestStore({
      inkwell:
        forbiddenMountainMaleficentsCastle.moveCost +
        forbiddenMountainMaleficentsCastle.cost,
      hand: [forbiddenMountainMaleficentsCastle],
      play: [caterpillarCalmAndCollected],
    });

    const location = testStore.getByZoneAndId(
      "hand",
      forbiddenMountainMaleficentsCastle.id,
    );
    const character = testStore.getByZoneAndId(
      "play",
      caterpillarCalmAndCollected.id,
    );

    location.playFromHand();

    expect(character.canEnterLocation(location)).toBeTruthy();
    character.enterLocation(location);
    expect(character.isAtLocation(location)).toBeTruthy();
  });

  it("gains lore during 'Set' step of your beginning phase", () => {
    const testStore = new TestStore(
      { deck: 2 },
      {
        play: [forbiddenMountainMaleficentsCastle],
        deck: 2,
      },
    );

    const location = testStore.getByZoneAndId(
      "play",
      forbiddenMountainMaleficentsCastle.id,
      "player_two",
    );

    expect(testStore.getPlayerLore("player_one")).toEqual(0);
    expect(testStore.getPlayerLore("player_two")).toEqual(0);

    testStore.passTurn();

    expect(testStore.getPlayerLore("player_one")).toEqual(0);
    expect(testStore.getPlayerLore("player_two")).toEqual(location.lore);

    testStore.passTurn();

    expect(testStore.getPlayerLore("player_one")).toEqual(0);
    expect(testStore.getPlayerLore("player_two")).toEqual(location.lore);
  });

  it("Character leaves location when it is moved to discard pile", () => {
    const testStore = new TestStore({
      inkwell: forbiddenMountainMaleficentsCastle.moveCost,
      play: [
        chernabogsFollowersCreaturesOfEvil,
        forbiddenMountainMaleficentsCastle,
      ],
      deck: 1,
    });

    const location = testStore.getByZoneAndId(
      "play",
      forbiddenMountainMaleficentsCastle.id,
    );
    const character = testStore.getByZoneAndId(
      "play",
      chernabogsFollowersCreaturesOfEvil.id,
    );

    character.enterLocation(location);

    expect(character.zone).toEqual("play");
    expect(character.isAtLocation(location)).toBeTruthy();
    expect(location.containsCharacter(character)).toBeTruthy();

    character.quest();
    testStore.resolveOptionalAbility();
    expect(character.zone).toEqual("discard");

    expect(character.isAtLocation(location)).toBeFalsy();
    expect(location.containsCharacter(character)).toBeFalsy();
  });
});
