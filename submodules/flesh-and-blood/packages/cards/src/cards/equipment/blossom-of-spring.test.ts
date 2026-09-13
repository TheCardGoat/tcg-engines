import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { blossomOfSpring } from "./blossom-of-spring.ts";

/**
 * Blossom of Spring (DVR004) — Generic Equipment Chest.
 *
 * Printed:
 *   Action - Destroy this: Gain {r}. Go again
 *
 * AAA trio:
 * - Happy: activate → destroys self, gains 1 resource, go again.
 * - Boundary: 0 action points → cannot activate.
 * - Timing: chest slot empty after activation.
 */

describe("Blossom of Spring (DVR004) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: activate destroys self and grants 1 resource with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [blossomOfSpring],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.must.activate(blossomOfSpring);

    // Destroyed → graveyard.
    expectFabCard(Bravo, blossomOfSpring).toBeIn("graveyard");

    // Gained 1 resource.
    expectFabPlayer(Bravo).toHaveResourceCount(1);

    // Go again preserves action point — still 1.
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: 0 action points — cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [blossomOfSpring],
        actionPoints: 0,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.must.activate(blossomOfSpring)).toThrow();
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: chest slot is empty after activation", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [blossomOfSpring],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("chest")).toHaveLength(1);

    Bravo.must.activate(blossomOfSpring);

    expect(Bravo.zone("chest")).toHaveLength(0);
  });
});
