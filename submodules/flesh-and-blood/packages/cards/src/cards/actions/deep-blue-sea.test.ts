import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { innerChiBlue } from "../resources/inner-chi.ts";
import { deepBlueSeaBlue } from "./deep-blue-sea.ts";

/**
 * Deep Blue Sea (MST084) — "+1{p} for each blue card you've pitched this
 * turn." Printed 5{p}, cost 4.
 */

describe("Deep Blue Sea (MST084) AAA", () => {
  it("happy: pitching one blue to play this is 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [deepBlueSeaBlue, innerChiBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(enigma).playAttack(deepBlueSeaBlue, { pitch: [innerChiBlue] });
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: paying with resource points (no pitch) stays printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [deepBlueSeaBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(enigma).playAttack(deepBlueSeaBlue);
    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: two blues pitched this turn make this 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [deepBlueSeaBlue, innerChiBlue, innerChiBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(enigma).playAttack(deepBlueSeaBlue, { pitch: [innerChiBlue, innerChiBlue] });
    expectCombat(game).toHaveAttackPower(7);
  });
});
