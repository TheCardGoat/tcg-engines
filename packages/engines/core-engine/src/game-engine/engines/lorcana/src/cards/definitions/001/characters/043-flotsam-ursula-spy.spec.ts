/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  flotsamUrsulaSpy,
  jetsamUrsulaSpy,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";

describe("Floatsam - Ursula's Spy", () => {
  it("Rush", () => {
    const testStore = new TestStore({
      play: [flotsamUrsulaSpy],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", flotsamUrsulaSpy.id);

    expect(cardUnderTest.hasRush).toEqual(true);
  });

  describe("**DEXTEROUS LUNGE** Your characters named Jetsam gain **Rush.**", () => {
    it("Flotsam in play", () => {
      const testStore = new TestStore({
        play: [jetsamUrsulaSpy, flotsamUrsulaSpy],
      });

      const cardUnderTest = testStore.getCard(jetsamUrsulaSpy);

      expect(cardUnderTest.hasRush).toEqual(true);
    });

    it("Flotsam NOT in play", () => {
      const testStore = new TestStore({
        play: [jetsamUrsulaSpy],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        jetsamUrsulaSpy.id,
      );

      expect(cardUnderTest.hasRush).toEqual(false);
    });
  });
});
