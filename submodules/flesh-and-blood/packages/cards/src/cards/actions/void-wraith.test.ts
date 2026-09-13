import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { voidWraithRed } from "./void-wraith.ts";

/**
 * Void Wraith, Red (MON209) — Shadow Attack Action.
 *
 * Printed: "You may play Void Wraith from your banished zone.\nBlood Debt"
 * (cost 2, 5{p}, 3{d})
 */

describe("Void Wraith (MON209) AAA", () => {
  it("happy: the permission plays the card straight from the banished zone at printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [],
        banished: [voidWraithRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.attackWith(voidWraithRed, { from: "banished" });
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Chane, voidWraithRed).toBeIn("graveyard");
  });

  it("boundary: the permission only extends playability — the hand copy is still an ordinary legal play", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [voidWraithRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.attackWith(voidWraithRed);
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Chane, voidWraithRed).toBeIn("graveyard");
  });

  it("timing: Blood Debt — a copy left in banished costs 1 life at the end phase", () => {
    const game = FabTestEngine.start(
      { hero: chane, hand: [], banished: [voidWraithRed], life: 20, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.endTurn();
    game.helpers.untilIdle();
    expectFabPlayer(Chane).toHaveLife(19);
  });
});
