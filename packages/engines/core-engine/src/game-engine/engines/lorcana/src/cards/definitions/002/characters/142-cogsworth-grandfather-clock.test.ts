/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  megaraPullingTheStrings,
  mickeyMouseTrueFriend,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { letTheStormRageOn } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import {
  cogsworthGrandfatherClock,
  eliLaBouffBigDaddy,
  goofyKnightForADay,
  madamMimFox,
  owlLogicalLecturer,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Cogsworth - Grandfather Clock", () => {
  it("Shift", () => {
    const testStore = new TestStore({
      play: [cogsworthGrandfatherClock],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      cogsworthGrandfatherClock.id,
    );

    expect(cardUnderTest.hasShift).toBeTruthy();
  });

  it("Ward", () => {
    const testStore = new TestStore({
      play: [cogsworthGrandfatherClock],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      cogsworthGrandfatherClock.id,
    );

    expect(cardUnderTest.hasWard).toBeTruthy();
  });

  describe("**UNWIND** Your other characters gain **Resist** +1 _(Damage dealt to them is reduced by 1.)_", () => {
    it("Other characters gain Resist", () => {
      const testStore = new TestStore({
        play: [
          megaraPullingTheStrings,
          mickeyMouseTrueFriend,
          cogsworthGrandfatherClock,
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

      expect(target.hasResist).toEqual(true);
      expect(anotherTarget.hasResist).toEqual(true);
    });

    it("Multiple Cogsworth should stack resist", () => {
      const testStore = new TestStore(
        {
          play: [
            megaraPullingTheStrings,
            mickeyMouseTrueFriend,
            cogsworthGrandfatherClock,
            cogsworthGrandfatherClock,
          ],
        },
        {
          play: [madamMimFox, mickeyMouseTrueFriend],
        },
      );

      const target = testStore.getByZoneAndId("play", mickeyMouseTrueFriend.id);

      const cogs = testStore.getByZoneAndId(
        "play",
        cogsworthGrandfatherClock.id,
      );

      target.updateCardMeta({ exerted: true });
      cogs.updateCardMeta({ exerted: true });

      const opponentMim = testStore.getByZoneAndId(
        "play",
        madamMimFox.id,
        "player_two",
      );
      const opponentMicky = testStore.getByZoneAndId(
        "play",
        mickeyMouseTrueFriend.id,
        "player_two",
      );

      expect(target.hasResist).toEqual(true);
      // Check that Mickey is at resist 2, fox has 4 attack so it should be reduced to 2
      opponentMim.challenge(target);
      expect(target.damage).toEqual(2);

      expect(cogs.hasResist).toEqual(true);
      // Check that cogsworth is only at resist 1, mickey has 3 attack so it should be reduced to 2
      opponentMicky.challenge(cogs);
      expect(cogs.damage).toEqual(2);
    });

    it("Cogsworth himself doesn't have resist", () => {
      const testStore = new TestStore({
        play: [cogsworthGrandfatherClock],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        cogsworthGrandfatherClock.id,
      );

      expect(cardUnderTest.hasResist).toEqual(false);
    });

    it("Two Cogsworths give resist to one another", () => {
      const testStore = new TestStore({
        play: [cogsworthGrandfatherClock, cogsworthGrandfatherClock],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        cogsworthGrandfatherClock.id,
      );

      expect(cardUnderTest.hasResist).toEqual(true);
    });
  });
});

describe("Regression", () => {
  it("should not be targeted by Let the Storm Rage On", () => {
    const testStore = new TestStore(
      {
        inkwell: letTheStormRageOn.cost,
        hand: [letTheStormRageOn],
        deck: 2,
      },
      { play: [cogsworthGrandfatherClock, goofyKnightForADay] },
    );

    const cardUnderTest = testStore.getCard(letTheStormRageOn);
    const target = testStore.getCard(cogsworthGrandfatherClock);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] }, true);

    expect(target.meta.damage).toBeFalsy();
  });

  it("Resist not working", () => {
    const testStore = new TestStore(
      {
        play: [eliLaBouffBigDaddy],
      },
      { play: [cogsworthGrandfatherClock, owlLogicalLecturer] },
    );

    const attacker = testStore.getCard(eliLaBouffBigDaddy);
    const defender = testStore.getCard(owlLogicalLecturer);

    expect(defender.hasResist).toEqual(true);
    defender.updateCardMeta({ exerted: true });

    attacker.challenge(defender);

    expect(defender.meta.damage).toEqual(1);
    expect(attacker.meta.damage).toEqual(2);
  });

  it("Resist not working", () => {
    const testStore = new TestStore(
      { play: [cogsworthGrandfatherClock, owlLogicalLecturer] },
      {
        play: [eliLaBouffBigDaddy],
      },
    );

    const attacker = testStore.getCard(owlLogicalLecturer);
    const defender = testStore.getCard(eliLaBouffBigDaddy);

    expect(attacker.hasResist).toEqual(true);
    defender.updateCardMeta({ exerted: true });

    attacker.challenge(defender);

    expect(defender.meta.damage).toEqual(2);
    expect(attacker.meta.damage).toEqual(1);
  });
});
