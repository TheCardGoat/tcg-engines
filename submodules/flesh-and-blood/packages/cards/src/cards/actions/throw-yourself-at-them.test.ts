import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { snatchRed } from "./snatch.ts";
import { throwYourselfAtThemRed } from "./throw-yourself-at-them.ts";

const card = throwYourselfAtThemRed;

describe("Throw Yourself at Them family AAA", () => {
  it("happy: attacks for printed power (dagger is not on the combat chain so the ping does not open)", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        weapon1: [nerveScalpel],
        hand: [card],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(card, { stopAt: "on-attack" });
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(17);
    expectFabCard(Katsu, card).toBeIn("graveyard");
  });

  it("boundary: unpaid cost 1 does not play this from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        weapon1: [nerveScalpel],
        hand: [card],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);
    expect(() => Katsu.playAttack(card)).toThrow();
    expectFabCard(Katsu, card).toBeIn("hand");
  });

  it("timing: cannot be played as an instant during the opponent's combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: katsu, hand: [card], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    game.as(dash).playAttack(snatchRed);
    game.toReaction();
    expect(() => game.as(katsu).play(card)).toThrow();
    expectFabCard(game.as(katsu), card).toBeIn("hand");
  });
});
