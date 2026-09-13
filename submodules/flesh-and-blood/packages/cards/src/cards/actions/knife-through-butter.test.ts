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
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { knifeThroughButterRed } from "./knife-through-butter.ts";

/**
 * Knife Through Butter (HNT134) — Warrior Action, cost 1, 3{d}, go again.
 *
 * Printed: "Your next dagger attack this turn gets +4{p}.
 * Whenever you attack a marked hero this turn, the attack gets go again.
 * Go again"
 */

describe("Knife Through Butter (HNT134) AAA", () => {
  it("happy: the next dagger attack this turn gets +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [knifeThroughButterRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.play(knifeThroughButterRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Fang).toHaveAP(1);
    expectFabCard(Fang, knifeThroughButterRed).toBeIn("graveyard");

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("defend");
    // Obsidian Fire Vein 1 + 4 = 5.
    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: an unmarked non-dagger attack stays at printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [knifeThroughButterRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.play(knifeThroughButterRed);
    game.helpers.resolveUntilIdle();
    Fang.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("timing: attacking a marked hero grants go again this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [knifeThroughButterRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], marked: true, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.play(knifeThroughButterRed);
    game.helpers.resolveUntilIdle();
    Fang.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Fang).toHaveAP(1);
  });
});
