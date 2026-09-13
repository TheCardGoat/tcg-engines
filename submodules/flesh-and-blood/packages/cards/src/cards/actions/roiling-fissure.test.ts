import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { drawACrowdBlue } from "./draw-a-crowd.ts";
import { seismicSurge } from "../tokens/seismic-surge.ts";
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
        deck: 6,
      },
      { hero: dash, hand: [], arena: [drawACrowdBlue], deck: 6 },
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
        deck: 6,
      },
      { hero: dash, hand: [], arena: [drawACrowdBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(roilingFissureBlue, { xValue: 0 });
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Dash, drawACrowdBlue).toBeIn("arena");
    expectFabCard(Bravo, roilingFissureBlue).toBeIn("graveyard");
  });

  it("timing: destroying a Seismic Surge you control asks to repeat the process", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [roilingFissureBlue],
        arena: [seismicSurge],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arena: [drawACrowdBlue, drawACrowdBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    const instanceId = Bravo.findCardInZone("hand", roilingFissureBlue);
    game.playInstance(Bravo.id, instanceId, { xValue: 2 }, "explicit");
    game.passBoth();
    const [firstCrowd] = Dash.cardsIn("arena", drawACrowdBlue);
    Bravo.targetRequired(firstCrowd!);
    Bravo.accept();
    Bravo.expectDecision("boolean");
    Bravo.decline();
    game.untilIdle({ optionals: "decline" });

    expect(Dash.cardsIn("arena", drawACrowdBlue)).toHaveLength(1);
    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 0);
    expectFabPlayer(Bravo).toHaveAP(1);
  });
});
