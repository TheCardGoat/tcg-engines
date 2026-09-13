import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectFabCard,
  seedResourcePoints,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { embodimentOfEarth } from "./embodiment-of-earth.ts";

/**
 * Embodiment of Earth (AJV028) — Elemental Token - Aura.
 * Printed: "Non-attack action cards you control get +1{d} while defending.
 * At the beginning of your action phase, destroy this."
 */
describe("Embodiment of Earth (AJV028) AAA", () => {
  it("happy: a defending non-attack action card gets +1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [embodimentOfEarth],
        hand: [nimblismBlue],
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    seedResourcePoints(game, 2, dash);
    game.helpers.untilIdle({ optionals: "decline" });
    game.as(dash).playAttack(brutalAssaultBlue);
    Bravo.defendWith(nimblismBlue);

    // Nimblism defends at 2{d}; the Embodiment lifts it to 3{d}.
    expectFabCard(Bravo, nimblismBlue).toHaveDefense(3);
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });
  });

  it("boundary: a defending attack action card gets no +1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [embodimentOfEarth],
        hand: [brutalAssaultBlue],
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], deck: 6 },
    );
    const Bravo = game.as(bravo);

    // Bravo defends with an attack action card from his own hand — the
    // Embodiment's bonus is for non-attack actions only.
    Bravo.endTurn();
    seedResourcePoints(game, 2, dash);
    game.helpers.untilIdle({ optionals: "decline" });
    game.as(dash).playAttack(brutalAssaultBlue);
    Bravo.defendWith(brutalAssaultBlue);

    expectFabCard(Bravo, brutalAssaultBlue).toHaveDefense(3);
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });
  });

  it("timing: the Embodiment is destroyed at the beginning of its controller's action phase", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [embodimentOfEarth],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.helpers.untilIdle({ optionals: "decline" });
    game.as(dash).endTurn();
    game.helpers.untilIdle({ optionals: "decline" });

    expect(Bravo.zone("arena")).not.toContain(embodimentOfEarth.canonicalId);
  });
});
