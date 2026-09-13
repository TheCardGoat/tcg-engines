import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { medkitBlue } from "./medkit.ts";

describe("Medkit (EVO076) AAA", () => {
  it("happy: Action bottoms this to gain 2 life", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [medkitBlue],
        life: 20,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(medkitBlue);
    game.untilIdle();
    Dash.activate(medkitBlue);
    game.untilIdle();

    expect(Dash.zone("deck")).toContain(medkitBlue.canonicalId);
    expectFabPlayer(Dash).toHaveLife(22);
  });

  it("boundary: with 0 action points the Action is illegal after play", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [medkitBlue],
        life: 20,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(medkitBlue);
    game.untilIdle();
    expectFabPlayer(Dash).toHaveAP(0);
    Dash.expectActivationRejected(medkitBlue);
    expectFabCard(Dash, medkitBlue).toBeIn("arena");
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
