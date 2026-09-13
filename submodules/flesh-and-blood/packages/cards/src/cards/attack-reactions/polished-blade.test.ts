import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { snatchRed } from "../actions/snatch.ts";
import { polishedBladeRed } from "./polished-blade.ts";

/**
 * Polished Blade (AHA009) — Warrior Attack Reaction, cost 0, 3{d}.
 *
 * Printed: "As an additional cost to play this, remove 1 or more +1{p}
 * counters from an attacking sword on the active chain link. Choose that
 * many modes plus 1."
 */

describe("Polished Blade (AHA009) AAA", () => {
  it("happy: removing 1 +1{p} counter from the attacking sword pays the additional cost", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [polishedBladeRed],
        weapon1: [{ card: dawnblade, state: { powerCounterTotal: 2 } }],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.activate(dawnblade);
    game.passBoth();
    game.advanceCombatTo("reaction");

    Dori.play(polishedBladeRed, {
      modeIds: [
        "gggJzRrtDDmNMKht6Whk7:removeCountersAndChooseModes:gainGoAgain",
        "gggJzRrtDDmNMKht6Whk7:removeCountersAndChooseModes:additionalSwordAttack",
      ],
    });
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Dori, polishedBladeRed).toBeIn("stack");
  });

  it("boundary: with no +1{p} counters the additional cost cannot be paid", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [polishedBladeRed],
        weapon1: [dawnblade],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.activate(dawnblade);
    game.passBoth();
    game.advanceCombatTo("reaction");

    expectFabUnplayable(() => Dori.play(polishedBladeRed));
    expect(Dori.zone("hand")).toContain(polishedBladeRed.canonicalId);
  });

  it("defense: blocks for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [polishedBladeRed, snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dori.activate(dawnblade);
    game.passBoth();
    game.advanceCombatTo("defend");
    Dash.defendWith([polishedBladeRed]);
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(20);
    expect(Dash.zone("graveyard")).toContain(polishedBladeRed.canonicalId);
  });
});
