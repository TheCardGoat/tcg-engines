import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { bladeFlashBlue } from "../attack-reactions/blade-flash.ts";
import { dawnbladeResplendent } from "../weapons/dawnblade-resplendent.ts";
import { dorintheaQuicksilverProdigy } from "./dorinthea-quicksilver-prodigy.ts";

/**
 * Dorinthea Quicksilver Prodigy (DDD001) — Warrior Hero, Young.
 *
 * Printed: The first time your Dawnblade, Resplendent's attack gets go again
 * each turn, you may attack an additional time with it this turn.
 */

describe("Dorinthea Quicksilver Prodigy (DDD001) AAA", () => {
  it("timing: Resplendent gaining go again allows the extra attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dorintheaQuicksilverProdigy,
        weapon1: [dawnbladeResplendent],
        hand: [bladeFlashBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorintheaQuicksilverProdigy);

    Dori.must.activate(dawnbladeResplendent);
    game.advanceCombatTo("reaction");
    Dori.must.playReaction(bladeFlashBlue);

    game.passBoth();

    // The first go-again gain grants extra-attack permission automatically.
    game.helpers.resolveUntilIdle({
      optionals: "decline",
      entityTargets: "minimum",
      ordering: "listed",
    });
    game.helpers.resolveRestOfCombat();

    Dori.must.activate(dawnbladeResplendent);
    game.passBoth();
    expectCombat(game).toBeOpen().toHaveAttackPower(2);
  });

  it("boundary: without a go-again gain, Resplendent gets no extra attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dorintheaQuicksilverProdigy,
        weapon1: [dawnbladeResplendent],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorintheaQuicksilverProdigy);

    Dori.must.activate(dawnbladeResplendent);
    game.helpers.resolveRestOfCombat();

    // No go-again gain on Resplendent this turn → the trigger never fired and
    // the once-per-turn activation limit still holds the weapon.
    Dori.expectActivationRejected(dawnbladeResplendent);
  });
});
