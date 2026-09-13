import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { sandSketchedPlanBlue } from "../actions/sand-sketched-plan.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { trenchOfWateryDepths } from "./trench-of-watery-depths.ts";

describe("Trench of Watery Depths (PEN168) AAA", () => {
  it("happy: defending lets the trench pitch the graveyard blue for {r}", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      {
        hero: dash,
        hand: [],
        resourcePoints: 0,
        graveyard: [sandSketchedPlanBlue],
        chest: [trenchOfWateryDepths],
        life: 20,
        deck: 6,
      },
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Blaze.playAttack(snatchRed);
    Dash.defendWith(trenchOfWateryDepths);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Dash, sandSketchedPlanBlue).toBeIn("pitch");
  });

  it("boundary: declining keeps the blue in the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      {
        hero: dash,
        hand: [],
        resourcePoints: 0,
        graveyard: [sandSketchedPlanBlue],
        chest: [trenchOfWateryDepths],
        life: 20,
        deck: 6,
      },
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Blaze.playAttack(snatchRed);
    Dash.defendWith(trenchOfWateryDepths);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, sandSketchedPlanBlue).toBeIn("graveyard");
  });
});
