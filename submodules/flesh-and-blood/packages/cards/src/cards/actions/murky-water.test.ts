import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { riptide } from "../heroes/riptide.ts";
import { boulderTrapYellow } from "../defense-reactions/boulder-trap.ts";
import { pendulumTrapYellow } from "../defense-reactions/pendulum-trap.ts";
import { tarpitTrapYellow } from "../defense-reactions/tarpit-trap.ts";

import { pulseOfIsenloftBlue } from "../defense-reactions/pulse-of-isenloft.ts";
import { murkyWaterRed } from "./murky-water.ts";

/**
 * Murky Water (MST233) — Riptide spec Arrow. Red cost 2, 6{p}/3{d}. Dominate.
 * When this hits, you may banish 3 traps with cost 0+ from GY face-down; if you do, put one at random into arsenal.
 */

describe("Murky Water (MST233) AAA", () => {
  it("happy: when this hits, banish 3 traps from GY and load one into arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: riptide,
        weapon1: [deathDealer],
        arsenal: [{ card: murkyWaterRed, state: { faceDown: false } }],
        graveyard: [boulderTrapYellow, pendulumTrapYellow, tarpitTrapYellow],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Riptide = game.as(riptide);

    Riptide.playAttack(murkyWaterRed, { from: "arsenal" });
    game.closeCombat({ optionals: "accept", entityTargets: "maximum", ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expect(Riptide.zone("banished").length).toBeGreaterThanOrEqual(2);
  });

  it("boundary: a blocked miss does not banish traps from the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: riptide,
        weapon1: [deathDealer],
        arsenal: [{ card: murkyWaterRed, state: { faceDown: false } }],
        graveyard: [boulderTrapYellow, pendulumTrapYellow, tarpitTrapYellow],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [pulseOfIsenloftBlue],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Riptide = game.as(riptide);
    const Dash = game.as(dash);

    Riptide.playAttack(murkyWaterRed, { from: "arsenal" });
    game.toReaction("defender");
    Dash.play(pulseOfIsenloftBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Riptide, boulderTrapYellow).toBeIn("graveyard");
  });

  it("timing: declining the optional leaves the traps in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: riptide,
        weapon1: [deathDealer],
        arsenal: [{ card: murkyWaterRed, state: { faceDown: false } }],
        graveyard: [boulderTrapYellow, pendulumTrapYellow, tarpitTrapYellow],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Riptide = game.as(riptide);

    Riptide.playAttack(murkyWaterRed, { from: "arsenal" });
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabCard(Riptide, boulderTrapYellow).toBeIn("graveyard");
    expect(Riptide.zone("arsenal")).toHaveLength(0);
  });
});
