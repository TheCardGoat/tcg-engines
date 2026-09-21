import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fang } from "../heroes/fang.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { arcticIncarcerationRed } from "../actions/arctic-incarceration.ts";
import { snatchRed } from "../actions/snatch.ts";
import { smolderingSteelRed } from "./smoldering-steel.ts";

/**
 * Smoldering Steel (PEN251) — Draconic Warrior Attack Reaction, cost 0.
 * Printed: Target dagger attack gets +1{p} and "When this hits a hero, deal
 * 1 damage to them." While this is in your graveyard, if 1 or more Frostbite
 * tokens would be created under your control, instead you may banish this.
 */

describe("Smoldering Steel (PEN251) AAA", () => {
  it("happy: a dagger attack gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [smolderingSteelRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(smolderingSteelRed);
    game.passBoth();

    // 1 + 1 — this link's Draconic reaction also turns on Obsidian Fire
    // Vein's printed "+1{p} and go again".
    expectCombat(game).toHaveAttackPower(3);
    expectFabCard(Fang, smolderingSteelRed).toBeIn("graveyard");
  });

  it("boundary: cannot target a non-dagger attack", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [snatchRed, smolderingSteelRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Fang.must.playReaction(smolderingSteelRed));
    expectFabCard(Fang, smolderingSteelRed).toBeIn("hand");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("happy: while in graveyard, you may banish this instead of creating Frostbites", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [arcticIncarcerationRed],
        graveyard: [smolderingSteelRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.play(arcticIncarcerationRed, { target: Fang.id });
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Fang, smolderingSteelRed).toBeIn("banished");
    expectFabPlayer(Fang).toHaveTokenCount("frostbite", 0);
  });

  it("boundary: declining the GY replacement still creates the Frostbites", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [arcticIncarcerationRed],
        graveyard: [smolderingSteelRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.play(arcticIncarcerationRed, { target: Fang.id });
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Fang, smolderingSteelRed).toBeIn("graveyard");
    expectFabPlayer(Fang).toHaveTokenCount("frostbite", 3);
  });
});
