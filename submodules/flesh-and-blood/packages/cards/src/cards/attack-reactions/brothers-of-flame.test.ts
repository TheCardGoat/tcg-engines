import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fang } from "../heroes/fang.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { huntToTheEndsOfRatheRed } from "../actions/hunt-to-the-ends-of-rathe.ts";
import { brothersOfFlameRed } from "./brothers-of-flame.ts";

/**
 * Brothers of Flame (HNT107) — Draconic Warrior Attack Reaction, cost 1, 3{d}.
 *
 * Printed: "Play this only if you control 2 or more Draconic chain links.
 * Target dagger attack gets +4{p}."
 */

describe("Brothers of Flame (HNT107) AAA", () => {
  it("happy: two Draconic chain links let a dagger attack get +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [huntToTheEndsOfRatheRed, brothersOfFlameRed],
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
    Fang.must.playReaction(brothersOfFlameRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Fang, brothersOfFlameRed).toBeIn("graveyard");
  });

  it("boundary: a single Draconic chain link cannot play this", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [brothersOfFlameRed],
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
    expect(() => Fang.must.playReaction(brothersOfFlameRed)).toThrow(
      /play condition is not satisfied/,
    );
    expectFabCard(Fang, brothersOfFlameRed).toBeIn("hand");
  });

  it("timing: the +4{p} applies in the reaction step before damage", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [huntToTheEndsOfRatheRed, brothersOfFlameRed],
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
    expectCombat(game).toHaveAttackPower(1);

    Fang.must.playReaction(brothersOfFlameRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(5);

    game.helpers.resolveRestOfCombat();
    // Hunt 2 + dagger 5.
    expect(Dash.life()).toBe(13);
  });
});
