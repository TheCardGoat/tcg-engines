import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { fang } from "./fang.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { fealty } from "../tokens/fealty.ts";

/**
 * Hero behavior acceptance test — Fang (FNG001).
 *
 * Printed: Whenever you hit a marked hero, create a Fealty token.
 * If you control 3 or more Fealty tokens, dagger attacks cost you {r} less
 * to activate.
 */

const opponentHero = dash;

describe("fang (FNG001)", () => {
  it("happy: hitting a marked hero creates a Fealty token", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, hand: [], life: 20, marked: true, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.activate(obsidianFireVein);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(opponentHero)).toHaveLife(19);
    expectFabPlayer(Fang).toHaveTokenCount("fealty", 1);
  });

  it("boundary: hitting an unmarked hero does NOT create a Fealty token", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.activate(obsidianFireVein);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(opponentHero)).toHaveLife(19);
    expectFabPlayer(Fang).toHaveTokenCount("fealty", 0);
  });

  it("boundary: 2 Fealty does not discount the dagger (needs 1{r} at 0 RP)", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        arena: [fealty, fealty],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    const rejection = Fang.expectActivationRejected(obsidianFireVein);
    expect(rejection.errorCode).toBe("insufficient_activation_assets");
    expectCombat(game).toBeClosed();
  });

  it("timing: with 3 Fealty the dagger activates for 0{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        arena: [fealty, fealty, fealty],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.activate(obsidianFireVein);
    game.passBoth();

    expectCombat(game).toBeOpen().toHaveAttackPower(1);
    expectFabPlayer(Fang).toHaveResourceCount(0);
  });

  it("timing: 3 Fealty leaves a seeded 1{r} unspent", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        arena: [fealty, fealty, fealty],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.activate(obsidianFireVein);
    game.passBoth();

    expectCombat(game).toBeOpen();
    expectFabPlayer(Fang).toHaveResourceCount(1);
  });
});
