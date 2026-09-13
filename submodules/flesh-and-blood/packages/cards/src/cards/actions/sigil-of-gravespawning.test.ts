import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { sigilOfSolitudeBlue } from "./sigil-of-solitude.ts";
import { sigilOfGravespawningBlue } from "./sigil-of-gravespawning.ts";

describe("Sigil of Gravespawning (PEN098) AAA", () => {
  it("happy: playing this refunds the action point from go again", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [sigilOfGravespawningBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(sigilOfGravespawningBlue);
    game.untilIdle();

    expectFabCard(Viserai, sigilOfGravespawningBlue).toBeIn("arena");
    expectFabPlayer(Viserai).toHaveAP(1);
  });

  it("boundary: at the beginning of your action phase, destroy this", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        arena: [sigilOfGravespawningBlue],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.endTurn();
    game.untilIdle();
    game.as(dash).endTurn();
    game.untilIdle();

    expectFabCard(Viserai, sigilOfGravespawningBlue).toBeIn("graveyard");
  });

  it("timing: an aura leaving the graveyard does not ping (leave-arena encoding)", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        arena: [sigilOfGravespawningBlue],
        graveyard: [sigilOfSolitudeBlue],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabCard(game.as(viserai), sigilOfSolitudeBlue).toBeIn("graveyard");
    expectFabPlayer(game.as(dash)).toHaveLife(20);
    // pin: trigger is leave-arena from GY, not printed "leaves your graveyard"
  });
});
