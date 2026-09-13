import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { iraScarletRevenger } from "../heroes/ira-scarlet-revenger.ts";
import { headJabRed } from "../actions/head-jab.ts";
import { snatchRed } from "../actions/snatch.ts";
import { ancestralEmpowermentRed } from "./ancestral-empowerment.ts";

/**
 * Ancestral Empowerment (WTR082) — Ninja Attack Reaction, cost 0, 3{d}.
 *
 * Printed: "Target Ninja attack action card gains +1{p}. Draw a card."
 */

describe("Ancestral Empowerment (WTR082) AAA", () => {
  it("happy: target Ninja attack action gains +1{p} and you draw a card", () => {
    const game = FabTestEngine.start(
      {
        hero: iraScarletRevenger,
        hand: [headJabRed, ancestralEmpowermentRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraScarletRevenger);

    Ira.playAttack(headJabRed);
    game.advanceCombatTo("reaction");
    Ira.must.playReaction(ancestralEmpowermentRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Ira, ancestralEmpowermentRed).toBeIn("graveyard");
    expectFabPlayer(Ira).toHaveHandCount(1);
  });

  it("boundary: Generic Snatch is not a legal Ninja AAC (silent no-op)", () => {
    const game = FabTestEngine.start(
      {
        hero: iraScarletRevenger,
        hand: [snatchRed, ancestralEmpowermentRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraScarletRevenger);

    Ira.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Ira.must.playReaction(ancestralEmpowermentRed));

    expectFabCard(Ira, ancestralEmpowermentRed).toBeIn("hand");
    expectCombat(game).toHaveAttackPower(4);
    expectFabPlayer(Ira).toHaveHandCount(1);
  });

  it("timing: the draw resolves in the reaction step while combat is still open", () => {
    const game = FabTestEngine.start(
      {
        hero: iraScarletRevenger,
        hand: [headJabRed, ancestralEmpowermentRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraScarletRevenger);

    Ira.playAttack(headJabRed);
    game.advanceCombatTo("reaction");
    expectFabPlayer(Ira).toHaveHandCount(1);
    Ira.must.playReaction(ancestralEmpowermentRed);
    game.passBoth();

    expectCombat(game).toBeOpen();
    expectFabPlayer(Ira).toHaveHandCount(1);
    game.closeCombat();
    expectFabPlayer(Ira).toHaveHandCount(1);
  });
});
