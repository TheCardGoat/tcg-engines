import { describe, expect, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { nimblismBlue } from "./nimblism.ts";
import { scarForAScarRed } from "./scar-for-a-scar.ts";
import { forceOfNatureBlue } from "./force-of-nature.ts";

/**
 * Force of Nature (ELE066) — Briar specialization, Earth Fusion.
 *
 * Printed delayed effect: whenever an attack action card you control hits
 * this turn, if its power is greater than its base power, draw a card.
 */

describe("Force of Nature (ELE066) AAA", () => {
  it("happy: a buffed attack action hit draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [forceOfNatureBlue, nimblismBlue, scarForAScarRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(forceOfNatureBlue);
    game.helpers.resolveUntilIdle({ optionals: "decline" });
    Briar.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(scarForAScarRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Briar).toHaveHandCount(1);
  });

  it("boundary: an attack at its base power does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [forceOfNatureBlue, scarForAScarRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(forceOfNatureBlue);
    game.helpers.resolveUntilIdle({ optionals: "decline" });
    Briar.attackWith(scarForAScarRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Briar).toHaveHandCount(0);
  });

  it("timing: the delayed trigger expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [forceOfNatureBlue],
        deck: [scarForAScarRed],
        actionPoints: 1,
        intellect: 0,
      },
      { hero: dash, hand: [], deck: 6, intellect: 0 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(forceOfNatureBlue);
    game.helpers.resolveUntilIdle({ optionals: "decline" });
    Briar.endTurn();
    game.as(dash).endTurn();

    expect(
      game
        .getView({ role: "player", actorId: Briar.id })
        .effects.some((effect) => effect.origin.kind === "delayed-trigger"),
    ).toBe(false);
  });
});
