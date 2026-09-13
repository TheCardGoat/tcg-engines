import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { fangDracaiOfBlades } from "./fang-dracai-of-blades.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { fealty } from "../tokens/fealty.ts";

/**
 * Fang, Dracai of Blades (HNT098) — Royal Draconic Warrior Hero.
 *
 * Printed: Whenever you hit a marked hero, create a Fealty token.
 * If you control 3 or more Fealty tokens, dagger attacks cost you {r} less to activate.
 */

describe("Fang, Dracai of Blades (HNT098) AAA", () => {
  it("happy: hitting a marked hero creates a Fealty token", () => {
    const game = FabTestEngine.start(
      {
        hero: fangDracaiOfBlades,
        weapon1: [obsidianFireVein],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], marked: true, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fangDracaiOfBlades);

    Fang.activate(obsidianFireVein);
    game.helpers.resolveRestOfCombat();

    expect(Fang.zone("arena")).toContain("token:fealty");
  });

  it("boundary: hitting an unmarked hero does not create Fealty", () => {
    const game = FabTestEngine.start(
      {
        hero: fangDracaiOfBlades,
        weapon1: [obsidianFireVein],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fangDracaiOfBlades);

    Fang.activate(obsidianFireVein);
    game.helpers.resolveRestOfCombat();

    expect(Fang.zone("arena")).not.toContain("token:fealty");
  });

  it("boundary: 0 Fealty does not discount the dagger", () => {
    const game = FabTestEngine.start(
      {
        hero: fangDracaiOfBlades,
        weapon1: [obsidianFireVein],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fangDracaiOfBlades);
    const rejection = Fang.expectActivationRejected(obsidianFireVein);
    expect(rejection.errorCode).toBe("insufficient_activation_assets");
    expectCombat(game).toBeClosed();
  });

  it("boundary: 2 Fealty does not discount the dagger", () => {
    const game = FabTestEngine.start(
      {
        hero: fangDracaiOfBlades,
        weapon1: [obsidianFireVein],
        arena: [fealty, fealty],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fangDracaiOfBlades);

    const rejection = Fang.expectActivationRejected(obsidianFireVein);
    expect(rejection.errorCode).toBe("insufficient_activation_assets");
    expectCombat(game).toBeClosed();
  });

  it("timing: with 3 Fealty a dagger activates for 0{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: fangDracaiOfBlades,
        weapon1: [obsidianFireVein],
        arena: [fealty, fealty, fealty],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fangDracaiOfBlades);

    Fang.activate(obsidianFireVein);
    game.passBoth();

    expectCombat(game).toBeOpen();
    expectFabPlayer(Fang).toHaveResourceCount(0);
  });

  it("boundary: 2 Fealty still spends a seeded 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: fangDracaiOfBlades,
        weapon1: [obsidianFireVein],
        arena: [fealty, fealty],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fangDracaiOfBlades);

    Fang.activate(obsidianFireVein);
    game.passBoth();

    expectCombat(game).toBeOpen();
    expectFabPlayer(Fang).toHaveResourceCount(0);
  });

  it("timing: 3 Fealty leaves a seeded 1{r} unspent", () => {
    const game = FabTestEngine.start(
      {
        hero: fangDracaiOfBlades,
        weapon1: [obsidianFireVein],
        arena: [fealty, fealty, fealty],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fangDracaiOfBlades);

    Fang.activate(obsidianFireVein);
    game.passBoth();

    expectCombat(game).toBeOpen();
    expectFabPlayer(Fang).toHaveResourceCount(1);
  });
});
