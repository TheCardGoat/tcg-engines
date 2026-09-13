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
import { snatchRed } from "./snatch.ts";
import { pointOfEngagementRed } from "./point-of-engagement.ts";

/**
 * Point of Engagement (HNT137) — Warrior Action, cost 0, 3{d}, go again.
 *
 * Printed: "Your next dagger attack this turn gets +3{p}.
 * Until end of turn, your attacks get +1{p} while attacking a marked hero.
 * Go again"
 */

describe("Point of Engagement (HNT137) AAA", () => {
  it("happy: the next dagger attack this turn gains +3{p} and go again refunds", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [pointOfEngagementRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.play(pointOfEngagementRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Fang).toHaveAP(1);
    expectFabCard(Fang, pointOfEngagementRed).toBeIn("graveyard");

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("defend");
    // Obsidian Fire Vein 1 + 3 = 4.
    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: an unmarked non-dagger attack stays at printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [pointOfEngagementRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.play(pointOfEngagementRed);
    game.helpers.resolveUntilIdle();

    Fang.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: attacks get +1{p} while attacking a marked hero this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [pointOfEngagementRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], marked: true, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.play(pointOfEngagementRed);
    game.helpers.resolveUntilIdle();
    Fang.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    // Snatch 4 + 1 vs marked = 5.
    expectCombat(game).toHaveAttackPower(5);
  });
});
