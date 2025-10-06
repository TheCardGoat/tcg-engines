/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  mauiHeroToAll,
  moanChosenByTheOcean,
  teKaHeartless,
  teKaTheBurningOne,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Moana Chosen By The Ocean", () => {
  describe("**THIS IS NOT WHO YOU ARE** When you play this character, you may banish chosen character named Te Ka.", () => {
    it("banishes Te Ka The Burning One", () => {
      const testStore = new TestStore({
        inkwell: moanChosenByTheOcean.cost,
        hand: [moanChosenByTheOcean],
        play: [teKaTheBurningOne],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        moanChosenByTheOcean.id,
      );
      const target = testStore.getByZoneAndId("play", teKaTheBurningOne.id);

      cardUnderTest.playFromHand();
      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({
        targetId: target.instanceId,
      });

      expect(target.zone).toEqual("discard");
    });

    it("banishes Te Ka Heartless", () => {
      const testStore = new TestStore({
        inkwell: moanChosenByTheOcean.cost,
        hand: [moanChosenByTheOcean],
        play: [teKaHeartless],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        moanChosenByTheOcean.id,
      );
      const target = testStore.getByZoneAndId("play", teKaHeartless.id);

      cardUnderTest.playFromHand();
      testStore.resolveOptionalAbility();

      testStore.resolveTopOfStack({
        targetId: target.instanceId,
      });

      expect(target.zone).toEqual("discard");
    });

    it("does not banishes non Teka character", () => {
      const testStore = new TestStore({
        inkwell: moanChosenByTheOcean.cost,
        hand: [moanChosenByTheOcean],
        play: [mauiHeroToAll],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        moanChosenByTheOcean.id,
      );
      const shouldNotBeTarget = testStore.getByZoneAndId(
        "play",
        mauiHeroToAll.id,
      );

      cardUnderTest.playFromHand();

      testStore.resolveTopOfStack();

      expect(shouldNotBeTarget.zone).toEqual("play");
    });
  });
});
