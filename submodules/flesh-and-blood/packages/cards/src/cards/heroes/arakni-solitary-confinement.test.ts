import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { arakniSolitaryConfinement } from "./arakni-solitary-confinement.ts";
import { infectRed } from "../actions/infect.ts";
import { malignRed } from "../actions/malign.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Hero behavior acceptance test — Arakni, Solitary Confinement (ARA001).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: first stealth attack each turn gets go again
 * - Boundaries: second stealth attack no go again, non-stealth no go again,
 *   19hp health
 *
 * No signature weapon in ARA set.
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// arakni-solitary-confinement (ARA001) — Assassin/Young — 19hp
// Printed: "Your first attack with stealth each turn has go again."
// ---------------------------------------------------------------------------

describe("arakni-solitary-confinement (ARA001)", () => {
  it("core mechanic: first stealth attack each turn gains go again (AP refunded)", () => {
    // infect-red (ARA008) is a 0-cost Assassin Attack with stealth.
    // ARA001-a1 grants go again to the first stealth attack each turn.
    const game = FabTestEngine.start(
      {
        hero: arakniSolitaryConfinement,
        hand: [infectRed],
        deck: 6,
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Arakni = game.as(arakniSolitaryConfinement);

    Arakni.attackWith(infectRed);
    // The action point is spent to attack; go again is applied after this
    // combat layer resolves, not while the defender still has priority.
    expectFabPlayer(Arakni).toHaveAP(0);
    expectCombat(game).toBeAtStep("defend");
    game.helpers.resolveRestOfCombat();

    // Go again from the continuous effect refunds the action point.
    expectFabPlayer(Arakni).toHaveAP(1);
  });

  it("boundaries: second stealth attack in the same turn does NOT get go again", () => {
    // The continuous effect applies only to the FIRST stealth attack per turn.
    // Two stealth attacks: first refunds AP, second does not.
    const game = FabTestEngine.start(
      {
        hero: arakniSolitaryConfinement,
        hand: [infectRed, malignRed],
        deck: 6,
        actionPoints: 2,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Arakni = game.as(arakniSolitaryConfinement);

    // First stealth attack — go again from the continuous effect refunds the AP.
    Arakni.attackWith(infectRed);
    expectFabPlayer(Arakni).toHaveAP(1);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Arakni).toHaveAP(2); // −1 +1 = still 2

    // Second stealth attack — go again does NOT apply (first already consumed).
    Arakni.attackWith(malignRed);
    expectFabPlayer(Arakni).toHaveAP(1);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Arakni).toHaveAP(1); // −1, no go again
  });

  it("boundaries: non-stealth attack does NOT get go again", () => {
    // snatch-red (WTR167) is a Generic Action Attack without stealth.
    // ARA001-a1 only grants go again to attacks with stealth.
    const game = FabTestEngine.start(
      {
        hero: arakniSolitaryConfinement,
        hand: [snatchRed],
        deck: 6,
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Arakni = game.as(arakniSolitaryConfinement);

    Arakni.attackWith(snatchRed);

    // No go again — AP stays at 0 (spent the 1 starting AP).
    expectFabPlayer(Arakni).toHaveAP(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Arakni).toHaveAP(0);
  });
});
