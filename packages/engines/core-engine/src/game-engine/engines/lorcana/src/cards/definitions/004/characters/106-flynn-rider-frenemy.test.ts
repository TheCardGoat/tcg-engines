/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { arielSpectacularSinger } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import {
  goofyKnightForADay,
  ladyTremaineImperiousQueen,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import {
  flynnRiderFrenemy,
  hadesMeticulousPlotter,
  nessusRiverGuardian,
  sisuWiseFriend,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Flynn Rider - Frenemy", () => {
  describe("**NARROW ADVANTAGE** At the start of your turn, if you have a character in play with more {S}than each opposing character, gain 3 lore.", () => {
    it("meets the condition", () => {
      const testStore = new TestStore(
        {
          play: [hadesMeticulousPlotter, sisuWiseFriend],
          deck: 1,
        },
        {
          play: [flynnRiderFrenemy, nessusRiverGuardian],
          deck: 2,
        },
      );

      expect(testStore.getPlayerLore("player_two")).toEqual(0);
      expect(testStore.getPlayerLore("player_one")).toEqual(0);

      // testStore.passTurn();
      // expect(testStore.getPlayerLore("player_one")).toEqual(0);
      // expect(testStore.getPlayerLore("player_two")).toEqual(3);
      //
      // testStore.passTurn();
      // expect(testStore.getPlayerLore("player_one")).toEqual(0);
      // expect(testStore.getPlayerLore("player_two")).toEqual(3);
      //
      // testStore.passTurn();
      // expect(testStore.getPlayerLore("player_one")).toEqual(0);
      // expect(testStore.getPlayerLore("player_two")).toEqual(6);
    });

    it("does NOT meet the condition", () => {
      const testStore = new TestStore(
        {
          play: [hadesMeticulousPlotter, nessusRiverGuardian],
          deck: 2,
        },
        {
          play: [flynnRiderFrenemy, sisuWiseFriend],
          deck: 1,
        },
      );

      expect(testStore.getPlayerLore("player_one")).toEqual(0);
      expect(testStore.getPlayerLore("player_two")).toEqual(0);

      testStore.passTurn();
      expect(testStore.getPlayerLore("player_one")).toEqual(0);
      expect(testStore.getPlayerLore("player_two")).toEqual(0);

      testStore.passTurn();
      expect(testStore.getPlayerLore("player_one")).toEqual(0);
      expect(testStore.getPlayerLore("player_two")).toEqual(0);

      testStore.passTurn();
      expect(testStore.getPlayerLore("player_one")).toEqual(0);
      expect(testStore.getPlayerLore("player_two")).toEqual(0);
    });
  });
});

describe("Regression Test", () => {
  it("Should trigger when alone", async () => {
    const testEngine = new TestEngine(
      {
        play: [flynnRiderFrenemy],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    await testEngine.passTurn();

    expect(testEngine.getPlayerLore("player_one")).toEqual(0);
    expect(testEngine.getPlayerLore("player_two")).toEqual(0);

    await testEngine.passTurn();

    expect(testEngine.getPlayerLore("player_one")).toEqual(3);
    expect(testEngine.getPlayerLore("player_two")).toEqual(0);
  });

  it("Should trigger when alone", async () => {
    const testEngine = new TestEngine(
      {
        deck: 2,
      },
      {
        play: [flynnRiderFrenemy],
        deck: 2,
      },
    );

    await testEngine.passTurn();

    expect(testEngine.getPlayerLore("player_one")).toEqual(0);
    expect(testEngine.getPlayerLore("player_two")).toEqual(3);
  });

  it("Should not trigger on tie, after being removed", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: ladyTremaineImperiousQueen.cost,
        hand: [ladyTremaineImperiousQueen],
        play: [arielSpectacularSinger],
        deck: 2,
      },
      {
        play: [flynnRiderFrenemy, goofyKnightForADay],
        deck: 2,
      },
    );

    await testEngine.playCard(ladyTremaineImperiousQueen);

    testEngine.changeActivePlayer("player_two");
    await testEngine.resolveTopOfStack({ targets: [flynnRiderFrenemy] });
    expect(testEngine.getCardModel(flynnRiderFrenemy).zone).toEqual("discard");

    testEngine.changeActivePlayer("player_one");
    await testEngine.passTurn();

    expect(testEngine.getPlayerLore("player_one")).toEqual(0);
    expect(testEngine.getPlayerLore("player_two")).toEqual(0);

    await testEngine.passTurn();

    expect(testEngine.getPlayerLore("player_one")).toEqual(0);
    expect(testEngine.getPlayerLore("player_two")).toEqual(0);
  });

  it("Tie is not a a win", () => {
    const testStore = new TestStore(
      {
        play: [arielSpectacularSinger],
        deck: 2,
      },
      {
        play: [flynnRiderFrenemy],
        deck: 1,
      },
    );

    expect(testStore.getPlayerLore("player_one")).toEqual(0);
    expect(testStore.getPlayerLore("player_two")).toEqual(0);

    testStore.passTurn();
    expect(testStore.getPlayerLore("player_one")).toEqual(0);
    expect(testStore.getPlayerLore("player_two")).toEqual(0);

    testStore.passTurn();
    expect(testStore.getPlayerLore("player_one")).toEqual(0);
    expect(testStore.getPlayerLore("player_two")).toEqual(0);

    testStore.passTurn();
    expect(testStore.getPlayerLore("player_one")).toEqual(0);
    expect(testStore.getPlayerLore("player_two")).toEqual(0);
  });
});
