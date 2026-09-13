import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { jiveBlue } from "./jive.ts";
import { offBeatBlue } from "./off-beat.ts";

/**
 * Off Beat (blue) — Warrior Action, cost 0, Sharpen, go again.
 *
 * Printed: "Destroy up to 1 Blade Dance and/or Flurry token. Sharpen target
 * sword you control for each token destroyed this way.\nGo again"
 *
 * Sharpen times is the destroyed-this-way total (not "1 plus that count").
 */

describe("Off Beat (MPW066) AAA", () => {
  it("happy: the targeted Blade Dance token is destroyed and the action refunds its point", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [jiveBlue, offBeatBlue],
        weapon1: [dawnblade],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(jiveBlue);
    game.untilIdle();
    expectFabPlayer(Dori).toHaveTokenCount("blade-dance", 1);

    Dori.play(offBeatBlue);
    game.untilIdle({ entityTargets: "pause" });
    Dori.target(fabToken("blade-dance"));
    game.untilIdle();

    expectFabPlayer(Dori).toHaveTokenCount("blade-dance", 0);
    expectFabCard(Dori, dawnblade).toHavePower(4);
    expectFabPlayer(Dori).toHaveAP(1);
  });

  it("boundary: with no tokens nothing is destroyed and no decision opens", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [offBeatBlue],
        weapon1: [dawnblade],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    // "Up to" with no legal token never opens a decision; the drain completes.
    Dori.play(offBeatBlue);
    game.untilIdle();

    expectFabPlayer(Dori).toHaveTokenCount("blade-dance", 0);
    expectFabCard(Dori, dawnblade).toHavePower(3);
    expectFabPlayer(Dori).toHaveAP(1);
  });
});
