import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fang } from "../heroes/fang.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { quicksilverDagger } from "../weapons/quicksilver-dagger.ts";
import { imperialIntentRed } from "./imperial-intent.ts";

/**
 * Imperial Intent (HNT109) — Draconic Warrior Attack Reaction, cost 1, 2{d}.
 *
 * Printed: "This costs {r} less to play for each Draconic chain link you control.
 * Target dagger attack gets +2{p}."
 */

describe("Imperial Intent (HNT109) AAA", () => {
  it("happy: one Draconic chain link plays this for 0{r} and the dagger gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [imperialIntentRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.activate(obsidianFireVein);
    expectFabPlayer(Fang).toHaveResourceCount(1);
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(imperialIntentRed);
    game.passBoth();

    expectFabPlayer(Fang).toHaveResourceCount(1);
    // 1 + 2 — this link's Draconic reaction also turns on Obsidian Fire
    // Vein's printed "+1{p} and go again".
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Fang, imperialIntentRed).toBeIn("graveyard");
  });

  it("boundary: a non-Draconic dagger attack pays the printed 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [quicksilverDagger],
        hand: [imperialIntentRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.activate(quicksilverDagger);
    expectFabPlayer(Fang).toHaveResourceCount(1);
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(imperialIntentRed);
    game.passBoth();

    expectFabPlayer(Fang).toHaveResourceCount(0);
    expectCombat(game).toHaveAttackPower(3);
    expectFabCard(Fang, imperialIntentRed).toBeIn("graveyard");
  });

  it("timing: the +2{p} applies in the reaction step before damage", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [imperialIntentRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);
    const Dash = game.as(dash);

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("reaction");
    expectCombat(game).toHaveAttackPower(1);

    Fang.must.playReaction(imperialIntentRed);
    game.passBoth();
    // 1 + 2 + Obsidian Fire Vein's live Draconic-link +1{p}.
    expectCombat(game).toHaveAttackPower(4);

    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(16);
  });
});
