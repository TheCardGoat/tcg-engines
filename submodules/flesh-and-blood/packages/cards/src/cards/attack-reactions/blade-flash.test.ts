import { describe, expect, it } from "vitest";
import { expectCombat, expectFabCard, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dawnbladeResplendent } from "../weapons/dawnblade-resplendent.ts";
import { dorinthea } from "../heroes/dorinthea.ts";

import { bladeFlashBlue } from "./blade-flash.ts";

/**
 * Blade Flash Blue (DVR023) — Generic Attack Reaction.
 *
 * Printed: Target sword attack gains go again.
 */

const MANUAL = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Blade Flash (DVR023) family AAA", () => {
  it("happy: target sword attack gains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnbladeResplendent],
        hand: [bladeFlashBlue],
        resourcePoints: 2, // 1 activation + 1 reaction
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      MANUAL,
    );
    const Dori = game.as(dorinthea);

    Dori.must.activate(dawnbladeResplendent);
    game.advanceCombatTo("reaction");
    Dori.must.playReaction(bladeFlashBlue);
    Dori.target(dawnbladeResplendent);
    game.passBoth();

    expectCombat(game).toHaveKeyword("go-again");

    game.helpers.resolveUntilIdle({ optionalBoolean: false });
  });

  it("boundary: insufficient resources — cannot play reaction", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnbladeResplendent],
        hand: [bladeFlashBlue],
        resourcePoints: 1, // only enough for activation
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      MANUAL,
    );
    const Dori = game.as(dorinthea);

    Dori.must.activate(dawnbladeResplendent);
    game.advanceCombatTo("reaction");

    expect(() => Dori.must.playReaction(bladeFlashBlue)).toThrow();
  });

  it("timing: weapon-based sword attacks stay in the weapon zone and still gain go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnbladeResplendent],
        hand: [bladeFlashBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      MANUAL,
    );
    const Dori = game.as(dorinthea);

    Dori.must.activate(dawnbladeResplendent);
    game.advanceCombatTo("reaction");
    Dori.must.playReaction(bladeFlashBlue);
    Dori.target(dawnbladeResplendent);
    game.passBoth();

    expectFabCard(Dori, dawnbladeResplendent).toBeIn("weapon1");
    expectCombat(game).toHaveKeyword("go-again");
    expectFabCard(Dori, bladeFlashBlue).toBeIn("graveyard");
  });
});
