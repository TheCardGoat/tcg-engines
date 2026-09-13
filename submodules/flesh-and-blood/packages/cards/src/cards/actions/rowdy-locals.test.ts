import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { snatchRed } from "./snatch.ts";
import { ironrotHelm } from "../equipment/ironrot-helm.ts";
import { rowdyLocalsBlue } from "./rowdy-locals.ts";

describe("Rowdy Locals (MST191) AAA", () => {
  it("happy: defended by an action card gets +2{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [rowdyLocalsBlue], actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Azalea = game.as(azalea);

    Dash.playAttack(rowdyLocalsBlue);
    game.advanceCombatTo("defend");
    Azalea.defendWith(snatchRed);

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Dash, rowdyLocalsBlue).toBeIn("combatChain");
  });

  it("boundary: not defended by an action card stays at printed 2{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [rowdyLocalsBlue], actionPoints: 1, deck: 6 },
      { hero: azalea, head: [ironrotHelm], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Azalea = game.as(azalea);

    Dash.playAttack(rowdyLocalsBlue);
    game.advanceCombatTo("defend");
    Azalea.defendWith(ironrotHelm);

    expectCombat(game).toHaveAttackPower(2);
  });

  it("timing: playing this opens combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [rowdyLocalsBlue], actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(dash).playAttack(rowdyLocalsBlue);
    expect(game.combat()).not.toBeNull();
    expectCombat(game).toHaveAttackPower(2);
  });
});
