import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { wreckerRompBlue } from "./wrecker-romp.ts";
import { snatchRed } from "./snatch.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { flowingStormstrikeRed } from "./flowing-stormstrike.ts";

describe("Flowing Stormstrike (AZS009) AAA", () => {
  it("happy: a hit creates a Lightning Flow token", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [flowingStormstrikeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.attackWith(flowingStormstrikeRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expect(Oscilio.zone("arena")).toContain("token:lightning-flow");
    expectFabCard(Oscilio, flowingStormstrikeRed).toBeIn("graveyard");
  });

  it("boundary: a miss does not create Lightning Flow", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [flowingStormstrikeRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [wreckerRompBlue, snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.attackWith(flowingStormstrikeRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.advanceCombatTo("defend");
    Dash.defendWith([wreckerRompBlue, snatchRed]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Oscilio.zone("arena")).not.toContain("token:lightning-flow");
  });
});
