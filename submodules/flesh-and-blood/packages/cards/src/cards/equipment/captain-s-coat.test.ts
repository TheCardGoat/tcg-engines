import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";
import { captainSCoat } from "./captain-s-coat.ts";

describe("Captain's Coat (SEA181) AAA", () => {
  it("happy: after drawing this turn, Action destroy this to gain {r} with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [captainSCoat],
        hand: [tomeOfFyendalYellow],
        actionPoints: 2,
        resourcePoints: 1,
        deck: 8,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(tomeOfFyendalYellow);
    game.helpers.resolveUntilIdle();
    Dash.activate(captainSCoat);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, captainSCoat).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveResourceCount(1);
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: cannot activate without drawing a card this turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, chest: [captainSCoat], actionPoints: 1, resourcePoints: 0, hand: [], deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(captainSCoat);
    expectFabCard(Dash, captainSCoat).toBeIn("chest");
  });

  it("timing: go again refunds the Action AP after a draw", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [captainSCoat],
        hand: [tomeOfFyendalYellow],
        actionPoints: 2,
        resourcePoints: 1,
        deck: 8,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(tomeOfFyendalYellow);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveAP(1);
    Dash.activate(captainSCoat);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveAP(1);
  });
});
