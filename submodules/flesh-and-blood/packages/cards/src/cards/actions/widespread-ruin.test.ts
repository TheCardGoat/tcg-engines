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
import { snatchRed } from "./snatch.ts";
import { widespreadRuinRed } from "./widespread-ruin.ts";

describe("Widespread Ruin (DTD139) AAA", () => {
  it("happy: when the chain closes, a hero who lost {h} banishes the top of their deck", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [widespreadRuinRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: [snatchRed] },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(vynnset).attackWith(widespreadRuinRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveRestOfCombat();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabCard(Dash, snatchRed).toBeBanished();
  });

  it("boundary: a hero who did not lose {h} is not asked to banish", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [widespreadRuinRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue],
        deck: 6,
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(vynnset).attackWith(widespreadRuinRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, brutalAssaultBlue]);
    game.helpers.resolveRestOfCombat();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("banished")).toHaveLength(0);
  });

  it("timing: Rune Gate lets you play this from banished when you control enough Runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        banished: [widespreadRuinRed],
        arena: [runechant, runechant],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(vynnset).attackWith(widespreadRuinRed, { from: "banished" });
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
  });
});
