import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";
import { dash, nimblismBlue } from "./fixtures.ts";
import { oscilio } from "../../../cards/src/cards/heroes/oscilio.ts";
import { volzarTheLightningRod } from "../../../cards/src/cards/weapons/volzar-the-lightning-rod.ts";
import { cloudCoverRed } from "../../../cards/src/cards/instants/cloud-cover.ts";
import { flashBoltRed } from "../../../cards/src/cards/instants/flash-bolt.ts";
import { flashBoltBlue } from "../../../cards/src/cards/instants/flash-bolt.ts";
import { sigilOfSolaceRed } from "../../../cards/src/cards/instants/sigil-of-solace.ts";
import { nullruneRobe } from "../../../cards/src/cards/equipment/nullrune-robe.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Oscilio — Volzar, the Lightning Rod", () => {
  it("AAA: snapshots Lightning cards played when Volzar resolves, then amps exactly the next arcane packet", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        weapon1: [volzarTheLightningRod],
        resourcePoints: 5,
        hand: [cloudCoverRed, flashBoltRed, flashBoltBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      manual,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    // Arrange/Act: Cloud Cover is played on top of Volzar. It is a Lightning
    // card when Volzar resolves; discarding it to Oscilio would not count.
    Oscilio.activate(volzarTheLightningRod);
    Oscilio.play(cloudCoverRed);
    game.passBoth();
    game.passBoth();

    Oscilio.play(flashBoltRed, { target: Dash.id });
    game.passBoth();
    expect(Dash.life()).toBe(16); // 3 + Amp 1

    Oscilio.play(flashBoltBlue, { target: Dash.id });
    game.passBoth();

    // Assert: the later Lightning Instant does not increase the locked X,
    // and Amp has been consumed by the first nonzero arcane damage event.
    expect(Dash.life()).toBe(15);
  });

  it("AAA defense: Arcane Barrier is chosen after Volzar's Amp has raised the packet", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        weapon1: [volzarTheLightningRod],
        resourcePoints: 3,
        hand: [cloudCoverRed, flashBoltRed, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      {
        hero: dash,
        life: 20,
        chest: [nullruneRobe],
        resourcePoints: 1,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      manual,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.activate(volzarTheLightningRod);
    Oscilio.play(cloudCoverRed);
    game.passBoth();
    game.passBoth();
    Oscilio.play(flashBoltRed, { target: Dash.id });
    game.passBoth();

    const barrier = Dash.expectDecision("option");
    expect(barrier.options).toHaveLength(1);
    Dash.chooseOptions(barrier.options[0]!.id);
    // CR 6.5.4-6.5.5 fixes Amp (standard) before Arcane Barrier
    // (prevention); cross-stage ordering is not a player decision.
    expect(game.getState().decision).toBeNull();

    expect(Dash.life()).toBe(17); // (3 + Amp 1) - Arcane Barrier 1
    expect(Dash.resourcePoints()).toBe(0);
    expect(Dash.zone("chest")).toContain(nullruneRobe.canonicalId);
  });
});
