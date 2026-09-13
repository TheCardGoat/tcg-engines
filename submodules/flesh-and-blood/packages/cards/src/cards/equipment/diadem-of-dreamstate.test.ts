import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { deadwoodDirgeRed } from "../actions/deadwood-dirge.ts";
import { hazeShelterBlue } from "../instants/haze-shelter.ts";
import { passingMirageBlue } from "../actions/passing-mirage.ts";
import { diademOfDreamstate } from "./diadem-of-dreamstate.ts";

/**
 * Diadem of Dreamstate (DTD217) — Illusionist Head, Ward 2.
 * Printed: "Once per turn, when this or a non-token permanent you control
 * with ward is destroyed, you may pay {r}. If you do, create a Ponder token."
 * Deadwood Dirge (a real Runeblade aura-destroyer) supplies the destroy event.
 */

describe("Diadem of Dreamstate (DTD217) AAA", () => {
  it("happy: a destroyed ward aura lets the diadem pay 1{r} for a Ponder", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        head: [diademOfDreamstate],
        arena: [hazeShelterBlue],
        hand: [deadwoodDirgeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(deadwoodDirgeRed);
    game.untilIdle({ entityTargets: "pause", ordering: "listed" });
    Viserai.target(hazeShelterBlue);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabCard(Viserai, hazeShelterBlue).toBeIn("graveyard");
    expectFabCard(Viserai, diademOfDreamstate).toBeIn("head");
    expectFabPlayer(Viserai).toHaveResourceCount(0); // the {r} was paid
    expectFabToken(game, "ponder").toHaveCount(1);
  });

  it("boundary: destroying a permanent without ward never opens the diadem", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        head: [diademOfDreamstate],
        arena: [passingMirageBlue],
        hand: [deadwoodDirgeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(deadwoodDirgeRed);
    game.untilIdle({ entityTargets: "pause", ordering: "listed" });
    Viserai.target(passingMirageBlue);
    // No pay/decline optional exists — the ward filter excluded the aura.
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Viserai, passingMirageBlue).toBeIn("graveyard");
    expectFabPlayer(Viserai).toHaveResourceCount(1);
    expectFabToken(game, "ponder").toHaveCount(0);
  });
});
