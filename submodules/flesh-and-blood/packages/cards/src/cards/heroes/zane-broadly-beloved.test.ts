import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "./kassai.ts";
import { wageGoldRed } from "../actions/wage-gold.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { jubeelSpellbane } from "../weapons/jubeel-spellbane.ts";
import { mercilessBattleaxe } from "../weapons/merciless-battleaxe.ts";
import { zaneBroadlyBeloved } from "./zane-broadly-beloved.ts";

/**
 * Zane, Broadly Beloved (SPW003) — Revered Warrior Hero - Young.
 *
 * Printed:
 *   You may equip 2H swords as though they were 1H.
 *   Whenever you win a wager, the crowd cheers you.
 *   The first time the crowd cheers you each turn, each hero draws a card.
 */

describe("Zane, Broadly Beloved (SPW003) AAA", () => {
  it("happy: a 2H sword seats as 1H, so Zane can attack with it and a 1H saber", () => {
    const game = FabTestEngine.start(
      {
        hero: zaneBroadlyBeloved,
        weapon1: [jubeelSpellbane],
        weapon2: [cintariSaber],
        hand: [],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zane = game.as(zaneBroadlyBeloved);
    const Dash = game.as(dash);

    expectFabCard(Zane, jubeelSpellbane).toBeIn("weapon1");
    expectFabCard(Zane, cintariSaber).toBeIn("weapon2");

    Zane.activateAttack(jubeelSpellbane);
    game.closeCombat();
    Zane.activateAttack(cintariSaber);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("boundary: a Warrior without the grant cannot seat a 2H sword beside a 1H", () => {
    expect(() =>
      FabTestEngine.start(
        {
          hero: kassai,
          weapon1: [jubeelSpellbane],
          weapon2: [cintariSaber],
          hand: [],
          deck: 6,
        },
        { hero: dash, hand: [], deck: 6 },
      ),
    ).toThrow(/two-hander-must-be-alone/);
  });

  it("timing: a 2H axe is not a sword, so Zane cannot seat it beside a 1H", () => {
    expect(() =>
      FabTestEngine.start(
        {
          hero: zaneBroadlyBeloved,
          weapon1: [mercilessBattleaxe],
          weapon2: [cintariSaber],
          hand: [],
          deck: 6,
        },
        { hero: dash, hand: [], deck: 6 },
      ),
    ).toThrow(/two-hander-must-be-alone/);
  });

  it("happy: winning a wager cheers Zane and each hero draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: zaneBroadlyBeloved,
        hand: [wageGoldRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zane = game.as(zaneBroadlyBeloved);
    const Dash = game.as(dash);

    Zane.playAttack(wageGoldRed, { stopAt: "on-attack" });
    Zane.accept();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // Wage Gold hit (7{p}); the won wager cheered Zane once, both drew.
    expectFabPlayer(Zane).toHaveHandCount(1);
    expectFabPlayer(Dash).toHaveHandCount(1).toHaveLife(13);
  });

  it("boundary: only the first cheer each turn draws", () => {
    const game = FabTestEngine.start(
      {
        hero: zaneBroadlyBeloved,
        hand: [wageGoldRed, wageGoldRed],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zane = game.as(zaneBroadlyBeloved);
    const Dash = game.as(dash);

    Zane.playAttack(wageGoldRed, { stopAt: "on-attack" });
    Zane.accept();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    Zane.playAttack(wageGoldRed, { stopAt: "on-attack" });
    Zane.accept();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // Two won wagers, two cheers, but only the first drew a card.
    expectFabPlayer(Zane).toHaveHandCount(1);
    expectFabPlayer(Dash).toHaveHandCount(1);
  });

  it("boundary: declining the wager means no cheer and no draw", () => {
    const game = FabTestEngine.start(
      {
        hero: zaneBroadlyBeloved,
        hand: [wageGoldRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zane = game.as(zaneBroadlyBeloved);
    const Dash = game.as(dash);

    Zane.playAttack(wageGoldRed, { stopAt: "on-attack" });
    Zane.decline();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Zane).toHaveHandCount(0);
    expectFabPlayer(Dash).toHaveHandCount(0).toHaveLife(13);
  });
});
