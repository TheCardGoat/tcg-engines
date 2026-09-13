import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { runnerRunnerRed } from "./runner-runner.ts";

/**
 * Runner Runner (HVY156) — When this attacks, if it has go again, create an Agility token.
 */

describe("Runner Runner (HVY156) AAA", () => {
  it("happy: attacking with go again (Agility start-of-turn) creates an Agility token", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [runnerRunnerRed],
        arena: [fabToken("agility")],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.untilIdle({ ordering: "listed" });
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(runnerRunnerRed, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Rhinar).toHaveTokenCount("agility", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("agility", 0);
  });

  it("boundary: attacking without go again creates no Agility", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [runnerRunnerRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(runnerRunnerRed, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Rhinar).toHaveTokenCount("agility", 0);
  });

  it("timing: the token exists at on-attack while combat is still open", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [runnerRunnerRed],
        arena: [fabToken("agility")],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.untilIdle({ ordering: "listed" });
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(runnerRunnerRed, { stopAt: "on-attack" });
    expectFabPlayer(Rhinar).toHaveTokenCount("agility", 1);
  });
});
