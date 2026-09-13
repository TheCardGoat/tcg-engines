import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
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
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        chest: [adaptivePlating],
        arena: [hyperDriverRed],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(adaptivePlating);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    Dash.target(hyperDriverRed);

    expectFabCard(Dash, hyperDriverRed).toBeIn("graveyard");
    expectFabCard(Dash, adaptivePlating).toHaveDefense(3);
    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("boundary: declining galvanize leaves printed 1{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        chest: [adaptivePlating],
        arena: [hyperDriverRed],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(adaptivePlating);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, hyperDriverRed).toBeIn("arena");
    expectFabCard(Dash, adaptivePlating).toHaveDefense(1);
  });

  it("timing: Blade Break destroys this after it defends", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        chest: [adaptivePlating],
        arena: [hyperDriverRed],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(adaptivePlating);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, adaptivePlating).toBeIn("graveyard");
  });
});
