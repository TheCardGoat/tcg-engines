import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";
import { dash, nimblismBlue } from "./fixtures.ts";
import { cometCollisionRed } from "../../../cards/src/cards/actions/comet-collision.ts";
import { meteoricImpactRed } from "../../../cards/src/cards/actions/meteoric-impact.ts";
import { oscilioConstellaIntelligence } from "../../../cards/src/cards/heroes/oscilio-constella-intelligence.ts";
import { cloudCoverRed } from "../../../cards/src/cards/instants/cloud-cover.ts";
import { sigilOfSolaceRed } from "../../../cards/src/cards/instants/sigil-of-solace.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Starfall alternatives", () => {
  it("Comet Collision is an Action and resolves exactly its base damage when Starfall is false", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilioConstellaIntelligence,
        hand: [cometCollisionRed, nimblismBlue, nimblismBlue, nimblismBlue],
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
    const Oscilio = game.as(oscilioConstellaIntelligence);
    const Dash = game.as(dash);
    expect(Oscilio.id).not.toBe(Dash.id);
    expect(Dash.hero()).toBe(dash.canonicalId);
    expect(
      game.getState().objects[game.getState().players[Dash.id]!.heroCardId!]?.canonicalId,
    ).toBe(dash.canonicalId);

    Oscilio.play(cometCollisionRed, {
      targetInstanceId: game.getState().players[Dash.id]!.heroCardId!,
    });
    expect(Oscilio.actionPoints()).toBe(0);
    game.passBoth();
    game.passBoth();

    expect(game.committedEvents().filter((event) => event.name === "deal-damage")).toEqual([
      expect.objectContaining({
        data: expect.objectContaining({ target: { kind: "hero", playerId: Dash.id }, amount: 3 }),
      }),
    ]);
    expect(Dash.life()).toBe(17);
  });

  it("Comet Collision replaces—not adds—its base damage after a real instant enters its controller's graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilioConstellaIntelligence,
        hand: [cloudCoverRed, cometCollisionRed, nimblismBlue, nimblismBlue],
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
    const Oscilio = game.as(oscilioConstellaIntelligence);
    const Dash = game.as(dash);

    Oscilio.play(cloudCoverRed);
    game.passBoth();
    expect(Oscilio.zone("graveyard")).toContain(cloudCoverRed.canonicalId);

    Oscilio.play(cometCollisionRed, {
      targetInstanceId: game.getState().players[Dash.id]!.heroCardId!,
    });
    game.passBoth();
    game.passBoth();

    expect(Dash.life()).toBe(16);
  });

  it("Meteoric Impact remains an Action and resolves exactly its Starfall amount", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilioConstellaIntelligence,
        hand: [cloudCoverRed, meteoricImpactRed, nimblismBlue, nimblismBlue],
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
    const Oscilio = game.as(oscilioConstellaIntelligence);
    const Dash = game.as(dash);

    Oscilio.play(cloudCoverRed);
    game.passBoth();
    Oscilio.play(meteoricImpactRed, {
      target: Dash.id,
      pitch: [nimblismBlue],
    });
    expect(Oscilio.actionPoints()).toBe(0);
    game.passBoth();
    game.passBoth();

    expect(Dash.life()).toBe(15);
  });
});
