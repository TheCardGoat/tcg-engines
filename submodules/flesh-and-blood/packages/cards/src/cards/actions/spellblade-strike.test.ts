import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { spellbladeStrikeRed } from "./spellblade-strike.ts";

const runechant = fabToken("runechant");

describe("Spellblade Strike (ARC103) AAA", () => {
  it("happy: the attack hits for 4 and creates one Runechant token", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [spellbladeStrikeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.attackWith(spellbladeStrikeRed);
    expectCombat(game).toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Briar).toHaveTokenCount("runechant", 1);
    expect(Briar.zone("arena")).toContain("token:runechant");
  });

  it("boundary: a fully blocked miss still creates the Runechant token", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [spellbladeStrikeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue, brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.attackWith(spellbladeStrikeRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, brutalAssaultBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Briar).toHaveTokenCount("runechant", 1);
  });

  it("timing: playing the strike consumes a pre-existing Runechant for 1 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [spellbladeStrikeRed],
        arena: [runechant],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.attackWith(spellbladeStrikeRed);
    game.helpers.resolveRestOfCombat();

    // 4 combat damage + 1 arcane from the consumed Runechant; only the newly
    // created token remains (CR 8.6.3: playing an AAC destroys Runechants).
    expectFabPlayer(Dash).toHaveLife(15);
    expectFabPlayer(Briar).toHaveTokenCount("runechant", 1);
  });
});
