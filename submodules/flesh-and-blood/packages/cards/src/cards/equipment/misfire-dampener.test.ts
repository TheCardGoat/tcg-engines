import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { throttleRed } from "../actions/throttle.ts";
import { flashBoltYellow } from "../instants/flash-bolt.ts";
import { misfireDampener } from "./misfire-dampener.ts";

/**
 * Misfire Dampener — Mechanologist Arms d1 Blade Break.
 *
 * Printed: "Instant - Destroy this: Prevent the next 1 arcane damage that
 * would be dealt to you this turn. If you've boosted this turn, instead
 * prevent the next 2. Blade Break"
 */

describe("Misfire Dampener AAA", () => {
  it("happy: after boosting this turn, destroying the dampener prevents the next 2 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [misfireDampener],
        hand: [throttleRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: blazeFiremind,
        hand: [flashBoltYellow],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Dash.play(throttleRed, { boost: true });
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    // Still the same turn: the boost stamps "boosted this turn".
    game.helpers.passPriorityTo(Blaze);
    Blaze.play(flashBoltYellow, { target: Dash.id });
    Blaze.pass();
    Dash.activate(misfireDampener);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(20); // 2 arcane - 2 prevented
    expectFabCard(Dash, misfireDampener).toBeIn("graveyard");
  });

  it("boundary: without a boost this turn, the destroy prevents only 1 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [misfireDampener],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: blazeFiremind,
        hand: [flashBoltYellow],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    game.helpers.passPriorityTo(Blaze);
    Blaze.play(flashBoltYellow, { target: Dash.id });
    Blaze.pass();
    Dash.activate(misfireDampener);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(19); // 2 arcane - 1 prevented
    expectFabCard(Dash, misfireDampener).toBeIn("graveyard");
  });
});
