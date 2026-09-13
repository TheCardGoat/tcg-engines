import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { evoSteelSoulMemoryBlue } from "../actions/evo-steel-soul-memory.ts";
import { tekloBaseHead } from "../equipment/teklo-base-head.ts";
import { teklovossenEsteemedMagnate } from "./teklovossen-esteemed-magnate.ts";

describe("Teklovossen, Esteemed Magnate (EVO007) AAA", () => {
  it("happy: may play an Evo from the banished zone", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossenEsteemedMagnate,
        head: [tekloBaseHead],
        banished: [evoSteelSoulMemoryBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossenEsteemedMagnate);

    Teklo.play(evoSteelSoulMemoryBlue, { from: "banished" });
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Teklo, evoSteelSoulMemoryBlue).toBeIn("head");
  });

  it("happy: after the instant, a banished Evo plays as an instant, spends no AP, and draws", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossenEsteemedMagnate,
        head: [tekloBaseHead],
        hand: [],
        banished: [evoSteelSoulMemoryBlue],
        resourcePoints: 7,
        actionPoints: 0,
        deck: [tekloBaseHead],
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossenEsteemedMagnate);

    Teklo.activate(teklovossenEsteemedMagnate);
    game.passBoth();
    Teklo.play(evoSteelSoulMemoryBlue, { from: "banished" });
    game.untilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Teklo).toHaveAP(0);
    expectFabCard(Teklo, evoSteelSoulMemoryBlue).toBeIn("head");
    expectFabPlayer(Teklo).toHaveHandCount(1);
  });

  it("boundary: a hero without the permission cannot play an Evo from his own banished zone", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [tekloBaseHead],
        banished: [evoSteelSoulMemoryBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: teklovossenEsteemedMagnate, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expectFabUnplayable(() => Dash.play(evoSteelSoulMemoryBlue, { from: "banished" }), /banished/i);
    expectFabCard(Dash, evoSteelSoulMemoryBlue).toBeBanished();
  });
});
