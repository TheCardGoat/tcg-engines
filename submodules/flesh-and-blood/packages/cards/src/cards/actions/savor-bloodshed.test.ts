import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { savorBloodshedRed } from "./savor-bloodshed.ts";

/**
 * Savor Bloodshed (HNT198) — Assassin / Warrior Action, cost 0, 3{d}, go again.
 *
 * Printed: "Your next dagger attack this turn gets +4{p}.
 * The next time you hit a marked hero with a dagger this turn, draw a card.
 * Go again"
 *
 * The +4{p} latch is public on a dagger weapon attack. The hit-draw trigger
 * filters `hasStatus: "marked-with-dagger"` (unhandled) — pin the missing draw.
 */

describe("Savor Bloodshed (HNT198) AAA", () => {
  it("happy: the next dagger attack this turn gets +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [nerveScalpel],
        hand: [savorBloodshedRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.play(savorBloodshedRed);
    game.helpers.resolveUntilIdle();
    Arakni.activate(nerveScalpel);
    game.passBoth();
    game.advanceCombatTo("defend");

    // Nerve Scalpel printed 1 + 4 = 5.
    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Arakni, savorBloodshedRed).toBeIn("graveyard");
  });

  it("boundary: a non-dagger attack stays at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [savorBloodshedRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.play(savorBloodshedRed);
    game.helpers.resolveUntilIdle();
    Arakni.attackWith(snatchRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the action point spent to play it", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [savorBloodshedRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    expectFabPlayer(Arakni).toHaveAP(1);
    Arakni.play(savorBloodshedRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Arakni).toHaveAP(1);
  });

  it("happy: hitting a marked hero with a dagger draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [nerveScalpel],
        hand: [savorBloodshedRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], marked: true, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.play(savorBloodshedRed);
    game.helpers.resolveUntilIdle();
    Arakni.activate(nerveScalpel);
    game.passBoth();
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);

    game.closeCombat({ ordering: "listed" });
    game.helpers.untilIdle();
    expectFabPlayer(Arakni).toHaveHandCount(1);
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: arakni, hand: [savorBloodshedRed], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Arakni = game.as(arakni);

    Dash.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    Arakni.defendWith([savorBloodshedRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Arakni).toHaveLife(19);
    expectFabCard(Arakni, savorBloodshedRed).toBeIn("graveyard");
  });
});
