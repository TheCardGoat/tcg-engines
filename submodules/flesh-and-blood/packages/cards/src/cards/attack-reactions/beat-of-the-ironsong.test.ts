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
import { dawnblade } from "../weapons/dawnblade.ts";
import { beatOfTheIronsongBlue } from "./beat-of-the-ironsong.ts";

/**
 * Beat of the Ironsong Blue (SUP251) — Warrior Attack Reaction.
 *
 * Printed:
 *   Choose X+1, where X is the number of +1{p} counters on an attacking Dawnblade;
 *   - Target Dawnblade attack gets +1{p}.
 *   - Target Dawnblade attack gets go again.
 *   - Cards defending target Dawnblade attack can't gain {d}.
 *   - Damage target Dawnblade attack would deal can't be prevented.
 */

describe("Beat of the Ironsong (SUP251) AAA", () => {
  it("happy: 0 counters chooses +1 power on the Dawnblade attack", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [dawnblade],
        hand: [beatOfTheIronsongBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.activate(dawnblade);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(beatOfTheIronsongBlue, { modeIndexes: [0] });
    game.passBoth();

    // Dawnblade base 3 + mode "+1{p}" = 4.
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Kassai, beatOfTheIronsongBlue).toBeIn("graveyard");
  });

  it("boundary: cannot target a non-Dawnblade weapon attack", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [beatOfTheIronsongBlue],
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

    expect(() => Kassai.must.playReaction(beatOfTheIronsongBlue, { modeIndexes: [0] })).toThrow();
  });
});
