import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { talismanicLens } from "./talismanic-lens.ts";

describe("Talismanic Lens (ARC151) AAA", () => {
  it("happy: destroy this to opt 2", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [talismanicLens],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue],
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(talismanicLens);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Dash, talismanicLens).toBeIn("graveyard");
  });

  it("boundary: the lens cannot be activated after it is already in the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: dash, head: [talismanicLens], actionPoints: 1, deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(talismanicLens);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabCard(Dash, talismanicLens).toBeIn("graveyard");
    Dash.expectActivationRejected(talismanicLens);
  });
});
