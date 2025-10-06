/**
 * @jest-environment node
 */
import { describe, expect, it } from "@jest/globals";
import {
  auroraDreamingGuardian,
  megaraPullingTheStrings,
  mickeyMouseTrueFriend,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Aurora - Dreaming Guardian", () => {
  describe("**Protective Embrace** Your other characters gain **Ward**. _(Opponents can't choose them except to challenge.)_", () => {
    it("Other characters gain ward", () => {
      const testStore = new TestStore({
        play: [
          megaraPullingTheStrings,
          mickeyMouseTrueFriend,
          auroraDreamingGuardian,
        ],
      });

      const target = testStore.getByZoneAndId(
        "play",
        megaraPullingTheStrings.id,
      );
      const anotherTarget = testStore.getByZoneAndId(
        "play",
        mickeyMouseTrueFriend.id,
      );

      expect(target.hasWard).toEqual(true);
      expect(anotherTarget.hasWard).toEqual(true);
    });

    it("Aurora herself doesn't have ward", () => {
      const testStore = new TestStore({
        play: [auroraDreamingGuardian],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        auroraDreamingGuardian.id,
      );

      expect(cardUnderTest.hasWard).toEqual(false);
    });

    it("Two Auroras give ward to one another", () => {
      const testStore = new TestStore({
        play: [auroraDreamingGuardian, auroraDreamingGuardian],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        auroraDreamingGuardian.id,
      );

      expect(cardUnderTest.hasWard).toEqual(true);
    });
  });
});
