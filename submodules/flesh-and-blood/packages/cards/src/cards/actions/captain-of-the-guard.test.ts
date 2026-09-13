import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { regurgitatingSlogRed } from "./regurgitating-slog.ts";
import { snatchRed } from "./snatch.ts";
import { woundingBlowBlue } from "./wounding-blow.ts";
import { captainOfTheGuardBlue } from "./captain-of-the-guard.ts";

describe("Captain of the Guard (MPG127) AAA", () => {
  it("happy: attacks for 5", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [captainOfTheGuardBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(captainOfTheGuardBlue);
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Bravo, captainOfTheGuardBlue).toBeIn("graveyard");
  });

  it("happy: while defending a 4{p} attack, 5{p} this gets +1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [captainOfTheGuardBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(captainOfTheGuardBlue);
    game.closeCombat();

    expectFabPlayer(Bravo).toHaveLife(19);
  });

  it("boundary: while defending a 6{p} attack, this stays printed 2{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [regurgitatingSlogRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [captainOfTheGuardBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(regurgitatingSlogRed, { optionals: "decline" });
    Bravo.defendWith(captainOfTheGuardBlue);
    game.closeCombat();

    expectFabPlayer(Bravo).toHaveLife(16);
  });

  it("timing: cannot be played as an instant during the opponent's combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [woundingBlowBlue], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [captainOfTheGuardBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(woundingBlowBlue);
    game.toReaction();
    expect(() => Bravo.play(captainOfTheGuardBlue)).toThrow();
    expectFabCard(Bravo, captainOfTheGuardBlue).toBeIn("hand");
  });
});
