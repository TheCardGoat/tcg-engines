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
import { fai } from "../heroes/fai.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "../actions/snatch.ts";
import { rapidReflexRed } from "./rapid-reflex.ts";

/**
 * Rapid Reflex (UPR162) — Ninja Attack Reaction.
 *
 * Printed: Target attack action card with cost 0 gains +3{p}.
 */

describe("Rapid Reflex (UPR162) AAA", () => {
  it("happy: a cost-0 attack action gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [snatchRed, rapidReflexRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Fai.must.playReaction(rapidReflexRed);
    game.passBoth();

    // Snatch base 4 + 3 = 7.
    expectCombat(game).toHaveAttackPower(7);
    expectFabCard(Fai, rapidReflexRed).toBeIn("graveyard");
  });

  it("boundary: cannot target a cost-2 attack action", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [brutalAssaultBlue, rapidReflexRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.must.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Fai.play(rapidReflexRed));
    game.passBoth();
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Fai, rapidReflexRed).toBeIn("hand");
  });

  it("timing: the +3{p} applies through the damage step", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [snatchRed, rapidReflexRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Fai.must.playReaction(rapidReflexRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(7);

    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(13);
  });
});
