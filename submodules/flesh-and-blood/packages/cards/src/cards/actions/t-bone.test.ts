import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { teklovossen } from "../heroes/teklovossen.ts";
import { dash } from "../heroes/dash.ts";
import { ironrotGauntlet } from "../equipment/ironrot-gauntlet.ts";
import { snatchRed } from "./snatch.ts";
import { tBoneRed } from "./t-bone.ts";

describe("T-Bone (EVR073) AAA", () => {
  it("happy: a boosted chain forces the defending hero to block with equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [tBoneRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
        actionPoints: 1,
      },
      { hero: dash, arms: [ironrotGauntlet], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const Dash = game.as(dash);

    Teklo.attackWith(tBoneRed, { boost: true });
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    game.advanceCombatTo("defend");
    const rejected = Dash.expectBlockRejected([]);
    expect(rejected.errorCode).toBeDefined();
    Dash.defendWith(ironrotGauntlet);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(18);
  });

  it("timing: without equipment the defender may decline even when boosted", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [tBoneRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(tBoneRed, { boost: true });
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(17);
  });

  it("boundary: without a boosted card the defender may decline to block", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [tBoneRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arms: [ironrotGauntlet], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(tBoneRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(17);
  });
});
