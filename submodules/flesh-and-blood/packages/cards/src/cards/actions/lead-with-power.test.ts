import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { clashOfMightBlue } from "./clash-of-might.ts";
import { leadWithPowerRed } from "./lead-with-power.ts";

describe("lead-with-power family AAA", () => {
  it("happy: next Brute or Guardian attack gets +3{p} and creates a Might token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [leadWithPowerRed, clashOfMightBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(leadWithPowerRed);
    game.helpers.resolveUntilIdle();

    expect(Bravo.zone("arena")).toContain("token:might");
    expectFabCard(Bravo, leadWithPowerRed).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);

    Bravo.playAttack(clashOfMightBlue);

    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: a Generic attack does not get +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [leadWithPowerRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(leadWithPowerRed);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(snatchRed);

    expectCombat(game).toHaveAttackPower(4);
    expect(Bravo.zone("arena")).toContain("token:might");
    expect(Dash.zone("arena")).not.toContain("token:might");
  });

  it("timing: Might grants +1{p} next turn and the +3{p} latch expires", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [leadWithPowerRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(leadWithPowerRed);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    game.helpers.untilIdle();
    expect(Bravo.zone("arena")).toContain("token:might");

    Dash.endTurn();
    game.helpers.untilIdle();
    expect(Bravo.zone("arena")).not.toContain("token:might");

    Bravo.playAttack(snatchRed);

    expectCombat(game).toHaveAttackPower(5);
  });
});
