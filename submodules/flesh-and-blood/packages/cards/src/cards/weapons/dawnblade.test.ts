import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dawnblade } from "./dawnblade.ts";

describe("Dawnblade (TEA003) AAA", () => {
  it("happy: first swing is 3{p}; the second hit each turn puts a +1{p} counter", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.activate(dawnblade);
    game.passBoth();
    game.advanceCombatTo("defend");
    expect(game.combat()?.activeLink?.attackPower).toBe(3);

    game.helpers.resolveUntilIdle();
    expectFabCard(Dori, dawnblade).toHaveCounters(0);

    Dori.activate(dawnblade);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dori, dawnblade).toHaveCounters(1);
  });

  it("boundary: once per turn cannot attack twice without an extra-attack grant", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dawnblade],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(dawnblade);
    game.helpers.resolveUntilIdle();

    Bravo.expectActivationRejected(dawnblade);
    expectFabCard(Bravo, dawnblade).toHaveCounters(0);
  });

  it("timing: end phase removes all +1{p} counters if Dawnblade did not hit", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [{ card: dawnblade, state: { powerCounterTotal: 2 } }],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    expectFabCard(Dori, dawnblade).toHaveCounters(2);

    Dori.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Dori, dawnblade).toHaveCounters(0);
  });
});
