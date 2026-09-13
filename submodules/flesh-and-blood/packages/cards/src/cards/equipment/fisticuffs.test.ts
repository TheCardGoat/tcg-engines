import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { fisticuffs } from "./fisticuffs.ts";

describe("Fisticuffs (BEN005) AAA", () => {
  it("happy: Attack Reaction {r}{r} destroy gives the attack +1 power", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [fisticuffs],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Bravo.activate(fisticuffs);
    game.passBoth();

    expectFabCard(Bravo, fisticuffs).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveResourceCount(0);
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("boundary: 1 resource cannot pay the Attack Reaction", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [fisticuffs],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Bravo.expectActivationRejected(fisticuffs);
    expectFabCard(Bravo, fisticuffs).toBeIn("arms");
  });

  it("timing: the Attack Reaction is illegal outside the reaction step", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [fisticuffs],
        hand: [],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).expectActivationRejected(fisticuffs);
    expectFabCard(game.as(bravo), fisticuffs).toBeIn("arms");
  });
});
