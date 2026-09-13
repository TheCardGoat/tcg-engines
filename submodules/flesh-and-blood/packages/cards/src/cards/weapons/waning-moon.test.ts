import { describe, expect, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { iyslander } from "../heroes/iyslander.ts";
import { sonicBoomYellow } from "../actions/sonic-boom.ts";
import { nimblismBlue } from "../actions/nimblism.ts";

import { waningMoon } from "./waning-moon.ts";

/**
 * Waning Moon (LGS109) — Wizard Weapon - Staff (2H).
 *
 * Printed: "Once per Turn Instant - {r}{r}: Deal 2 arcane damage to target
 * hero. If it's not your turn, instead deal 3 arcane damage to them. Activate
 * this only if you've played a non-attack action card this turn."
 *
 * The not-your-turn 3-arcane branch is Iyslander's printed arsenal permission:
 * a blue non-attack Action played as Instant still counts as playing a
 * non-attack action this turn.
 */

describe("Waning Moon (LGS109) AAA", () => {
  it("happy: on your own turn the staff deals 2 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        weapon1: [waningMoon],
        hand: [sonicBoomYellow],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(sonicBoomYellow, { target: Dash.id }); // a non-attack action
    game.helpers.resolveUntilIdle({ optionals: "decline", ordering: "listed" });

    Blaze.activate(waningMoon);
    Blaze.target(Dash);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(15); // Sonic Boom 3 + Waning Moon 2
  });

  it("boundary: without a non-attack action played this turn, the staff cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        weapon1: [waningMoon],
        hand: [],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    expect(() => Blaze.activate(waningMoon)).toThrow(/condition/i);
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("timing: on the opponent's turn the staff deals 3 arcane after a non-attack action", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], actionPoints: 1, life: 20, deck: 6 },
      {
        hero: iyslander,
        weapon1: [waningMoon],
        arsenal: [nimblismBlue],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Iyslander = game.as(iyslander);

    game.helpers.passPriorityTo(Iyslander);
    Iyslander.play(nimblismBlue, { from: "arsenal" });
    game.helpers.resolveUntilIdle({ optionals: "decline", ordering: "listed" });
    game.helpers.passPriorityTo(Iyslander);

    Iyslander.activate(waningMoon);
    Iyslander.target(Dash);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(17);
  });
});
