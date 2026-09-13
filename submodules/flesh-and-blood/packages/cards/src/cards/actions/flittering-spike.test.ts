import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blinkBlue } from "../instants/blink.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { flitteringSpikeRed } from "./flittering-spike.ts";

describe("Flittering Spike (OMN166) AAA", () => {
  it("happy: an instant this chain link gives +2{p}, and a hit creates Lightning Flow", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [flitteringSpikeRed, blinkBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.attackWith(flitteringSpikeRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.advanceCombatTo("reaction");
    Oscilio.must.playInstant(blinkBlue);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expect(Oscilio.zone("arena")).toContain("token:lightning-flow");
    expectFabCard(Oscilio, flitteringSpikeRed).toBeIn("graveyard");
  });

  it("boundary: without an instant this chain link, stays at printed 4 and still creates Lightning Flow on hit", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [flitteringSpikeRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.attackWith(flitteringSpikeRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expect(Oscilio.zone("arena")).toContain("token:lightning-flow");
  });
});
