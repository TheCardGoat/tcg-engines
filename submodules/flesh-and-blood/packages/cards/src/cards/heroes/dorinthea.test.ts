import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectWait,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { snatchBlue, snatchRed } from "../actions/snatch.ts";
import { dorinthea } from "./dorinthea.ts";
import { dawnblade } from "../weapons/dawnblade.ts";

/**
 * AAA acceptance — Dorinthea (TEA002) with her signature weapon Dawnblade
 * (TEA003). CR 5.2.1-2 governs the weapon activation; the first weapon hit
 * each turn grants that weapon one additional attack (CR 5.2.3c).
 */

describe("Dorinthea + Dawnblade AAA (TEA002/TEA003)", () => {
  it("uses a Dawnblade hit to grant Dorinthea's additional-attack permission", () => {
    const game = FabTestEngine.start(
      { hero: dorinthea, weapon1: [dawnblade], resourcePoints: 2, actionPoints: 2, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dori.must.activate(dawnblade);
    game.helpers.resolveRestOfCombat();

    expectWait(game).toBeIdle();
    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Dori).toHaveAP(1);

    // The hit grants exactly one additional attack this turn.
    Dori.must.activate(dawnblade);
    expectCombat(game).toBeOpen();
    game.helpers.resolveRestOfCombat();
    expectFabCard(Dori, dawnblade).toHavePower(4);
    Dori.expectActivationRejected(dawnblade, "activation_limit");
  });

  it("does not grant an additional attack when Dawnblade misses", () => {
    const game = FabTestEngine.start(
      { hero: dorinthea, weapon1: [dawnblade], resourcePoints: 2, actionPoints: 2, deck: 6 },
      { hero: dash, hand: [snatchRed, snatchBlue], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dori = game.as(dorinthea);

    Dori.must.activate(dawnblade);
    game.advanceUntil({ stopAt: "defend" });
    game.as(dash).defendWith(snatchRed, snatchBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dori).toHaveAP(1);
    Dori.expectActivationRejected(dawnblade);
  });

  it("does not trigger from an attack action that is not a weapon attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dori = game.as(dorinthea);

    Dori.must.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();

    // The hero's first-weapon-hit permission is still unused, so the equipped
    // signature weapon remains a legal attack this turn.
    Dori.must.activate(dawnblade);
    game.passBoth();
    expectCombat(game).toBeOpen();
  });
});
