import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";

import { arcbaneGraspBlue } from "./arcbane-grasp.ts";

describe("Arcbane Grasp (OMN236) AAA", () => {
  it("happy: seating this creates a Spellbane Aegis token", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [arcbaneGraspBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: blazeFiremind, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Dash, arcbaneGraspBlue).toBeIn("arms");
    expectFabPlayer(Dash).toHaveTokenCount("spellbane-aegis", 1);
  });

  it("boundary: declining Arcane Barrier 1 takes the full 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        resourcePoints: 1,
        arms: [arcbaneGraspBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(blazeFiremind).play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    Dash.expectDecision("option");
    Dash.chooseOptions();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabPlayer(Dash).toHaveResourceCount(1);
    expectFabCard(Dash, arcbaneGraspBlue).toBeIn("arms");
  });

  it("timing: seating without this equipment creates no Spellbane Aegis", () => {
    const game = FabTestEngine.start(
      { hero: dash, actionPoints: 1, deck: 6 },
      { hero: blazeFiremind, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveTokenCount("spellbane-aegis", 0);
  });
});
