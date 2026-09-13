import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { snatchRed } from "./snatch.ts";
import { convectionAmplifierRed } from "./convection-amplifier.ts";

/**
 * Convection Amplifier (ARC019) — Mechanologist Action Item, red, cost 0.
 *
 * Printed: "Convection Amplifier enters the arena with 2 steam counters on it.
 * When Convection Amplifier has no steam counters on it, destroy it.
 * Action - Remove a steam counter from Convection Amplifier: The next attack
 * action card you play this turn gains dominate. Go again"
 */

describe("Convection Amplifier (ARC019) AAA", () => {
  it("happy: playing it enters with 2 steam; the next attack action gains dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [convectionAmplifierRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(convectionAmplifierRed);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Dash, convectionAmplifierRed).toBeIn("arena");
    expectFabCard(Dash, convectionAmplifierRed).toHaveCounters(2, "steam");

    Dash.activate(convectionAmplifierRed);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Dash, convectionAmplifierRed).toHaveCounters(1, "steam");
    expectFabPlayer(Dash).toHaveAP(1);

    Dash.playAttack(snatchRed);
    expectCombat(game).toHaveKeyword("dominate").toHaveAttackPower(4);
  });

  it("boundary: without the Action, an attack action card has no dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        arena: [{ card: convectionAmplifierRed, state: { steamCounters: 2 } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).playAttack(snatchRed);
    expectCombat(game).notToHaveKeyword("dominate").toHaveAttackPower(4);
  });

  it("timing: only the next attack action this turn gains dominate; the second does not", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, snatchRed],
        arena: [{ card: convectionAmplifierRed, state: { steamCounters: 2 } }],
        actionPoints: 3,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(convectionAmplifierRed);
    game.untilIdle({ ordering: "listed" });

    Dash.playAttack(snatchRed);
    expectCombat(game).toHaveKeyword("dominate");
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    Dash.playAttack(snatchRed);
    expectCombat(game).notToHaveKeyword("dominate");
  });

  it("timing: removing the last steam counter destroys it", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [{ card: convectionAmplifierRed, state: { steamCounters: 1 } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(convectionAmplifierRed);
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Dash, convectionAmplifierRed).toBeIn("graveyard");
  });
});
