/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  flotsamUrsulaSpy,
  jetsamUrsulaSpy,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Jetsam - Ursula's Spy", () => {
  it("Evasive", () => {
    const testStore = new TestStore({
      play: [jetsamUrsulaSpy],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", jetsamUrsulaSpy.id);

    expect(cardUnderTest.hasEvasive).toEqual(true);
  });

  describe("**SINISTER SLITHER** Your characters named Flotsam gain **Evasive.**", () => {
    it("Jetsam in play", () => {
      const testStore = new TestStore({
        play: [jetsamUrsulaSpy, flotsamUrsulaSpy],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        flotsamUrsulaSpy.id,
      );

      expect(cardUnderTest.hasEvasive).toEqual(true);
    });

    it("Jetsam NOT in play", () => {
      const testStore = new TestStore({
        play: [flotsamUrsulaSpy],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        flotsamUrsulaSpy.id,
      );

      expect(cardUnderTest.hasEvasive).toEqual(false);
    });
  });
});
