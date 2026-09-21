import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { drawACrowdBlue } from "./draw-a-crowd.ts";
import { seismicSurge } from "../tokens/seismic-surge.ts";
import { nimblismBlue } from "./nimblism.ts";
import { roilingFissureBlue } from "./roiling-fissure.ts";

/**
 * Roiling Fissure (HNT248) — Guardian Action, X cost, go again.
 *
 * Printed: Destroy an aura with cost X or less, then you may destroy a Seismic
 * Surge you control. If you do, repeat this process. Go again
 *
 * Repeat until declined wraps destroy aura cost≤X then optional destroy
 * Seismic Surge you control. Accepting the Surge re-runs the process.
 */

describe("Roiling Fissure (HNT248) AAA", () => {
  it("happy: declared X=2 destroys an opposing cost-2 aura", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [roilingFissureBlue],
        arena: [seismicSurge],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [],
        arena: [drawACrowdBlue],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(roilingFissureBlue, { xValue: 2 });
    Bravo.target(drawACrowdBlue);
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Dash, drawACrowdBlue).toBeIn("graveyard");
    expectFabCard(Bravo, seismicSurge).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabCard(Bravo, roilingFissureBlue).toBeIn("graveyard");
  });

  it("boundary: X=0 cannot destroy a cost-2 aura", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [roilingFissureBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [],
        arena: [drawACrowdBlue],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(roilingFissureBlue, { xValue: 0 });
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Dash, drawACrowdBlue).toBeIn("arena");
    expectFabCard(Bravo, roilingFissureBlue).toBeIn("graveyard");
  });

  it("timing: accepting a Surge repeats the mandatory aura destruction before another optional", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [roilingFissureBlue],
        arena: [seismicSurge],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [],
        arena: [drawACrowdBlue, drawACrowdBlue],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    const [firstCrowd, secondCrowd] = Dash.cardsIn("arena", drawACrowdBlue);
    Bravo.play(roilingFissureBlue, { xValue: 2 });
    game.advanceToDecision(Bravo, "entity-target");
    Bravo.target(firstCrowd!);
    game.advanceToDecision(Bravo, "boolean");
    Bravo.accept();
    game.untilIdle({ optionals: "throw", entityTargets: "pause" });

    expectFabCard(Dash, firstCrowd!).toBeIn("graveyard");
    expectFabCard(Dash, secondCrowd!).toBeIn("graveyard");
    expectFabCard(Bravo, roilingFissureBlue).toBeIn("graveyard");
    expectWait(game).toBeIdle();
    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 0);
    expectFabPlayer(Bravo).toHaveAP(1);
  });
});
