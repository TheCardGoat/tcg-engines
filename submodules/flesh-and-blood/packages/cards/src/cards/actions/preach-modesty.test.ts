import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zen } from "../heroes/zen.ts";
import { preachModestyRed } from "./preach-modesty.ts";

/**
 * Preach Modesty Red (SEA252) — Ninja Aura.
 *
 * Printed: Enters with a balance counter. At the beginning of your action
 * phase, destroy this unless you remove a balance counter from it.
 * Hero abilities can't create cards.
 */

describe("Preach Modesty (SEA252) AAA", () => {
  it("happy: hero Instant create is skipped while this is in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [preachModestyRed],
        chiPoints: 3,
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(preachModestyRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Zen, preachModestyRed).toBeIn("arena").toHaveCounters(1, "balance");

    Zen.activate(zen);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Zen.zone("hand").filter((id) => id.startsWith("token:crouching-tiger"))).toHaveLength(0);
  });

  it("boundary: without Preach, the same hero Instant creates a Crouching Tiger", () => {
    const game = FabTestEngine.start(
      { hero: zen, hand: [], chiPoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.activate(zen);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Zen.zone("hand").filter((id) => id.startsWith("token:crouching-tiger"))).toHaveLength(1);
  });

  it("timing: after this is destroyed, the hero Instant can create again", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [preachModestyRed],
        chiPoints: 3,
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(preachModestyRed);
    game.helpers.resolveUntilIdle();
    Zen.endTurn();
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expect(Zen.cardsIn("arena", preachModestyRed)).toHaveLength(0);

    Zen.activate(zen);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Zen.zone("hand").filter((id) => id.startsWith("token:crouching-tiger"))).toHaveLength(1);
  });
});
