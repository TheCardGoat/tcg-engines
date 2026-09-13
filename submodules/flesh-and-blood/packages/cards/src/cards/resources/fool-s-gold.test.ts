import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravoShowstopper } from "../heroes/bravo-showstopper.ts";
import { nimbleStrikeRed } from "../actions/nimble-strike.ts";
import { cripplingCrushRed } from "../actions/crippling-crush.ts";
import { foolSGoldYellow } from "./fool-s-gold.ts";

describe("Fool's Gold (SEA215) AAA", () => {
  it("happy: discarding this creates a Gold token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [cripplingCrushRed],
        resourcePoints: 7,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [foolSGoldYellow],
        life: 40,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravoShowstopper).attackWith(cripplingCrushRed);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, foolSGoldYellow).toBeIn("graveyard");
    expect(Dash.zone("arena")).toContain("token:gold");
  });

  it("boundary: pitching this is not a discard and creates no Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [nimbleStrikeRed, foolSGoldYellow],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: bravoShowstopper, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(nimbleStrikeRed, { pitch: [foolSGoldYellow] });
    game.passBoth();

    expectFabCard(Dash, foolSGoldYellow).toBeIn("pitch");
    expect(Dash.zone("arena")).not.toContain("token:gold");
    expectFabPlayer(Dash).toHaveResourceCount(1);
  });

  it("timing: cannot be played as a card", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [foolSGoldYellow], deck: 6 },
      { hero: bravoShowstopper, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(dash).play(foolSGoldYellow)).toThrow();
    expectFabCard(game.as(dash), foolSGoldYellow).toBeIn("hand");
    expect(game.as(dash).zone("arena")).not.toContain("token:gold");
  });
});
