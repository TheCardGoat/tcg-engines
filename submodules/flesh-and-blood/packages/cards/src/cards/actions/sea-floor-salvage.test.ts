import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { barnacleYellow } from "./barnacle.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { seaFloorSalvageBlue } from "./sea-floor-salvage.ts";

/**
 * Sea Floor Salvage (SEA146) — Pirate Action.
 *
 * Printed:
 *   Turn a card in a graveyard face-down. If it's yellow, create a Gold token.
 *   Go again
 */

describe("Sea Floor Salvage (SEA146) AAA", () => {
  it("happy: turning a yellow graveyard card face-down creates a Gold token", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [seaFloorSalvageBlue],
        graveyard: [barnacleYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);
    const [gyBarnacle] = Gravy.cardsIn("graveyard", barnacleYellow);

    Gravy.play(seaFloorSalvageBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Gravy, gyBarnacle!).toBeFaceDown();
    expectFabPlayer(Gravy).toHaveTokenCount("gold", 1);
  });

  it("boundary: turning a non-yellow graveyard card face-down creates no Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [seaFloorSalvageBlue],
        graveyard: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);
    const [gySnatch] = Gravy.cardsIn("graveyard", snatchRed);

    Gravy.play(seaFloorSalvageBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Gravy, gySnatch!).toBeFaceDown();
    expectFabPlayer(Gravy).toHaveTokenCount("gold", 0);
  });

  it("timing: go again refunds the play AP after the graveyard card is turned", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [seaFloorSalvageBlue],
        graveyard: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(seaFloorSalvageBlue);
    expectFabPlayer(Gravy).toHaveAP(0);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Gravy).toHaveAP(1);
    expectFabCard(Gravy, seaFloorSalvageBlue).toBeIn("graveyard");
  });
});
