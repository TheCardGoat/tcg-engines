import { describe, it } from "vitest";
import { FabTestEngine, expectCombat } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { freewheelingRenegadesRed } from "./freewheeling-renegades.ts";

describe("Freewheeling Renegades family AAA", () => {
  it("happy: an action defense reduces power by 2", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [freewheelingRenegadesRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [nimblismBlue], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(freewheelingRenegadesRed);
    game.as(bravo).defendWith(nimblismBlue);
    expectCombat(game).toHaveAttackPower(4);
  });
  it("boundary: no defense leaves printed power", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [freewheelingRenegadesRed], actionPoints: 1, deck: 6 },
      { hero: bravo, deck: 6 },
    );
    game.as(dash).playAttack(freewheelingRenegadesRed);
    expectCombat(game).toHaveAttackPower(6);
  });
  it("timing: a non-action defense does not reduce power", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [freewheelingRenegadesRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [brutalAssaultBlue], deck: 6 },
    );
    game.as(dash).playAttack(freewheelingRenegadesRed);
    game.as(bravo).defendWith(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
  });
});
