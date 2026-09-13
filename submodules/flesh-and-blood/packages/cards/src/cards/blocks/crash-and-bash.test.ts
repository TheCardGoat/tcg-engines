import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { spinalCrushRed } from "../actions/spinal-crush.ts";
import { snatchRed } from "../actions/snatch.ts";
import { crashAndBashRed } from "./crash-and-bash.ts";

describe("Crash and Bash family AAA", () => {
  it("revealing a crush card creates a Seismic Surge", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      { hero: bravo, hand: [crashAndBashRed, spinalCrushRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(crashAndBashRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    expect(Bravo.zone("arena")).toContain("token:seismic-surge");
    expectFabCard(Bravo, crashAndBashRed).toBeIn("graveyard");
  });

  it("declining the reveal creates no token", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      { hero: bravo, hand: [crashAndBashRed, spinalCrushRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(crashAndBashRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expect(Bravo.zone("arena")).not.toContain("token:seismic-surge");
  });
});
