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
import { leadWithHeartRed } from "./lead-with-heart.ts";

describe("lead-with-heart family AAA", () => {
  it("happy: next Guardian or Warrior attack gets +3{p} and creates a Vigor token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [leadWithHeartRed, clashOfMightBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(leadWithHeartRed);
    game.helpers.resolveUntilIdle();

    expect(Bravo.zone("arena")).toContain("token:vigor");
    expectFabCard(Bravo, leadWithHeartRed).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);

    Bravo.playAttack(clashOfMightBlue);

    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: a Generic attack does not get +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [leadWithHeartRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(leadWithHeartRed);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(snatchRed);

    expectCombat(game).toHaveAttackPower(4);
    expect(Bravo.zone("arena")).toContain("token:vigor");
    expect(Dash.zone("arena")).not.toContain("token:vigor");
  });

  it("timing: Vigor grants {r} next turn and the +3{p} latch expires", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [leadWithHeartRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(leadWithHeartRed);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    game.helpers.untilIdle();
    expect(Bravo.zone("arena")).toContain("token:vigor");

    Dash.endTurn();
    game.helpers.untilIdle();
    expect(Bravo.zone("arena")).not.toContain("token:vigor");
    expectFabPlayer(Bravo).toHaveResourceCount(1);

    Bravo.playAttack(snatchRed);

    expectCombat(game).toHaveAttackPower(4);
  });
});
