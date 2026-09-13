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
import { huntToTheEndsOfRatheRed } from "../actions/hunt-to-the-ends-of-rathe.ts";
import { snatchRed } from "../actions/snatch.ts";
import { fang } from "../heroes/fang.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { searingGazeRed } from "./searing-gaze.ts";

/**
 * Searing Gaze (FNG016) — Draconic Warrior Attack Reaction, cost 0, 2{d}.
 *
 * Printed: Target dagger attack gets +2{p}. If you control 2 or more
 * Draconic chain links, it gets "When this hits a hero, mark them."
 */

describe("Searing Gaze (FNG016) AAA", () => {
  it("happy: two Draconic chain links give the dagger +2{p} and mark on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [huntToTheEndsOfRatheRed, searingGazeRed],
        resourcePoints: 1,
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
    Fang.must.playReaction(searingGazeRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(3);
    expectFabCard(Fang, searingGazeRed).toBeIn("graveyard");
    expectFabPlayer(Dash).notToBeMarked();

    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toBeMarked();
  });

  it("boundary: a single Draconic chain link gives +2{p} but does not mark", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [searingGazeRed],
        resourcePoints: 1,
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
    Fang.must.playReaction(searingGazeRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(3);

    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).notToBeMarked();
  });

  it("timing: cannot target a non-dagger attack", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [snatchRed, searingGazeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Fang.must.playReaction(searingGazeRed));

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Fang, searingGazeRed).toBeIn("hand");
  });
});
