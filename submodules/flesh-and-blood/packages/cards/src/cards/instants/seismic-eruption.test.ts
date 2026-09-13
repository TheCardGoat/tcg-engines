import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";

import { seismicEruptionYellow } from "./seismic-eruption.ts";

describe("Seismic Eruption (MPG024) AAA", () => {
  it("happy: creates 3 Seismic Surge tokens", () => {
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
    game.passBoth();

    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 3);
    expectFabCard(Bravo, seismicEruptionYellow).toBeIn("graveyard");
  });

  it("boundary: does not create Seismic Surges for the opposing hero", () => {
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
    const Dash = game.as(dash);

    Bravo.play(seismicEruptionYellow);
    game.passBoth();

    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 3);
    expectFabPlayer(Dash).toHaveTokenCount("seismic-surge", 0);
  });

  it("timing: playing this as an instant spends no action point", () => {
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
    game.passBoth();

    expectFabCard(Bravo, seismicEruptionYellow).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);
  });
});
