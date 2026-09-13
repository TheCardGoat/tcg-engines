import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { knifeThroughRed } from "./knife-through.ts";

/**
 * Knife Through, Red (PEN147) — go again if you've hit with a dagger this combat chain.
 */

describe("Knife Through (PEN147) AAA", () => {
  it("happy: after a dagger hit this combat chain, this has go again", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [nerveScalpel],
        hand: [knifeThroughRed],
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
    Arakni.attackWith(knifeThroughRed);
    game.passBoth();

    expectCombat(game).toHaveKeyword("go-again").toHaveAttackPower(3);
  });

  it("boundary: as the first attack this combat chain, this does not have go again", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [knifeThroughRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.attackWith(knifeThroughRed);
    game.passBoth();

    expectCombat(game).notToHaveKeyword("go-again").toHaveAttackPower(3);
  });
});
