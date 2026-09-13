import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { aurora } from "../heroes/aurora.ts";
import { dash } from "../heroes/dash.ts";
import { voltboundDualityRed } from "./voltbound-duality.ts";

describe("Voltbound Duality (OMN077) AAA", () => {
  it("happy: Instant discard deals 1 arcane and creates a Lightning Flow", () => {
    const game = FabTestEngine.start(
      {
        hero: aurora,
        hand: [voltboundDualityRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(aurora);

    Aurora.activate(voltboundDualityRed);
    if (game.pendingDecision()?.kind === "entity-target") {
      Aurora.chooseTargetPlayers(game.as(dash));
    }
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Aurora, voltboundDualityRed).toBeIn("graveyard");
    expect(Aurora.zone("arena").filter((id) => id === "token:lightning-flow")).toHaveLength(1);
    expectFabPlayer(game.as(dash)).toHaveLife(19);
    expectFabPlayer(Aurora).toHaveAP(1);
  });

  it("boundary: without a resource the Instant cannot be activated", () => {
    const game = FabTestEngine.start(
      {
        hero: aurora,
        hand: [voltboundDualityRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(aurora);

    expect(() => Aurora.activate(voltboundDualityRed)).toThrow();
    expectFabCard(Aurora, voltboundDualityRed).toBeIn("hand");
  });

  it("timing: played as an attack it hits for printed 4", () => {
    const game = FabTestEngine.start(
      {
        hero: aurora,
        hand: [voltboundDualityRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(aurora);

    Aurora.attackWith(voltboundDualityRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabCard(Aurora, voltboundDualityRed).toBeIn("graveyard");
  });
});
