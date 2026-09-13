import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { iyslander } from "../heroes/iyslander.ts";
import { arcticIncarcerationRed } from "./arctic-incarceration.ts";

/**
 * Arctic Incarceration (Red) (UPR144) — Ice Action, cost 0.
 * Printed: "Create 3 Frostbite tokens under target hero's control."
 */

describe("Arctic Incarceration (Red) (UPR144) AAA", () => {
  it("happy: creates 3 Frostbites under the targeted hero", () => {
    const game = FabTestEngine.start(
      { hero: iyslander, hand: [arcticIncarcerationRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(arcticIncarcerationRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 3);
    expectFabPlayer(Iyslander).toHaveTokenCount("frostbite", 0);
    expectFabCard(Iyslander, arcticIncarcerationRed).toBeIn("graveyard");
  });

  it("boundary: targeting the caster puts the Frostbites under the caster", () => {
    const game = FabTestEngine.start(
      { hero: iyslander, hand: [arcticIncarcerationRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    Iyslander.play(arcticIncarcerationRed, { target: Iyslander.id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Iyslander).toHaveTokenCount("frostbite", 3);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("frostbite", 0);
  });

  it("timing: the Action is in the graveyard before the Frostbites exist", () => {
    const game = FabTestEngine.start(
      { hero: iyslander, hand: [arcticIncarcerationRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(arcticIncarcerationRed, { target: Dash.id });
    expectFabCard(Iyslander, arcticIncarcerationRed).toBeIn("stack");
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 0);

    game.untilIdle();
    expectFabCard(Iyslander, arcticIncarcerationRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 3);
  });
});
