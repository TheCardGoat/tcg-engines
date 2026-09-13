import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { cerebellumProcessorBlue } from "./cerebellum-processor.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { snatchRed } from "./snatch.ts";
import { ratchetUpRed } from "./ratchet-up.ts";

/**
 * Ratchet Up, Red (EVO105) — Mechanologist Action Attack, 5{p}/2{d}.
 * Printed: If an item you control has been destroyed this turn, action cards
 * get -1{d} while defending this. Galvanize — When this defends, you may
 * destroy an item you control. If you do, this gets +2{d}.
 */

describe("Ratchet Up (EVO105) AAA", () => {
  it("happy: destroying an item you control while defending grants +2{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        hand: [ratchetUpRed],
        arena: [cerebellumProcessorBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(ratchetUpRed);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    Dash.target(cerebellumProcessorBlue);

    expectFabCard(Dash, cerebellumProcessorBlue).toBeIn("graveyard");
    expectFabCard(Dash, ratchetUpRed).toHaveDefense(4);
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: declining galvanize leaves printed 2{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        hand: [ratchetUpRed],
        arena: [cerebellumProcessorBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(ratchetUpRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, cerebellumProcessorBlue).toBeIn("arena");
    expectFabCard(Dash, ratchetUpRed).toHaveDefense(2);
    expectFabPlayer(Dash).toHaveLife(18);
  });

  it("timing: without a destroyed item this turn the attack is printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [ratchetUpRed],
        deck: 6,
        resourcePoints: 1,
      },
      { hero: bravo, hand: [brutalAssaultBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).playAttack(ratchetUpRed, { stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
  });
});
