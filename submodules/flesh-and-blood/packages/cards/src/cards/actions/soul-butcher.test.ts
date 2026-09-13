import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { soulButcherRed } from "./soul-butcher.ts";

/**
 * Soul Butcher, Red (DTD181) — Shadow Action - Attack, cost 2, 6{p}, 2{d}.
 * Printed: "If the defending hero has 1 or more cards in their soul, this
 * gets +2{p}.\nBlood Debt"
 */

describe("Soul Butcher (DTD181) AAA", () => {
  it("happy: defending hero with a soul card grants +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [soulButcherRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, soul: [snatchRed], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(chane).attackWith(soulButcherRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: empty defender soul stays at printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [soulButcherRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(chane).attackWith(soulButcherRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(6);
  });

  it("timing: Blood Debt — an unplayed banished copy drains 1 life at the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [],
        banished: [soulButcherRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    Chane.endTurn();
    game.helpers.untilIdle();
    expectFabPlayer(Chane).toHaveLife(19);
    expectFabCard(Chane, soulButcherRed).toBeBanished();
  });
});
