import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { agility } from "../tokens/agility.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { ominousAggressionRed } from "./ominous-aggression.ts";

describe("Ominous Aggression (OMN216) AAA", () => {
  it("happy: target AAC gets the base +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, ominousAggressionRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.play(ominousAggressionRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Dash, ominousAggressionRed).toBeIn("graveyard");
  });

  it("boundary: a non-attack is not a legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [ominousAggressionRed, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expect(() => Dash.play(ominousAggressionRed)).toThrow();
    expectFabCard(Dash, ominousAggressionRed).toBeIn("hand");
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
  });

  it("happy: instead +4{p} after an aura you control was destroyed this turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: bravo,
        arena: [agility],
        hand: [snatchRed, ominousAggressionRed, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Bravo.play(ominousAggressionRed, { pitch: [nimblismBlue] });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(8);
  });

  it("timing: the +2{p} expires next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, snatchRed, ominousAggressionRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 8,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const snatches = Dash.cardsIn("hand", snatchRed);

    Dash.playAttack(snatches[0]!);
    game.advanceCombatTo("reaction");
    Dash.play(ominousAggressionRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ optionals: "decline" });

    Dash.endTurn();
    game.as(bravo).endTurn();
    Dash.playAttack(snatches[1]!);
    expectCombat(game).toHaveAttackPower(4);
  });
});
