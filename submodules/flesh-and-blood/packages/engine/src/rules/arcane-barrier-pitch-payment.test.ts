/**
 * CR 8.3.8 Arcane Barrier / CR 1.14.2d: an optional pay-resources prevention is
 * offered whenever the controller can pay — banked resource points or a
 * pitchable hand card — and pitching happens through a payment decision before
 * the prevention applies.
 */
import { describe, expect, it } from "vitest";

import {
  createFabMatchContext,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../index.ts";
import { FabTestEngine, type FabFixtureCardEntry } from "../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "./fixtures.ts";

import { nullruneGloves } from "../../../cards/src/cards/equipment/nullrune-gloves.ts";
import { runechant } from "../../../cards/src/cards/tokens/runechant.ts";

function startGame(dashHand: readonly FabFixtureCardEntry[], resourcePoints: number) {
  return FabTestEngine.start(
    {
      hero: bravo,
      arena: [runechant],
      hand: [snatchRed],
      deck: 6,
      actionPoints: 1,
    },
    {
      hero: dash,
      arms: [nullruneGloves],
      hand: dashHand,
      deck: 6,
      resourcePoints,
      life: 20,
    },
    { autoPassPriority: false },
  );
}

/** Bravo attacks into the Runechant; its destruction deals 1 arcane to Dash
 * and the engine opens the optional prevention decision for Dash. */
function driveRunechantDamage(
  game: ReturnType<typeof FabTestEngine.start>,
): ReturnType<typeof game.pendingDecision> {
  const Bravo = game.as(bravo);
  const Dash = game.as(dash);
  Bravo.play(snatchRed, { target: Dash.id });
  Bravo.pass();
  for (let i = 0; i < 12 && !game.pendingDecision(); i += 1) {
    const holder = game.getPriorityPlayerId();
    if (!holder) break;
    if (holder === Dash.id) Dash.pass();
    else Bravo.pass();
  }
  return game.pendingDecision();
}

describe("optional pay-resources prevention pitches to pay (CR 1.14.2d)", () => {
  it("AAA: 0 RP with a pitchable hand — selecting the barrier opens one pitch round, then prevents", () => {
    const game = startGame([nimblismBlue], 0);
    const Dash = game.as(dash);

    const choice = driveRunechantDamage(game);
    expect(choice?.actorId).toBe(Dash.id);
    expect(choice?.label).toContain("arcane");
    Dash.chooseOptions(Dash.expectDecision("option").options[0]!.id);

    // The selection alone cannot pay 1 — a pitch round opens before the
    // prevention applies.
    const payment = Dash.expectDecision("payment");
    expect(payment.label).toContain("Pitch a card");
    expect(payment.candidates.map((candidate) => candidate.instanceId)).toContain(
      Dash.cardIn("hand", nimblismBlue).instanceId,
    );
    Dash.pitchFirst();

    // Prevention applied: no arcane damage, the pitched card generated 3 and
    // paid 1, and the combat continues to the defend step.
    expect(Dash.life()).toBe(20);
    expect(Dash.zone("pitch")).toContain(nimblismBlue.canonicalId);
    expect(game.getState().players[Dash.id]?.resourcePoints).toBe(2);
    expect(Dash.zone("hand")).not.toContain(nimblismBlue.canonicalId);
  });

  it("AAA: declining the prevention takes the arcane damage and never pitches", () => {
    const game = startGame([nimblismBlue], 0);
    const Dash = game.as(dash);

    const choice = driveRunechantDamage(game);
    Dash.chooseOptions();

    expect(Dash.life()).toBe(19);
    expect(Dash.zone("hand")).toContain(nimblismBlue.canonicalId);
    expect(game.getState().players[Dash.id]?.resourcePoints).toBe(0);
  });

  it("AAA: 0 RP with an empty hand — the prevention is not offered at all", () => {
    const game = startGame([], 0);
    const Dash = game.as(dash);

    const choice = driveRunechantDamage(game);

    expect(choice).toBeNull();
    expect(Dash.life()).toBe(19);
  });

  it("AAA: banked resources pay directly — no pitch round opens", () => {
    const game = startGame([nimblismBlue], 1);
    const Dash = game.as(dash);

    const choice = driveRunechantDamage(game);
    expect(choice?.actorId).toBe(Dash.id);
    Dash.chooseOptions(Dash.expectDecision("option").options[0]!.id);

    expect(game.pendingDecision()?.kind).not.toBe("payment");
    expect(Dash.life()).toBe(20);
    expect(Dash.zone("hand")).toContain(nimblismBlue.canonicalId);
    expect(game.getState().players[Dash.id]?.resourcePoints).toBe(0);
  });

  it("AAA: a pending pitch round survives snapshot restore and still prevents", () => {
    const game = startGame([nimblismBlue], 0);
    const Dash = game.as(dash);

    const choice = driveRunechantDamage(game);
    expect(choice?.actorId).toBe(Dash.id);
    Dash.chooseOptions(Dash.expectDecision("option").options[0]!.id);
    Dash.expectDecision("payment");

    // Persist the unresolved pitch round, then resume through the public
    // snapshot ingress.
    const state = game.getState();
    const restored = restoreFabMatchSnapshot(
      serializeFabMatchSnapshot(state),
      createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
    );
    const resumed = FabTestEngine.fromState(restored);
    const ResumedDash = resumed.as(dash);
    ResumedDash.pitchFirst();

    expect(ResumedDash.life()).toBe(20);
    expect(ResumedDash.zone("pitch")).toContain(nimblismBlue.canonicalId);
    expect(resumed.getState().players[ResumedDash.id]?.resourcePoints).toBe(2);
  });
});
