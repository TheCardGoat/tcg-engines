import { nimblismBlue } from "../actions/nimblism.ts";
import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectCombat,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { hyperDriverRed } from "../actions/hyper-driver.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { adaptivePlating } from "./adaptive-plating.ts";

/**
 * Adaptive Plating (EVO013) — Mechanologist Equipment, Modular, Blade Break.
 * Printed: Action - 0: Equip this to another equipment zone. Galvanize —
 * when this defends, you may destroy an item you control. If you do, this
 * gets +2{d} until end of turn.
 */

describe("Adaptive Plating (EVO013) AAA", () => {
  it("happy: galvanize destroy-item grants +2{d} while defending", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        life: 20,
        chest: [adaptivePlating],
        arena: [hyperDriverRed],
        hand: [],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(snatchRed);
    Dash.defendWith(adaptivePlating);
    game.advanceToDecision(Dash, "boolean");
    Dash.accept();
    game.advanceUntil({ stopAt: "reaction", optionals: "throw" });

    expectFabCard(Dash, hyperDriverRed).toBeIn("graveyard");
    expectFabCard(Dash, adaptivePlating).toHaveDefense(3);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Dash, adaptivePlating).toBeIn("graveyard").toHaveDefense(1);
    expectCombat(game).toBeClosed();
  });

  it("boundary: declining galvanize leaves printed 1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        life: 20,
        chest: [adaptivePlating],
        arena: [hyperDriverRed],
        hand: [],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(snatchRed);
    Dash.defendWith(adaptivePlating);
    game.advanceToDecision(Dash, "boolean");
    Dash.decline();
    game.advanceUntil({ stopAt: "reaction", optionals: "throw" });

    expectFabCard(Dash, hyperDriverRed).toBeIn("arena");
    expectFabCard(Dash, adaptivePlating).toHaveDefense(1);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Dash, adaptivePlating).toBeIn("graveyard").toHaveDefense(1);
    expectCombat(game).toBeClosed();
  });

  it("timing: Blade Break destroys this after it defends", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        life: 20,
        chest: [adaptivePlating],
        arena: [hyperDriverRed],
        hand: [],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(snatchRed);
    Dash.defendWith(adaptivePlating);
    game.advanceToDecision(Dash, "boolean");
    Dash.decline();
    game.advanceUntil({ stopAt: "reaction", optionals: "throw" });

    expectFabCard(Dash, adaptivePlating).toBeIn("combatChain").toHaveDefense(1);
    game.closeCombat({ optionals: "throw" });
    expectFabCard(Dash, adaptivePlating).toBeIn("graveyard").toHaveDefense(1);
    expectFabPlayer(Dash).toHaveLife(17);
    expectWait(game).notToHaveDecision();
  });
});
