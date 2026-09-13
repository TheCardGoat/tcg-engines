import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { cutThroughRed } from "./cut-through.ts";

describe("Cut Through family AAA", () => {
  it("happy: after a dagger hit this combat chain, this is 4{p} with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [nerveScalpel],
        hand: [cutThroughRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.must.activate(nerveScalpel);
    game.advanceCombatTo("resolution");
    Arakni.attackWith(cutThroughRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4).toHaveKeyword("go-again");
  });

  it("boundary: as the first attack this combat chain, this stays 3{p} without go again", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [cutThroughRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.attackWith(cutThroughRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(3).notToHaveKeyword("go-again");
  });

  it("timing: without a dagger hit, go again does not refund AP", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [cutThroughRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.playAttack(cutThroughRed);
    game.closeCombat();

    expectFabPlayer(Arakni).toHaveAP(0);
  });
});
