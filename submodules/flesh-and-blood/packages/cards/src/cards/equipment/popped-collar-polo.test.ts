import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { poppedCollarPolo } from "./popped-collar-polo.ts";

describe("Popped Collar Polo (LSS014) AAA", () => {
  it("happy: Action destroy this to gain {r} with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [poppedCollarPolo],
        actionPoints: 1,
        resourcePoints: 0,
        hand: [],
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(poppedCollarPolo);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, poppedCollarPolo).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveResourceCount(1);
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: 0 action points cannot activate the Action", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [poppedCollarPolo],
        actionPoints: 0,
        resourcePoints: 0,
        hand: [],
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(poppedCollarPolo);
    expectFabCard(Dash, poppedCollarPolo).toBeIn("chest");
  });

  it("timing: chest is empty after the destroy-self Action", () => {
    const game = FabTestEngine.start(
      { hero: dash, chest: [poppedCollarPolo], actionPoints: 1, hand: [], deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(poppedCollarPolo);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, poppedCollarPolo).toBeIn("graveyard");
  });
});
