import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zyggy } from "../heroes/zyggy.ts";
import { snatchRed } from "../actions/snatch.ts";
import { stardustSpikeRed } from "./stardust-spike.ts";

/**
 * Stardust Spike (AZS017) — Lightning Illusionist Instant Aura, Ward 2.
 *
 * Printed: When this leaves the arena, gain {r} and amp 1.
 *
 * Ward prevents damage to the hero by destroying this (CR 8.3.20). Snatch 4{p}
 * vs Ward 2 is life 18 and a leave-arena {r}.
 */

describe("Stardust Spike (AZS017) AAA", () => {
  it("happy: Ward destroy on Snatch gains {r} as this leaves the arena", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: zyggy, arena: [stardustSpikeRed], resourcePoints: 0, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Zyggy = game.as(zyggy);

    Dash.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Zyggy, stardustSpikeRed).toBeIn("graveyard");
    expectFabPlayer(Zyggy).toHaveLife(18);
    expectFabPlayer(Zyggy).toHaveResourceCount(1);
  });

  it("boundary: without this in the arena, Snatch deals the full 4", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: zyggy, arena: [], resourcePoints: 0, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Zyggy = game.as(zyggy);

    Dash.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Zyggy).toHaveLife(16);
    expectFabPlayer(Zyggy).toHaveResourceCount(0);
  });
});
