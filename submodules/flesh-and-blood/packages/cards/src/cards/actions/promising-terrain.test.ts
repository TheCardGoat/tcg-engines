import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";

import { seismicEruptionYellow } from "../instants/seismic-eruption.ts";
import { promisingTerrainBlue } from "./promising-terrain.ts";

describe("Promising Terrain (MPG045) AAA", () => {
  it("happy: creating Seismic Surges while this is in the arena creates one extra", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [promisingTerrainBlue, seismicEruptionYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(promisingTerrainBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, promisingTerrainBlue).toBeIn("arena");

    Bravo.play(seismicEruptionYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 4);
  });

  it("boundary: Seismic Surges created without this in the arena are not increased", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [seismicEruptionYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(seismicEruptionYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 3);
  });

  it("timing: at the beginning of your next action phase this is destroyed, then 3+ surges draw and gain 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [promisingTerrainBlue, seismicEruptionYellow],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(promisingTerrainBlue);
    game.helpers.resolveUntilIdle();
    Bravo.play(seismicEruptionYellow);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 4);

    Bravo.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Bravo, promisingTerrainBlue).toBeIn("graveyard");
  });
});
