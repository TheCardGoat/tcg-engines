import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectWait,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { shiningCourageRed } from "../instants/shining-courage.ts";
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
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
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
          deck: [
            nimblismBlue,
            nimblismBlue,
            nimblismBlue,
            nimblismBlue,
            nimblismBlue,
            nimblismBlue,
          ],
        },
        {
          hero: dash,
          hand: [],
          deck: [
            nimblismBlue,
            nimblismBlue,
            nimblismBlue,
            nimblismBlue,
            nimblismBlue,
            nimblismBlue,
          ],
        },
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
          deck: [
            nimblismBlue,
            nimblismBlue,
            nimblismBlue,
            nimblismBlue,
            nimblismBlue,
            nimblismBlue,
          ],
        },
        {
          hero: dash,
          hand: [],
          deck: [
            nimblismBlue,
            nimblismBlue,
            nimblismBlue,
            nimblismBlue,
            nimblismBlue,
            nimblismBlue,
          ],
        },
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
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
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
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
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
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
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

it("Zane draws on the first cheer again during the opposing turn", () => {
  const padding = () => Array.from({ length: 10 }, () => nimblismBlue);
  const game = FabTestEngine.start(
    {
      hero: zaneBroadlyBeloved,
      hand: [shiningCourageRed, shiningCourageRed, shiningCourageRed],
      life: 20,
      resourcePoints: 0,
      deck: padding(),
    },
    { hero: dash, hand: [snatchRed], life: 20, resourcePoints: 0, deck: padding() },
    FAB_MANUAL_HARNESS,
  );
  const Zane = game.as(zaneBroadlyBeloved);
  const Dash = game.as(dash);
  Zane.play(shiningCourageRed);
  game.untilIdle({ optionals: "throw" });
  expectFabPlayer(Zane).toHaveHandCount(3);
  expectFabPlayer(Dash).toHaveHandCount(2);
  Zane.play(shiningCourageRed);
  game.untilIdle({ optionals: "throw" });
  expectFabPlayer(Zane).toHaveHandCount(2);
  expectFabPlayer(Dash).toHaveHandCount(2);
  Zane.endTurn();
  expectFabPlayer(Zane).toHaveHandCount(4);
  expectFabPlayer(Dash).toHaveHandCount(4);
  Dash.pass();
  Zane.play(shiningCourageRed);
  game.untilIdle({ optionals: "throw" });
  expectFabPlayer(Zane).toHaveHandCount(4);
  expectFabPlayer(Dash).toHaveHandCount(5);
  Dash.playAttack(snatchRed);
  game.closeCombat({ optionals: "throw" });
  expectFabPlayer(Zane).toHaveLife(16);
  expectFabPlayer(Dash).toHaveHandCount(5).toHaveAP(0);
  expectCombat(game).toBeClosed();
  expectWait(game).toBeIdle();
});
