import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { ash } from "../tokens/ash.ts";
import { dash } from "../heroes/dash.ts";
import { dromai } from "../heroes/dromai.ts";
import { rakeTheEmbersBlue } from "../actions/rake-the-embers.ts";
import { silkenForm } from "./silken-form.ts";

/**
 * Silken Form (DRO007) — Draconic Illusionist Arms d0, Quell 1.
 *
 * Printed: "Instant - Destroy Silken Form: Transform target ash you control
 * into an Aether Ashwing. Quell 1"
 */

describe("Silken Form (DRO007) AAA", () => {
  it("happy: destroying the arms transforms the target ash into an Aether Ashwing", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        arms: [silkenForm],
        hand: [rakeTheEmbersBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    // Create the ash, declining Rake the Embers' own transform.
    Dromai.play(rakeTheEmbersBlue);
    game.untilIdle({ entityTargets: "minimum" });
    expectFabToken(game, "ash").toHaveCount(1);

    Dromai.activate(silkenForm);
    Dromai.target(ash);
    game.untilIdle();

    expectFabCard(Dromai, silkenForm).toBeIn("graveyard");
    expectFabToken(game, "ash").toHaveCount(0);
    expectFabToken(game, "aether-ashwing").toHaveCount(1);
  });

  it("boundary: with no ash in the arena the Instant is illegal and the arms stay", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        arms: [silkenForm],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.expectActivationRejected(silkenForm);
    expectFabCard(Dromai, silkenForm).toBeIn("arms");
  });
});
