import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { ragingOnslaughtRed } from "./raging-onslaught.ts";
import { seedsOfAgonyRed } from "./seeds-of-agony.ts";
import { seedsOfAgonyBlue } from "./seeds-of-agony.ts";

describe("Seeds of Agony (CHN014) AAA", () => {
  it("happy: the next cost-0 attack also deals 1 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [snatchRed],
        banished: [seedsOfAgonyRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    // a1 permission: play Seeds straight out of the banished zone; its
    // printed go again refunds the action point.
    Chane.play(seedsOfAgonyRed, { from: "banished" });
    game.helpers.resolveUntilIdle();

    Chane.playAttack(snatchRed, { stopAt: "on-attack" });
    const wait = game.waitState();
    if (wait.kind === "decision" && wait.decision.kind === "entity-target") {
      Chane.target(Dash);
    }
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabPlayer(Chane).toHaveAP(1); // Seeds refunded its own play
  });

  it("boundary: a cost-3 attack action does not gain the arcane trigger", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [seedsOfAgonyRed, ragingOnslaughtRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(seedsOfAgonyRed);
    game.helpers.resolveUntilIdle();

    Chane.playAttack(ragingOnslaughtRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(13); // printed 7{p} only, no ping
    expectFabPlayer(Chane).toHaveAP(1);
  });

  it("timing: the grant expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [seedsOfAgonyRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(seedsOfAgonyRed);
    game.helpers.resolveUntilIdle();
    Chane.endTurn();
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.helpers.untilIdle();

    // Next turn's qualifying attack hits for its printed 4{p} only —
    // the latch expired with the turn.
    Chane.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("happy: the next cost-0 attack also deals 1 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [snatchRed],
        banished: [seedsOfAgonyBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(seedsOfAgonyBlue, { from: "banished" });
    game.helpers.resolveUntilIdle();
    Chane.playAttack(snatchRed, { stopAt: "on-attack" });
    const wait = game.waitState();
    if (wait.kind === "decision" && wait.decision.kind === "entity-target") {
      Chane.target(Dash);
    }
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabPlayer(Chane).toHaveAP(1);
  });
});
