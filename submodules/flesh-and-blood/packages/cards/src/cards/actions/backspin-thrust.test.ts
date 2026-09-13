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
import { backspinThrustRed } from "./backspin-thrust.ts";

/**
 * Backspin Thrust (SUP254) — Mechanologist AAC 4{p}.
 *
 * Printed: Once per Turn Instant — {u} a cog you control: This gets +1{p} or go again.
 */

describe("Backspin Thrust (SUP254) AAA", () => {
  it("happy: Instant untap a cog to give this +1 power", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [{ card: goldenCog, state: { tapped: true } }],
        hand: [backspinThrustRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(backspinThrustRed);
    game.toReaction();
    Dash.activate(backspinThrustRed);
    game.passBoth();
    Dash.choose("modify-numeric");

    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Dash, goldenCog).toBeReady();
  });

  it("boundary: without a tapped cog the Instant is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [goldenCog],
        hand: [backspinThrustRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.playAttack(backspinThrustRed);
    game.toReaction();
    Dash.expectActivationRejected(backspinThrustRed);
    expectFabCard(Dash, backspinThrustRed).toBeIn("combatChain");
  });

  it("timing: Instant is once per turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [{ card: goldenCog, state: { tapped: true } }],
        hand: [backspinThrustRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(backspinThrustRed);
    game.toReaction();
    Dash.activate(backspinThrustRed);
    game.passBoth();
    Dash.choose("modify-numeric");
    Dash.expectActivationRejected(backspinThrustRed);
    expectCombat(game).toHaveAttackPower(5);
  });
});
