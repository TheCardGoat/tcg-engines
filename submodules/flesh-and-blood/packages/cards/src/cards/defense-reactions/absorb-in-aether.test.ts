import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { volticBoltBlue } from "../actions/voltic-bolt.ts";
import { iyslander } from "../heroes/iyslander.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { absorbInAetherRed } from "./absorb-in-aether.ts";

/**
 * Absorb in Aether Red (ARC123) — Wizard Defense Reaction.
 *
 * Printed: The next card you play this turn with an effect that deals arcane
 * damage, instead deals that much arcane damage plus 2.
 */

describe("Absorb in Aether (ARC123) AAA", () => {
  it("happy: next arcane card this turn deals printed plus 2", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: iyslander,
        hand: [absorbInAetherRed],
        arsenal: [volticBoltBlue],
        resourcePoints: 3,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Iyslander = game.as(iyslander);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Iyslander.play(absorbInAetherRed);
    game.passBoth();
    game.helpers.passPriorityTo(Iyslander);
    Iyslander.play(volticBoltBlue, { from: "arsenal", target: Dash });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("boundary: an arcane card without Absorb deals printed damage only", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: iyslander,
        arsenal: [volticBoltBlue],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Iyslander = game.as(iyslander);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Iyslander.play(volticBoltBlue, { from: "arsenal", target: Dash });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("timing: Absorb's this-turn window is the turn it resolves", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: iyslander,
        hand: [absorbInAetherRed, volticBoltBlue, nimblismBlue],
        resourcePoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Iyslander = game.as(iyslander);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Iyslander.play(absorbInAetherRed);
    game.helpers.resolveRestOfCombat();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    Iyslander.play(volticBoltBlue, { target: Dash, pitch: [nimblismBlue] });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Dash).toHaveLife(17);
  });
});
