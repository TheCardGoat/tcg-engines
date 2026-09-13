/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: trigger:crowd-cheers
 * Representative card: packages/cards/src/cards/heroes/pleiades-superstar.ts
 * Canonical id: JhgRJb6nfctWkndbzrgnj
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
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { pleiadesSuperstar } from "../../../../../../cards/src/cards/heroes/pleiades-superstar.ts";
import { bravo, cosmicFlareRed, superstarBlue } from "../../../fixtures.ts";

describe("trigger: crowd-cheers", () => {
  it("Arrange/Act/Assert: Superstar's cheer creates Pleiades' Confidence token (CR 6.6.4)", () => {
    // Arrange — Pleiades, Superstar has a structured crowd-cheers listener.
    const game = FabTestEngine.start(
      { hero: pleiadesSuperstar, hand: [superstarBlue], deck: 6 },
      { hero: bravo, deck: 6 },
    );
    const Pleiades = game.as(pleiadesSuperstar);

    // Act — Superstar resolves: "the crowd cheers you" (CR 6.6.5).
    Pleiades.play(superstarBlue);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // Assert — the cheer event triggered Pleiades and a Confidence token exists.
    expect(game.getState().players[Pleiades.id]?.history.turn.crowdCheered).toBe(true);
    expect(Pleiades.zone("arena").some((id) => /confidence/i.test(String(id)))).toBe(true);
  });

  it("AAA boundary: a card without a crowd effect creates no Confidence token", () => {
    const game = FabTestEngine.start(
      { hero: pleiadesSuperstar, hand: [cosmicFlareRed], deck: 6 },
      { hero: bravo, deck: 6 },
    );
    const Pleiades = game.as(pleiadesSuperstar);

    Pleiades.play(cosmicFlareRed);

    expect(game.getState().players[Pleiades.id]?.history.turn.crowdCheered).toBe(false);
    expect(Pleiades.zone("arena").some((id) => /confidence/i.test(String(id)))).toBe(false);
  });
});
