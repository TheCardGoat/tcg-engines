import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { iyslander } from "./iyslander.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";
import { succumbToWinterBlue } from "../actions/succumb-to-winter.ts";
import { nimblismRed } from "../actions/nimblism.ts";
import { dromai } from "./dromai.ts";
import { stormOfSandikai } from "../weapons/storm-of-sandikai.ts";
import { ash } from "../tokens/ash.ts";
import { aetherAshwing } from "../tokens/aether-ashwing.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Hero behavior acceptance test — Dromai (DRO001).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: pitch a red card → create an Ash token
 * - Core mechanic: played a red card this turn → dragons gain go again
 *   while attacking
 * - Boundaries: only red pitch triggers Ash, only after red card played
 *   dragons get go again
 *
 * Signature weapon: Storm of Sandikai (DRO004)
 * Draconic/Illusionist/Young — 20hp
 */

const hero = dromai;
const opponentHero = dash;

// ---------------------------------------------------------------------------
// dromai (DRO001) — Draconic Illusionist/Young — 20hp
// Printed: "Whenever you pitch a red card, create an Ash Token."
// "If you've played a red card this turn, dragons you control have go again
// while attacking."
// Signature weapon: Storm of Sandikai (DRO004) — 2H Draconic Illusionist Scepter
// ---------------------------------------------------------------------------

describe("dromai (DRO001)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start({ hero, deck: 6 }, { hero: opponentHero, deck: 6 });
    game.helpers.expectPlayer(game.as(hero)).toHaveLife(20);
  });

  it("core mechanic: pitching a red card creates an Ash token", () => {
    // snatchRed is a red card with pitch 1.
    const game = FabTestEngine.start(
      {
        hero,
        hand: [snatchRed, tomeOfFyendalYellow],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dromai = game.as(hero);

    // Play tome-of-fyendal (cost 1) pitching snatch-red → red pitch trigger.
    Dromai.play(tomeOfFyendalYellow, { pitch: [snatchRed] });
    game.passBoth();

    expectFabPlayer(Dromai).toHaveTokenCount("ash", 1);
  });

  it("core mechanic: playing a red card grants dragons go again while attacking", () => {
    // Aether Ashwing (Dragon ally) attacks via Storm of Sandikai's grant.
    // Playing the red Nimblism turns on Dromai's dragon go-again condition.
    const game = FabTestEngine.start(
      {
        hero,
        weapon1: [stormOfSandikai],
        arena: [aetherAshwing, ash],
        hand: [nimblismRed],
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dromai = game.as(hero);

    Dromai.play(nimblismRed);
    game.helpers.resolveUntilIdle();
    expect(Dromai.actionPoints()).toBe(1);

    Dromai.activate(aetherAshwing);
    expect(Dromai.actionPoints()).toBe(0);

    // The undestroyed dragon attack resolves and its go again refunds the AP.
    game.helpers.resolveUntilIdle();
    expectCombat(game).toBeClosed();
    expect(Dromai.actionPoints()).toBe(1);
  });

  it("boundaries: without a red card played, dragons do NOT get go again", () => {
    const game = FabTestEngine.start(
      {
        hero,
        weapon1: [stormOfSandikai],
        arena: [aetherAshwing, ash],
        hand: [],
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dromai = game.as(hero);

    Dromai.activate(aetherAshwing);
    game.helpers.resolveUntilIdle();
    expectCombat(game).toBeClosed();
    // No red card played → the printed condition is false → no AP refund.
    expect(Dromai.actionPoints()).toBe(0);
  });

  it("creates an attack-proxy when a Dragon ally activates its granted Attack ability", () => {
    const game = FabTestEngine.start(
      {
        hero,
        weapon1: [stormOfSandikai],
        arena: [aetherAshwing],
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dromai = game.as(hero);
    const _ashwingId = Dromai.card(aetherAshwing);

    // CR 1.4.3 and 8.3.1: the granted Attack ability makes the activated-layer
    // itself an attack-proxy representing the Aether Ashwing.
    Dromai.activate(aetherAshwing);

    // CR 8.3.1b and 7.1: adding the proxy opens combat in the Layer Step and
    // gives the turn-player priority. The ally becomes attacking only after
    // the proxy moves onto the combat chain (CR 8.2.8c).
    expect(Dromai.hasPriority()).toBe(true);
    game.helpers.expectCombat().toBeOpen().toBeAtStep("layer");
    game.helpers.expectPlayer(Dromai).toHaveAP(0);
  });

  it("happy path: an undestroyed Dragon attack resolves and returns Dromai's action point", () => {
    const game = FabTestEngine.start(
      {
        hero,
        weapon1: [stormOfSandikai],
        arena: [aetherAshwing, ash],
        hand: [nimblismRed],
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dromai = game.as(hero);

    Dromai.play(nimblismRed);
    game.helpers.resolveUntilIdle();
    game.helpers.expectPlayer(Dromai).toHaveAP(1);

    Dromai.activate(aetherAshwing);
    game.helpers.expectPlayer(Dromai).toHaveAP(0);

    // Both players pass without destroying or otherwise responding to the
    // Dragon attack. Its go again resolves during combat resolution.
    game.helpers.resolveUntilIdle();

    game.helpers.expectCombat().toBeClosed();
    game.helpers.expectPlayer(Dromai).toHaveAP(1);
    expect(Dromai.zone("arena")).toContain(aetherAshwing.canonicalId);
  });

  it("edge case: destroying a Dragon during the Layer Step prevents go again", () => {
    const game = FabTestEngine.start(
      {
        hero,
        weapon1: [stormOfSandikai],
        arena: [aetherAshwing, ash],
        hand: [nimblismRed],
        deck: 6,
      },
      {
        hero: iyslander,
        arsenal: [succumbToWinterBlue],
        resourcePoints: 3,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dromai = game.as(hero);
    const Iyslander = game.as(iyslander);

    expectFabCard(Dromai, aetherAshwing).notToHaveKeyword("go-again");

    // Nimblism is a red non-attack action, so Dromai's dragon go-again
    // condition is active for the remainder of the turn.
    Dromai.play(nimblismRed);
    game.helpers.resolveUntilIdle();

    // Dromai grants go again only while the Dragon is attacking.
    expectFabCard(Dromai, aetherAshwing).notToHaveKeyword("go-again");

    // Nimblism resolved with go again. No combat is still open and Dromai has
    // the action point needed to start the Ashwing attack.
    game.helpers.expectCombat().toBeClosed();
    game.helpers.expectPlayer(Dromai).toHaveAP(1);

    // Storm of Sandikai gives the Aether Ashwing its once-per-turn attack.
    Dromai.activate(aetherAshwing);

    // The activated-layer is an attack-proxy on the stack, so combat opens in
    // the Layer Step before the ally becomes attacking (CR 8.3.1b and 7.1).
    game.helpers.expectCombat().toBeOpen().toBeAtStep("layer");
    game.helpers.expectPlayer(Dromai).toHaveAP(0);

    // Pass priority in the Layer Step. Iyslander may play blue non-attack
    // actions from arsenal as instants. Succumb to Winter is used here because
    // Zap can target only a hero, while this blue card can target an ally.
    Dromai.pass();
    expect(Iyslander.hasPriority()).toBe(true);
    game.helpers.expectCombat().toBeOpen().toBeAtStep("layer");

    Iyslander.playFromArsenal(succumbToWinterBlue, aetherAshwing);

    // CR 1.11.5: Iyslander regains priority after playing the instant. The
    // damage has not resolved yet, so the ally and its proxy both exist.
    expect(Iyslander.hasPriority()).toBe(true);
    expect(game.isStackWaiting()).toBe(true);
    expect(Dromai.zone("arena")).toContain(aetherAshwing.canonicalId);
    game.helpers.expectCombat().toBeOpen().toBeAtStep("layer");

    // Iyslander passes to Dromai. The instant still does not resolve until
    // Dromai also passes, completing the successive-pass sequence (CR 1.11.4a).
    Iyslander.pass();
    expect(Dromai.hasPriority()).toBe(true);
    expect(game.isStackWaiting()).toBe(true);
    expect(Dromai.zone("arena")).toContain(aetherAshwing.canonicalId);
    Dromai.pass();

    // The 1-life token was destroyed. Its attack-proxy consequently ceases to
    // exist while still on the stack, closing combat before an attack resolves.
    expect(Dromai.hasPriority()).toBe(true);
    expect(Dromai.zone("arena")).not.toContain(aetherAshwing.canonicalId);
    game.helpers.expectCombat().toBeClosed();
    game.helpers.expectPlayer(Dromai).toHaveAP(0);
  });
});
