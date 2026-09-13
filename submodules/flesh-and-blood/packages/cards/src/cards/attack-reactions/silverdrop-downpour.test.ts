import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { silverdropDownpourRed } from "./silverdrop-downpour.ts";

/**
 * Silverdrop Downpour (Red) (AHA010) — Warrior Attack Reaction.
 *
 * Printed:
 *   Target weapon attack gets +4{p}.
 *   If the weapon has been sharpened this turn, this costs {r} less to play.
 *
 * CR 8.5.58: Sharpen puts a +1{p} counter on the sword and the sharpen
 * reducer stamps the `sharpened-this-turn` status marker on the seated
 * weapon. CR 7.4.1/7.4.2: attack reactions are played during the Reaction
 * Step with the combat chain open, so the weapon-sharpened-this-turn
 * condition resolves the active attack's source weapon from combat facts.
 */

describe("Silverdrop Downpour (Red) (AHA010) AAA", () => {
  it("happy: weapon sharpened this turn → costs {r} less and the attack gets +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [silverdropDownpourRed],
        resourcePoints: 5, // 3 sharpen + 1 weapon attack + 1 reduced reaction
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

    // Attack with the sharpened blade, then react during the Reaction Step.
    Hala.must.activate(zenithBlade);
    game.advanceCombatTo("reaction");
    Hala.must.playReaction(silverdropDownpourRed);
    game.passBoth();

    // Zenith Blade base 3 + 1 sharpen counter + 4 reaction = 8.
    expectCombat(game).toHaveAttackPower(8);
    // 5{r} − 3 (sharpen) − 1 (attack) − 1 (reduced reaction) = 0.
    expectFabPlayer(Hala).toHaveResourceCount(0);
    expectFabCard(Hala, silverdropDownpourRed).toBeIn("graveyard");
  });

  it("boundary: weapon not sharpened this turn → full 2{r} cost", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [silverdropDownpourRed],
        resourcePoints: 4, // 1 weapon attack + 2 full-cost reaction, 1 left over
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.must.activate(zenithBlade);
    game.advanceCombatTo("reaction");
    Hala.must.playReaction(silverdropDownpourRed);
    game.passBoth();

    // No sharpen counter: base 3 + 4 reaction = 7.
    expectCombat(game).toHaveAttackPower(7);
    // 4{r} − 1 (attack) − 2 (full-cost reaction) = 1.
    expectFabPlayer(Hala).toHaveResourceCount(1);
  });

  it("boundary: not sharpened → unpayable with only 1{r} remaining, card stays in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [silverdropDownpourRed],
        resourcePoints: 2, // 1 weapon attack, only 1 left for a 2{r} reaction
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.must.activate(zenithBlade);
    game.advanceCombatTo("reaction");

    // No sharpening happened this turn, so the reduction does not apply and
    // the 2{r} cost is unpayable with 1{r} banked.
    expect(() => Hala.must.playReaction(silverdropDownpourRed)).toThrow();
    expectFabPlayer(Hala).toHaveResourceCount(1);
    expectFabCard(Hala, silverdropDownpourRed).toBeIn("hand");
  });

  it("timing: playable only against a weapon attack — a non-weapon attack rejects it", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        hand: [silverdropDownpourRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    // Snatch is an attack ACTION, not a weapon attack — the reaction's
    // "Target weapon attack" has no legal referent during this Reaction Step.
    Hala.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");

    expect(() => Hala.must.playReaction(silverdropDownpourRed)).toThrow();
    expectFabCard(Hala, silverdropDownpourRed).toBeIn("hand");
  });
});
