import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
  expectFabCard,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { ironrotHelm } from "../equipment/ironrot-helm.ts";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { riledUpRed } from "./riled-up.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { nimblismBlue } from "./nimblism.ts";
import {
  barragingBeatdownRed,
  barragingBeatdownYellow,
  barragingBeatdownBlue,
} from "./barraging-beatdown.ts";

// One opponent card is intimidated before the attack: two starting hand cards
// leave one defender; three leave two. No six-power discard modifies Riled Up.
describe("Barraging Beatdown attack modifier", () => {
  for (const [color, card, bonus] of [
    ["red", barragingBeatdownRed, 4],
    ["yellow", barragingBeatdownYellow, 3],
    ["blue", barragingBeatdownBlue, 2],
  ] as const) {
    it.each([1, 2])(
      `${color}: next Brute attack against %i non-equipment defenders`,
      (defenders) => {
        const game = FabTestEngine.start(
          {
            hero: rhinar,
            hand: [card, riledUpRed],
            resourcePoints: 3,
            deck: [nimblismBlue, nimblismBlue],
          },
          {
            hero: dash,
            hand: Array.from({ length: defenders + 1 }, () => nimblismBlue),
            deck: [nimblismBlue, nimblismBlue],
          },
          { ...FAB_MANUAL_HARNESS, firstPlayer: rhinar },
        );
        const Rhinar = game.as(rhinar);
        const Dash = game.as(dash);
        Rhinar.play(card);
        game.untilIdle();
        Rhinar.playAttack(riledUpRed);
        expectCombat(game).toHaveAttackPower(7 + bonus);
        Dash.defendWith(...Array.from({ length: defenders }, () => nimblismBlue));
        expectCombat(game).toHaveAttackPower(defenders === 1 ? 7 + bonus : 7);
        game.closeCombat();
        expectFabPlayer(Dash).toHaveLife(defenders === 1 ? 15 - bonus : 17);
        expectFabPlayer(Rhinar).toHaveAP(0);
      },
    );

    it(`${color}: a Generic attack does not receive the Brute modifier`, () => {
      const game = FabTestEngine.start(
        {
          hero: rhinar,
          hand: [card, brutalAssaultBlue],
          resourcePoints: 2,
          deck: [nimblismBlue, nimblismBlue],
        },
        { hero: dash, hand: [], deck: [nimblismBlue, nimblismBlue] },
        { ...FAB_MANUAL_HARNESS, firstPlayer: rhinar },
      );
      const Rhinar = game.as(rhinar);
      Rhinar.play(card);
      game.untilIdle();
      Rhinar.playAttack(brutalAssaultBlue);
      expectCombat(game).toHaveAttackPower(4);
      game.closeCombat();
      expectFabPlayer(game.as(dash)).toHaveLife(16);
    });
  }
});

// The printed Intimidate precedes the granted next-attack ability in every pitch variant.
describe("Barraging Beatdown intimidate", () => {
  for (const [color, card] of [
    ["red", barragingBeatdownRed],
    ["yellow", barragingBeatdownYellow],
    ["blue", barragingBeatdownBlue],
  ] as const) {
    it(`${color} banishes the opposing hand card face-down until end phase`, () => {
      const game = FabTestEngine.start(
        { hero: rhinar, hand: [card], resourcePoints: 0, deck: [nimblismBlue, nimblismBlue] },
        { hero: dash, hand: [brutalAssaultBlue], deck: [nimblismBlue, nimblismBlue] },
        { ...FAB_MANUAL_HARNESS, firstPlayer: rhinar },
      );
      const Rhinar = game.as(rhinar);
      const Dash = game.as(dash);
      Rhinar.play(card);
      game.untilIdle();
      expectFabCard(Dash, brutalAssaultBlue).toBeBanished().toBeFaceDown();
      expectFabPlayer(Dash).toHaveHandCount(0);
      expectFabPlayer(Rhinar).toHaveAP(1);
      Rhinar.endTurn();
      expectFabCard(Dash, brutalAssaultBlue).toBeIn("hand");
    });
  }
});

describe("Barraging Beatdown ignores equipment in its defender count", () => {
  it.each([0, 1, 2])("one equipment plus %i non-equipment defenders", (defenders) => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [barragingBeatdownRed, riledUpRed],
        resourcePoints: 3,
        deck: [nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        head: [ironrotHelm],
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        deck: [nimblismBlue, nimblismBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: rhinar },
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);
    Rhinar.play(barragingBeatdownRed);
    game.untilIdle();
    Rhinar.playAttack(riledUpRed);
    Dash.defendWith(ironrotHelm, ...Array.from({ length: defenders }, () => nimblismBlue));
    expectCombat(game).toHaveAttackPower(defenders < 2 ? 11 : 7);
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(defenders < 2 ? 10 + 2 * defenders : 18);
  });
});
