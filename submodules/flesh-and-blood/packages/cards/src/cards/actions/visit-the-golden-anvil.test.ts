import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { olympia } from "../heroes/olympia.ts";
import { hotStreak } from "../weapons/hot-streak.ts";
import { prizedGalea } from "../equipment/prized-galea.ts";
import { visitTheGoldenAnvilBlue } from "./visit-the-golden-anvil.ts";

/**
 * Visit the Golden Anvil (MST226) — Warrior Action, Olympia Specialization.
 *
 * Printed: As an additional cost to play this, destroy X Gold you control.
 * Equip X weapons and/or equipment from your inventory.
 *
 * typeBox.types:["Weapon","Equipment"] is AND; printed and/or is `or` of two
 * type-boxes. At-resolution `{ type: "x" }` must resolve from costBindings so
 * CR 1.8.6c can auto-bind (X=0 is determined empty).
 */

describe("Visit the Golden Anvil (MST226) AAA", () => {
  it("happy: X=1 destroys a Gold and equips Prized Galea from inventory", () => {
    const game = FabTestEngine.start(
      {
        hero: olympia,
        hand: [visitTheGoldenAnvilBlue],
        arena: [fabToken("gold")],
        inventory: [prizedGalea],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympia);

    Olympia.play(visitTheGoldenAnvilBlue, { xValue: 1 });
    game.untilIdle({ ordering: "listed" });

    expectFabPlayer(Olympia).toHaveTokenCount("gold", 0);
    expectFabCard(Olympia, prizedGalea).toBeIn("head");
    expectFabCard(Olympia, visitTheGoldenAnvilBlue).toBeIn("graveyard");
  });

  it("boundary: X=0 destroys no Gold and equips nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: olympia,
        hand: [visitTheGoldenAnvilBlue],
        arena: [fabToken("gold")],
        inventory: [prizedGalea],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympia);

    Olympia.play(visitTheGoldenAnvilBlue, { xValue: 0 });
    game.untilIdle({ ordering: "listed" });

    expectFabPlayer(Olympia).toHaveTokenCount("gold", 1);
    expect(Olympia.cardsIn("inventory", prizedGalea)).toHaveLength(1);
    expectFabCard(Olympia, visitTheGoldenAnvilBlue).toBeIn("graveyard");
  });

  it("timing: X=1 with two inventory cards equips the chosen weapon, not the helm", () => {
    const game = FabTestEngine.start(
      {
        hero: olympia,
        hand: [visitTheGoldenAnvilBlue],
        arena: [fabToken("gold")],
        inventory: [prizedGalea, hotStreak],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympia);

    const sword = Olympia.cardsIn("inventory", hotStreak)[0]!;
    Olympia.play(visitTheGoldenAnvilBlue, { xValue: 1 });
    game.passBoth();
    Olympia.target(sword);
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Olympia, hotStreak).toBeIn("weapon1");
    expect(Olympia.cardsIn("inventory", prizedGalea)).toHaveLength(1);
    expectFabPlayer(Olympia).toHaveTokenCount("gold", 0);
  });
});
