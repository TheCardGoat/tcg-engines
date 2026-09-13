import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { snatchRed } from "./snatch.ts";
import { becomeTheCupRed } from "./become-the-cup.ts";

/**
 * Become the Cup (PEN040) — Ninja Action - Attack, cost 0, 3{p}, go again.
 *
 * Printed: As you play this, choose a color. This gets the chosen color.
 */

describe("Become the Cup (PEN040) AAA", () => {
  it("happy: choosing Blue grants Blue and attacks for 3 with go again", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [becomeTheCupRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    Katsu.play(becomeTheCupRed);
    expectWait(game).toHaveDecision("effect-resolution");
    Katsu.choose("Blue");

    expectCombat(game).toHaveAttackPower(3);
    expectCombat(game).toHaveKeyword("go-again");
    expectFabCard(Katsu, becomeTheCupRed).toHaveColor("Blue");
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Katsu).toHaveAP(1);
    expectFabCard(Katsu, becomeTheCupRed).toBeIn("graveyard");
  });

  it("boundary: playAttack does not auto-bind a color", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [becomeTheCupRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Katsu = game.as(katsu);

    expect(() => Katsu.playAttack(becomeTheCupRed)).toThrow(/effect-resolution/);
    expectWait(game).toHaveDecision("effect-resolution");
    expectFabCard(Katsu, becomeTheCupRed).toHaveColor("Red");
  });

  it("timing: cannot be played as an instant during the opponent's combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: katsu, hand: [becomeTheCupRed], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Katsu = game.as(katsu);

    Dash.playAttack(snatchRed);
    game.toReaction();
    expect(() => Katsu.play(becomeTheCupRed)).toThrow();
    expectFabCard(Katsu, becomeTheCupRed).toBeIn("hand");
  });
});
