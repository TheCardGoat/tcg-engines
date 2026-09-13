/**
 * AAA test for activated create-token with controller: each.
 * Representative card: Heart Throb (TCC052) — Bard Chest Equipment.
 * Defense 0.
 * Activated (a1): "Action — Destroy this: Each hero creates a Vigor token. Go again"
 *   → activated: cost destroy-self → effect: create-token { token: vigor, controller: each }
 *
 * Verifies that activating Heart Throb destroys it and creates a Vigor token
 * under each hero's control. Boundary: before activation the equipment stays.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, heartThrob } from "../../../fixtures.ts";

describe("create-token: each hero (Heart Throb)", () => {
  it("AAA: activating Heart Throb destroys it and each hero gains a Vigor token", () => {
    const game = FabTestEngine.start(
      { hero: bravo, chest: [heartThrob], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(heartThrob);

    // Equipment moved from chest to graveyard.
    expect(Bravo.zone("chest")).not.toContain(heartThrob.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(heartThrob.canonicalId);
    // Each hero should have a Vigor token in the arena.
    const bravoArena = Bravo.zone("arena");
    const dashArena = game.as(dash).zone("arena");
    expect(bravoArena.some((id) => id.toLowerCase().includes("vigor"))).toBe(true);
    expect(dashArena.some((id) => id.toLowerCase().includes("vigor"))).toBe(true);
  });

  it("AAA boundary: before activation the equipment is in the chest zone", () => {
    const game = FabTestEngine.start(
      { hero: bravo, chest: [heartThrob], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("chest")).toContain(heartThrob.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(heartThrob.canonicalId);
  });
});
