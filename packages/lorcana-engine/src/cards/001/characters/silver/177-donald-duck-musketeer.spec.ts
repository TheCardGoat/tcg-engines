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

describe("Donald Duck - Musketeer", () => {
  describe("**STAY ALERT!** During your turn, your Musketeer characters gain **Evasive.** _(They can challenge characters with Evasive.)_", () => {
    it("during your turn, Musketeer characters gain **Evasive.**", () => {
      const testStore = new TestStore({
        play: [mickeyMouseMusketeer, donaldDuckMusketeer, goofyMusketeer],
      });

      const target = testStore.getByZoneAndId("play", mickeyMouseMusketeer.id);
      const anotherTarget = testStore.getByZoneAndId("play", goofyMusketeer.id);

      expect(target.hasEvasive).toEqual(true);
      expect(anotherTarget.hasEvasive).toEqual(true);
    });

    it("during OPPONENT's turn, Musketeer characters DON'T gain **Evasive.**", () => {
      const testStore = new TestStore(
        {
          play: [mickeyMouseMusketeer, donaldDuckMusketeer, goofyMusketeer],
        },
        {
          deck: 1,
        },
      );

      const target = testStore.getByZoneAndId("play", mickeyMouseMusketeer.id);
      const anotherTarget = testStore.getByZoneAndId("play", goofyMusketeer.id);

      testStore.store.passTurn("player_one");

      expect(target.hasEvasive).toEqual(false);
      expect(anotherTarget.hasEvasive).toEqual(false);
    });

    it("Non-musketeers don't get the bonus", () => {
      const testStore = new TestStore({
        play: [lefouBumbler, jumbaJokibaaRenegadeScientist],
      });

      const target = testStore.getByZoneAndId("play", lefouBumbler.id);
      const anotherTarget = testStore.getByZoneAndId(
        "play",
        jumbaJokibaaRenegadeScientist.id,
      );

      expect(target.hasEvasive).toEqual(false);
      expect(anotherTarget.hasEvasive).toEqual(false);
    });
  });

  it("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", () => {
    const testStore = new TestStore({
      play: [donaldDuckMusketeer],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      donaldDuckMusketeer.id,
    );

    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
