import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { toBeContinuedBlue } from "./to-be-continued.ts";

/**
 * To Be Continued... (APS027) — Guardian Instant Aura (Suspense).
 *
 * Printed: Suspense
 *          The first time you would be dealt damage each turn, prevent 1 of that damage.
 */

describe("To Be Continued... (APS027) AAA", () => {
  it("happy: first damage each turn is reduced by 1 while this is in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [toBeContinuedBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(toBeContinuedBlue);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Bravo, toBeContinuedBlue).toBeIn("arena");
    expectFabCard(Bravo, toBeContinuedBlue).toHaveCounters(2, "suspense");

    Bravo.endTurn();
    Dash.playAttack(snatchRed);
    Bravo.defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveLife(17);
  });

  it("boundary: a second damage event the same turn is not prevented", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        life: 20,
        deck: 6,
      },
      {
        hero: bravo,
        arena: [toBeContinuedBlue],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    const attacks = Dash.cardsIn("hand", snatchRed);
    Dash.playAttack(attacks[0]!);
    Bravo.defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Bravo).toHaveLife(17);

    Dash.playAttack(attacks[1]!);
    Bravo.defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveLife(13);
  });

  it("timing: the first damage of a later turn is prevented again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [toBeContinuedBlue],
        hand: [],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, snatchRed], actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.endTurn();
    Dash.playAttack(snatchRed);
    Bravo.defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Bravo).toHaveLife(17);

    Dash.endTurn();
    Bravo.endTurn();
    Dash.playAttack(snatchRed);
    Bravo.defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveLife(14);
    expectFabCard(Bravo, toBeContinuedBlue).toBeIn("arena");
  });
});
