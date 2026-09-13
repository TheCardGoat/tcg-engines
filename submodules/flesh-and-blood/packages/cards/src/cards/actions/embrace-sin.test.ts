import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { woundingBlowBlue } from "./wounding-blow.ts";
import { runechantOfGreedYellow } from "../instants/runechant-of-greed.ts";
import { runechantOfPrideYellow } from "../instants/runechant-of-pride.ts";
import { poundOfFleshBlue } from "./pound-of-flesh.ts";
import { nimblismBlue } from "./nimblism.ts";
import { embraceSinYellow } from "./embrace-sin.ts";

/**
 * Embrace Sin (IAR120) — Shadow Runeblade Action, cost 1, go again.
 *
 * Printed: "Your next attack this turn gets +2{p}.\nYou may play an aura with
 * Runechant in its name from your banished zone this turn.\nGo again"
 */

describe("Embrace Sin (IAR120) AAA", () => {
  it("happy: an eligible aura banished after resolution is playable this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [embraceSinYellow, poundOfFleshBlue, runechantOfGreedYellow, woundingBlowBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.play(embraceSinYellow);
    game.untilIdle();

    Viserai.play(poundOfFleshBlue);
    game.untilIdle({ entityTargets: "pause" });
    Viserai.target(runechantOfGreedYellow);
    game.untilIdle({ entityTargets: "pause" });
    Dash.target(nimblismBlue);
    game.untilIdle();
    expectFabCard(Viserai, runechantOfGreedYellow).toBeIn("banished");

    Viserai.play(runechantOfGreedYellow, { from: "banished" });
    game.untilIdle();
    expectFabCard(Viserai, runechantOfGreedYellow).toBeIn("arena");
  });

  it("happy: the next attack gets the printed +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [embraceSinYellow, woundingBlowBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(embraceSinYellow);
    game.untilIdle();
    Viserai.playAttack(woundingBlowBlue);
    expectCombat(game).toHaveAttackPower(4); // 2 base + printed +2
  });

  it("happy: every eligible banished Runechant aura may be played this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [embraceSinYellow],
        banished: [runechantOfGreedYellow, runechantOfPrideYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(embraceSinYellow);
    game.untilIdle();

    Viserai.play(runechantOfGreedYellow, { from: "banished" });
    game.untilIdle();
    Viserai.play(runechantOfPrideYellow, { from: "banished" });
    game.untilIdle();

    expectFabCard(Viserai, runechantOfGreedYellow).toBeIn("arena");
    expectFabCard(Viserai, runechantOfPrideYellow).toBeIn("arena");
  });

  it("boundary: the permission does not allow matching auras from the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [embraceSinYellow],
        graveyard: [runechantOfGreedYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(embraceSinYellow);
    game.untilIdle();

    expectFabUnplayable(
      () => Viserai.play(runechantOfGreedYellow, { from: "graveyard" }),
      /requires a migrated permission effect/,
    );
    expectFabCard(Viserai, runechantOfGreedYellow).toBeIn("graveyard");
  });

  it("boundary: the permission does not allow a non-Runechant card from banished", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [embraceSinYellow],
        banished: [runechantOfGreedYellow, poundOfFleshBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(embraceSinYellow);
    game.untilIdle();
    Viserai.play(runechantOfGreedYellow, { from: "banished" });
    game.untilIdle();

    expectFabUnplayable(
      () => Viserai.play(poundOfFleshBlue, { from: "banished" }),
      /requires a migrated permission effect/,
    );
    expectFabCard(Viserai, poundOfFleshBlue).toBeIn("banished");
  });

  it("boundary: without Embrace Sin the banished Runechant aura is not playable", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [],
        banished: [runechantOfGreedYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    expectFabUnplayable(
      () => Viserai.play(runechantOfGreedYellow, { from: "banished" }),
      /requires a migrated permission effect/,
    );
    expectFabCard(Viserai, runechantOfGreedYellow).toBeIn("banished");
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("timing: the play permission expires with the turn", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [embraceSinYellow],
        banished: [runechantOfGreedYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    // Turn 1: grant the permission but do not exercise it.
    Viserai.play(embraceSinYellow);
    game.untilIdle();
    Viserai.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabUnplayable(
      () => Viserai.play(runechantOfGreedYellow, { from: "banished" }),
      /requires a migrated permission effect/,
    );
    expectFabCard(Viserai, runechantOfGreedYellow).toBeIn("banished");
  });
});
