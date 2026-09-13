import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { dash } from "../heroes/dash.ts";
import { heartbeatOfCandleholdBlue } from "../actions/heartbeat-of-candlehold.ts";
import { verdance } from "../heroes/verdance.ts";
import { thistleBloomLifeYellow } from "../actions/thistle-bloom-life.ts";
import { fertileGroundBlue } from "./fertile-ground.ts";
import { rampantGrowthLifeYellow } from "./rampant-growth-life.ts";

/**
 * Rampant Growth // Life (ROS017) — Wizard Instant // Earth Instant. Meld.
 *
 * Printed: Amp X, where X is the total {h} you've gained this turn. // Gain 1{h}
 *
 * Amp is the live `amp` leaf; X is `count` `life-gained-this-turn`. Meld is
 * right-then-left (`playMethod: { kind: "meld" }`).
 */

describe("Rampant Growth // Life (ROS017) AAA", () => {
  it("happy: Amp X after gaining 3{h} adds 3 to Voltic Bolt", () => {
    const game = FabTestEngine.start(
      {
        hero: verdance,
        hand: [heartbeatOfCandleholdBlue, rampantGrowthLifeYellow, volticBoltRed],
        resourcePoints: 3,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Verdance = game.as(verdance);
    const Dash = game.as(dash);

    Verdance.play(heartbeatOfCandleholdBlue);
    game.untilIdle({ ordering: "listed" });
    Verdance.play(rampantGrowthLifeYellow, { playMethod: { kind: "face", face: "left" } });
    game.untilIdle({ ordering: "listed" });
    Verdance.play(volticBoltRed, { target: Dash.id });
    game.untilIdle({ ordering: "listed" });

    expectFabPlayer(Verdance).toHaveLife(23);
    expectFabPlayer(Dash).toHaveLife(12);
    expectFabCard(Verdance, rampantGrowthLifeYellow).toBeIn("graveyard");
  });

  it("boundary: Amp with no life gained this turn does not raise Voltic Bolt", () => {
    const game = FabTestEngine.start(
      {
        hero: verdance,
        hand: [rampantGrowthLifeYellow, volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Verdance = game.as(verdance);
    const Dash = game.as(dash);

    Verdance.play(rampantGrowthLifeYellow, { playMethod: { kind: "face", face: "left" } });
    game.untilIdle({ ordering: "listed" });
    Verdance.play(volticBoltRed, { target: Dash.id });
    game.untilIdle({ ordering: "listed" });

    expectFabPlayer(Verdance).toHaveLife(20);
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("timing: melded Life's 1{h} is counted by the following Amp", () => {
    const game = FabTestEngine.start(
      {
        hero: verdance,
        hand: [rampantGrowthLifeYellow, volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Verdance = game.as(verdance);
    const Dash = game.as(dash);

    Verdance.play(rampantGrowthLifeYellow, { playMethod: { kind: "meld" } });
    game.passBoth();
    game.passBoth();
    game.untilIdle({ ordering: "listed" });
    Verdance.play(volticBoltRed, { target: Dash.id });
    game.untilIdle({ ordering: "listed" });

    expectFabPlayer(Verdance).toHaveLife(21);
    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("happy: keyword Amp boosts Verdance's Hero-sourced arcane damage", () => {
    const game = FabTestEngine.start(
      {
        hero: verdance,
        hand: [fertileGroundBlue, rampantGrowthLifeYellow, thistleBloomLifeYellow],
        banished: [
          heartbeatOfCandleholdBlue,
          heartbeatOfCandleholdBlue,
          heartbeatOfCandleholdBlue,
          heartbeatOfCandleholdBlue,
        ],
        resourcePoints: 2,
        actionPoints: 1,
        life: 16,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Verdance = game.as(verdance);
    const Dash = game.as(dash);

    Verdance.play(fertileGroundBlue);
    game.untilIdle({ optionals: "accept", entityTargets: "pause", ordering: "listed" });
    Verdance.target(Dash);
    game.untilIdle({ ordering: "listed" });

    Verdance.play(rampantGrowthLifeYellow, { playMethod: { kind: "face", face: "left" } });
    game.untilIdle({ ordering: "listed" });
    Verdance.play(thistleBloomLifeYellow, { playMethod: { kind: "face", face: "right" } });
    game.untilIdle({ optionals: "accept", entityTargets: "pause", ordering: "listed" });
    Verdance.target(Dash);
    game.untilIdle({ ordering: "listed" });

    expectFabPlayer(Verdance).toHaveLife(20);
    expectFabPlayer(Dash).toHaveLife(15);
  });
});
