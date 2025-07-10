/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  donaldDuckMusketeer,
  goofyMusketeer,
  jumbaJokibaaRenegadeScientist,
  lefouBumbler,
  mickeyMouseMusketeer,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Mickey Mouse - Musketeer", () => {
  describe("**ALL FOR ONE** Your other Musketeer characters get +1 {S}.", () => {
    it("Your other Musketeer characters get +1 {S}.", () => {
      const testStore = new TestStore({
        play: [mickeyMouseMusketeer, donaldDuckMusketeer, goofyMusketeer],
      });

      const target = testStore.getByZoneAndId("play", donaldDuckMusketeer.id);
      const anotherTarget = testStore.getByZoneAndId("play", goofyMusketeer.id);

      expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) + 1);
      expect(anotherTarget.strength).toEqual(
        (anotherTarget.lorcanitoCard.strength || 0) + 1,
      );
    });

    it("Mickey and non-musketeers don't get the bonus", () => {
      const testStore = new TestStore({
        play: [
          mickeyMouseMusketeer,
          lefouBumbler,
          jumbaJokibaaRenegadeScientist,
        ],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        mickeyMouseMusketeer.id,
      );
      const target = testStore.getByZoneAndId("play", lefouBumbler.id);
      const anotherTarget = testStore.getByZoneAndId(
        "play",
        jumbaJokibaaRenegadeScientist.id,
      );

      expect(cardUnderTest.strength).toEqual(cardUnderTest.strength);
      expect(target.strength).toEqual(target.lorcanitoCard.strength);
      expect(anotherTarget.strength).toEqual(
        anotherTarget.lorcanitoCard.strength,
      );
    });
  });

  it("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", () => {
    const testStore = new TestStore({
      play: [mickeyMouseMusketeer],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      mickeyMouseMusketeer.id,
    );

    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
