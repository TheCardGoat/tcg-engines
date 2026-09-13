import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { iraCrimsonHaze } from "../heroes/ira-crimson-haze.ts";
import { edgeOfAutumn } from "../weapons/edge-of-autumn.ts";
import { zephyrNeedle } from "../weapons/zephyr-needle.ts";
import { robeOfAutumnSFall } from "./robe-of-autumn-s-fall.ts";

/**
 * Robe of Autumn's Fall (ASR004) — Ninja Chest, Arcane Barrier 1.
 *
 * Printed: "When an Edge of Autumn you control hits, you may destroy this. If
 * you do, gain {r}. Arcane Barrier 1"
 */

describe("Robe of Autumn's Fall (ASR004) AAA", () => {
  it("happy: when Edge of Autumn hits, destroying the robe gains {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        weapon1: [edgeOfAutumn],
        chest: [robeOfAutumnSFall],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);
    const Dash = game.as(dash);

    Ira.activateAttack(edgeOfAutumn);
    Dash.defendWith();
    game.closeCombat({ optionals: "accept" });

    expectFabCard(Ira, robeOfAutumnSFall).toBeIn("graveyard");
    expectFabPlayer(Ira).toHaveResourceCount(1); // 1 attack - 1 hit gain
    expectFabPlayer(Dash).toHaveLife(19); // 1{p} hit
  });

  it("boundary: declining the optional keeps the robe and gains nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        weapon1: [edgeOfAutumn],
        chest: [robeOfAutumnSFall],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);
    const Dash = game.as(dash);

    Ira.activateAttack(edgeOfAutumn);
    Dash.defendWith();
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Ira, robeOfAutumnSFall).toBeIn("chest");
    expectFabPlayer(Ira).toHaveResourceCount(0);
  });

  it("timing: a different weapon hitting never triggers the robe", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        weapon1: [zephyrNeedle],
        chest: [robeOfAutumnSFall],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);
    const Dash = game.as(dash);

    Ira.activateAttack(zephyrNeedle);
    Dash.defendWith();
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Ira, robeOfAutumnSFall).toBeIn("chest");
    expectFabPlayer(Ira).toHaveResourceCount(0);
    expectFabPlayer(Dash).toHaveLife(18); // 2{p} hit
  });
});
