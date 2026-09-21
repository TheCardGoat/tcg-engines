import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { huntToTheEndsOfRatheRed } from "../actions/hunt-to-the-ends-of-rathe.ts";
import { snatchRed } from "../actions/snatch.ts";
import { fang } from "../heroes/fang.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { stabbingPainRed } from "./stabbing-pain.ts";

/**
 * Stabbing Pain (FNG017) — Draconic Warrior Attack Reaction, cost 1, 2{d}.
 *
 * Printed: Target dagger attack gets +3{p}. If you control 2 or more
 * Draconic chain links, it gets "When this hits a hero, mark them."
 */

describe("Stabbing Pain (FNG017) AAA", () => {
  it("happy: two Draconic chain links give the dagger +3{p} and mark on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [huntToTheEndsOfRatheRed, stabbingPainRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);
    const Dash = game.as(dash);

    Fang.must.playAttack(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(stabbingPainRed);
    game.passBoth();

    // + Obsidian Fire Vein's live Draconic-link +1{p}.
    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Fang, stabbingPainRed).toBeIn("graveyard");
    expectFabPlayer(Dash).notToBeMarked();

    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toBeMarked();
  });

  it("boundary: a single Draconic chain link gives +3{p} but does not mark", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [stabbingPainRed],
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
    Fang.must.playReaction(stabbingPainRed);
    game.passBoth();

    // + Obsidian Fire Vein's live Draconic-link +1{p}.
    expectCombat(game).toHaveAttackPower(5);

    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).notToBeMarked();
  });

  it("timing: cannot target a non-dagger attack", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [snatchRed, stabbingPainRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Fang.must.playReaction(stabbingPainRed));

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Fang, stabbingPainRed).toBeIn("hand");
  });
});
