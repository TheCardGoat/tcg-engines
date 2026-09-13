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
import { fang } from "../heroes/fang.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { snatchRed } from "./snatch.ts";
import { huntAKillerRed } from "./hunt-a-killer.ts";

/**
 * Hunt a Killer (HNT131) — Warrior Action, cost 1, 3{d}, go again.
 *
 * Printed: "Your next dagger attack this turn gets +4{p} and
 * \"When this hits a hero, mark them.\"
 * Go again"
 */

describe("hunt-a-killer family AAA", () => {
  it("happy: the next dagger attack this turn gets +4{p} and marks the hero it hits", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [huntAKillerRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);
    const Dash = game.as(dash);

    Fang.play(huntAKillerRed);
    game.untilIdle();
    expectFabPlayer(Fang).toHaveAP(1);
    expectFabCard(Fang, huntAKillerRed).toBeIn("graveyard");

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("defend");
    // Obsidian Fire Vein 1 + 4 = 5.
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabPlayer(Dash).toBeMarked();
  });

  it("boundary: a non-dagger attack stays at printed power and does not mark", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [huntAKillerRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);
    const Dash = game.as(dash);

    Fang.play(huntAKillerRed);
    game.untilIdle();
    Fang.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Dash).notToBeMarked();
  });

  it("timing: only the next dagger this turn gets +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        weapon2: [quicksilverDagger],
        hand: [huntAKillerRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.play(huntAKillerRed);
    game.untilIdle();
    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat({ optionals: "decline" });

    Fang.must.activate(quicksilverDagger);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(1);
  });
});
