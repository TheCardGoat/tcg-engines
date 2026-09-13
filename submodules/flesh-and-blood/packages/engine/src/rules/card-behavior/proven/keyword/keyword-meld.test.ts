/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:meld
 * Representative card: packages/cards/src/cards/actions/burn-up-shock.ts
 * Canonical id: RmwkmHccFCW9T8HNbmBFq
 *
 * Arrange: import the representative real card and establish a legal,
 * player-reachable match state with the required heroes, zones, resources,
 * targets, counters, and opponent responses.
 * Act: dispatch only production FabTestEngine moves (play, pitch, defend,
 * resolve prompts, pass priority, and end the relevant phase).
 * Assert: verify player-visible outcomes such as life, zones, AP/resources,
 * combat state, prompts, legality error codes, or game result. Include the
 * negative/boundary case and any timing or interaction case before completion.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, baseHasKeyword, toFabCardDefinition } from "../../../../index.ts";
import { bravo, dash, nimblismBlue } from "../../../fixtures.ts";
import { burnUpShockRed } from "../../../../../../cards/src/cards/actions/burn-up-shock.ts";
import { pulsingAetherLifeRed } from "../../../../../../cards/src/cards/actions/pulsing-aether-life.ts";

describe("keyword: meld", () => {
  it("AAA happy — Arrange: Burn Up // Shock (meld) in hand; Act: declare playMethod meld; Assert: legal play resolves to GY and go again restores AP", () => {
    expect(baseHasKeyword(toFabCardDefinition(burnUpShockRed), "meld")).toBe(true);
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [burnUpShockRed],
        deck: 4,
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(burnUpShockRed, {
      target: Dash.id,
      playMethod: { kind: "meld" },
    });
    game.passBoth();

    // Instant clears to GY after resolution.
    expect(Bravo.zone("graveyard")).toContain(burnUpShockRed.canonicalId);
    // Go again (printed on Burn Up // Shock) restores an action point.
    expect(Bravo.actionPoints()).toBeGreaterThanOrEqual(1);
  });

  it("AAA cost — Arrange: Pulsing Aether // Life (meld, cost 1); Act: declare playMethod meld pitching a blue; Assert: double base cost is paid (pitch 3 − 2 = 1 RP)", () => {
    expect(baseHasKeyword(toFabCardDefinition(pulsingAetherLifeRed), "meld")).toBe(true);
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        hand: [pulsingAetherLifeRed, nimblismBlue],
        deck: 4,
        resourcePoints: 0,
      },
      { hero: dash, life: 20, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // CR 8.3.38: cost 1×2 = 2; pitch blue (3) → 1 RP remaining.
    Bravo.play(pulsingAetherLifeRed, {
      target: Dash.id,
      pitch: [nimblismBlue],
      playMethod: { kind: "meld" },
    });
    game.passBoth();

    expect(Bravo.resourcePoints()).toBe(1);
    expect(Bravo.zone("graveyard")).toContain(pulsingAetherLifeRed.canonicalId);
  });

  it("AAA boundary — Arrange: Pulsing Aether // Life; Act: play its left face; Assert: only base cost is paid (pitch 3 − 1 = 2 RP)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        hand: [pulsingAetherLifeRed, nimblismBlue],
        deck: 4,
        resourcePoints: 0,
      },
      { hero: dash, life: 20, deck: 4 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(pulsingAetherLifeRed, {
      playMethod: { kind: "face", face: "left" },
      target: game.as(dash).id,
      pitch: [nimblismBlue],
    });
    game.passBoth();

    expect(Bravo.resourcePoints()).toBe(2);
    expect(Bravo.zone("graveyard")).toContain(pulsingAetherLifeRed.canonicalId);
  });
});
