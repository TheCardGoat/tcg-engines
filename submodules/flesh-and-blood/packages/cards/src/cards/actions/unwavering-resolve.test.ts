import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { unwaveringResolveRed } from "./unwavering-resolve.ts";

describe("Unwavering Resolve (SUP218) AAA", () => {
  it("happy: printed 6{p} with cards remaining in the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [unwaveringResolveRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(unwaveringResolveRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Dash, unwaveringResolveRed).notToHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(game.as(bravo)).toHaveLife(14);
    expectFabPlayer(Dash).toHaveAP(0);
  });

  it("boundary: an empty deck grants +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [unwaveringResolveRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [],
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(unwaveringResolveRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(10);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(game.as(bravo)).toHaveLife(10);
  });

  it("timing: 3 defenders grant go again leftover AP", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [unwaveringResolveRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(unwaveringResolveRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith([nimblismBlue, nimblismBlue, nimblismBlue]);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabPlayer(Dash).toHaveAP(1);
  });
});
