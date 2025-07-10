/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  captainHookForcefulDuelist,
  captainHookThinkingAHappyThought,
  hansSchemingPrince,
  maleficentSorceress,
  moanaOfMotunui,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Captain Hook - Thinking a Happy Thought", () => {
  describe("**STOLEN DUST** Characters with cost 3 or less can't challenge this character.", () => {
    it("Characters with cost 3 or less can't challenge THIS character.", () => {
      const testStore = new TestStore(
        {
          play: [maleficentSorceress],
        },
        {
          play: [captainHookThinkingAHappyThought],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        captainHookThinkingAHappyThought.id,
        "player_two",
      );
      const attacker = testStore.getByZoneAndId("play", maleficentSorceress.id);

      cardUnderTest.updateCardMeta({ exerted: true });

      attacker.challenge(cardUnderTest);

      expect(cardUnderTest.zone).toEqual("play");
      expect(cardUnderTest.meta.damage).toBeFalsy();

      expect(attacker.zone).toEqual("play");
      expect(attacker.meta.damage).toBeFalsy();
      expect(attacker.lorcanitoCard.cost).toEqual(3);
    });

    it("Characters with cost 3 or less can challenge OTHER character.", () => {
      const testStore = new TestStore(
        {
          play: [maleficentSorceress],
        },
        {
          play: [captainHookThinkingAHappyThought, moanaOfMotunui],
        },
      );

      const defender = testStore.getByZoneAndId(
        "play",
        moanaOfMotunui.id,
        "player_two",
      );
      const attacker = testStore.getByZoneAndId("play", maleficentSorceress.id);

      defender.updateCardMeta({ exerted: true });

      attacker.challenge(defender);

      expect(defender.zone).toEqual("play");
      expect(defender.meta.damage).toBeTruthy();

      expect(attacker.zone).toEqual("play");
      expect(attacker.meta.damage).toBeTruthy();
      expect(attacker.lorcanitoCard.cost).toEqual(3);
    });

    it("Characters with cost 4 or more can challenge this character.", () => {
      const testStore = new TestStore(
        {
          play: [hansSchemingPrince],
        },
        {
          play: [captainHookThinkingAHappyThought],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        captainHookThinkingAHappyThought.id,
        "player_two",
      );
      const attacker = testStore.getByZoneAndId("play", hansSchemingPrince.id);

      cardUnderTest.updateCardMeta({ exerted: true });

      attacker.challenge(cardUnderTest);

      expect(cardUnderTest.zone).toEqual("play");
      expect(cardUnderTest.meta.damage).toBeTruthy();

      expect(attacker.zone).toEqual("play");
      expect(attacker.meta.damage).toBeTruthy();
      expect(attacker.lorcanitoCard.cost).toEqual(4);
    });
  });

  it("**Shift** 3 _(You may pay 3 {I} to play this on top of one of your characters named Captain Hook.)_", () => {
    const testStore = new TestStore({
      inkwell: 3,
      hand: [captainHookThinkingAHappyThought],
      play: [captainHookForcefulDuelist],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      captainHookThinkingAHappyThought.id,
    );
    const target = testStore.getByZoneAndId(
      "play",
      captainHookForcefulDuelist.id,
    );

    testStore.store.shiftCard(cardUnderTest.instanceId, target.instanceId);

    expect(cardUnderTest.zone).toEqual("play");
    expect(cardUnderTest.meta.shifted).toEqual(target.instanceId);
    expect(target.meta.shifter).toEqual(cardUnderTest.instanceId);
    expect(
      testStore.store.tableStore.getTable("player_one").inkAvailable(),
    ).toEqual(0);
  });

  it("**Challenger** +3 _(While challenging, this character gets +3 {S}.)_", () => {
    const testStore = new TestStore(
      {
        play: [captainHookThinkingAHappyThought],
      },
      {
        play: [moanaOfMotunui],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      captainHookThinkingAHappyThought.id,
    );
    const defender = testStore.getByZoneAndId(
      "play",
      moanaOfMotunui.id,
      "player_two",
    );

    defender.updateCardMeta({ exerted: true });

    cardUnderTest.challenge(defender);

    expect(defender.meta.damage).toEqual(
      (cardUnderTest.lorcanitoCard.strength || 0) + 3,
    );
    expect(cardUnderTest.hasChallenger).toEqual(true);
  });
});
