import { describe, expect, it } from "@jest/globals";
import {
  donaldDuckStruttingHisStuff,
  gastonArrogantHunter,
  jetsamUrsulaSpy,
  moanaOfMotunui,
  teKaTheBurningOne,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { hiddenCoveTranquilHaven } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
/**
 * @jest-environment node
 */
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Reckless keyword", () => {
  it("Cannot pass turn if there's a valid character challenge target", () => {
    const testStore = new TestStore(
      {
        play: [gastonArrogantHunter],
      },
      {
        play: [moanaOfMotunui],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      gastonArrogantHunter.id,
    );
    expect(cardUnderTest.meta).toEqual(
      expect.objectContaining({
        exerted: undefined,
        playedThisTurn: undefined,
      }),
    );
    const defender = testStore.getByZoneAndId(
      "play",
      moanaOfMotunui.id,
      "player_two",
    );
    defender.updateCardMeta({ exerted: true });
    expect(defender.ready).toEqual(false);

    expect(testStore.store.turnPlayer).toEqual("player_one");
    expect(testStore.store.turnCount).toEqual(0);

    testStore.store.passTurn("player_one");

    expect(testStore.store.turnPlayer).toEqual("player_one");
    expect(testStore.store.turnCount).toEqual(0);
  });

  it("Cannot pass turn if there's a valid location challenge target", async () => {
    const testStore = new TestEngine(
      {
        play: [gastonArrogantHunter],
      },
      {
        play: [hiddenCoveTranquilHaven],
      },
    );

    expect(testStore.store.turnPlayer).toEqual("player_one");
    expect(testStore.store.turnCount).toEqual(0);

    await testStore.passTurn("player_one");

    expect(testStore.store.turnPlayer).toEqual("player_one");
    expect(testStore.store.turnCount).toEqual(0);
  });

  it("let people skip check if needed (manual mode)", () => {
    const testStore = new TestStore(
      {
        play: [gastonArrogantHunter],
      },
      {
        play: [moanaOfMotunui],
        deck: [moanaOfMotunui],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      gastonArrogantHunter.id,
    );
    expect(cardUnderTest.meta).toEqual(
      expect.objectContaining({
        exerted: undefined,
        playedThisTurn: undefined,
      }),
    );
    const defender = testStore.getByZoneAndId(
      "play",
      moanaOfMotunui.id,
      "player_two",
    );
    defender.updateCardMeta({ exerted: true });
    expect(defender.ready).toEqual(false);

    expect(testStore.store.turnPlayer).toEqual("player_one");
    expect(testStore.store.turnCount).toEqual(0);

    testStore.store.passTurn("player_one", true);

    expect(testStore.store.turnPlayer).toEqual("player_two");
    expect(testStore.store.turnCount).toEqual(1);
  });

  describe("When there's no valid challenge target", () => {
    it("No cards exerted", () => {
      const testStore = new TestStore(
        {
          play: [teKaTheBurningOne],
        },
        {
          play: [moanaOfMotunui],
          deck: [donaldDuckStruttingHisStuff],
        },
      );

      expect(testStore.store.turnPlayer).toEqual("player_one");
      expect(testStore.store.turnCount).toEqual(0);

      testStore.store.passTurn("player_one");

      expect(testStore.store.turnPlayer).toEqual("player_two");
      expect(testStore.store.turnCount).toEqual(1);
    });

    it("Evasive glimmer", () => {
      const testStore = new TestStore(
        {
          play: [gastonArrogantHunter],
        },
        {
          play: [jetsamUrsulaSpy],
          deck: [jetsamUrsulaSpy],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        gastonArrogantHunter.id,
      );
      expect(cardUnderTest.meta).toEqual(
        expect.objectContaining({
          exerted: undefined,
          playedThisTurn: undefined,
        }),
      );
      const defender = testStore.getByZoneAndId(
        "play",
        jetsamUrsulaSpy.id,
        "player_two",
      );
      defender.updateCardMeta({ exerted: true });
      expect(defender.ready).toEqual(false);

      expect(testStore.store.turnCount).toEqual(0);
      expect(testStore.store.turnPlayer).toEqual("player_one");

      testStore.store.passTurn("player_one");

      expect(testStore.store.turnCount).toEqual(1);
      expect(testStore.store.turnPlayer).toEqual("player_two");
    });
  });
});
