import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { crazyBrewBlue } from "./crazy-brew.ts";
import { lifeOfThePartyRed } from "./life-of-the-party.ts";

describe("Life of the Party (EVR161) AAA", () => {
  it("happy: paying the printed {r} cost plays the attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [lifeOfThePartyRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(lifeOfThePartyRed);
    expectCombat(game).toBeOpen();
    expectFabCard(Dash, lifeOfThePartyRed).toBeIn("combatChain");
  });

  it("boundary: 0{r} without Crazy Brew cannot pay the printed cost", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [lifeOfThePartyRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expect(() => Dash.playAttack(lifeOfThePartyRed)).toThrow();
    expectFabCard(Dash, lifeOfThePartyRed).toBeIn("hand");
  });

  it("timing: destroying Crazy Brew pays the alternative cost and chooses all modes", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [crazyBrewBlue],
        hand: [lifeOfThePartyRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(lifeOfThePartyRed, { modeIds: ["pay"] });
    expectFabCard(Dash, crazyBrewBlue).toBeIn("graveyard");
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(6);
    expectCombat(game).toHaveKeyword("go-again");
  });
});
