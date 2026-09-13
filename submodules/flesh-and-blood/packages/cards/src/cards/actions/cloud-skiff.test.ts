import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { goldenCog } from "../tokens/golden-cog.ts";
import { cloudSkiffRed } from "./cloud-skiff.ts";

/**
 * Cloud Skiff (SEA024) — Mechanologist AAC 5{p}/3{d}.
 *
 * Printed: Once per Turn Instant — {t} a cog you control: This gets +1{p} or go again.
 * Instant activations on the attacking card need attacker priority (reaction
 * window). Defend-pending after `stopAt: "on-attack"` has no priority holder.
 */

describe("Cloud Skiff family AAA", () => {
  it("happy: Instant tap a cog to give this +1 power", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [goldenCog],
        hand: [cloudSkiffRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(cloudSkiffRed);
    game.toReaction();
    Dash.activate(cloudSkiffRed);
    game.passBoth();
    Dash.choose("modify-numeric");

    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Dash, goldenCog).toBeTapped();
  });

  it("boundary: without a cog the Instant is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cloudSkiffRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.playAttack(cloudSkiffRed);
    game.toReaction();
    Dash.expectActivationRejected(cloudSkiffRed);
    expectFabCard(Dash, cloudSkiffRed).toBeIn("combatChain");
  });

  it("timing: Instant is once per turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [goldenCog],
        hand: [cloudSkiffRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(cloudSkiffRed);
    game.toReaction();
    Dash.activate(cloudSkiffRed);
    game.passBoth();
    Dash.choose("modify-numeric");
    Dash.expectActivationRejected(cloudSkiffRed);
    expectCombat(game).toHaveAttackPower(6);
  });
});
