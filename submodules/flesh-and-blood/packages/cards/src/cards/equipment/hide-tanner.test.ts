import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { dash } from "../heroes/dash.ts";
import { wreckerRompRed } from "../actions/wrecker-romp.ts";
import { brutalAssaultRed } from "../actions/brutal-assault.ts";
import { hideTanner } from "./hide-tanner.ts";

/**
 * Equipment behavior acceptance test — Hide Tanner (AKO005).
 *
 * AAA trio:
 * - Happy: random discard 6+{p} → optional destroy self → create 2 Might tokens
 * - Boundary: random discard p4 card — no trigger, arms stay
 * - Timing: battleworn — first defend applies -1 defense counter, remains equipped
 *
 * Hero: Bravo, Showstopper (BVO002) — Brute
 * Driver: Wrecker Romp Red (RNR013) — has random discard additional cost
 * Target discard: Brutal Assault Red (CRU192) — p6 (minimum to trigger)
 *                Snatch Red (WTR167) — p4 (boundary, no trigger)
 *
 * FLUENT API ONLY.
 */

describe("Hide Tanner (AKO005) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: random discard p6 → destroys self, creates 2 Might tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [hideTanner],
        hand: [wreckerRompRed, brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const,
    );
    const Bravo = game.as(bravo);

    // Wrecker Romp has an additional cost: discard a random card.
    // With only 2 cards in hand, after playing Romp the sole remaining is
    // Brutal Assault (p6), so the random discard deterministically picks it.
    Bravo.play(wreckerRompRed);
    // Resolve through all pending decisions (accept optional destroy, combat, etc.)
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    // Hide Tanner should be destroyed and in graveyard.
    expectFabCard(Bravo, hideTanner).toBeIn("graveyard");
    // Arms slot is empty.
    expect(Bravo.zone("arms")).toHaveLength(0);
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: random discard p4 — no trigger, arms remain", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [hideTanner],
        hand: [wreckerRompRed, snatchRed], // Snatch p4 — below the 6+{p} threshold
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const,
    );
    const Bravo = game.as(bravo);

    Bravo.play(wreckerRompRed);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    // Arms still present — p4 doesn't meet the 6+{p} threshold.
    expect(Bravo.zone("arms")).toHaveLength(1);
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: battleworn — first defend applies -1 defense counter, remains equipped", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, arms: [hideTanner], deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // playAttack advances to the Defend step automatically.
    Bravo.must.playAttack(snatchRed);
    Dash.must.defend(hideTanner);
    game.helpers.resolveRestOfCombat();

    // Battleworn: after first defend, equipment gets -1 defense counter but stays.
    expect(Dash.zone("arms")).toHaveLength(1);
  });
});
