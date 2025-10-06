/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  cinderellaBallroomSensation,
  fairyGodmotherPureHeart,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Fairy Godmother - Pure Heart", () => {
  describe("**JUST LEAVE IT TO ME** Whenever you play a character named Cinderella, you may exert chosen character.", () => {
    it("Play a character named Cinderella", () => {
      const testStore = new TestStore({
        inkwell: cinderellaBallroomSensation.cost,
        hand: [cinderellaBallroomSensation],
        play: [fairyGodmotherPureHeart],
      });

      const cardToTriggerEffect = testStore.getByZoneAndId(
        "hand",
        cinderellaBallroomSensation.id,
      );
      const target = testStore.getByZoneAndId(
        "play",
        fairyGodmotherPureHeart.id,
      );

      cardToTriggerEffect.playFromHand();
      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({ targets: [target] });
      expect(target.ready).toBeFalsy();
    });

    it("Play a character not named Cinderella", () => {
      const testStore = new TestStore({
        inkwell: fairyGodmotherPureHeart.cost,
        hand: [fairyGodmotherPureHeart],
        play: [fairyGodmotherPureHeart],
      });

      const cardToNotTriggerEffect = testStore.getByZoneAndId(
        "hand",
        fairyGodmotherPureHeart.id,
      );
      const target = testStore.getByZoneAndId(
        "play",
        fairyGodmotherPureHeart.id,
      );

      cardToNotTriggerEffect.playFromHand();
      expect(target.ready).toBeTruthy();
    });
  });
});
