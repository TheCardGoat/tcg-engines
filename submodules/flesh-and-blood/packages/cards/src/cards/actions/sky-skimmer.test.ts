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
import { skySkimmerRed } from "./sky-skimmer.ts";

/**
 * Sky Skimmer (SEA027) — Mechanologist AAC 4{p}.
 *
 * Printed: Once per Turn Instant — {t} a cog you control: This gets +1{p} or go again.
 */

describe("Sky Skimmer (SEA027) AAA", () => {
  it("happy: Instant tap a cog to give this +1 power", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [goldenCog],
        hand: [skySkimmerRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(skySkimmerRed);
    game.toReaction();
    Dash.activate(skySkimmerRed);
    game.passBoth();
    Dash.choose("modify-numeric");

    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Dash, goldenCog).toBeTapped();
  });

  it("boundary: without a cog the Instant is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [skySkimmerRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.playAttack(skySkimmerRed);
    game.toReaction();
    Dash.expectActivationRejected(skySkimmerRed);
    expectFabCard(Dash, skySkimmerRed).toBeIn("combatChain");
  });

  it("timing: Instant is once per turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [goldenCog],
        hand: [skySkimmerRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(skySkimmerRed);
    game.toReaction();
    Dash.activate(skySkimmerRed);
    game.passBoth();
    Dash.choose("modify-numeric");
    Dash.expectActivationRejected(skySkimmerRed);
    expectCombat(game).toHaveAttackPower(5);
  });
});
