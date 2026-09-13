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
import { deathlyWailRed } from "./deathly-wail.ts";

describe("Deathly Wail (DTD146) AAA", () => {
  it("happy: hits for printed 6", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [deathlyWailRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.attackWith(deathlyWailRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabCard(Vynnset, deathlyWailRed).toBeIn("graveyard");
  });

  it("happy: combat-chain-close creates Runechants equal to heroes who lost {h} this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [deathlyWailRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.attackWith(deathlyWailRed);
    game.helpers.resolveRestOfCombat();
    game.helpers.resolveUntilIdle();

    // One hero lost life → create 1 Runechant.
    expect(Vynnset.zone("arena").filter((id) => id === "token:runechant")).toHaveLength(1);
  });

  it("boundary: if no hero lost {h} this turn, no Runechants are created", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [deathlyWailRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue, brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);
    const Dash = game.as(dash);

    Vynnset.attackWith(deathlyWailRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, brutalAssaultBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Vynnset.zone("arena").filter((id) => id === "token:runechant")).toHaveLength(0);
  });

  it("timing: Rune Gate lets you play this from banished when you control enough Runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        banished: [deathlyWailRed],
        arena: [runechant, runechant, runechant],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.attackWith(deathlyWailRed, { from: "banished" });
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    expectFabPlayer(Vynnset).toHaveResourceCount(0);
  });
});
