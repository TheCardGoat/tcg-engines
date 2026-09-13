import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fryRed } from "../actions/fry.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { snatchRed } from "../actions/snatch.ts";
import { flowThroughBlue } from "./flow-through.ts";

/**
 * Flow Through (OMN158) — Lightning Instant, cost 0.
 *
 * Printed: Target Lightning attack gets +1{p} and "When this hits, create a
 * Lightning Flow token."
 */

describe("Flow Through (OMN158) AAA", () => {
  it("happy: the Lightning attack gets +1{p} and a hit creates a Lightning Flow token", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [fryRed, flowThroughBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.must.playAttack(fryRed);
    game.advanceCombatTo("reaction");
    Oscilio.must.playInstant(flowThroughBlue);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Oscilio, flowThroughBlue).toBeIn("graveyard");

    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Oscilio).toHaveTokenCount("lightning-flow", 1);
  });

  it("boundary: a non-Lightning attack is not a legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [snatchRed, flowThroughBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Oscilio.must.playInstant(flowThroughBlue));

    expectFabCard(Oscilio, flowThroughBlue).toBeIn("hand");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: +1{p} applies when Flow Through resolves; the token is created only after the hit", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [fryRed, flowThroughBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.must.playAttack(fryRed);
    game.advanceCombatTo("reaction");
    expectCombat(game).toHaveAttackPower(3);
    expectFabPlayer(Oscilio).toHaveTokenCount("lightning-flow", 0);

    Oscilio.must.playInstant(flowThroughBlue);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(4);
    expectFabPlayer(Oscilio).toHaveTokenCount("lightning-flow", 0);

    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Oscilio).toHaveTokenCount("lightning-flow", 1);
  });
});
