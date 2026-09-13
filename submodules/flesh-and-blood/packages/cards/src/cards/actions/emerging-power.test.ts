import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectFabCard,
  expectCombat,
  FAB_MANUAL_HARNESS,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravoShowstopper } from "../heroes/bravo-showstopper.ts";
import { dash } from "../heroes/dash.ts";
import { disableRed } from "./disable.ts";
import { nimblismBlue } from "./nimblism.ts";
import { emergingPowerRed } from "./emerging-power.ts";

describe("Emerging Power Red (BVO012) AAA", () => {
  it("happy: played as aura enters the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [emergingPowerRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);

    Bravo.play(emergingPowerRed);
    game.helpers.resolveUntilIdle();

    // Aura enters arena as permanent
    expectFabCard(Bravo, emergingPowerRed).toBeIn("arena");
  });

  it("boundary: cost 2 — requires sufficient resources", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [emergingPowerRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);

    expect(() => Bravo.play(emergingPowerRed)).toThrow();
  });

  it("timing: next action phase destroys the aura and the next Guardian attack gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [emergingPowerRed, disableRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.play(emergingPowerRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, emergingPowerRed).toBeIn("arena");

    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, emergingPowerRed).toBeIn("graveyard");
    Bravo.must.pitch(nimblismBlue, nimblismBlue).playAttack(disableRed);
    game.passBoth();
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(12);
  });
});
