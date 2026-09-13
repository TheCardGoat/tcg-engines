import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { huntToTheEndsOfRatheRed } from "../actions/hunt-to-the-ends-of-rathe.ts";
import { fang } from "../heroes/fang.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { snatchRed } from "../actions/snatch.ts";
import { sizzlingSteelRed } from "./sizzling-steel.ts";

/**
 * Sizzling Steel (HNT113) — Draconic Warrior Attack Reaction, cost 1, 2{d}.
 *
 * Printed: Target dagger attack gets +3{p}. If you control 2 or more
 * Draconic chain links, instead it gets +4{p}.
 */

describe("Sizzling Steel (HNT113) AAA", () => {
  it("happy: a dagger attack gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [sizzlingSteelRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(sizzlingSteelRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Fang, sizzlingSteelRed).toBeIn("graveyard");
  });

  it("timing: two Draconic chain links instead give +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [huntToTheEndsOfRatheRed, sizzlingSteelRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.playAttack(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(sizzlingSteelRed);
    game.passBoth();

    // Obsidian Fire Vein printed 1 + 4 = 5.
    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Fang, sizzlingSteelRed).toBeIn("graveyard");
  });

  it("boundary: cannot target a non-dagger attack", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [snatchRed, sizzlingSteelRed],
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
    expectFabUnplayable(() => Fang.must.playReaction(sizzlingSteelRed));

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Fang, sizzlingSteelRed).toBeIn("hand");
  });
});
