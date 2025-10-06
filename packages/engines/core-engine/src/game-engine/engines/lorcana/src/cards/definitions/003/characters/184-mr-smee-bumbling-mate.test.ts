/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { captainHookCaptainOfTheJollyRoger } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { beastTragicHero } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { theBareNecessities } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { mrSmeeBumblingMate } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import { amethystChromicon } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mr. Smee - Bumbling Mate", () => {
  describe("**OH DEAR, DEAR, DEAR** At the end of your turn, if this character is exerted while you do not have a Captain character in play, deal 1 damage to this character.", () => {
    it("Mr. Smee is exerted, Opponent has a Captain in play", () => {
      const testStore = new TestStore(
        {
          play: [mrSmeeBumblingMate],
        },
        {
          play: [captainHookCaptainOfTheJollyRoger],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        mrSmeeBumblingMate.id,
      );

      cardUnderTest.updateCardMeta({ exerted: true });

      testStore.passTurn();

      expect(cardUnderTest.meta.damage).toBe(1);
    });

    describe("When Mr. Smee - Bumbling Mate is exerted", () => {
      it("when a captain in play, does NOT deal one damage to itself", () => {
        const testStore = new TestStore({
          play: [mrSmeeBumblingMate, captainHookCaptainOfTheJollyRoger],
        });

        const cardUnderTest = testStore.getByZoneAndId(
          "play",
          mrSmeeBumblingMate.id,
        );

        cardUnderTest.updateCardMeta({ exerted: true });

        testStore.passTurn();

        expect(cardUnderTest.meta.damage).toBeFalsy();
      });

      it("when a captain in NOT in play, deals one damage to itself", () => {
        const testStore = new TestStore({
          play: [mrSmeeBumblingMate],
        });

        const cardUnderTest = testStore.getByZoneAndId(
          "play",
          mrSmeeBumblingMate.id,
        );

        cardUnderTest.updateCardMeta({ exerted: true });

        testStore.passTurn();

        expect(cardUnderTest.meta.damage).toBe(1);
      });
    });

    describe("When Mr. Smee - Bumbling Mate is NOT exerted", () => {
      it("when a captain in play, does NOT deal one damage to itself", () => {
        const testStore = new TestStore({
          play: [mrSmeeBumblingMate, captainHookCaptainOfTheJollyRoger],
        });

        const cardUnderTest = testStore.getByZoneAndId(
          "play",
          mrSmeeBumblingMate.id,
        );

        cardUnderTest.updateCardMeta({ exerted: false });

        testStore.passTurn();

        expect(cardUnderTest.meta.damage).toBeFalsy();
      });

      it("when a captain in NOT in play, does NOT deal one damage to itself", () => {
        const testStore = new TestStore({
          play: [mrSmeeBumblingMate],
        });

        const cardUnderTest = testStore.getByZoneAndId(
          "play",
          mrSmeeBumblingMate.id,
        );

        cardUnderTest.updateCardMeta({ exerted: false });

        testStore.passTurn();

        expect(cardUnderTest.meta.damage).toBeFalsy();
      });
    });
  });
});

describe("Regression tests", () => {
  it("Mr Smee is not taking damage", () => {
    const testStore = new TestStore(
      {
        play: [mrSmeeBumblingMate, amethystChromicon],
      },
      {
        play: [beastTragicHero],
        deck: 1,
      },
    );

    const cardUnderTest = testStore.getCard(mrSmeeBumblingMate);
    const beast = testStore.getCard(beastTragicHero);

    beast.updateCardMeta({ exerted: true, damage: 2 });
    cardUnderTest.quest();

    testStore.passTurn();

    expect(cardUnderTest.meta.damage).toBe(1);
  });

  it("Sing", async () => {
    const testEngine = new TestEngine({
      play: [mrSmeeBumblingMate],
      hand: [theBareNecessities],
    });

    await testEngine.singSong({
      singer: mrSmeeBumblingMate,
      song: theBareNecessities,
    });
  });
});
