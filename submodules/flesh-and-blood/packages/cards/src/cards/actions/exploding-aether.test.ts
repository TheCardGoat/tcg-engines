import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { volticBoltRed } from "./voltic-bolt.ts";
import { explodingAetherRed } from "./exploding-aether.ts";

/**
 * Exploding Aether Red (OSC015) — Wizard Action. Go again.
 *
 * Printed: Amp 3
 */

describe("Exploding Aether (OSC015) AAA", () => {
  it("happy: Amp 3 raises the next bolt and go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [explodingAetherRed, volticBoltRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(explodingAetherRed);
    game.passBoth();
    expectFabPlayer(Kano).toHaveAP(1); // go again

    Kano.play(volticBoltRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(12); // 20 - (5 + 3)
  });
});
