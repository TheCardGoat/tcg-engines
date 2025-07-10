/**
 * @jest-environment node
 */

import { describe, expect, fit, it, test } from "@jest/globals";
import { allCardsById } from "@lorcanito/lorcana-engine";
import {
  caterpillarCalmAndCollected,
  dukeWeaseltonSmallTimeCrook,
  goofyKnightForADay,
  theHuntsmanReluctantEnforcer,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { forbiddenMountainMaleficentsCastle } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

const fakeLocation: LorcanitoLocationCard = {
  ...forbiddenMountainMaleficentsCastle,
  id: "fake-location",
};
allCardsById[fakeLocation.id] = fakeLocation;

describe("Characters", () => {
  describe("Location interactions", () => {
    it("Let characters move to a location, by paying its move cost", () => {
      const testStore = new TestStore({
        inkwell: forbiddenMountainMaleficentsCastle.moveCost * 2,
        play: [
          goofyKnightForADay,
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
        goofyKnightForADay.id,
      );
      const anotherCharacter = testStore.getByZoneAndId(
        "play",
        caterpillarCalmAndCollected.id,
      );

      [aCharacter, anotherCharacter].forEach((character) => {
        expect(character.canEnterLocation(location)).toBeTruthy();

        expect(character.isAtLocation(location)).toBeFalsy();
        expect(location.containsCharacter(character)).toBeFalsy();

        character.enterLocation(location);

        expect(character.isAtLocation(location)).toBeTruthy();
        expect(location.containsCharacter(character)).toBeTruthy();
      });

      expect(location.meta.characters).toHaveLength(2);
    });

    it("When there's not enough ink, characters can't move", () => {
      const testStore = new TestStore({
        inkwell: forbiddenMountainMaleficentsCastle.moveCost - 1,
        play: [goofyKnightForADay, forbiddenMountainMaleficentsCastle],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        forbiddenMountainMaleficentsCastle.id,
      );
      const aCharacter = testStore.getByZoneAndId(
        "play",
        goofyKnightForADay.id,
      );

      expect(aCharacter.canEnterLocation(cardUnderTest)).toBeFalsy();

      aCharacter.enterLocation(cardUnderTest);

      expect(aCharacter.isAtLocation(cardUnderTest)).toBeFalsy();
      expect(cardUnderTest.containsCharacter(aCharacter)).toBeFalsy();

      expect(cardUnderTest.meta.characters || []).toHaveLength(0);
    });

    it("Characters can't move to a location that they're already at", () => {
      const testStore = new TestStore({
        inkwell: forbiddenMountainMaleficentsCastle.moveCost * 2,
        play: [goofyKnightForADay, forbiddenMountainMaleficentsCastle],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        forbiddenMountainMaleficentsCastle.id,
      );
      const aCharacter = testStore.getByZoneAndId(
        "play",
        goofyKnightForADay.id,
      );

      expect(aCharacter.canEnterLocation(cardUnderTest)).toBeTruthy();

      aCharacter.enterLocation(cardUnderTest);

      expect(aCharacter.canEnterLocation(cardUnderTest)).toBeFalsy();
    });

    it("Characters can move to different locations in a same turn, as long as they have enough ink", () => {
      const testStore = new TestStore({
        inkwell: 10,
        play: [
          goofyKnightForADay,
          forbiddenMountainMaleficentsCastle,
          fakeLocation,
        ],
      });

      const aLocation = testStore.getByZoneAndId(
        "play",
        forbiddenMountainMaleficentsCastle.id,
      );
      const anotherLocation = testStore.getByZoneAndId("play", fakeLocation.id);

      const aCharacter = testStore.getByZoneAndId(
        "play",
        goofyKnightForADay.id,
      );

      aCharacter.enterLocation(aLocation);
      expect(aCharacter.canEnterLocation(anotherLocation)).toBeTruthy();

      aCharacter.enterLocation(anotherLocation);
      expect(aCharacter.canEnterLocation(aLocation)).toBeTruthy();

      aCharacter.enterLocation(aLocation);
      expect(aCharacter.canEnterLocation(anotherLocation)).toBeTruthy();

      aCharacter.enterLocation(anotherLocation);
      expect(aCharacter.canEnterLocation(aLocation)).toBeTruthy();
    });

    //Once a character enters a location, they cannot leave the location, unless it is to enter another location.

    it("Characters can move to a location on the turn that they are played.", () => {
      const testStore = new TestStore({
        inkwell:
          forbiddenMountainMaleficentsCastle.moveCost +
          caterpillarCalmAndCollected.cost,
        hand: [caterpillarCalmAndCollected],
        play: [forbiddenMountainMaleficentsCastle],
      });

      const location = testStore.getByZoneAndId(
        "play",
        forbiddenMountainMaleficentsCastle.id,
      );
      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        caterpillarCalmAndCollected.id,
      );

      cardUnderTest.playFromHand();

      expect(cardUnderTest.canEnterLocation(location)).toBeTruthy();
      cardUnderTest.enterLocation(location);
      expect(cardUnderTest.isAtLocation(location)).toBeTruthy();
    });

    it("Characters can only be in one location.", () => {
      const testStore = new TestStore({
        inkwell: 8,
        play: [
          goofyKnightForADay,
          forbiddenMountainMaleficentsCastle,
          fakeLocation,
        ],
      });

      const aCharacter = testStore.getByZoneAndId(
        "play",
        goofyKnightForADay.id,
      );
      const aLocation = testStore.getByZoneAndId(
        "play",
        forbiddenMountainMaleficentsCastle.id,
      );
      const anotherLocation = testStore.getByZoneAndId("play", fakeLocation.id);

      aCharacter.enterLocation(aLocation);
      aCharacter.enterLocation(anotherLocation);

      expect(aCharacter.isAtLocation(aLocation)).toBeFalsy();
      expect(aCharacter.isAtLocation(anotherLocation)).toBeTruthy();
    });

    it("Only your character cards can move to your locations. Your opponent’s character cannot move to your locations.", () => {
      const testStore = new TestStore(
        {
          inkwell: forbiddenMountainMaleficentsCastle.moveCost,
          play: [caterpillarCalmAndCollected],
        },
        {
          play: [forbiddenMountainMaleficentsCastle],
        },
      );

      const location = testStore.getByZoneAndId(
        "play",
        forbiddenMountainMaleficentsCastle.id,
        "player_two",
      );
      const aCharacter = testStore.getByZoneAndId(
        "play",
        caterpillarCalmAndCollected.id,
      );

      expect(aCharacter.canEnterLocation(location)).toBeTruthy();
    });

    it("Let characters challenge a location", () => {
      const testStore = new TestStore(
        {
          play: [
            caterpillarCalmAndCollected,
            dukeWeaseltonSmallTimeCrook,
            theHuntsmanReluctantEnforcer,
          ],
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
      const challengerOne = testStore.getByZoneAndId(
        "play",
        caterpillarCalmAndCollected.id,
      );
      const challengerTwo = testStore.getByZoneAndId(
        "play",
        dukeWeaseltonSmallTimeCrook.id,
      );
      const challengerThree = testStore.getByZoneAndId(
        "play",
        theHuntsmanReluctantEnforcer.id,
      );

      [challengerOne, challengerTwo, challengerThree].forEach(
        (challenger, index) => {
          expect(challenger.canChallenge(cardUnderTest)).toEqual(true);

          challenger.challenge(cardUnderTest);
          expect(cardUnderTest.damage).toEqual(index + 1);
        },
      );
    });
  });
});
