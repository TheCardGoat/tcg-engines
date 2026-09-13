import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { anothos } from "../weapons/anothos.ts";
import { snatchRed } from "../actions/snatch.ts";
import { frailty } from "./frailty.ts";

describe("Frailty (ARA028) AAA", () => {
  it("happy: an attack action played from arsenal has -1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [frailty],
        hand: [],
        arsenal: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(snatchRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: an attack action played from hand is not reduced", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [frailty],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: Frailty is destroyed at the beginning of your end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [frailty],
        weapon1: [anothos],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(anothos);
    expectCombat(game).toHaveAttackPower(3);
    game.helpers.resolveRestOfCombat();

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    expect(Bravo.zone("arena")).not.toContain(frailty.canonicalId);
  });
});
