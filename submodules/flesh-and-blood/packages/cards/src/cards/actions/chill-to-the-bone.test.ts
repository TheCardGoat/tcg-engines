import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { winterSGraspYellow } from "./winter-s-grasp.ts";
import { icyEncounterBlue } from "./icy-encounter.ts";
import { chillToTheBoneRed } from "./chill-to-the-bone.ts";

/**
 * Chill to the Bone (Red) (ELE163) — Ice Action.
 *
 * Printed: "The next time an Ice or Elemental attack hits a hero this turn,
 * create 3 Frostbite tokens under their control. Go again"
 */

describe("Chill to the Bone (ELE163) AAA", () => {
  it("happy: the next Ice attack that hits creates 3 Frostbites under the defending hero", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [chillToTheBoneRed, winterSGraspYellow],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.play(chillToTheBoneRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 0);

    Oldhim.playAttack(winterSGraspYellow);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 3);
    expectFabPlayer(Oldhim).toHaveTokenCount("frostbite", 0);
  });

  it("boundary: a Generic hit does not create the Frostbites", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [brutalAssaultBlue, chillToTheBoneRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.play(chillToTheBoneRed);
    game.helpers.resolveUntilIdle();
    Oldhim.playAttack(brutalAssaultBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 0);
  });

  it("timing: ELE159 still creates its own Frostbite on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [icyEncounterBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(oldhim).playAttack(icyEncounterBlue);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 1);
  });
});
