import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fang } from "../heroes/fang.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { quicksilverDagger } from "../weapons/quicksilver-dagger.ts";
import { snatchRed } from "../actions/snatch.ts";
import { dicedRed } from "./diced.ts";

/**
 * Diced (HNT119) — Warrior Attack Reaction, cost 0, 2{d}.
 *
 * Printed: "Target dagger attack gets +1{p}.
 * Your next dagger attack this turn gets +3{p}."
 */

describe("diced family AAA", () => {
  it("happy: the targeted dagger attack gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [dicedRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(dicedRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(2);
    expectFabCard(Fang, dicedRed).toBeIn("graveyard");
  });

  it("boundary: cannot target a non-dagger attack", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [snatchRed, dicedRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Fang.must.playReaction(dicedRed));

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Fang, dicedRed).toBeIn("hand");
  });

  it("timing: the next dagger attack this turn gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        weapon2: [quicksilverDagger],
        hand: [dicedRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(dicedRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(2);
    game.helpers.resolveRestOfCombat();

    Fang.must.activate(quicksilverDagger);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });
});
