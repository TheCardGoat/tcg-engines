import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { chane } from "../heroes/chane.ts";
import { invertExistenceBlue } from "../instants/invert-existence.ts";
import { summerSFallRed } from "./summer-s-fall.ts";
import { earthSEmbraceBlue } from "./earth-s-embrace.ts";

describe("Earth's Embrace (ROS034) AAA", () => {
  it("happy: at your end phase create an Embodiment of Earth then destroy this", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        arena: [earthSEmbraceBlue],
        hand: [],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    // No Earth card banished this turn: the not-gate destroys the aura.
    Briar.endTurn();
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Briar, earthSEmbraceBlue).toBeIn("graveyard");
  });

  it("boundary: this does not trigger on the opponent's end phase", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: briar,
        arena: [earthSEmbraceBlue],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabCard(Briar, earthSEmbraceBlue).toBeIn("arena");
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 0);
  });

  it("timing: go again refunds AP when this is played as an action", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [earthSEmbraceBlue],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(earthSEmbraceBlue);
    game.untilIdle();

    expectFabCard(Briar, earthSEmbraceBlue).toBeIn("arena");
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("happy: banishing an opponent-owned Earth card credits the banishing player", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        arena: [earthSEmbraceBlue],
        hand: [invertExistenceBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, graveyard: [summerSFallRed], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(invertExistenceBlue);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: summerSFallRed.canonicalId });
    expectFabCard(game.as(dash), summerSFallRed).toBeIn("banished");

    Chane.endTurn();
    game.untilIdle();

    expectFabCard(Chane, earthSEmbraceBlue).toBeIn("arena");
    expectFabPlayer(Chane).toHaveTokenCount("embodiment-of-earth", 1);
  });
});
