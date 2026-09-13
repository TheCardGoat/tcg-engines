import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { levia } from "../heroes/levia.ts";
import { smashWithBigTreeRed } from "./smash-with-big-tree.ts";
import { nimblismBlue } from "./nimblism.ts";
import { poundOfFleshBlue } from "./pound-of-flesh.ts";

/**
 * Pound of Flesh (PEN189) — Shadow Brute Action, cost 0, go again.
 * Printed: Each hero banishes a card from their hand. Each hero who didn't
 * banish a card with 6 or more {p} this way loses 1{h}.
 */

describe("Pound of Flesh (PEN189) AAA", () => {
  it("happy: heroes who banish a sub-6 card this way each lose 1 life", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [poundOfFleshBlue, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.play(poundOfFleshBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Levia, nimblismBlue).toBeBanished();
    expectFabCard(Dash, nimblismBlue).toBeBanished();
    expectFabPlayer(Levia).toHaveLife(19);
    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("boundary: heroes who banish a 6+ card this way do not lose life", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [poundOfFleshBlue, smashWithBigTreeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [smashWithBigTreeRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.play(poundOfFleshBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Levia, smashWithBigTreeRed).toBeBanished();
    expectFabCard(Dash, smashWithBigTreeRed).toBeBanished();
    expectFabPlayer(Levia).toHaveLife(20);
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: go again refunds the action point; a mixed 6+ / sub-6 split taxes only the sub-6 hero", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [poundOfFleshBlue, smashWithBigTreeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.play(poundOfFleshBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Levia).toHaveAP(1);
    expectFabPlayer(Levia).toHaveLife(20);
    expectFabPlayer(Dash).toHaveLife(19);
  });
});
