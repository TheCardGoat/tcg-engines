import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { deadlyDisplayBlue } from "./deadly-display.ts";
import { deadlyDisplayRed } from "./deadly-display.ts";

/**
 * Deadly Display (Blue) (AHA020) — Warrior Attack Reaction.
 *
 * Printed:
 *   Target weapon attack gets +1{p}. If the weapon has been sharpened this
 *   turn, the attack gets "When this hits a hero, create a Flurry token."
 *
 * CR 8.5.58: sharpening stamps the `sharpened-this-turn` marker on the seated
 * weapon for the turn. CR 7.4.1/7.4.2: the attack reaction resolves during the
 * Reaction Step; the weapon-sharpened-this-turn gate resolves the active
 * attack's source weapon from combat facts and grants the hit-triggered
 * Flurry ability to the bound weapon attack ("it"). The trigger fires on the
 * hit during the Damage Step (CR 7.5) and creates the token before the chain
 * link closes.
 */

describe("Deadly Display (Blue) (AHA020) AAA", () => {
  it("happy: sharpened this turn → +1{p} and the hit creates a Flurry token", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [deadlyDisplayBlue],
        resourcePoints: 5, // 3 sharpen + 1 weapon attack + 1 reaction
        actionPoints: 2, // sharpen Action (go again refunds) + weapon attack
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    // Sharpen Zenith Blade this turn (3{r} + tap, go again).
    Hala.activate(halaBladesaintOfTheVow);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: zenithBlade.canonicalId,
      entityTargets: "minimum",
      ordering: "listed",
      optionalBoolean: false,
    });

    Hala.must.activate(zenithBlade);
    game.advanceCombatTo("reaction");
    Hala.must.playReaction(deadlyDisplayBlue);
    game.passBoth();

    // Zenith Blade base 3 + 1 sharpen counter + 1 reaction = 5.
    expectCombat(game).toHaveAttackPower(5);

    // Undefended attack hits; the granted trigger creates the Flurry token.
    game.helpers.resolveRestOfCombat();
    expect(Hala.zone("arena")).toContain("token:flurry");
    expectFabCard(Hala, deadlyDisplayBlue).toBeIn("graveyard");
  });

  it("boundary: +1{p} counters alone are not sharpening → no Flurry on hit", () => {
    // A blade that merely carries +1{p} counters was not sharpened THIS turn,
    // so the gate stays false: the attack still gets +1{p} but no trigger.
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [{ card: zenithBlade, state: { powerCounterTotal: 2 } }],
        hand: [deadlyDisplayBlue],
        resourcePoints: 2, // 1 weapon attack + 1 reaction
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.must.activate(zenithBlade);
    game.advanceCombatTo("reaction");
    Hala.must.playReaction(deadlyDisplayBlue);
    game.passBoth();

    // 3 base + 2 seated counters + 1 reaction = 6, but no sharpen marker.
    expectCombat(game).toHaveAttackPower(6);

    game.helpers.resolveRestOfCombat();
    expect(Hala.zone("arena").some((id) => /token:flurry/i.test(String(id)))).toBe(false);
    expectFabCard(Hala, deadlyDisplayBlue).toBeIn("graveyard");
  });

  it("timing: only playable against a weapon attack — an attack action rejects it", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        hand: [deadlyDisplayBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    // Snatch is an attack ACTION, not a weapon attack — "Target weapon
    // attack" has no legal referent during this Reaction Step.
    Hala.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");

    expect(() => Hala.must.playReaction(deadlyDisplayBlue)).toThrow();
    expectFabCard(Hala, deadlyDisplayBlue).toBeIn("hand");
  });
});

/**
 * Deadly Display (Red) (AHA007) — Warrior Attack Reaction.
 *
 * Printed:
 *   Target weapon attack gets +3{p}. If the weapon has been sharpened this
 *   turn, the attack gets "When this hits a hero, create a Flurry token."
 *
 * CR 8.5.58: sharpening stamps the `sharpened-this-turn` marker on the seated
 * weapon for the turn. CR 7.4.1/7.4.2: the attack reaction resolves during the
 * Reaction Step; the weapon-sharpened-this-turn gate resolves the active
 * attack's source weapon from combat facts and grants the hit-triggered
 * Flurry ability to the bound weapon attack ("it"). The trigger fires on the
 * hit during the Damage Step (CR 7.5) and creates the token before the chain
 * link closes.
 */

describe("Deadly Display (Red) (AHA007) AAA", () => {
  it("happy: sharpened this turn → +3{p} and the hit creates a Flurry token", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [deadlyDisplayRed],
        resourcePoints: 5, // 3 sharpen + 1 weapon attack + 1 reaction
        actionPoints: 2, // sharpen Action (go again refunds) + weapon attack
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    // Sharpen Zenith Blade this turn (3{r} + tap, go again).
    Hala.activate(halaBladesaintOfTheVow);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: zenithBlade.canonicalId,
      entityTargets: "minimum",
      ordering: "listed",
      optionalBoolean: false,
    });

    Hala.must.activate(zenithBlade);
    game.advanceCombatTo("reaction");
    Hala.must.playReaction(deadlyDisplayRed);
    game.passBoth();

    // Zenith Blade base 3 + 1 sharpen counter + 3 reaction = 7.
    expectCombat(game).toHaveAttackPower(7);

    // Undefended attack hits; the granted trigger creates the Flurry token.
    game.helpers.resolveRestOfCombat();
    expect(Hala.zone("arena")).toContain("token:flurry");
    expectFabCard(Hala, deadlyDisplayRed).toBeIn("graveyard");
  });

  it("boundary: +1{p} counters alone are not sharpening → no Flurry on hit", () => {
    // A blade that merely carries +1{p} counters was not sharpened THIS turn,
    // so the gate stays false: the attack still gets +3{p} but no trigger.
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [{ card: zenithBlade, state: { powerCounterTotal: 2 } }],
        hand: [deadlyDisplayRed],
        resourcePoints: 2, // 1 weapon attack + 1 reaction
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.must.activate(zenithBlade);
    game.advanceCombatTo("reaction");
    Hala.must.playReaction(deadlyDisplayRed);
    game.passBoth();

    // 3 base + 2 seated counters + 3 reaction = 8, but no sharpen marker.
    expectCombat(game).toHaveAttackPower(8);

    game.helpers.resolveRestOfCombat();
    expect(Hala.zone("arena").some((id) => /token:flurry/i.test(String(id)))).toBe(false);
    expectFabCard(Hala, deadlyDisplayRed).toBeIn("graveyard");
  });

  it("timing: only playable against a weapon attack — an attack action rejects it", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        hand: [deadlyDisplayRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    // Snatch is an attack ACTION, not a weapon attack — "Target weapon
    // attack" has no legal referent during this Reaction Step.
    Hala.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");

    expect(() => Hala.must.playReaction(deadlyDisplayRed)).toThrow();
    expectFabCard(Hala, deadlyDisplayRed).toBeIn("hand");
  });
});
