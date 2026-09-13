import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { scoutThePeripheryRed } from "./scout-the-periphery.ts";

describe("Scout the Periphery Red (AZL020) AAA", () => {
  it("happy: an attack from arsenal gets +3 power", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [scoutThePeripheryRed], arsenal: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(scoutThePeripheryRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    Dash.playAttack(snatchRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(7);
    expectFabCard(Dash, scoutThePeripheryRed).toBeIn("graveyard");
  });

  it("boundary: an attack from hand is not buffed", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [scoutThePeripheryRed, snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(scoutThePeripheryRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    Dash.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });
});
