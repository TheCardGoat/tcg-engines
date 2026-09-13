import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  seedPitchedPower6,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { bearHugRed } from "./bear-hug.ts";

/**
 * Bear Hug, Red (PEN012) — Brute Attack Action.
 *
 * Printed: "Play this only if you've pitched a card with 6 or more {p} this
 * turn." (cost 2, 7{p}, 3{d})
 */

describe("Bear Hug (PEN012) AAA", () => {
  it("happy: after pitching a 6+{p} card this turn, this attacks at 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bearHugRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    seedPitchedPower6(game, rhinar);

    Rhinar.attackWith(bearHugRed);
    expectCombat(game).toHaveAttackPower(7);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });

  it("boundary: without pitching a 6+{p} card this turn, the play is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bearHugRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    expect(() => Rhinar.attackWith(bearHugRed)).toThrow();
    expectFabCard(Rhinar, bearHugRed).toBeIn("hand");
  });

  it("timing: a legal play after the 6+ pitch still spends 2{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bearHugRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    seedPitchedPower6(game, rhinar);

    Rhinar.attackWith(bearHugRed);
    expectFabPlayer(Rhinar).toHaveResourceCount(0);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Rhinar, bearHugRed).toBeIn("graveyard");
  });
});
