import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rebelliousRushYellow } from "../actions/rebellious-rush.ts";
import { fang } from "../heroes/fang.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { snatchRed } from "../actions/snatch.ts";
import { blisteringBladeRed } from "./blistering-blade.ts";

/**
 * Blistering Blade (FNG010) — Draconic Warrior Attack Reaction, cost 0, 2{d}.
 *
 * Printed: Target dagger attack gets +2{p}. If you control 2 or more
 * Draconic chain links, instead it gets +3{p}.
 */

describe("Blistering Blade (FNG010) family AAA", () => {
  it("happy: target dagger attack gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [blisteringBladeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(blisteringBladeRed);
    game.passBoth();

    // Obsidian Fire Vein 1 + 2 (this link's Draconic reaction turns on its
    // printed "+1{p} and go again").
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Fang, blisteringBladeRed).toBeIn("graveyard");
  });

  it("instead: with 2 or more Draconic chain links the dagger gets +3{p} (not +2, not +5)", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [rebelliousRushYellow, blisteringBladeRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      // Manual harness: keep the chain open across links (CR 7.0.1).
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    // Chain link 1: a go-again Draconic attack resolves without closing the
    // chain, so the dagger attack opens link 2 of the SAME chain.
    Fang.playAttack(rebelliousRushYellow);
    game.as(dash).defendWith();
    game.advanceCombatTo("resolution");
    game.advanceCombatTo("resolution");
    expectCombat(game).toBeOpen();

    // Chain link 2: attack with the Draconic dagger weapon.
    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(blisteringBladeRed, {
      // Weapon attacks are targeted through their weapon-zone attack proxy.
      targetInstanceId: Fang.cardIn("weapon1", obsidianFireVein).instanceId,
    });
    game.passBoth();

    // Obsidian Fire Vein 1 + 3 (the instead branch replaces the +2) + its
    // live Draconic-link +1{p}.
    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Fang, blisteringBladeRed).toBeIn("graveyard");
  });

  it("boundary: targeting a non-dagger attack does not grant +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [blisteringBladeRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() =>
      Fang.must.playReaction(blisteringBladeRed, {
        targetInstanceId: Fang.cardIn("combatChain", snatchRed).instanceId,
      }),
    );
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
  });
});
