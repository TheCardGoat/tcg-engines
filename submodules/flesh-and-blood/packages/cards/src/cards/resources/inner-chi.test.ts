import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { innerChiBlue } from "./inner-chi.ts";

/**
 * Inner Chi Blue (ENG025) — Mystic Resource - Chi.
 *
 * Printed: (vanilla — no abilities)
 *   Pitch 3. No cost, power, or defense — a pure resource.
 *
 * AAA trio:
 * - Boundary: a resource is not an attack — it cannot be played as one.
 * - Timing: Chi cards are excluded from {r} payment, but pitching one funds
 *   {c} activation costs exactly (pitch 3 pays Enigma's {c}{c}{c} Instant in
 *   one card), then it cycles to the bottom of the deck at end of turn
 *   (CR 4.4.3c).
 */

describe("Inner Chi Blue (ENG025) AAA", () => {
  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: a resource is not an attack — cannot be played as one", () => {
    const game = FabTestEngine.start(
      { hero: enigma, hand: [innerChiBlue], deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    expect(() => Enigma.playAttack(innerChiBlue)).toThrow();
    expectFabCard(Enigma, innerChiBlue).toBeIn("hand");
  });

  // ── Timing / zone movement ─────────────────────────────────────────────────

  it("timing: pitching Inner Chi funds {c} costs exactly, then cycles to deck bottom", () => {
    const game = FabTestEngine.start(
      { hero: enigma, hand: [innerChiBlue], chiPoints: 0, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    // Enigma: "Once per Turn Instant - {c}{c}{c}: Create a Spectral Shield
    // token with a +1{p} counter." With zero chi banked, the only legal way
    // to pay is pitching Inner Chi — and its pitch value 3 covers the cost
    // in exactly one card.
    const chiInstance = Enigma.cardsIn("hand", innerChiBlue)[0]!;
    Enigma.activate(enigma);

    const decision = game.pendingDecision();
    if (!decision || decision.kind !== "payment") {
      throw new Error("Expected a chi payment decision for the activation.");
    }
    game.exec({
      move: "answer-decision",
      actorId: decision.actorId,
      payload: {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "payment", instanceIds: [chiInstance.instanceId] },
      },
    });
    game.passBoth();

    expectFabCard(Enigma, innerChiBlue).toBeIn("pitch");
    expect(Enigma.actionPoints()).toBe(1); // Instant activations don't consume AP.
    // The {c}{c}{c} was fully paid — no second payment card was available.
    expect(() => Enigma.activate(enigma)).toThrow(); // once per turn

    Enigma.endTurn();

    // CR 4.4.3c — pitched cards go to the bottom of the deck, not the graveyard.
    expect(Enigma.zone("deck")).toContain(innerChiBlue.canonicalId);
  });
});
