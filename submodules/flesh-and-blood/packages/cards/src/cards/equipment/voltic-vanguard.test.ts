import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { blinkBlue } from "../instants/blink.ts";
import { snatchRed } from "../actions/snatch.ts";
import { volticVanguard } from "./voltic-vanguard.ts";

describe("Voltic Vanguard (PEN240) AAA", () => {
  it("happy: after playing an instant, destroy this", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [volticVanguard],
        hand: [blinkBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(blinkBlue);
    game.helpers.resolveUntilIdle();
    Dash.activate(volticVanguard);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, volticVanguard).toBeIn("graveyard");
  });

  it("boundary: cannot activate without playing an instant this turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, head: [volticVanguard], actionPoints: 1, deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(volticVanguard);
    expectFabCard(Dash, volticVanguard).toBeIn("head");
  });

  it("timing: prevention expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [volticVanguard],
        hand: [blinkBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(blinkBlue);
    game.helpers.resolveUntilIdle();
    Dash.activate(volticVanguard);
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.as(bravo).endTurn();
    Dash.endTurn();
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
  });
});
