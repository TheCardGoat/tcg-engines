import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { ellipticalConfluxYellow } from "./elliptical-conflux.ts";

describe("Elliptical Conflux (AZS019) AAA", () => {
  it("happy: leave-arena from Ward creates an Embodiment of Lightning token", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: zyggyStarlight,
        arena: [ellipticalConfluxYellow],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    game.as(dash).attackWith(snatchRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabCard(Zyggy, ellipticalConfluxYellow).toBeIn("graveyard");
    expectFabPlayer(Zyggy).toHaveTokenCount("embodiment-of-lightning", 1);
  });

  it("boundary: the opponent's leave-arena does not mint Embodiment of Lightning for you", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: zyggyStarlight,
        arena: [ellipticalConfluxYellow],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).attackWith(snatchRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabPlayer(game.as(dash)).toHaveTokenCount("embodiment-of-lightning", 0);
  });

  it("timing: entering the arena does not create Embodiment of Lightning", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [ellipticalConfluxYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.play(ellipticalConfluxYellow);
    game.passBoth();

    expectFabCard(Zyggy, ellipticalConfluxYellow).toBeIn("arena");
    expectFabPlayer(Zyggy).toHaveTokenCount("embodiment-of-lightning", 0);
  });
});
