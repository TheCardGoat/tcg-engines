import { describe, expect, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { kunaiOfRetribution } from "../weapons/kunai-of-retribution.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { cindraDracaiOfRetribution } from "./cindra-dracai-of-retribution.ts";

/**
 * Cindra, Dracai of Retribution (HNT054) — Royal Draconic Ninja Hero.
 *
 * Printed: Whenever you hit a marked hero, create a Fealty token.
 * Once per Turn Instant - {r}{r}{r}: Equip up to 2 Draconic daggers from your
 * graveyard. This costs {r} less to activate for each Draconic chain link
 * you control.
 */

describe("Cindra, Dracai of Retribution (HNT054) AAA", () => {
  it("happy: hitting a marked hero creates a Fealty token under Cindra's control", () => {
    const game = FabTestEngine.start(
      {
        hero: cindraDracaiOfRetribution,
        weapon1: [kunaiOfRetribution],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], marked: true, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Cindra = game.as(cindraDracaiOfRetribution);
    const Dash = game.as(dash);

    Cindra.activate(kunaiOfRetribution);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(19);
    expect(Cindra.zone("arena")).toContain("token:fealty");
    expect(Dash.zone("arena")).not.toContain("token:fealty");
  });

  it("boundary: hitting an unmarked hero does not create a Fealty token", () => {
    const game = FabTestEngine.start(
      {
        hero: cindraDracaiOfRetribution,
        weapon1: [kunaiOfRetribution],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Cindra = game.as(cindraDracaiOfRetribution);

    Cindra.activate(kunaiOfRetribution);
    game.helpers.resolveRestOfCombat();

    expect(Cindra.zone("arena")).not.toContain("token:fealty");
  });

  it("happy: a2 equips up to 2 Draconic daggers from the graveyard for {r}{r}{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: cindraDracaiOfRetribution,
        graveyard: [kunaiOfRetribution, obsidianFireVein],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Cindra = game.as(cindraDracaiOfRetribution);

    Cindra.activate(cindraDracaiOfRetribution);
    game.helpers.resolveUntilIdle({ entityTargets: "maximum" });

    const weapons = [...Cindra.zone("weapon1"), ...Cindra.zone("weapon2")];
    expect(weapons).toContain(kunaiOfRetribution.canonicalId);
    expect(weapons).toContain(obsidianFireVein.canonicalId);
    expect(Cindra.zone("graveyard")).not.toContain(kunaiOfRetribution.canonicalId);
    expect(Cindra.zone("graveyard")).not.toContain(obsidianFireVein.canonicalId);
    expectFabPlayer(Cindra).toHaveResourceCount(0);
  });

  it("boundary: a2 is once per turn", () => {
    const game = FabTestEngine.start(
      {
        hero: cindraDracaiOfRetribution,
        graveyard: [kunaiOfRetribution, obsidianFireVein],
        hand: [],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Cindra = game.as(cindraDracaiOfRetribution);

    Cindra.activate(cindraDracaiOfRetribution);
    game.helpers.resolveUntilIdle({ entityTargets: "maximum" });
    expectFabPlayer(Cindra).toHaveResourceCount(3);

    Cindra.expectActivationRejected(cindraDracaiOfRetribution);
  });

  it("timing: an open Draconic chain link discounts a2 to {r}{r} mid-combat", () => {
    const game = FabTestEngine.start(
      {
        hero: cindraDracaiOfRetribution,
        weapon1: [kunaiOfRetribution],
        graveyard: [obsidianFireVein],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Cindra = game.as(cindraDracaiOfRetribution);

    Cindra.activate(kunaiOfRetribution);
    game.passBoth();
    expect(game.combat()?.open).toBe(true);

    Cindra.activate(cindraDracaiOfRetribution);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: obsidianFireVein.canonicalId,
    });

    expectFabPlayer(Cindra).toHaveResourceCount(0);
    expect(Cindra.zone("weapon2")).toContain(obsidianFireVein.canonicalId);
    expect(Cindra.zone("graveyard")).not.toContain(obsidianFireVein.canonicalId);
    expect(game.combat()).toBeNull();
  });
});
