import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fang } from "../heroes/fang.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { upSticksAndRunRed } from "./up-sticks-and-run.ts";

/**
 * Up Sticks and Run Red (HNT179) — Assassin Ninja Action. Go again.
 *
 * Printed: You may retrieve a dagger from your graveyard.
 * Your next dagger attack this turn gets +4{p}.
 *
 * Retrieve = CR 8.5.51: pay {r}, then EQUIP the dagger from the graveyard
 * (first consuming card of the type:"retrieve" proposer).
 */

describe("Up Sticks and Run (HNT179) AAA", () => {
  it("happy: next dagger attack this turn gets +4{p} (go again funds the swing)", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [upSticksAndRunRed],
        weapon1: [nerveScalpel],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);
    const Dash = game.as(dash);

    Fang.play(upSticksAndRunRed);
    game.helpers.resolveUntilIdle();
    // Go again refunds the spent action point for the weapon swing.
    expectFabPlayer(Fang).toHaveAP(1);

    Fang.activateAttack(nerveScalpel);
    expectCombat(game).toHaveAttackPower(5); // 1 + 4
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(15); // 20 - 5
  });

  it("happy: retrieving pays {r} and equips the dagger out of the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [upSticksAndRunRed],
        graveyard: [nerveScalpel],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.play(upSticksAndRunRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    // CR 8.5.51: paid {r} and equipped the dagger out of the graveyard.
    expectFabCard(Fang, nerveScalpel).toBeIn("weapon1");
    expectFabPlayer(Fang).toHaveResourceCount(2);
    expectFabPlayer(Fang).toHaveHandCount(0);
  });

  it("boundary: a non-dagger attack does not gain the +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [upSticksAndRunRed, brutalAssaultBlue],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.play(upSticksAndRunRed);
    game.helpers.resolveUntilIdle();
    Fang.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);

    game.helpers.resolveUntilIdle();
  });

  it("boundary: an empty graveyard never offers the may retrieve (CR 8.5.51a)", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [upSticksAndRunRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.play(upSticksAndRunRed);
    game.helpers.resolveUntilIdle();

    expectWait(game).toBeIdle();
    expectFabPlayer(Fang).toHaveResourceCount(3);
    expectFabPlayer(Fang).toHaveAP(1);
  });

  it("boundary: a dagger with no legal weapon seat cannot be retrieved", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [upSticksAndRunRed],
        graveyard: [nerveScalpel],
        weapon1: [nerveScalpel],
        weapon2: [nerveScalpel],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.play(upSticksAndRunRed);
    game.helpers.resolveUntilIdle();

    expectWait(game).toBeIdle();
    expectFabPlayer(Fang).toHaveResourceCount(3);
    expect(Fang.zone("graveyard")).toContain(nerveScalpel.canonicalId);
  });

  it("boundary: a player who cannot pay is not offered retrieve", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [upSticksAndRunRed],
        graveyard: [nerveScalpel],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.play(upSticksAndRunRed);
    game.helpers.resolveUntilIdle();

    expectWait(game).toBeIdle();
    expectFabPlayer(Fang).toHaveResourceCount(0);
    expectFabCard(Fang, nerveScalpel).toBeIn("graveyard");
  });
});
