import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { anothos } from "../weapons/anothos.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { blessingOfSteelRed, blessingOfSteelBlue } from "./blessing-of-steel.ts";

describe("blessing-of-steel family AAA", () => {
  it("happy: start of your turn destroys this then the next weapon attack gets +3{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: bravo,
        arena: [blessingOfSteelRed],
        weapon1: [anothos],
        hand: [nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle();
    expectFabCard(Bravo, blessingOfSteelRed).toBeIn("graveyard");

    Bravo.activate(anothos);
    Bravo.pitchFirst();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: an attack action does not get the weapon-attack bonus", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: bravo,
        arena: [blessingOfSteelRed],
        weapon1: [anothos],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle();
    Bravo.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: does not fire at the start of the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [blessingOfSteelRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).endTurn();
    game.untilIdle();
    expectFabCard(game.as(bravo), blessingOfSteelRed).toBeIn("arena");
  });

  it("pitch scale: the blue aura gives the next weapon attack +1{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: bravo,
        arena: [blessingOfSteelBlue],
        weapon1: [anothos],
        hand: [nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle();
    expectFabCard(Bravo, blessingOfSteelBlue).toBeIn("graveyard");

    Bravo.activate(anothos);
    Bravo.pitchFirst();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
  });
});
