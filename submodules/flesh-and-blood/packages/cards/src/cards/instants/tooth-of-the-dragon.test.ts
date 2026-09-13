import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { fang } from "../heroes/fang.ts";
import { dash } from "../heroes/dash.ts";
import { phoenixFlameRed } from "../actions/phoenix-flame.ts";
import { forTheDracaiRed } from "../actions/for-the-dracai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { toothOfTheDragonRed } from "./tooth-of-the-dragon.ts";

/**
 * Tooth of the Dragon (FNG021) — Draconic Instant, cost 0.
 *
 * Printed: "Your next Draconic attack this turn gets +3{p}."
 */

describe("Tooth of the Dragon (FNG021) AAA", () => {
  it("happy: the next Draconic attack this turn gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [toothOfTheDragonRed, forTheDracaiRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.play(toothOfTheDragonRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Fang).toHaveAP(1);
    expectFabCard(Fang, toothOfTheDragonRed).toBeIn("graveyard");

    Fang.must.playAttack(forTheDracaiRed);
    game.advanceCombatTo("defend");
    // For the Dracai 4 + 3 = 7.
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: a Generic attack gets no +3{p} and does not consume the latch", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [toothOfTheDragonRed, snatchRed, forTheDracaiRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.play(toothOfTheDragonRed);
    game.helpers.resolveUntilIdle();

    Fang.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);

    game.advanceCombatTo("resolution");
    Fang.must.playAttack(forTheDracaiRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
  });

  it("timing: the modifier is consumed by the first Draconic attack", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [toothOfTheDragonRed, forTheDracaiRed, phoenixFlameRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.play(toothOfTheDragonRed);
    game.helpers.resolveUntilIdle();

    Fang.must.playAttack(forTheDracaiRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
    game.helpers.resolveRestOfCombat();

    Fang.must.playAttack(phoenixFlameRed);
    game.advanceCombatTo("defend");
    // Phoenix Flame printed 0{p}; the +3 latch was consumed.
    expectCombat(game).toHaveAttackPower(0);
  });
});
