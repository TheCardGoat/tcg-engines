import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { inTheSwingRed } from "./in-the-swing.ts";

/**
 * In the Swing Red (EVR063) — Warrior Attack Reaction.
 *
 * Printed:
 *   Play this only if you've attacked 2 or more times with weapons this turn.
 *   Target weapon attack gains +3{p}.
 */

describe("in-the-swing family AAA", () => {
  it("happy: +3 power after two weapon attacks this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        weapon2: [cintariSaber],
        hand: [inTheSwingRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);
    const first = Kassai.cardIn("weapon1", cintariSaber);
    const second = Kassai.cardIn("weapon2", cintariSaber);

    Kassai.must.activate(first);
    game.advanceCombatTo("defend");
    game.as(dash).must.defend();
    game.helpers.resolveRestOfCombat();

    Kassai.must.activate(second);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(inTheSwingRed);
    game.passBoth();

    // Second Cintari Saber base 2 + 3 = 5.
    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Kassai, inTheSwingRed).toBeIn("graveyard");
  });

  it("boundary: cannot play after only one weapon attack", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [inTheSwingRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.activate(cintariSaber);
    game.advanceCombatTo("reaction");

    expect(() => Kassai.must.playReaction(inTheSwingRed)).toThrow();
  });
});
