import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { nimbleStrikeRed } from "./nimble-strike.ts";
import { nimblismBlue } from "./nimblism.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

// nimble-strike-red (WTR185) — Generic Attack Action, cost 1, power 4.
// Printed: "As an additional cost to play Nimble Strike, you may banish a card
// named Nimblism from your graveyard. If you do, Nimble Strike gains +1{p} and
// go again."
//
// Regression: with a Nimblism in the graveyard the play used to be DENIED
// ("This card requires an unmigrated effect-cost declaration") — the optional
// banish cost could never be paid (only auto-declined by absence).
describe("nimble-strike-red (WTR185) AAA", () => {
  it("pay: banishing a Nimblism from the graveyard grants +1{p} and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimbleStrikeRed],
        graveyard: [nimblismBlue],
        resourcePoints: 1,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      manual,
    );
    game.as(bravo).play(nimbleStrikeRed, {
      target: game.as(dash).id,
      banishCostCard: nimblismBlue,
    });
    game.helpers.resolveRestOfCombat();
    // The optional cost was paid: Nimblism left the graveyard for the banished zone.
    expect(game.as(bravo).zone("banished")).toContain(nimblismBlue.canonicalId);
    expect(game.as(bravo).zone("graveyard")).not.toContain(nimblismBlue.canonicalId);
    // +1{p}: base 4 → 5 undefended → Dash life 15.
    expect(game.as(dash).life()).toBe(15);
    // Go again: an action point is banked when the chain link resolves.
    expect(game.as(bravo).actionPoints()).toBeGreaterThanOrEqual(1);
  });

  it("decline: keeping the Nimblism leaves the attack at base power with no go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimbleStrikeRed],
        graveyard: [nimblismBlue],
        resourcePoints: 1,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      manual,
    );
    game.as(bravo).play(nimbleStrikeRed, { target: game.as(dash).id });
    game.helpers.resolveRestOfCombat();
    // Declined: the Nimblism stays in the graveyard.
    expect(game.as(bravo).zone("graveyard")).toContain(nimblismBlue.canonicalId);
    // Base 4{p} undefended → Dash life 16; the spent action point is not refunded.
    expect(game.as(dash).life()).toBe(16);
    expect(game.as(bravo).actionPoints()).toBe(0);
  });
});
