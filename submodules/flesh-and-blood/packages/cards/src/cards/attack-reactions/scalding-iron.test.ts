import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fang } from "../heroes/fang.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { quicksilverDagger } from "../weapons/quicksilver-dagger.ts";
import { huntToTheEndsOfRatheRed } from "../actions/hunt-to-the-ends-of-rathe.ts";
import { scaldingIronRed } from "./scalding-iron.ts";

/**
 * Scalding Iron (HNT110) — Draconic Warrior Attack Reaction, cost 0, 2{d}.
 *
 * Printed: "Target dagger attack gets +X{p}, where X is the number of
 * Draconic chain links you control."
 */

describe("Scalding Iron (HNT110) AAA", () => {
  it("happy: one Draconic chain link gives the dagger +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [scaldingIronRed],
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
    Fang.must.playReaction(scaldingIronRed);
    game.passBoth();

    // 1 + 1 — this link's Draconic reaction also turns on Obsidian Fire
    // Vein's printed "+1{p} and go again".
    expectCombat(game).toHaveAttackPower(3);
    expectFabCard(Fang, scaldingIronRed).toBeIn("graveyard");
  });

  it("boundary: zero Draconic chain links grants +0{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [quicksilverDagger],
        hand: [scaldingIronRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.activate(quicksilverDagger);
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(scaldingIronRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(1);
    expectFabCard(Fang, scaldingIronRed).toBeIn("graveyard");
  });

  it("timing: two Draconic chain links give the dagger +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [huntToTheEndsOfRatheRed, scaldingIronRed],
        resourcePoints: 1,
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
    Fang.must.playReaction(scaldingIronRed);
    game.passBoth();

    // 1 + 1 + Obsidian Fire Vein's live Draconic-link +1{p}.
    expectCombat(game).toHaveAttackPower(4);
  });
});
