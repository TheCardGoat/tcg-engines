import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { winterSGraspYellow } from "./winter-s-grasp.ts";
import { frostbite } from "../tokens/frostbite.ts";
import { themai } from "../allies/themai.ts";
import { hypothermiaBlue } from "./hypothermia.ts";
import { freezingPointRed } from "./freezing-point.ts";

/**
 * Freezing Point Red (UPR105) — fused X = 5 plus the number of Frostbites,
 * Ice afflictions, and frozen cards the damaged hero controls.
 * Newly resolved fragment: the "Ice afflictions" count operand
 * (Ice supertype AND Affliction subtype, target-controller permanents).
 */

describe("Freezing Point (UPR105) AAA", () => {
  it("happy: fused, X counts a Frostbite and an Ice affliction the target hero controls (5+1+1=7)", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [freezingPointRed, winterSGraspYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 4,
      },
      {
        hero: dash,
        hand: [],
        arena: [frostbite, hypothermiaBlue],
        deck: 4,
      },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);
    const lifeBefore = Dash.life();

    Blaze.play(freezingPointRed, {
      target: Dash.id,
      fuse: true,
      fuseCards: [winterSGraspYellow],
    });
    game.passBoth();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(lifeBefore - 7);
  });

  it("negative: fused, a non-Ice non-affliction unfrozen permanent contributes 0 (5+1=6)", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [freezingPointRed, winterSGraspYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 4,
      },
      {
        hero: dash,
        hand: [],
        arena: [frostbite, themai],
        deck: 4,
      },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);
    const lifeBefore = Dash.life();

    Blaze.play(freezingPointRed, {
      target: Dash.id,
      fuse: true,
      fuseCards: [winterSGraspYellow],
    });
    game.passBoth();
    game.helpers.resolveUntilIdle();

    // Themai is a Draconic ally: no Ice supertype, no Affliction subtype,
    // not frozen — only the Frostbite is counted beyond the base 5.
    expectFabPlayer(Dash).toHaveLife(lifeBefore - 6);
  });

  it("boundary: unfused, Freezing Point deals the base 5 despite seated permanents", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [freezingPointRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 4,
      },
      {
        hero: dash,
        hand: [],
        arena: [frostbite, hypothermiaBlue],
        deck: 4,
      },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);
    const lifeBefore = Dash.life();

    Blaze.play(freezingPointRed, { target: Dash.id });
    game.passBoth();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(lifeBefore - 5);
  });
});
