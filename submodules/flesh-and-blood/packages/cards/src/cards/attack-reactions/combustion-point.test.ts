import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { phoenixFlameRed } from "../actions/phoenix-flame.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { combustionPointRed } from "./combustion-point.ts";

/**
 * Combustion Point (UPR050) — Draconic Ninja Attack Reaction.
 *
 * Printed: Target Draconic or Ninja attack action card gains +1{p}.
 * You may banish a non-equipment defending card with {d} less than the
 * number of Draconic chain links you control.
 */

describe("Combustion Point (UPR050) AAA", () => {
  it("happy: a Draconic attack action gains +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [phoenixFlameRed, combustionPointRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.must.playAttack(phoenixFlameRed);
    game.advanceCombatTo("reaction");
    Fai.must.playReaction(combustionPointRed);
    game.passBoth();

    // Phoenix Flame printed 0 + 1 = 1.
    expectCombat(game).toHaveAttackPower(1);
    expectFabCard(Fai, combustionPointRed).toBeIn("graveyard");
  });

  it("boundary: a Generic attack action is not a legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [snatchRed, combustionPointRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Fai.play(combustionPointRed));
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Fai, combustionPointRed).toBeIn("hand");
  });

  it("timing: may banish a non-equipment defender with {d} less than Draconic links", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [phoenixFlameRed, phoenixFlameRed, phoenixFlameRed, combustionPointRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.attackWith(phoenixFlameRed);
    game.advanceCombatTo("resolution");
    Fai.attackWith(phoenixFlameRed);
    game.advanceCombatTo("resolution");
    Fai.must.playAttack(phoenixFlameRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(nimblismBlue);
    game.advanceCombatTo("reaction");
    const reactionId = Fai.findCardInZone("hand", combustionPointRed);
    const defenderId = Dash.findCardInZone("combatChain", nimblismBlue);
    game.playInstance(Fai.id, reactionId, { additionalTarget: defenderId }, "explicit");
    game.closeCombat({ entityTargets: "maximum" });

    expectFabCard(Fai, combustionPointRed).toBeIn("graveyard");
    expectFabCard(Dash, nimblismBlue).toBeIn("banished");
  });
});
