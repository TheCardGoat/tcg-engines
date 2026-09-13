import { describe, expect, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { stormOfSandikai } from "../weapons/storm-of-sandikai.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { silkenGi } from "../equipment/silken-gi.ts";
import { snagBlue } from "../instants/snag.ts";
import { snatchRed } from "../actions/snatch.ts";
import { themai } from "./themai.ts";

/**
 * Themai (UPR015) — Draconic Illusionist Dragon Ally, 3{p}/4{h}.
 *
 * Printed: Opponents can't play cards or activate abilities during your turn.
 */

describe("Themai (UPR015) AAA", () => {
  it("happy: Themai attacks via Storm of Sandikai without needing a printed Attack", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        weapon1: [stormOfSandikai],
        arena: [themai],
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.activate(themai);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    Dash.defendWith();
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: without Themai the opponent can play an Instant in the reaction step", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [snagBlue], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Blaze.pass();
    Dash.play(snagBlue);
    game.passBoth();
  });

  it("happy: during its controller's turn Themai prevents opposing plays and activations", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        arena: [themai],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 4,
      },
      {
        hero: dash,
        chest: [silkenGi],
        hand: [snagBlue],
        deck: 4,
      },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Blaze.pass();

    expect(() => Dash.play(snagBlue)).toThrow();
    expect(() => Dash.activate(silkenGi)).toThrow();
  });

  it("timing: on the opponent's turn they can play cards again", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        arena: [themai],
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [snagBlue], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.endTurn();
    game.helpers.untilIdle();
    Dash.play(snagBlue);
    game.passBoth();
  });
});
