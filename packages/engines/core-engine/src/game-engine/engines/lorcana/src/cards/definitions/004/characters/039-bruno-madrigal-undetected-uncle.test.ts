/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  brunoMadrigalUndetectedUncle,
  luisaMadrigalMagicallyStrongOne,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import { luisaMadrigalEntertainingMuscle } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Bruno Madrigal - Undetected Uncle", () => {
  it("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
    const testStore = new TestStore({
      play: [brunoMadrigalUndetectedUncle],
    });

    const cardUnderTest = testStore.getCard(brunoMadrigalUndetectedUncle);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  describe("**YOU JUST HAVE TO SEE IT** {E} − Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand and gain 3 lore. Otherwise, put it on the top of your deck.", () => {
    it("Hit", () => {
      const testStore = new TestStore({
        play: [brunoMadrigalUndetectedUncle],
        deck: [
          luisaMadrigalMagicallyStrongOne,
          luisaMadrigalEntertainingMuscle,
        ],
      });

      const cardUnderTest = testStore.getCard(brunoMadrigalUndetectedUncle);
      const target = testStore.getCard(luisaMadrigalEntertainingMuscle);
      const notTarget = testStore.getCard(luisaMadrigalMagicallyStrongOne);

      cardUnderTest.activate();
      expect(testStore.stackLayers.length).toBe(1);

      testStore.resolveTopOfStack({
        nameACard: target.name,
      });

      expect(target.zone).toBe("hand");
      expect(notTarget.zone).toBe("deck");
      expect(testStore.getPlayerLore("player_one")).toBe(3);
    });

    it("Miss", () => {
      const testStore = new TestStore({
        play: [brunoMadrigalUndetectedUncle],
        deck: [
          luisaMadrigalMagicallyStrongOne,
          luisaMadrigalEntertainingMuscle,
        ],
      });

      const cardUnderTest = testStore.getCard(brunoMadrigalUndetectedUncle);
      const target = testStore.getCard(luisaMadrigalEntertainingMuscle);
      const notTarget = testStore.getCard(luisaMadrigalMagicallyStrongOne);

      cardUnderTest.activate();
      expect(testStore.stackLayers.length).toBe(1);

      testStore.resolveTopOfStack({
        nameACard: cardUnderTest.name,
      });

      expect(target.meta.revealed).toBe(true);
      expect(target.zone).toBe("deck");
      expect(notTarget.zone).toBe("deck");
      expect(testStore.getPlayerLore("player_one")).toBe(0);
    });
  });
});
