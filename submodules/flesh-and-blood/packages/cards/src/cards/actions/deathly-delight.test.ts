import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { vynnset } from "../heroes/vynnset.ts";
import { dash } from "../heroes/dash.ts";
import { runechant } from "../tokens/runechant.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { deathlyDelightRed } from "./deathly-delight.ts";

describe("Deathly Delight (DTD143) AAA", () => {
  it("happy: hits for printed 5", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [deathlyDelightRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);
    const Dash = game.as(dash);

    Vynnset.attackWith(deathlyDelightRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Vynnset, deathlyDelightRed).toBeIn("graveyard");
  });

  it("happy: combat-chain-close gains {h} equal to heroes who lost {h} this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [deathlyDelightRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.attackWith(deathlyDelightRed);
    game.helpers.resolveRestOfCombat();
    game.helpers.resolveUntilIdle();

    // One hero (Dash) lost life → gain 1{h}.
    expectFabPlayer(Vynnset).toHaveLife(21);
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("boundary: if no hero lost {h} this turn, the close trigger gains 0", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [deathlyDelightRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue, brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);
    const Dash = game.as(dash);

    Vynnset.attackWith(deathlyDelightRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, brutalAssaultBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Vynnset).toHaveLife(20);
  });

  it("timing: Rune Gate lets you play this from banished when you control enough Runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        banished: [deathlyDelightRed],
        arena: [runechant, runechant],
        resourcePoints: 0,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.attackWith(deathlyDelightRed, { from: "banished" });
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
    expectFabPlayer(Vynnset).toHaveResourceCount(0);
  });
});
