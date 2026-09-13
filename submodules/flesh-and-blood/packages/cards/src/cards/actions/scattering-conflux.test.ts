import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { scatteringConfluxRed } from "./scattering-conflux.ts";

describe("Scattering Conflux (AZS012) AAA", () => {
  it("happy: whenever this fragments, create an Embodiment of Lightning token", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [scatteringConfluxRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    Zyggy.attackWith(scatteringConfluxRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(nimblismBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Zyggy).toHaveTokenCount("embodiment-of-lightning", 1);
  });

  it("boundary: without a qualifying block this does not fragment and creates no token", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [scatteringConfluxRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.attackWith(scatteringConfluxRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabPlayer(Zyggy).toHaveTokenCount("embodiment-of-lightning", 0);
    expectFabCard(Zyggy, scatteringConfluxRed).toBeIn("graveyard");
  });
});
