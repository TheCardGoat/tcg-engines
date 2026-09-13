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
import { bloodiedOval } from "./bloodied-oval.ts";

describe("Bloodied Oval (BET003) AAA", () => {
  it("happy: {d} is 1 when the opposing hero has more life", () => {
    const game = FabTestEngine.start(
      { hero: dash, life: 10, weapon1: [bloodiedOval], deck: 6 },
      { hero: bravo, life: 20, hand: [snatchRed], actionPoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expectFabCard(Dash, bloodiedOval).toHaveDefense(1);

    Dash.endTurn();
    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(bloodiedOval);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(7);
    expectFabCard(Dash, bloodiedOval).toBeIn("graveyard");
  });

  it("boundary: {d} is 0 when the opposing hero does not have more life", () => {
    const game = FabTestEngine.start(
      { hero: dash, life: 20, weapon1: [bloodiedOval], deck: 6 },
      { hero: bravo, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabCard(game.as(dash), bloodiedOval).toHaveDefense(0);
    expectFabCard(game.as(dash), bloodiedOval).toHaveKeyword("blade-break");
  });
});
