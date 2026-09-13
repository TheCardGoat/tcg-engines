import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zyggy } from "../heroes/zyggy.ts";
import { cosmicDualityRed } from "./cosmic-duality.ts";

/**
 * Cosmic Duality (OMN015) — Lightning Illusionist Action Attack, red 7{p}.
 *
 * Printed Instant: {r}, discard this: Deal 1 arcane to target hero. Create a
 * Lightning Flow token. Fragment.
 */

describe("Cosmic Duality (OMN015) AAA", () => {
  it("happy: Instant discard deals 1 arcane and creates a Lightning Flow", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggy,
        hand: [cosmicDualityRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggy);

    Zyggy.activate(cosmicDualityRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Zyggy, cosmicDualityRed).toBeIn("graveyard");
    expectFabPlayer(Zyggy).toHaveTokenCount("lightning-flow", 1);
    expectFabPlayer(Zyggy).toHaveAP(1);
  });

  it("boundary: without a resource the Instant cannot be activated", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggy,
        hand: [cosmicDualityRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggy);

    Zyggy.expectActivationRejected(cosmicDualityRed);
    expectFabCard(Zyggy, cosmicDualityRed).toBeIn("hand");
  });

  it("timing: played as an attack it hits for printed 7 and keeps Fragment", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggy,
        hand: [cosmicDualityRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggy);

    Zyggy.attackWith(cosmicDualityRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
    expectFabCard(Zyggy, cosmicDualityRed).toHaveKeyword("fragment");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });
});
