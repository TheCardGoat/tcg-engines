import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { quicksilverDagger } from "../weapons/quicksilver-dagger.ts";
import { snatchRed } from "./snatch.ts";
import { fang } from "../heroes/fang.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { swornVengeanceRed } from "./sworn-vengeance.ts";

/**
 * Sworn Vengeance (FNG019) — Warrior Action, cost 0, 3{d}, go again.
 *
 * Printed: Your next dagger attack this turn gets +3{p} and
 * "When this hits a hero, mark them."
 * Go again
 */

describe("Sworn Vengeance (FNG019) AAA", () => {
  it("happy: the next dagger attack gets +3{p} and marks on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [swornVengeanceRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);
    const Dash = game.as(dash);

    Fang.must.play(swornVengeanceRed);
    game.passBoth();
    expectFabCard(Fang, swornVengeanceRed).toBeIn("graveyard");
    expectFabPlayer(Fang).toHaveAP(1);

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
    expectFabPlayer(Dash).notToBeMarked();

    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toBeMarked();
  });

  it("boundary: a non-dagger attack is not the next dagger attack", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [swornVengeanceRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.play(swornVengeanceRed);
    game.passBoth();
    Fang.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: a second dagger attack this turn does not get +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        weapon2: [quicksilverDagger],
        hand: [swornVengeanceRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.play(swornVengeanceRed);
    game.passBoth();
    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();

    Fang.must.activate(quicksilverDagger);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(1);
  });
});
