import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { snatchRed } from "./snatch.ts";
import { strongYieldRed } from "./strong-yield.ts";

describe("Strong Yield family AAA", () => {
  it("happy: your action-phase start destroys this then your next attack gets +3{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: briar,
        arena: [strongYieldRed],
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
    );
    const Briar = game.as(briar);

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabCard(Briar, strongYieldRed).toBeIn("graveyard");

    Briar.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: attacking before your action-phase start does not get +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        arena: [strongYieldRed],
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Briar = game.as(briar);

    expectFabCard(Briar, strongYieldRed).toBeIn("arena");
    Briar.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: opponent action-phase start does not destroy this", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        arena: [strongYieldRed],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Briar = game.as(briar);

    Briar.endTurn();
    game.untilIdle();
    expectFabCard(Briar, strongYieldRed).toBeIn("arena");
  });
});
