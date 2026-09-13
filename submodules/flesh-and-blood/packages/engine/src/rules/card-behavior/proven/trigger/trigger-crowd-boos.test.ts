/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: trigger:crowd-boos
 * Representative card: packages/cards/src/cards/heroes/kayo-underhanded-cheat.ts
 * Canonical id: fMDbBJHTPL7dcMMFNkCCm
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
import { kayoUnderhandedCheat } from "../../../../../../cards/src/cards/heroes/kayo-underhanded-cheat.ts";
import { bravo, concealedObjectBlue, cosmicFlareRed } from "../../../fixtures.ts";

describe("trigger: crowd-boos", () => {
  it("Arrange/Act/Assert: Concealed Object's boo creates Kayo's Vigor token (CR 6.6.4)", () => {
    // Arrange — Kayo, Underhanded Cheat has a structured crowd-boos listener.
    const game = FabTestEngine.start(
      { hero: kayoUnderhandedCheat, hand: [concealedObjectBlue], deck: 6 },
      { hero: bravo, deck: 6 },
    );
    const Kayo = game.as(kayoUnderhandedCheat);

    // Act — Concealed Object enters the arena: "the crowd boos you" (CR 6.6.5).
    Kayo.play(concealedObjectBlue);

    // Assert — the boo event triggered Kayo and the Vigor token exists.
    expect(game.getState().players[Kayo.id]?.history.turn.crowdBooed).toBe(true);
    expect(Kayo.zone("arena").some((id) => /vigor/i.test(String(id)))).toBe(true);
  });

  it("AAA boundary: a card without a crowd effect creates no Vigor token", () => {
    const game = FabTestEngine.start(
      { hero: kayoUnderhandedCheat, hand: [cosmicFlareRed], deck: 6 },
      { hero: bravo, deck: 6 },
    );
    const Kayo = game.as(kayoUnderhandedCheat);

    Kayo.play(cosmicFlareRed);

    expect(game.getState().players[Kayo.id]?.history.turn.crowdBooed).toBe(false);
    expect(Kayo.zone("arena").some((id) => /vigor/i.test(String(id)))).toBe(false);
  });
});
