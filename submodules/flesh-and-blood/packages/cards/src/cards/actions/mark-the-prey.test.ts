import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { markThePreyRed } from "./mark-the-prey.ts";

describe("Mark the Prey (HNT038) AAA", () => {
  it("happy: hitting a hero marks them", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [markThePreyRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(markThePreyRed);
    expectCombat(game).toHaveAttackPower(3);
    expectCombat(game).toHaveKeyword("stealth");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Dash).toBeMarked();
  });

  it("boundary: a miss does not mark the defending hero", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [markThePreyRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(markThePreyRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(brutalAssaultBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Dash).notToBeMarked();
  });

  it("timing: the mark remains after combat closes", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [markThePreyRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(markThePreyRed);
    game.helpers.resolveRestOfCombat();

    expect(game.combat()).toBeNull();
    expectFabPlayer(Dash).toBeMarked();
  });
});
