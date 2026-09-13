import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { volatileFluxorRed } from "./volatile-fluxor.ts";

describe("Volatile Fluxor (OMN178) AAA", () => {
  it("happy: printed 0{p} without an instant this chain link, and go again refunds", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [volatileFluxorRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.attackWith(volatileFluxorRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(0);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(20);
    expectFabPlayer(Oscilio).toHaveAP(1);
    expect(Oscilio.zone("arena")).not.toContain("token:lightning-flow");
    expectFabCard(Oscilio, volatileFluxorRed).toBeIn("graveyard");
  });

  it("boundary: without an instant this stays at 0{p} and a miss creates no token", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [volatileFluxorRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [autumnSTouchBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.attackWith(volatileFluxorRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(0);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith(autumnSTouchBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(20);
    expect(Oscilio.zone("arena")).not.toContain("token:lightning-flow");
  });
});
