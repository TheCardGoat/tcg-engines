import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { nimblismBlue } from "./nimblism.ts";
import { hazeBendingBlue } from "./haze-bending.ts";
import { fractalCreationBlue } from "./fractal-creation.ts";

describe("Fractal Creation (OMN040) AAA", () => {
  it("happy: when this hits, you may create a token copy of an aura you control", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [hazeBendingBlue, fractalCreationBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.play(hazeBendingBlue);
    game.helpers.resolveUntilIdle();
    expect(Zyggy.zone("arena")).toContain(hazeBendingBlue.canonicalId);

    Zyggy.attackWith(fractalCreationBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    const auras = Zyggy.zone("arena").filter((id) => id === hazeBendingBlue.canonicalId);
    expect(auras.length).toBeGreaterThanOrEqual(2);
  });

  it("boundary: declining the on-hit copy leaves only the original aura", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [hazeBendingBlue, fractalCreationBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.play(hazeBendingBlue);
    game.helpers.resolveUntilIdle();
    Zyggy.attackWith(fractalCreationBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Zyggy.zone("arena").filter((id) => id === hazeBendingBlue.canonicalId)).toHaveLength(1);
    expectFabCard(Zyggy, fractalCreationBlue).toBeIn("graveyard");
  });

  it("boundary: Fragment reduces power by 2 when a 2+ {d} card defends", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [fractalCreationBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    Zyggy.attackWith(fractalCreationBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.advanceCombatTo("defend");
    Dash.defendWith(nimblismBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Dash).toHaveLife(18);
  });
});
