import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { oscilio } from "../heroes/oscilio.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { strikeTwiceRed } from "./strike-twice.ts";

describe("Strike Twice (PEN238) AAA", () => {
  it("happy: deals 3 arcane to the chosen hero", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [strikeTwiceRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(strikeTwiceRed, { target: Dash });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Oscilio, strikeTwiceRed).toBeIn("graveyard");
  });

  it("boundary: cannot be played as an instant before dealing arcane to an opposing hero", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [strikeTwiceRed], resourcePoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.attackWith(snatchRed);
    const rejected = Dash.expectFailure({
      move: "begin-play",
      payload: { instanceId: Dash.findCardInZone("hand", strikeTwiceRed) },
    });
    expect(rejected.errorCode).toBeDefined();
    expectFabCard(Dash, strikeTwiceRed).toBeIn("hand");
  });

  it("timing: after dealing arcane to an opposing hero, a second copy plays as an instant", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [strikeTwiceRed, strikeTwiceRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(strikeTwiceRed, { target: Dash });
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Oscilio).toHaveAP(0);

    Oscilio.play(strikeTwiceRed, { target: Dash });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabPlayer(Oscilio).toHaveAP(0);
  });
});
