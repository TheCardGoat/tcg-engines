import { nimblismBlue } from "./nimblism.ts";
import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectCombat,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { hyperDriverRed } from "./hyper-driver.ts";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { snatchRed } from "./snatch.ts";
import { adaptivePlating } from "../equipment/adaptive-plating.ts";
import { smashWithBigRockYellow } from "./smash-with-big-rock.ts";

/**
 * Smash with Big Rock (SUP133) — Brute Attack, cost 2, 6{p}.
 *
 * Printed: Cards defending this can't gain {d}.
 *
 * The restriction controls defense during this attack. Blade Break destroys
 * Adaptive Plating when the chain closes; CR3.0.9 resets its bonus then.
 */

describe("Smash with Big Rock (SUP133) AAA", () => {
  it("happy: galvanize +2{d} does not change combat math on a card defending this", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [smashWithBigRockYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        chest: [adaptivePlating],
        arena: [hyperDriverRed],
        hand: [],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(smashWithBigRockYellow);
    Dash.defendWith(adaptivePlating);
    game.advanceToDecision(Dash, "boolean");
    Dash.accept();
    game.advanceUntil({ stopAt: "reaction", optionals: "throw" });

    expectFabCard(Dash, hyperDriverRed).toBeIn("graveyard");
    expectFabCard(Dash, adaptivePlating).toHaveDefense(1);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Dash, adaptivePlating).toBeIn("graveyard").toHaveDefense(1);
    expectCombat(game).toBeClosed();
  });

  it("boundary: galvanize still grants +2{d} against a Generic attack", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        chest: [adaptivePlating],
        arena: [hyperDriverRed],
        hand: [],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(snatchRed);
    Dash.defendWith(adaptivePlating);
    game.advanceToDecision(Dash, "boolean");
    Dash.accept();
    game.advanceUntil({ stopAt: "reaction", optionals: "throw" });

    expectFabCard(Dash, adaptivePlating).toHaveDefense(3);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Dash, adaptivePlating).toBeIn("graveyard").toHaveDefense(1);
    expectCombat(game).toBeClosed();
  });

  it("timing: after this chain closes, galvanize works on the next attack", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [smashWithBigRockYellow, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        chest: [adaptivePlating],
        arena: [hyperDriverRed],
        hand: [],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(smashWithBigRockYellow);
    Dash.defendWith();
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Dash).toHaveLife(14);

    Rhinar.playAttack(snatchRed);
    Dash.defendWith(adaptivePlating);
    game.advanceToDecision(Dash, "boolean");
    Dash.accept();
    game.advanceUntil({ stopAt: "reaction", optionals: "throw" });
    expectFabCard(Dash, adaptivePlating).toHaveDefense(3);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Dash).toHaveLife(13);
    expectFabCard(Dash, adaptivePlating).toBeIn("graveyard").toHaveDefense(1);
    expectWait(game).notToHaveDecision();
  });
});
