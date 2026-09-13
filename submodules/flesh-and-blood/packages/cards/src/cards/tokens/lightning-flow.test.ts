import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { lightningFlow } from "./lightning-flow.ts";

/**
 * Lightning Flow (OMN203) — Elemental Token - Aura.
 *
 * Printed: (vanilla token — no abilities, no printed stats)
 *
 * AAA trio:
 * - Happy: the aura token occupies the arena and persists across turns
 *   (auras have no end-of-turn expiry).
 * - Boundary: a token aura is not an attack or defense card — it cannot
 *   be played as one.
 * - Model: token stat profile (no pitch/cost/power/defense, vanilla).
 */

describe("Lightning Flow (OMN203) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: the aura token sits in the arena and persists across turns", () => {
    const game = FabTestEngine.start(
      { hero: briar, arena: [lightningFlow], deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    expectFabCard(Briar, lightningFlow).toBeIn("arena");

    // Auras have no printed expiry — the token survives a full turn cycle.
    Briar.endTurn();
    Dash.endTurn();

    expectFabCard(Briar, lightningFlow).toBeIn("arena");
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: a token aura cannot be played as an attack or declared as a defender", () => {
    const game = FabTestEngine.start(
      { hero: briar, arena: [lightningFlow], deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    expect(() => Briar.playAttack(lightningFlow)).toThrow();
    expect(() => Briar.defendWith(lightningFlow)).toThrow();
    expectFabCard(Briar, lightningFlow).toBeIn("arena");
  });
});
