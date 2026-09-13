import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { nullruneHood } from "../equipment/nullrune-hood.ts";
import { chane } from "../heroes/chane.ts";
import { vexingMaliceRed } from "./vexing-malice.ts";

describe("Vexing Malice (CHN026) AAA", () => {
  it("happy: deals 2 arcane on resolution then 3 combat to the opposing hero", () => {
    const game = FabTestEngine.start(
      { hero: chane, hand: [vexingMaliceRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.playAttack(vexingMaliceRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(18);
    expectCombat(game).toBeOpen().toHaveAttackPower(3);

    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Chane, vexingMaliceRed).toBeIn("graveyard");
  });

  it("boundary: Arcane Barrier 1 prevents 1 of the 2 arcane; combat still deals 3", () => {
    const game = FabTestEngine.start(
      { hero: chane, hand: [vexingMaliceRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], resourcePoints: 1, head: [nullruneHood], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(vexingMaliceRed, { target: Dash.id });
    game.passBoth();
    const choice = Dash.expectDecision("option");
    Dash.chooseOptions(choice.options[0]!.id);

    expectFabPlayer(Dash).toHaveLife(19);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Dash).toHaveResourceCount(0);
  });

  it("timing: arcane ping resolves onto the chain before combat damage", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        life: 20,
        hand: [vexingMaliceRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.playAttack(vexingMaliceRed);
    expectFabPlayer(Dash).toHaveLife(18);
    expect(game.combat()).not.toBeNull();
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveLife(15);
  });
});
